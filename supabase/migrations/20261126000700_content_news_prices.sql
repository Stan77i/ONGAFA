-- ONG AFA — Migration 0007 : veille, articles, prix, ressources (phase 5)
--
-- Règles :
--  * Veille externe : titre, extrait court, source, date, lien. Jamais le texte complet d'un article.
--  * Un prix n'est visible du public que VÉRIFIÉ, daté et sourcé.
--  * Publication d'un article AFA : permission publish_article (contrôlée en base).

create type public.content_status      as enum ('draft', 'review', 'published', 'archived');
create type public.news_status         as enum ('pending', 'published', 'rejected');
create type public.source_trust        as enum ('auto', 'review');
create type public.price_type          as enum ('farmgate', 'wholesale', 'retail');
create type public.verification_status as enum ('pending', 'verified', 'rejected');
create type public.resource_kind       as enum ('guide', 'fiche', 'pdf', 'video', 'etude', 'formation');

-- ───────────────────────── Référentiels ─────────────────────────
create table public.crops (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name        text not null,
  is_priority boolean not null default false,
  sort_order  int not null default 100,
  -- Mots-clés (minuscules) pour rattacher automatiquement la veille à une culture.
  -- « mot » = mot entier ; « mot* » = mot qui commence ainsi. Un mot-clé accentué n'est comparé
  -- qu'au texte accentué (« maïs » ne doit pas trouver la conjonction « mais »).
  keywords    text[] not null default '{}'
);

create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  scope      text not null check (scope in ('news', 'resource')),
  slug       text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name       text not null,
  sort_order int not null default 100,
  unique (scope, slug)
);

-- ───────────────────────── Veille ─────────────────────────
create table public.news_sources (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  site_url            text not null check (site_url ~ '^https://'),
  feed_url            text not null unique check (feed_url ~ '^https://'),
  trust               public.source_trust not null default 'review',
  requires_keyword    boolean not null default false, -- flux généraliste : ne garder que les sujets agricoles
  default_category_id uuid references public.categories(id) on delete set null,
  active              boolean not null default false,
  last_fetched_at     timestamptz,
  last_error          text,
  created_at          timestamptz not null default now()
);

create table public.news_items (
  id           uuid primary key default gen_random_uuid(),
  source_id    uuid not null references public.news_sources(id) on delete cascade,
  title        text not null check (char_length(title) between 3 and 300),
  excerpt      text check (char_length(excerpt) <= 400), -- extrait court, jamais l'article complet
  url          text not null unique check (url ~ '^https?://'),
  published_at timestamptz not null,
  fetched_at   timestamptz not null default now(),
  status       public.news_status not null default 'pending',
  category_id  uuid references public.categories(id) on delete set null,
  reviewed_by  uuid references auth.users(id) on delete set null,
  reviewed_at  timestamptz,
  search_vector tsvector generated always as (
    to_tsvector('french', coalesce(title, '') || ' ' || coalesce(excerpt, ''))
  ) stored
);
create index news_items_published_idx on public.news_items (published_at desc) where status = 'published';
create index news_items_search_idx on public.news_items using gin (search_vector);

create table public.news_item_crops (
  news_item_id uuid not null references public.news_items(id) on delete cascade,
  crop_id      uuid not null references public.crops(id) on delete cascade,
  primary key (news_item_id, crop_id)
);

create table public.ingestion_runs (
  id          bigint generated always as identity primary key,
  source_id   uuid references public.news_sources(id) on delete cascade,
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  fetched     int not null default 0,
  inserted    int not null default 0,
  error       text
);
create index ingestion_runs_started_idx on public.ingestion_runs (started_at desc);

-- ───────────────────────── Articles AFA ─────────────────────────
create table public.articles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           text not null check (char_length(title) between 3 and 200),
  summary         text not null check (char_length(summary) between 10 and 400),
  body            text not null default '', -- Markdown
  cover_path      text,
  cover_alt       text,
  author_name     text not null default 'ONG AFA',
  source_label    text, -- sources citées dans l'article
  category_id     uuid references public.categories(id) on delete set null,
  status          public.content_status not null default 'draft',
  published_at    timestamptz,
  seo_title       text check (char_length(seo_title) <= 70),
  seo_description text check (char_length(seo_description) <= 170),
  created_by      uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (status <> 'published' or published_at is not null),
  search_vector   tsvector generated always as (
    to_tsvector('french', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(body, ''))
  ) stored
);
create index articles_published_idx on public.articles (published_at desc) where status = 'published';
create index articles_search_idx on public.articles using gin (search_vector);
create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

create table public.article_crops (
  article_id uuid not null references public.articles(id) on delete cascade,
  crop_id    uuid not null references public.crops(id) on delete cascade,
  primary key (article_id, crop_id)
);

-- Publier (ou dépublier) exige publish_article ; rédiger exige create/edit_article.
create or replace function public.articles_guard_publication()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (tg_op = 'INSERT' and new.status = 'published')
     or (tg_op = 'UPDATE' and new.status is distinct from old.status
         and (new.status = 'published' or old.status = 'published')) then
    if (select auth.uid()) is not null and not public.has_permission('publish_article') then
      raise exception 'Publication réservée aux personnes autorisées (publish_article)' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;
create trigger articles_guard_publication
  before insert or update on public.articles
  for each row execute function public.articles_guard_publication();
create trigger articles_audit
  after insert or update or delete on public.articles
  for each row execute function public.audit_row_change();

-- ───────────────────────── Prix ─────────────────────────
create table public.units (
  code          text primary key check (code ~ '^[a-z0-9_]+$'),
  label         text not null,
  kg_equivalent numeric check (kg_equivalent > 0) -- null si l'unité n'est pas standardisée (tas, cuvette…)
);

create table public.markets (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  location_id uuid references public.locations(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table public.market_prices (
  id            uuid primary key default gen_random_uuid(),
  crop_id       uuid not null references public.crops(id),
  product_label text not null check (char_length(product_label) between 2 and 80), -- « Manioc frais », « Attiéké »…
  market_id     uuid references public.markets(id) on delete set null,
  location_id   uuid references public.locations(id) on delete set null,
  unit_code     text not null references public.units(code),
  amount        numeric(12, 2) not null check (amount > 0),
  currency      text not null default 'XOF' check (currency = 'XOF'),
  price_type    public.price_type not null,
  observed_on   date not null check (observed_on <= current_date),
  source        text not null check (char_length(source) >= 2),
  source_url    text check (source_url ~ '^https?://'),
  verification  public.verification_status not null default 'pending',
  created_by    uuid references auth.users(id) on delete set null,
  verified_by   uuid references auth.users(id) on delete set null,
  verified_at   timestamptz,
  created_at    timestamptz not null default now()
);
create index market_prices_public_idx on public.market_prices (crop_id, observed_on desc) where verification = 'verified';

-- Seule une personne avec verify_prices peut changer le statut de vérification ; on garde qui et quand.
create or replace function public.market_prices_guard_verification()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (tg_op = 'INSERT' and new.verification <> 'pending')
     or (tg_op = 'UPDATE' and new.verification is distinct from old.verification) then
    if (select auth.uid()) is not null and not public.has_permission('verify_prices') then
      raise exception 'Vérification des prix réservée (verify_prices)' using errcode = '42501';
    end if;
    new.verified_by := (select auth.uid());
    new.verified_at := now();
  end if;
  return new;
end;
$$;
create trigger market_prices_guard_verification
  before insert or update on public.market_prices
  for each row execute function public.market_prices_guard_verification();
create trigger market_prices_audit
  after insert or update or delete on public.market_prices
  for each row execute function public.audit_row_change();

-- ───────────────────────── Ressources ─────────────────────────
create table public.resources (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title        text not null,
  description  text,
  kind         public.resource_kind not null,
  file_path    text,
  external_url text check (external_url ~ '^https://'),
  size_label   text,
  crop_id      uuid references public.crops(id) on delete set null,
  source       text not null,
  status       public.content_status not null default 'draft',
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (file_path is not null or external_url is not null),
  check (status <> 'published' or published_at is not null)
);
create trigger resources_updated_at before update on public.resources
  for each row execute function public.set_updated_at();

-- ───────────────────────── Données de référence ─────────────────────────
insert into public.crops (slug, name, is_priority, sort_order, keywords) values
  ('manioc',   'Manioc',          true,  1, array['manioc*', 'attieke', 'attiéké', 'placali', 'gari', 'cossette*', 'tapioca']),
  ('mais',     'Maïs',            false, 2, array['maïs']),
  ('igname',   'Igname',          false, 3, array['igname*']),
  ('plantain', 'Banane plantain', false, 4, array['plantain*']),
  ('riz',      'Riz',             false, 5, array['riz', 'rizicult*', 'riziere*', 'rizière*']),
  ('legumes',  'Légumes',         false, 6, array['legume*', 'légume*', 'maraich*', 'maraîch*', 'tomate*', 'piment*', 'aubergine*', 'gombo*', 'oignon*'])
on conflict (slug) do nothing;

insert into public.categories (scope, slug, name, sort_order) values
  ('news', 'actualites', 'Actualités agricoles', 1),
  ('news', 'recherche', 'Recherche et innovation', 2),
  ('news', 'terrain', 'Encadrement et terrain', 3),
  ('news', 'marches', 'Marchés et prix', 4),
  ('news', 'opportunites', 'Opportunités', 5),
  ('news', 'afa', 'Contenus AFA', 6),
  ('resource', 'guides', 'Guides pratiques', 1),
  ('resource', 'fiches', 'Fiches techniques', 2),
  ('resource', 'etudes', 'Études et rapports', 3)
on conflict (scope, slug) do nothing;

insert into public.units (code, label, kg_equivalent) values
  ('kg', 'kilogramme', 1),
  ('tonne', 'tonne', 1000),
  ('sac_50kg', 'sac de 50 kg', 50),
  ('sac_100kg', 'sac de 100 kg', 100),
  ('tas', 'tas', null),
  ('cuvette', 'cuvette', null),
  ('boule', 'boule', null)
on conflict (code) do nothing;

-- Sources de veille : institutions publiques en publication automatique ;
-- presse généraliste filtrée par mots-clés et soumise à validation.
insert into public.news_sources (name, site_url, feed_url, trust, requires_keyword, default_category_id, active)
select v.name, v.site_url, v.feed_url, v.trust::public.source_trust, v.requires_keyword, c.id, true
from (values
  ('AIP — Agriculture', 'https://www.aip.ci', 'https://www.aip.ci/category/economie/agriculture/feed/', 'auto', false, 'actualites'),
  ('CNRA', 'https://www.cnra.ci', 'https://www.cnra.ci/feed/', 'auto', false, 'recherche'),
  ('ANADER', 'https://www.anader.ci', 'https://www.anader.ci/feed/', 'auto', false, 'terrain'),
  ('Linfodrome', 'https://www.linfodrome.com', 'https://www.linfodrome.com/rss', 'review', true, 'actualites')
) as v(name, site_url, feed_url, trust, requires_keyword, category)
join public.categories c on c.scope = 'news' and c.slug = v.category
on conflict (feed_url) do nothing;

-- ───────────────────────── Sécurité (RLS) ─────────────────────────
alter table public.crops           enable row level security;
alter table public.categories      enable row level security;
alter table public.news_sources    enable row level security;
alter table public.news_items      enable row level security;
alter table public.news_item_crops enable row level security;
alter table public.ingestion_runs  enable row level security;
alter table public.articles        enable row level security;
alter table public.article_crops   enable row level security;
alter table public.units           enable row level security;
alter table public.markets         enable row level security;
alter table public.market_prices   enable row level security;
alter table public.resources       enable row level security;

revoke all on public.crops, public.categories, public.news_sources, public.news_items, public.news_item_crops,
              public.ingestion_runs, public.articles, public.article_crops, public.units, public.markets,
              public.market_prices, public.resources
  from anon, authenticated;

-- Lecture publique (filtrée par les politiques)
grant select on public.crops, public.categories, public.units, public.markets, public.news_item_crops,
                public.article_crops, public.news_items, public.articles, public.market_prices, public.resources
  to anon, authenticated;
grant select (id, name, site_url, default_category_id, active) on public.news_sources to anon;
grant select on public.news_sources, public.ingestion_runs to authenticated;
-- Écritures (filtrées par les politiques)
grant insert, update, delete on public.news_sources, public.news_items, public.news_item_crops, public.articles,
                                public.article_crops, public.markets, public.market_prices, public.resources
  to authenticated;

create policy crops_read      on public.crops      for select to anon, authenticated using (true);
create policy categories_read on public.categories for select to anon, authenticated using (true);
create policy units_read      on public.units      for select to anon, authenticated using (true);
create policy markets_read    on public.markets    for select to anon, authenticated using (true);
create policy markets_write   on public.markets    for all to authenticated
  using (public.has_permission('manage_prices')) with check (public.has_permission('manage_prices'));

create policy news_sources_read on public.news_sources for select to anon, authenticated
  using (active or public.has_permission('manage_news_sources'));
create policy news_sources_write on public.news_sources for all to authenticated
  using (public.has_permission('manage_news_sources')) with check (public.has_permission('manage_news_sources'));

create policy news_items_read on public.news_items for select to anon, authenticated
  using (status = 'published' or public.has_permission('manage_news'));
create policy news_items_write on public.news_items for all to authenticated
  using (public.has_permission('manage_news')) with check (public.has_permission('manage_news'));

create policy news_item_crops_read on public.news_item_crops for select to anon, authenticated
  using (exists (select 1 from public.news_items n where n.id = news_item_id
                 and (n.status = 'published' or public.has_permission('manage_news'))));
create policy news_item_crops_write on public.news_item_crops for all to authenticated
  using (public.has_permission('manage_news')) with check (public.has_permission('manage_news'));

create policy ingestion_runs_read on public.ingestion_runs for select to authenticated
  using (public.has_permission('manage_news_sources'));

create policy articles_read on public.articles for select to anon, authenticated
  using ((status = 'published' and published_at <= now())
         or public.has_permission('edit_article') or public.has_permission('create_article'));
create policy articles_insert on public.articles for insert to authenticated
  with check (public.has_permission('create_article'));
create policy articles_update on public.articles for update to authenticated
  using (public.has_permission('edit_article')) with check (public.has_permission('edit_article'));
create policy articles_delete on public.articles for delete to authenticated
  using (public.has_permission('publish_article'));

create policy article_crops_read on public.article_crops for select to anon, authenticated
  using (exists (select 1 from public.articles a where a.id = article_id
                 and ((a.status = 'published' and a.published_at <= now()) or public.has_permission('edit_article'))));
create policy article_crops_write on public.article_crops for all to authenticated
  using (public.has_permission('edit_article')) with check (public.has_permission('edit_article'));

create policy market_prices_read on public.market_prices for select to anon, authenticated
  using (verification = 'verified' or public.has_permission('manage_prices') or public.has_permission('verify_prices'));
create policy market_prices_insert on public.market_prices for insert to authenticated
  with check (public.has_permission('manage_prices'));
create policy market_prices_update on public.market_prices for update to authenticated
  using (public.has_permission('manage_prices') or public.has_permission('verify_prices'))
  with check (public.has_permission('manage_prices') or public.has_permission('verify_prices'));
create policy market_prices_delete on public.market_prices for delete to authenticated
  using (public.has_permission('manage_prices'));

create policy resources_read on public.resources for select to anon, authenticated
  using ((status = 'published' and published_at <= now()) or public.has_permission('manage_resources'));
create policy resources_write on public.resources for all to authenticated
  using (public.has_permission('manage_resources')) with check (public.has_permission('manage_resources'));

revoke all on function public.articles_guard_publication()       from public, anon, authenticated;
revoke all on function public.market_prices_guard_verification() from public, anon, authenticated;
