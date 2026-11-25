-- ONG AFA — Migration 0003 : territoires et implantations AFA
--
-- Un SEUL arbre de territoires (district > région > département > sous-préfecture > ville > village).
-- Les villes ne sont jamais écrites en dur dans le code : tout est administrable ici.
-- La carte nationale lit afa_map_points ; ajouter une ville = ajouter une ligne.

create type public.location_level as enum
  ('country', 'district', 'region', 'department', 'sub_prefecture', 'city', 'village', 'zone');
create type public.afa_status as enum ('active', 'in_progress', 'upcoming');

-- Rang hiérarchique : un parent doit toujours être "au-dessus" de son enfant.
-- Les "zones" (zones de production, regroupements) peuvent se placer sous n'importe quel niveau.
create or replace function public.location_rank(p_level public.location_level)
returns int
language sql
immutable
set search_path = ''
as $$
  select case p_level
    when 'country'        then 0
    when 'district'       then 1
    when 'region'         then 2
    when 'department'     then 3
    when 'sub_prefecture' then 4
    when 'city'           then 5
    when 'village'        then 6
    when 'zone'           then 7
  end;
$$;

create table public.locations (
  id            uuid primary key default gen_random_uuid(),
  parent_id     uuid references public.locations(id) on delete restrict,
  level         public.location_level not null,
  name          text not null check (char_length(name) between 1 and 120),
  slug          text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  path_slug     text not null,  -- chemin complet, calculé : "region/departement/ville" (URLs territoriales)
  official_code text,
  geom          extensions.geometry(MultiPolygon, 4326),
  centroid      extensions.geometry(Point, 4326),
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique nulls not distinct (parent_id, slug),
  unique (path_slug)
);
create index locations_parent_idx   on public.locations (parent_id);
create index locations_level_idx    on public.locations (level);
create index locations_name_trgm    on public.locations using gin (name extensions.gin_trgm_ops);
create index locations_geom_gist    on public.locations using gist (geom);
create index locations_centroid_gist on public.locations using gist (centroid);

create or replace function public.locations_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_parent public.locations%rowtype;
begin
  if new.parent_id is null then
    new.path_slug := new.slug;
  else
    select * into v_parent from public.locations where id = new.parent_id;
    if not found then
      raise exception 'Territoire parent introuvable';
    end if;
    if new.id = new.parent_id then
      raise exception 'Un territoire ne peut pas être son propre parent';
    end if;
    if new.level <> 'zone'
       and public.location_rank(v_parent.level) >= public.location_rank(new.level) then
      raise exception 'Hiérarchie invalide : un(e) % ne peut pas être sous un(e) %', new.level, v_parent.level
        using errcode = 'check_violation';
    end if;
    new.path_slug := v_parent.path_slug || '/' || new.slug;
  end if;
  return new;
end;
$$;

create trigger locations_path_and_rank
  before insert or update of parent_id, slug, level on public.locations
  for each row execute function public.locations_before_write();
-- Renommer ou déplacer un territoire met à jour le chemin de tous ses descendants.
create or replace function public.locations_cascade_path()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.path_slug is distinct from old.path_slug then
    -- "set parent_id = parent_id" redéclenche le calcul du chemin chez chaque enfant (récursivement).
    update public.locations set parent_id = parent_id where parent_id = new.id;
  end if;
  return null;
end;
$$;

-- NB : pas de "after update OF path_slug" : cette colonne est modifiée par un trigger, pas par la requête,
-- et PostgreSQL ne déclencherait alors pas ce trigger. La comparaison old/new est faite dans la fonction.
create trigger locations_cascade_path
  after update on public.locations
  for each row execute function public.locations_cascade_path();

create trigger locations_updated_at before update on public.locations
  for each row execute function public.set_updated_at();
create trigger locations_audit
  after insert or update or delete on public.locations
  for each row execute function public.audit_row_change();

-- Implantations AFA : un territoire a au plus une fiche d'implantation.
create table public.afa_locations (
  id           uuid primary key default gen_random_uuid(),
  location_id  uuid not null unique references public.locations(id) on delete restrict,
  status       public.afa_status not null default 'upcoming',
  since_date   date,
  description  text check (char_length(description) <= 5000),
  activities   text[] not null default '{}',
  -- Point d'affichage VOLONTAIREMENT approximatif : jamais d'adresse exacte.
  public_point extensions.geometry(Point, 4326),
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index afa_locations_status_idx on public.afa_locations (status) where is_published;
create trigger afa_locations_updated_at before update on public.afa_locations
  for each row execute function public.set_updated_at();
create trigger afa_locations_audit
  after insert or update or delete on public.afa_locations
  for each row execute function public.audit_row_change();

-- Clés étrangères différées depuis la migration 0002.
alter table public.profiles   add constraint profiles_location_fk
  foreign key (location_id) references public.locations(id) on delete set null;
alter table public.user_roles add constraint user_roles_scope_location_fk
  foreign key (scope_location_id) references public.locations(id) on delete cascade;

-- Vue pour la carte nationale : uniquement les implantations publiées, jamais de données privées.
create view public.afa_map_points
with (security_invoker = true) as
select
  al.id,
  l.id        as location_id,
  l.name,
  l.level,
  l.path_slug,
  al.status,
  al.since_date,
  al.description,
  al.activities,
  coalesce(al.public_point, l.centroid) as point
from public.afa_locations al
join public.locations l on l.id = al.location_id
where al.is_published and l.is_active;

-- ───────────────────────── Sécurité (RLS) ─────────────────────────
alter table public.locations     enable row level security;
alter table public.afa_locations enable row level security;

revoke all on public.locations, public.afa_locations, public.afa_map_points from anon, authenticated;
grant select on public.locations, public.afa_locations, public.afa_map_points to anon, authenticated;
grant insert, update, delete on public.locations, public.afa_locations to authenticated;

-- Territoires : lecture publique des territoires actifs.
create policy locations_read on public.locations
  for select to anon, authenticated
  using (is_active or public.has_permission('manage_locations'));
create policy locations_write_insert on public.locations
  for insert to authenticated with check (public.has_permission('manage_locations'));
create policy locations_write_update on public.locations
  for update to authenticated
  using (public.has_permission('manage_locations'))
  with check (public.has_permission('manage_locations'));
create policy locations_write_delete on public.locations
  for delete to authenticated using (public.has_permission('manage_locations'));

-- Implantations : lecture publique des fiches publiées ; gestion par manage_afa_locations.
create policy afa_locations_read on public.afa_locations
  for select to anon, authenticated
  using (is_published or public.has_permission('manage_afa_locations'));
create policy afa_locations_insert on public.afa_locations
  for insert to authenticated with check (public.has_permission('manage_afa_locations'));
create policy afa_locations_update on public.afa_locations
  for update to authenticated
  using (public.has_permission('manage_afa_locations'))
  with check (public.has_permission('manage_afa_locations'));
create policy afa_locations_delete on public.afa_locations
  for delete to authenticated using (public.has_permission('manage_afa_locations'));

revoke all on function public.locations_before_write()  from public, anon, authenticated;
revoke all on function public.locations_cascade_path()  from public, anon, authenticated;
