-- ONG AFA — Migration 0002 : identité, consentements, rôles, permissions, audit
--
-- Principes :
--  * RLS activée sur toutes les tables, accès explicitement accordé (jamais par défaut).
--  * Données publiques (profiles) séparées des données privées (user_private).
--  * Aucun droit élevé n'est attribuable par l'inscription ni par l'utilisateur lui-même.
--  * Les droits sont des PERMISSIONS ; les rôles sont des ensembles de permissions.

create type public.account_status    as enum ('active', 'suspended', 'banned');
create type public.visibility_level  as enum ('private', 'members', 'public');
create type public.data_request_type as enum ('export', 'rectify', 'delete');
create type public.request_status    as enum ('open', 'in_progress', 'done', 'rejected');

-- ───────────────────────── Rôles et permissions ─────────────────────────
create table public.roles (
  code        text primary key check (code ~ '^[a-z][a-z_]{1,40}$'),
  label       text not null,
  description text
);

create table public.permissions (
  code   text primary key check (code ~ '^[a-z][a-z_]{1,60}$'),
  label  text not null,
  domain text not null
);

create table public.role_permissions (
  role_code       text not null references public.roles(code)       on delete cascade,
  permission_code text not null references public.permissions(code) on delete cascade,
  primary key (role_code, permission_code)
);

-- ───────────────────────── Profils (publics) ─────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 80),
  avatar_path  text,
  bio          text check (char_length(bio) <= 1000),
  location_id  uuid,  -- clé étrangère ajoutée avec la table locations (migration 0003)
  status       public.account_status not null default 'active',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- ───────────────────────── Données privées ─────────────────────────
-- Le téléphone est facultatif, DÉCLARATIF (jamais vérifié) et privé par défaut.
create table public.user_private (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  phone            text check (phone ~ '^[0-9+() .-]{6,20}$'),
  phone_visibility public.visibility_level not null default 'private',
  phone_verified   boolean not null default false check (phone_verified = false),
  updated_at       timestamptz not null default now()
);
create trigger user_private_updated_at before update on public.user_private
  for each row execute function public.set_updated_at();

-- ───────────────────────── Rôles attribués ─────────────────────────
create table public.user_roles (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  role_code         text not null references public.roles(code),
  scope_location_id uuid,  -- périmètre territorial (agents de terrain) ; FK ajoutée en 0003
  granted_by        uuid references auth.users(id) on delete set null,
  granted_at        timestamptz not null default now(),
  unique nulls not distinct (user_id, role_code, scope_location_id)
);
create index user_roles_user_idx on public.user_roles (user_id);

-- ───────────────────────── Consentements et demandes RGPD-like ─────────────────────────
create table public.consents (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  consent_type text not null check (consent_type in ('terms', 'privacy', 'producer_data', 'testimonial', 'media')),
  version      text not null,
  granted_at   timestamptz not null default now(),
  revoked_at   timestamptz
);
create index consents_user_idx on public.consents (user_id);

create table public.data_requests (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  type       public.data_request_type not null,
  status     public.request_status not null default 'open',
  note       text check (char_length(note) <= 2000),
  created_at timestamptz not null default now(),
  handled_by uuid references auth.users(id) on delete set null,
  handled_at timestamptz
);
create index data_requests_user_idx on public.data_requests (user_id);

-- ───────────────────────── Journal d'audit ─────────────────────────
create table public.admin_audit_logs (
  id          bigint generated always as identity primary key,
  actor_id    uuid,            -- null = action système / service
  action      text not null,
  entity_type text not null,
  entity_id   text,
  old_value   jsonb,
  new_value   jsonb,
  created_at  timestamptz not null default now()
);
create index admin_audit_logs_entity_idx on public.admin_audit_logs (entity_type, entity_id);
create index admin_audit_logs_created_idx on public.admin_audit_logs (created_at desc);

-- ───────────────────────── Fonctions de contrôle d'accès ─────────────────────────
-- SECURITY DEFINER pour lire user_roles sans dépendre de ses propres politiques RLS.
-- Un compte suspendu ou banni perd tous ses droits.
-- Seuls les rôles NON limités à un territoire comptent ici (voir docs/ARCHITECTURE.md).
create or replace function public.has_permission(p_permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role_code = ur.role_code
    join public.profiles pr         on pr.id = ur.user_id
    where ur.user_id = (select auth.uid())
      and ur.scope_location_id is null
      and rp.permission_code = p_permission
      and pr.status = 'active'
  );
$$;

create or replace function public.has_role(p_role text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.profiles pr on pr.id = ur.user_id
    where ur.user_id = (select auth.uid())
      and ur.role_code = p_role
      and pr.status = 'active'
  );
$$;

revoke all on function public.has_permission(text) from public;
revoke all on function public.has_role(text)       from public;
grant execute on function public.has_permission(text) to anon, authenticated, service_role;
grant execute on function public.has_role(text)       to anon, authenticated, service_role;

-- ───────────────────────── Audit automatique ─────────────────────────
create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id text;
begin
  v_id := coalesce(
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'id',
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'user_id'
  );
  insert into public.admin_audit_logs (actor_id, action, entity_type, entity_id, old_value, new_value)
  values (
    (select auth.uid()),
    lower(tg_op),
    tg_table_name,
    v_id,
    case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end
  );
  return coalesce(new, old);
end;
$$;

create trigger user_roles_audit
  after insert or update or delete on public.user_roles
  for each row execute function public.audit_row_change();

create trigger role_permissions_audit
  after insert or update or delete on public.role_permissions
  for each row execute function public.audit_row_change();

-- Impossible de retirer le dernier administrateur.
create or replace function public.protect_last_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role_code = 'admin'
     and (tg_op = 'DELETE' or new.role_code is distinct from 'admin' or new.user_id is distinct from old.user_id)
     and not exists (
       select 1 from public.user_roles ur
       where ur.role_code = 'admin' and ur.id <> old.id
     )
  then
    raise exception 'Impossible de retirer le dernier administrateur'
      using errcode = 'P0001';
  end if;
  return coalesce(new, old);
end;
$$;

create trigger user_roles_protect_last_admin
  before update or delete on public.user_roles
  for each row execute function public.protect_last_admin();

-- ───────────────────────── Création automatique du profil ─────────────────────────
-- N'utilise QUE le nom affiché des métadonnées : jamais de rôle ni de statut venant du client.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  v_name := left(btrim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), 80);
  if char_length(v_name) < 2 then
    v_name := left(btrim(coalesce(split_part(new.email, '@', 1), '')), 80);
  end if;
  if char_length(v_name) < 2 then
    v_name := 'Membre AFA';
  end if;

  insert into public.profiles (id, display_name) values (new.id, v_name);
  insert into public.user_roles (user_id, role_code) values (new.id, 'member');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────── Sécurité (RLS) ─────────────────────────
alter table public.roles            enable row level security;
alter table public.permissions      enable row level security;
alter table public.role_permissions enable row level security;
alter table public.profiles         enable row level security;
alter table public.user_private     enable row level security;
alter table public.user_roles       enable row level security;
alter table public.consents         enable row level security;
alter table public.data_requests    enable row level security;
alter table public.admin_audit_logs enable row level security;

-- Privilèges : on retire tout puis on accorde le strict nécessaire.
revoke all on public.roles, public.permissions, public.role_permissions, public.profiles,
              public.user_private, public.user_roles, public.consents, public.data_requests,
              public.admin_audit_logs
  from anon, authenticated;

grant select on public.roles, public.permissions, public.role_permissions to authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, avatar_path, bio, location_id) on public.profiles to authenticated;
grant select, insert, update on public.user_private to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant select, insert on public.consents to authenticated;
grant update (revoked_at) on public.consents to authenticated;
grant select, insert on public.data_requests to authenticated;
grant update (status, handled_by, handled_at) on public.data_requests to authenticated;
grant select on public.admin_audit_logs to authenticated;

-- roles / permissions : lisibles par les membres connectés (catalogue), modifiables uniquement via migration.
create policy roles_read            on public.roles            for select to authenticated using (true);
create policy permissions_read      on public.permissions      for select to authenticated using (true);
create policy role_permissions_read on public.role_permissions for select to authenticated using (true);

-- profiles : nom affiché visible des membres connectés (pas des visiteurs) ; modification de soi uniquement.
create policy profiles_read_members on public.profiles
  for select to authenticated
  using (status = 'active' or id = (select auth.uid()) or public.has_permission('manage_users'));
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and status = 'active');
create policy profiles_update_staff on public.profiles
  for update to authenticated
  using (public.has_permission('manage_users'))
  with check (public.has_permission('manage_users'));
-- NB : le statut (suspension/bannissement) n'est modifiable que par le personnel, via la fonction set_account_status ci-dessous.

-- user_private : propriétaire, ou personnel explicitement habilité (view_producer_private).
create policy user_private_select on public.user_private
  for select to authenticated
  using (user_id = (select auth.uid()) or public.has_permission('view_producer_private'));
create policy user_private_insert on public.user_private
  for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy user_private_update on public.user_private
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- user_roles : chacun voit les siens ; seul manage_roles attribue, modifie ou retire.
create policy user_roles_select on public.user_roles
  for select to authenticated
  using (user_id = (select auth.uid()) or public.has_permission('manage_roles'));
create policy user_roles_insert on public.user_roles
  for insert to authenticated
  with check (public.has_permission('manage_roles') and granted_by = (select auth.uid()));
create policy user_roles_update on public.user_roles
  for update to authenticated
  using (public.has_permission('manage_roles'))
  with check (public.has_permission('manage_roles'));
create policy user_roles_delete on public.user_roles
  for delete to authenticated
  using (public.has_permission('manage_roles'));

-- consents : propriétaire seulement (ajout et révocation, pas de modification de version).
create policy consents_select on public.consents
  for select to authenticated using (user_id = (select auth.uid()));
create policy consents_insert on public.consents
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy consents_revoke on public.consents
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- data_requests : propriétaire (création, lecture) ; traitement par manage_users.
create policy data_requests_select on public.data_requests
  for select to authenticated
  using (user_id = (select auth.uid()) or public.has_permission('manage_users'));
create policy data_requests_insert on public.data_requests
  for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'open');
create policy data_requests_handle on public.data_requests
  for update to authenticated
  using (public.has_permission('manage_users'))
  with check (public.has_permission('manage_users'));

-- admin_audit_logs : lecture seule pour view_audit_logs ; aucune écriture directe (triggers uniquement).
create policy audit_logs_select on public.admin_audit_logs
  for select to authenticated using (public.has_permission('view_audit_logs'));

-- Changement de statut d'un compte : réservé à manage_users, tracé dans le journal.
create or replace function public.set_account_status(p_user uuid, p_status public.account_status)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old public.account_status;
begin
  if not public.has_permission('manage_users') then
    raise exception 'Permission refusée' using errcode = '42501';
  end if;
  select status into v_old from public.profiles where id = p_user for update;
  if not found then
    raise exception 'Utilisateur introuvable' using errcode = 'P0002';
  end if;
  update public.profiles set status = p_status where id = p_user;
  insert into public.admin_audit_logs (actor_id, action, entity_type, entity_id, old_value, new_value)
  values ((select auth.uid()), 'set_account_status', 'profiles', p_user::text,
          jsonb_build_object('status', v_old), jsonb_build_object('status', p_status));
end;
$$;
revoke all on function public.set_account_status(uuid, public.account_status) from public;
grant execute on function public.set_account_status(uuid, public.account_status) to authenticated;

-- Hygiène : sur Supabase, les fonctions de "public" sont exécutables par défaut par anon/authenticated.
-- Les fonctions internes (triggers) ne doivent pas être appelables directement via l'API.
revoke all on function public.audit_row_change()   from public, anon, authenticated;
revoke all on function public.protect_last_admin() from public, anon, authenticated;
revoke all on function public.handle_new_user()    from public, anon, authenticated;
revoke all on function public.set_updated_at()     from public, anon, authenticated;
revoke all on function public.set_account_status(uuid, public.account_status) from anon;
