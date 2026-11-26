-- ONG AFA — Migration 0010 : espace producteurs, demandes d'adhésion, questions à AFA (phase 6)
--
-- Règles :
--  * Un profil producteur n'existe qu'avec un consentement « producer_data » actif (contrôlé en base).
--  * Le badge « Vérifié par AFA » n'est attribuable que par manage_producers.
--  * Le téléphone reste dans user_private ; visible des membres seulement si le producteur l'a choisi.
--  * Formulaires ouverts aux visiteurs : limités contre le spam (par email et globalement).

-- ───────────────────────── Toutes les régions (sélection de la localisation) ─────────────────────────
insert into public.locations (level, name, slug, centroid)
select v.level::public.location_level, v.name, v.slug, extensions.st_setsrid(extensions.st_makepoint(v.lon, v.lat), 4326)
from (values
  ('region', 'Agnéby-Tiassa', 'agneby-tiassa', -4.51788, 5.93541),
  ('region', 'Bafing', 'bafing', -7.62443, 8.38908),
  ('region', 'Bagoué', 'bagoue', -6.47105, 9.86114),
  ('region', 'Bélier', 'belier', -5.05057, 7.20672),
  ('region', 'Béré', 'bere', -6.04067, 8.36548),
  ('region', 'Bounkani', 'bounkani', -3.44661, 9.16757),
  ('region', 'Cavally', 'cavally', -7.68613, 6.33312),
  ('district', 'District autonome d''Abidjan', 'district-autonome-dabidjan', -4.0752, 5.41397),
  ('district', 'District autonome de Yamoussoukro', 'district-autonome-de-yamoussoukro', -5.26867, 6.85583),
  ('region', 'Folon', 'folon', -7.40026, 10.09999),
  ('region', 'Gbêkê', 'gbeke', -5.21636, 7.70297),
  ('region', 'Gbôklé', 'gbokle', -5.97176, 5.26706),
  ('region', 'Gôh', 'goh', -5.87772, 6.21582),
  ('region', 'Gontougo', 'gontougo', -3.21249, 7.99229),
  ('region', 'Grands-Ponts', 'grands-ponts', -4.77649, 5.36015),
  ('region', 'Guémon', 'guemon', -7.31606, 7.01805),
  ('region', 'Hambol', 'hambol', -4.83851, 8.5205),
  ('region', 'Haut-Sassandra', 'haut-sassandra', -6.60351, 7.03605),
  ('region', 'Iffou', 'iffou', -4.06002, 7.46412),
  ('region', 'Indénié-Djuablin', 'indenie-djuablin', -3.42712, 6.71527),
  ('region', 'Kabadougou', 'kabadougou', -7.37858, 9.42354),
  ('region', 'Lôh-Djiboua', 'loh-djiboua', -5.40427, 5.75722),
  ('region', 'Marahoué', 'marahoue', -5.8928, 7.08512),
  ('region', 'Mé', 'me', -3.7433, 5.98917),
  ('region', 'Moronou', 'moronou', -4.23922, 6.60295),
  ('region', 'N''Zi', 'nzi', -4.56082, 6.97377),
  ('region', 'Nawa', 'nawa', -6.66921, 5.85311),
  ('region', 'Poro', 'poro', -5.83293, 9.41572),
  ('region', 'San-Pédro', 'san-pedro', -7.04719, 5.0129),
  ('region', 'Sud-Comoé', 'sud-comoe', -3.1801, 5.48065),
  ('region', 'Tchologo', 'tchologo', -4.82, 9.50511),
  ('region', 'Tonkpi', 'tonkpi', -7.82091, 7.47344),
  ('region', 'Worodougou', 'worodougou', -6.75755, 8.38054)
) as v(level, name, slug, lon, lat)
on conflict (path_slug) do nothing;

create type public.producer_need   as enum ('buyer', 'financing', 'inputs', 'training', 'processing', 'transport', 'support', 'other');
create type public.producer_badge  as enum ('unverified', 'verified');
create type public.join_profile    as enum ('producer', 'cooperative', 'trader', 'processor', 'buyer', 'transporter', 'youth', 'partner', 'other');
create type public.contact_category as enum ('debouche', 'financement', 'formation', 'intrants', 'transformation', 'transport', 'information', 'autre');
create type public.contact_status  as enum ('new', 'in_progress', 'answered', 'closed');

-- ───────────────────────── Producteurs ─────────────────────────
create table public.producers (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  display_name      text not null check (char_length(display_name) between 2 and 100),
  region_id         uuid references public.locations(id) on delete set null,
  city              text check (char_length(city) <= 80),
  village           text check (char_length(village) <= 80), -- jamais de position exacte
  description       text check (char_length(description) <= 1500),
  experience_years  int check (experience_years between 0 and 80),
  total_area_ha     numeric(10, 2) check (total_area_ha > 0 and total_area_ha < 100000),
  production_note   text check (char_length(production_note) <= 500),
  availability_note text check (char_length(availability_note) <= 300),
  visibility        public.visibility_level not null default 'members',
  verification      public.producer_badge not null default 'unverified',
  verified_by       uuid references auth.users(id) on delete set null,
  verified_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index producers_region_idx on public.producers (region_id);
create trigger producers_updated_at before update on public.producers
  for each row execute function public.set_updated_at();
create trigger producers_audit after insert or update or delete on public.producers
  for each row execute function public.audit_row_change();

create table public.producer_crops (
  producer_id uuid not null references public.producers(user_id) on delete cascade,
  crop_id     uuid not null references public.crops(id) on delete cascade,
  area_ha     numeric(10, 2) check (area_ha > 0 and area_ha < 100000),
  primary key (producer_id, crop_id)
);

create table public.producer_needs (
  producer_id uuid not null references public.producers(user_id) on delete cascade,
  need        public.producer_need not null,
  note        text check (char_length(note) <= 300),
  primary key (producer_id, need)
);

-- Consentement obligatoire ; badge réservé ; rôle « producteur » attribué automatiquement.
create or replace function public.producers_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' and not exists (
    select 1 from public.consents c
    where c.user_id = new.user_id and c.consent_type = 'producer_data' and c.revoked_at is null
  ) then
    raise exception 'Consentement « producer_data » requis pour créer un profil producteur' using errcode = '42501';
  end if;

  if (tg_op = 'INSERT' and new.verification <> 'unverified')
     or (tg_op = 'UPDATE' and new.verification is distinct from old.verification) then
    if (select auth.uid()) is not null and not public.has_permission('manage_producers') then
      raise exception 'Le badge « Vérifié par AFA » est attribué par AFA' using errcode = '42501';
    end if;
    new.verified_by := (select auth.uid());
    new.verified_at := case when new.verification = 'verified' then now() end;
  end if;

  if tg_op = 'UPDATE' and new.user_id is distinct from old.user_id then
    raise exception 'Le titulaire d''un profil ne peut pas changer' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger producers_before_write before insert or update on public.producers
  for each row execute function public.producers_before_write();

create or replace function public.producers_grant_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_roles (user_id, role_code) values (new.user_id, 'producer') on conflict do nothing;
  return new;
end;
$$;
create trigger producers_grant_role after insert on public.producers
  for each row execute function public.producers_grant_role();

-- ───────────────────────── Demandes d'adhésion (Rejoindre AFA) ─────────────────────────
create table public.join_requests (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  full_name       text not null check (char_length(full_name) between 2 and 100),
  email           text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone           text check (phone ~ '^[0-9+() .-]{6,20}$'),
  profile_type    public.join_profile not null,
  organization    text check (char_length(organization) <= 120),
  region_id       uuid references public.locations(id) on delete set null,
  city            text check (char_length(city) <= 80),
  message         text check (char_length(message) <= 2000),
  consent_version text not null,
  status          public.request_status not null default 'open',
  handled_by      uuid references auth.users(id) on delete set null,
  handled_at      timestamptz,
  created_at      timestamptz not null default now(),
  check (email is not null or phone is not null)
);
create index join_requests_created_idx on public.join_requests (created_at desc);

-- ───────────────────────── Questions à AFA ─────────────────────────
create table public.contact_requests (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete set null,
  full_name       text not null check (char_length(full_name) between 2 and 100),
  email           text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone           text check (phone ~ '^[0-9+() .-]{6,20}$'),
  category        public.contact_category not null,
  region_id       uuid references public.locations(id) on delete set null,
  city            text check (char_length(city) <= 80),
  message         text not null check (char_length(message) between 10 and 2000),
  consent_version text not null,
  status          public.contact_status not null default 'new',
  assigned_to     uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (email is not null or phone is not null)
);
create index contact_requests_status_idx on public.contact_requests (status, created_at desc);
create trigger contact_requests_updated_at before update on public.contact_requests
  for each row execute function public.set_updated_at();
create trigger contact_requests_audit after update or delete on public.contact_requests
  for each row execute function public.audit_row_change();

create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references public.contact_requests(id) on delete cascade,
  author_id   uuid references auth.users(id) on delete set null,
  body        text not null check (char_length(body) between 1 and 4000),
  is_internal boolean not null default false, -- note interne AFA, invisible du demandeur
  created_at  timestamptz not null default now()
);
create index contact_messages_request_idx on public.contact_messages (request_id, created_at);

-- Anti-abus des formulaires ouverts : statut imposé, 5 demandes par contact et par jour, 100 par heure au total.
create or replace function public.public_requests_guard()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_recent int;
  v_total  int;
begin
  if (select auth.uid()) is null or not public.has_permission('answer_contact_requests') then
    new.user_id := (select auth.uid());
    if tg_table_name = 'contact_requests' then
      new.status := 'new'; new.assigned_to := null;
    else
      new.status := 'open'; new.handled_by := null; new.handled_at := null;
    end if;
  end if;

  execute format(
    'select count(*) filter (where (email is not null and lower(email) = lower($1)) or (phone is not null and phone = $2) or (user_id is not null and user_id = $3)),
            count(*)
       from public.%I where created_at > now() - interval ''1 day''', tg_table_name)
    into v_recent, v_total using new.email, new.phone, new.user_id;
  if v_recent >= 5 then
    raise exception 'Trop de demandes envoyées aujourd''hui. Réessayez demain.' using errcode = '54000';
  end if;
  execute format('select count(*) from public.%I where created_at > now() - interval ''1 hour''', tg_table_name) into v_total;
  if v_total >= 100 then
    raise exception 'Le service est très sollicité. Réessayez dans une heure.' using errcode = '54000';
  end if;
  return new;
end;
$$;
create trigger join_requests_guard before insert on public.join_requests
  for each row execute function public.public_requests_guard();
create trigger contact_requests_guard before insert on public.contact_requests
  for each row execute function public.public_requests_guard();

-- ───────────────────────── Sécurité (RLS) ─────────────────────────
alter table public.producers        enable row level security;
alter table public.producer_crops   enable row level security;
alter table public.producer_needs   enable row level security;
alter table public.join_requests    enable row level security;
alter table public.contact_requests enable row level security;
alter table public.contact_messages enable row level security;

revoke all on public.producers, public.producer_crops, public.producer_needs, public.join_requests,
              public.contact_requests, public.contact_messages from anon, authenticated;

grant select on public.producers, public.producer_crops, public.producer_needs to anon, authenticated;
grant insert, update, delete on public.producers, public.producer_crops, public.producer_needs to authenticated;
grant insert on public.join_requests, public.contact_requests to anon, authenticated;
grant select, update on public.join_requests, public.contact_requests to authenticated;
grant select, insert on public.contact_messages to authenticated;

-- Profils : « public » pour tous, « members » pour les connectés, toujours pour soi et pour AFA.
create policy producers_read on public.producers for select to anon, authenticated
  using (
    visibility = 'public'
    or ((select auth.uid()) is not null and visibility = 'members')
    or user_id = (select auth.uid())
    or public.has_permission('manage_producers')
    or public.has_permission('view_producer_private')
  );
create policy producers_insert on public.producers for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy producers_update on public.producers for update to authenticated
  using (user_id = (select auth.uid()) or public.has_permission('manage_producers'))
  with check (user_id = (select auth.uid()) or public.has_permission('manage_producers'));
create policy producers_delete on public.producers for delete to authenticated
  using (user_id = (select auth.uid()) or public.has_permission('manage_producers'));

create policy producer_crops_read on public.producer_crops for select to anon, authenticated
  using (exists (select 1 from public.producers p where p.user_id = producer_id));
create policy producer_crops_write on public.producer_crops for all to authenticated
  using (producer_id = (select auth.uid()) or public.has_permission('manage_producers'))
  with check (producer_id = (select auth.uid()) or public.has_permission('manage_producers'));
create policy producer_needs_read on public.producer_needs for select to anon, authenticated
  using (exists (select 1 from public.producers p where p.user_id = producer_id));
create policy producer_needs_write on public.producer_needs for all to authenticated
  using (producer_id = (select auth.uid()) or public.has_permission('manage_producers'))
  with check (producer_id = (select auth.uid()) or public.has_permission('manage_producers'));

-- Téléphone partagé avec les membres connectés si le producteur l'a choisi.
create policy user_private_shared on public.user_private for select to authenticated
  using (phone_visibility in ('members', 'public'));

-- Demandes : envoi ouvert (statut imposé), lecture par le demandeur et par AFA.
create policy join_requests_insert on public.join_requests for insert to anon, authenticated with check (true);
create policy join_requests_read on public.join_requests for select to authenticated
  using (user_id = (select auth.uid()) or public.has_permission('manage_users'));
create policy join_requests_handle on public.join_requests for update to authenticated
  using (public.has_permission('manage_users')) with check (public.has_permission('manage_users'));

create policy contact_requests_insert on public.contact_requests for insert to anon, authenticated with check (true);
create policy contact_requests_read on public.contact_requests for select to authenticated
  using (user_id = (select auth.uid()) or public.has_permission('answer_contact_requests'));
create policy contact_requests_handle on public.contact_requests for update to authenticated
  using (public.has_permission('answer_contact_requests')) with check (public.has_permission('answer_contact_requests'));

create policy contact_messages_read on public.contact_messages for select to authenticated
  using (
    public.has_permission('answer_contact_requests')
    or (not is_internal and exists (select 1 from public.contact_requests r
                                    where r.id = request_id and r.user_id = (select auth.uid())))
  );
create policy contact_messages_insert on public.contact_messages for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and (public.has_permission('answer_contact_requests')
         or (not is_internal and exists (select 1 from public.contact_requests r
                                         where r.id = request_id and r.user_id = (select auth.uid()))))
  );

revoke all on function public.producers_before_write() from public, anon, authenticated;
revoke all on function public.producers_grant_role()   from public, anon, authenticated;
revoke all on function public.public_requests_guard()  from public, anon, authenticated;
