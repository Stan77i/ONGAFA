-- ONG AFA — Migration 0012 : communauté (forum, réponses, signalements, modération, témoignages) — phase 7
--
-- Règles :
--  * Lecture publique des contenus publiés (forum ouvert, utile et indexable) ; écriture réservée aux membres.
--  * Nouveau membre (moins de 2 contenus validés) : publication EN ATTENTE de validation.
--    Liens envoyés par un nouveau membre : toujours en attente. Modérateurs : publiés directement.
--  * Limites : 10 sujets et 60 réponses par jour et par membre, 20 secondes entre deux envois.
--  * Chaque décision de modération est enregistrée (qui, quoi, pourquoi, avant, après).
--  * Le nom affiché sur le forum est celui choisi par le membre (copié à l'envoi).

create type public.post_status   as enum ('pending', 'published', 'hidden', 'removed');
create type public.report_reason as enum ('spam', 'abuse', 'false_info', 'scam', 'personal_data', 'off_topic', 'other');
create type public.report_status as enum ('open', 'actioned', 'dismissed');

create table public.post_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null,
  description text,
  sort_order  int not null default 100
);

create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  author_id        uuid references auth.users(id) on delete set null,
  author_name      text not null,
  category_id      uuid not null references public.post_categories(id),
  crop_id          uuid references public.crops(id) on delete set null,
  region_id        uuid references public.locations(id) on delete set null,
  title            text not null check (char_length(title) between 8 and 140),
  body             text not null check (char_length(body) between 10 and 5000),
  status           public.post_status not null default 'pending',
  is_pinned        boolean not null default false,
  reply_count      int not null default 0,
  last_activity_at timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  search_vector    tsvector generated always as (
    to_tsvector('french', coalesce(title, '') || ' ' || coalesce(body, ''))
  ) stored
);
create index posts_feed_idx on public.posts (is_pinned desc, last_activity_at desc) where status = 'published';
create index posts_author_idx on public.posts (author_id, created_at desc);
create index posts_search_idx on public.posts using gin (search_vector);
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

create table public.comments (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  author_id   uuid references auth.users(id) on delete set null,
  author_name text not null,
  body        text not null check (char_length(body) between 2 and 3000),
  status      public.post_status not null default 'pending',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index comments_post_idx on public.comments (post_id, created_at);
create index comments_author_idx on public.comments (author_id, created_at desc);
create trigger comments_updated_at before update on public.comments
  for each row execute function public.set_updated_at();

create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('post', 'comment', 'testimonial')),
  target_id   uuid not null,
  reporter_id uuid references auth.users(id) on delete set null,
  reason      public.report_reason not null,
  details     text check (char_length(details) <= 1000),
  status      public.report_status not null default 'open',
  handled_by  uuid references auth.users(id) on delete set null,
  handled_at  timestamptz,
  created_at  timestamptz not null default now(),
  unique (target_type, target_id, reporter_id)
);
create index reports_open_idx on public.reports (created_at) where status = 'open';

create table public.moderation_actions (
  id              bigint generated always as identity primary key,
  target_type     text not null check (target_type in ('post', 'comment', 'testimonial')),
  target_id       uuid not null,
  actor_id        uuid references auth.users(id) on delete set null,
  previous_status text,
  new_status      text not null,
  reason          text check (char_length(reason) <= 500),
  created_at      timestamptz not null default now()
);
create index moderation_actions_target_idx on public.moderation_actions (target_type, target_id);

create table public.testimonials (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid references auth.users(id) on delete set null,
  name            text not null check (char_length(name) between 2 and 80),
  place           text not null check (char_length(place) between 2 and 80),
  activity        text not null check (char_length(activity) between 2 and 80),
  quote           text not null check (char_length(quote) between 20 and 1200),
  consent_version text not null,
  status          public.post_status not null default 'pending',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  check (status <> 'published' or published_at is not null)
);
create index testimonials_published_idx on public.testimonials (published_at desc) where status = 'published';

insert into public.post_categories (slug, name, description, sort_order) values
  ('questions-techniques', 'Questions techniques', 'Culture, maladies, variétés, sols, récolte, stockage.', 1),
  ('vente-achat', 'Vente et achat', 'Proposer une production, chercher un acheteur ou un fournisseur.', 2),
  ('transformation', 'Transformation', 'Attiéké, gari, placali, farine, amidon : techniques et équipements.', 3),
  ('financement', 'Financement et formation', 'Crédits, subventions, formations, accompagnement.', 4),
  ('vie-du-reseau', 'Vie du réseau', 'Rencontres, coopératives, idées et propositions pour AFA.', 5)
on conflict (slug) do nothing;

-- ───────────────────────── Règles d'envoi (forum) ─────────────────────────
-- Statut initial, nom affiché, limites anti-abus. SECURITY DEFINER pour compter l'historique de l'auteur.
create or replace function public.community_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid       uuid := (select auth.uid());
  v_validated int;
  v_today     int;
  v_last      timestamptz;
  v_text      text;
begin
  if v_uid is null then
    return new; -- rôle de service (import, tests) : valeurs fournies conservées
  end if;
  new.author_id := v_uid;
  select display_name into new.author_name from public.profiles where id = v_uid;

  if public.has_permission('moderate_post') then
    new.status := 'published';
    return new;
  end if;

  -- Limites
  if tg_table_name = 'posts' then
    select count(*), max(created_at) into v_today, v_last from public.posts
      where author_id = v_uid and created_at > now() - interval '1 day';
    if v_today >= 10 then raise exception 'Limite atteinte : 10 sujets par jour.' using errcode = '54000'; end if;
    new.is_pinned := false;
    new.reply_count := 0;
    v_text := new.title || ' ' || new.body;
  else
    select count(*), max(created_at) into v_today, v_last from public.comments
      where author_id = v_uid and created_at > now() - interval '1 day';
    if v_today >= 60 then raise exception 'Limite atteinte : 60 réponses par jour.' using errcode = '54000'; end if;
    if not exists (select 1 from public.posts where id = new.post_id and status = 'published') then
      raise exception 'Ce sujet n''accepte pas de réponse.' using errcode = '42501';
    end if;
    v_text := new.body;
  end if;
  if v_last is not null and v_last > now() - interval '20 seconds' then
    raise exception 'Patientez quelques secondes avant d''envoyer un nouveau message.' using errcode = '54000';
  end if;

  -- Statut : membre confirmé (≥ 2 contenus validés) sans lien → publié ; sinon en attente.
  select (select count(*) from public.posts where author_id = v_uid and status = 'published')
       + (select count(*) from public.comments where author_id = v_uid and status = 'published')
    into v_validated;
  if v_validated >= 2 and v_text !~* '(https?://|www\.)' then
    new.status := 'published';
  else
    new.status := 'pending';
  end if;
  return new;
end;
$$;
create trigger posts_before_insert before insert on public.posts
  for each row execute function public.community_before_insert();
create trigger comments_before_insert before insert on public.comments
  for each row execute function public.community_before_insert();

-- Un auteur ne peut modifier que le texte (pas le statut, l'épinglage, le compteur ou le nom affiché).
-- Ne vise que les modifications DIRECTES d'un utilisateur (current_user = authenticated) : les fonctions
-- internes (compteur de réponses, masquage automatique, modération) s'exécutent sous leur propriétaire.
create or replace function public.community_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if current_user = 'authenticated' and not public.has_permission('moderate_post') then
    if new.status is distinct from old.status
       or new.author_id is distinct from old.author_id
       or new.author_name is distinct from old.author_name
       or (tg_table_name = 'posts' and (new.is_pinned is distinct from old.is_pinned
                                       or new.reply_count is distinct from old.reply_count
                                       or new.last_activity_at is distinct from old.last_activity_at)) then
      raise exception 'Modification réservée à la modération' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
create trigger posts_before_update before update on public.posts
  for each row execute function public.community_before_update();
create trigger comments_before_update before update on public.comments
  for each row execute function public.community_before_update();

-- Compteur de réponses et date de dernière activité (réponses publiées uniquement).
create or replace function public.comments_refresh_post()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_post uuid := coalesce(new.post_id, old.post_id);
begin
  update public.posts p set
    reply_count = (select count(*) from public.comments c where c.post_id = v_post and c.status = 'published'),
    last_activity_at = greatest(p.created_at,
      coalesce((select max(c.created_at) from public.comments c where c.post_id = v_post and c.status = 'published'), p.created_at))
  where p.id = v_post;
  return null;
end;
$$;
create trigger comments_refresh_post after insert or update of status or delete on public.comments
  for each row execute function public.comments_refresh_post();

-- ───────────────────────── Modération ─────────────────────────
create or replace function public.moderate_content(p_type text, p_id uuid, p_status public.post_status, p_reason text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old text;
begin
  if not (public.has_permission('moderate_post') or (p_type = 'testimonial' and public.has_permission('manage_testimonials'))) then
    raise exception 'Permission refusée' using errcode = '42501';
  end if;
  if p_type = 'post' then
    select status::text into v_old from public.posts where id = p_id for update;
    update public.posts set status = p_status where id = p_id;
  elsif p_type = 'comment' then
    select status::text into v_old from public.comments where id = p_id for update;
    update public.comments set status = p_status where id = p_id;
  elsif p_type = 'testimonial' then
    select status::text into v_old from public.testimonials where id = p_id for update;
    update public.testimonials set status = p_status,
      published_at = case when p_status = 'published' then coalesce(published_at, now()) else published_at end
    where id = p_id;
  else
    raise exception 'Type inconnu : %', p_type;
  end if;
  if v_old is null then
    raise exception 'Contenu introuvable' using errcode = 'P0002';
  end if;
  insert into public.moderation_actions (target_type, target_id, actor_id, previous_status, new_status, reason)
  values (p_type, p_id, (select auth.uid()), v_old, p_status::text, p_reason);
  -- Les signalements ouverts sur ce contenu sont considérés comme traités.
  update public.reports set status = case when p_status in ('hidden', 'removed') then 'actioned'::public.report_status else 'dismissed'::public.report_status end,
         handled_by = (select auth.uid()), handled_at = now()
  where target_type = p_type and target_id = p_id and status = 'open';
end;
$$;

-- Trois signalements distincts sur un contenu publié : masquage automatique en attendant la modération.
create or replace function public.reports_auto_hide()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.reports where target_type = new.target_type and target_id = new.target_id and status = 'open') >= 3 then
    if new.target_type = 'post' then
      update public.posts set status = 'hidden' where id = new.target_id and status = 'published';
    elsif new.target_type = 'comment' then
      update public.comments set status = 'hidden' where id = new.target_id and status = 'published';
    end if;
    insert into public.moderation_actions (target_type, target_id, actor_id, previous_status, new_status, reason)
    values (new.target_type, new.target_id, null, 'published', 'hidden', 'Masquage automatique : 3 signalements');
  end if;
  return new;
end;
$$;
create trigger reports_auto_hide after insert on public.reports
  for each row execute function public.reports_auto_hide();

-- Témoignages : toujours en attente à l'envoi (sauf personne habilitée).
create or replace function public.testimonials_before_insert()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null and not public.has_permission('manage_testimonials') then
    new.author_id := (select auth.uid());
    new.status := 'pending';
    new.published_at := null;
  end if;
  return new;
end;
$$;
create trigger testimonials_before_insert before insert on public.testimonials
  for each row execute function public.testimonials_before_insert();

-- ───────────────────────── Sécurité (RLS) ─────────────────────────
alter table public.post_categories    enable row level security;
alter table public.posts              enable row level security;
alter table public.comments           enable row level security;
alter table public.reports            enable row level security;
alter table public.moderation_actions enable row level security;
alter table public.testimonials       enable row level security;

revoke all on public.post_categories, public.posts, public.comments, public.reports, public.moderation_actions,
              public.testimonials from anon, authenticated;

grant select on public.post_categories, public.posts, public.comments, public.testimonials to anon, authenticated;
grant insert, update, delete on public.posts, public.comments to authenticated;
grant insert on public.reports, public.testimonials to authenticated;
grant select on public.reports, public.moderation_actions to authenticated;

create policy post_categories_read on public.post_categories for select to anon, authenticated using (true);

create policy posts_read on public.posts for select to anon, authenticated
  using (status = 'published' or author_id = (select auth.uid()) or public.has_permission('moderate_post'));
create policy posts_insert on public.posts for insert to authenticated
  with check (public.has_permission('create_post'));
create policy posts_update on public.posts for update to authenticated
  using ((author_id = (select auth.uid()) and status in ('pending', 'published')) or public.has_permission('moderate_post'))
  with check ((author_id = (select auth.uid())) or public.has_permission('moderate_post'));
create policy posts_delete on public.posts for delete to authenticated
  using (author_id = (select auth.uid()) or public.has_permission('hide_content'));

create policy comments_read on public.comments for select to anon, authenticated
  using (
    (status = 'published' and exists (select 1 from public.posts p where p.id = post_id and p.status = 'published'))
    or author_id = (select auth.uid()) or public.has_permission('moderate_post')
  );
create policy comments_insert on public.comments for insert to authenticated
  with check (public.has_permission('comment'));
create policy comments_update on public.comments for update to authenticated
  using ((author_id = (select auth.uid()) and status in ('pending', 'published')) or public.has_permission('moderate_post'))
  with check ((author_id = (select auth.uid())) or public.has_permission('moderate_post'));
create policy comments_delete on public.comments for delete to authenticated
  using (author_id = (select auth.uid()) or public.has_permission('hide_content'));

create policy reports_insert on public.reports for insert to authenticated
  with check (reporter_id = (select auth.uid()) and status = 'open');
create policy reports_read on public.reports for select to authenticated
  using (reporter_id = (select auth.uid()) or public.has_permission('manage_reports'));

create policy moderation_actions_read on public.moderation_actions for select to authenticated
  using (public.has_permission('moderate_post') or public.has_permission('view_audit_logs'));

create policy testimonials_read on public.testimonials for select to anon, authenticated
  using ((status = 'published' and published_at <= now()) or author_id = (select auth.uid()) or public.has_permission('manage_testimonials'));
create policy testimonials_insert on public.testimonials for insert to authenticated
  with check (true);

revoke all on function public.community_before_insert()    from public, anon, authenticated;
revoke all on function public.community_before_update()    from public, anon, authenticated;
revoke all on function public.comments_refresh_post()      from public, anon, authenticated;
revoke all on function public.reports_auto_hide()          from public, anon, authenticated;
revoke all on function public.testimonials_before_insert() from public, anon, authenticated;
revoke all on function public.moderate_content(text, uuid, public.post_status, text) from public, anon;
grant execute on function public.moderate_content(text, uuid, public.post_status, text) to authenticated;
