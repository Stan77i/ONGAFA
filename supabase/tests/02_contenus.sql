-- Tests de sécurité de la phase 5 : veille, articles, prix, ressources.
-- Réutilise le schéma tests et les comptes créés par 01_security.sql.

-- ───────── Jeu de données ─────────
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-0000000000d1', 'dave@test.ci',  '{"display_name":"Dave"}'),
  ('00000000-0000-0000-0000-0000000000e1', 'erin@test.ci',  '{"display_name":"Erin"}'),
  ('00000000-0000-0000-0000-0000000000f1', 'frank@test.ci', '{"display_name":"Frank"}'),
  ('00000000-0000-0000-0000-0000000000a7', 'gina@test.ci',  '{"display_name":"Gina"}');

-- Rôles de test : un rédacteur sans droit de publier, une saisie de prix sans droit de vérifier.
insert into public.roles (code, label) values ('redacteur_test', 'Rédacteur (test)'), ('saisie_prix_test', 'Saisie prix (test)');
insert into public.role_permissions values
  ('redacteur_test', 'create_article'), ('redacteur_test', 'edit_article'), ('saisie_prix_test', 'manage_prices');
insert into public.user_roles (user_id, role_code) values
  ('00000000-0000-0000-0000-0000000000d1', 'editor'),
  ('00000000-0000-0000-0000-0000000000e1', 'data_manager'),
  ('00000000-0000-0000-0000-0000000000f1', 'redacteur_test'),
  ('00000000-0000-0000-0000-0000000000a7', 'saisie_prix_test');

-- Éléments de veille insérés comme le fait la collecte automatique (rôle de service).
insert into public.news_items (id, source_id, title, excerpt, url, published_at, status)
select v.id::uuid, s.id, v.title, 'Extrait.', v.url, now() - interval '1 day', v.status::public.news_status
from public.news_sources s,
     (values ('20000000-0000-0000-0000-000000000001', 'Info publiée sur le manioc', 'https://exemple.ci/a', 'published'),
             ('20000000-0000-0000-0000-000000000002', 'Info en attente de validation', 'https://exemple.ci/b', 'pending')) as v(id, title, url, status)
where s.name = 'CNRA';

insert into public.resources (slug, title, kind, external_url, source, status, published_at) values
  ('guide-publie', 'Guide publié', 'guide', 'https://exemple.ci/guide.pdf', 'Source test', 'published', now()),
  ('guide-brouillon', 'Guide brouillon', 'guide', 'https://exemple.ci/b.pdf', 'Source test', 'draft', null);

select tests.assert((select count(*) from public.crops) = 6, 'référentiel : 6 cultures, manioc en priorité');
select tests.assert((select count(*) from public.news_sources where active) = 4, 'veille : 4 sources actives');

-- ───────── Visiteur ─────────
set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.news_items) = 1, 'visiteur : ne voit que la veille publiée');
select tests.assert((select count(*) from public.news_sources) = 4, 'visiteur : voit la liste des sources');
select tests.assert_fails('select feed_url from public.news_sources', 'visiteur : ne voit pas les adresses techniques des flux');
select tests.assert_fails('select * from public.ingestion_runs', 'visiteur : pas d''accès au journal de collecte');
select tests.assert((select count(*) from public.resources) = 1, 'visiteur : ne voit que les ressources publiées');
select tests.assert_fails($$insert into public.news_items (source_id, title, url, published_at)
  select id, 'Spam', 'https://spam.example', now() from public.news_sources limit 1$$, 'visiteur : ne peut pas publier dans la veille');
reset role;

-- ───────── Membre ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-00000000000a');
select tests.assert_fails($$insert into public.articles (slug, title, summary) values ('pirate', 'Article pirate', 'Résumé pirate assez long')$$,
  'membre : ne peut pas créer d''article');
select tests.assert(tests.rows($$update public.news_items set status = 'published'$$) = 0,
  'membre : ne peut pas valider la veille en attente');
reset role;

-- ───────── Rédacteur sans droit de publier (Frank) ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000f1');
insert into public.articles (id, slug, title, summary, body)
  values ('30000000-0000-0000-0000-000000000001', 'premier-article', 'Premier article', 'Un résumé de test suffisamment long.', 'Texte.');
select tests.assert_fails($$update public.articles set status = 'published', published_at = now() where slug = 'premier-article'$$,
  'rédacteur : ne peut pas publier sans publish_article');
select tests.assert_fails($$insert into public.articles (slug, title, summary, status, published_at)
  values ('direct', 'Publication directe', 'Résumé suffisamment long pour le test.', 'published', now())$$,
  'rédacteur : ne peut pas créer un article directement publié');
reset role;

set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.articles) = 0, 'visiteur : ne voit pas un article en brouillon');
reset role;

-- ───────── Éditeur (Dave) ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000d1');
update public.articles set status = 'published', published_at = now() where slug = 'premier-article';
select tests.assert(tests.rows($$update public.news_items set status = 'published' where status = 'pending'$$) = 1,
  'éditeur : peut valider un élément de veille en attente');
reset role;

set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.articles) = 1, 'visiteur : voit l''article une fois publié');
select tests.assert((select count(*) from public.news_items) = 2, 'visiteur : voit la veille validée');
reset role;
select tests.assert(exists (select 1 from public.admin_audit_logs where entity_type = 'articles' and action = 'update'),
  'audit : la publication d''un article est tracée');

-- ───────── Prix ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000a7');
select tests.assert_fails($$insert into public.market_prices (crop_id, product_label, unit_code, amount, price_type, observed_on, source, verification)
  select id, 'Manioc frais', 'kg', 100, 'retail', current_date, 'Relevé test', 'verified' from public.crops where slug = 'manioc'$$,
  'saisie : ne peut pas créer un prix déjà « vérifié »');
insert into public.market_prices (id, crop_id, product_label, unit_code, amount, price_type, observed_on, source)
  select '40000000-0000-0000-0000-000000000001', id, 'Manioc frais', 'kg', 100, 'retail', current_date, 'Relevé test'
  from public.crops where slug = 'manioc';
select tests.assert_fails($$update public.market_prices set verification = 'verified'$$,
  'saisie : ne peut pas vérifier son propre prix');
select tests.assert_fails($$insert into public.market_prices (crop_id, product_label, unit_code, amount, price_type, observed_on, source)
  select id, 'Manioc frais', 'kg', 100, 'retail', current_date + 7, 'Relevé test' from public.crops where slug = 'manioc'$$,
  'prix : une date future est refusée');
select tests.assert_fails($$insert into public.market_prices (crop_id, product_label, unit_code, amount, price_type, observed_on, source)
  select id, 'Manioc frais', 'kg', 100, 'retail', current_date, '' from public.crops where slug = 'manioc'$$,
  'prix : une source est obligatoire');
reset role;

set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.market_prices) = 0, 'visiteur : ne voit pas un prix non vérifié');
reset role;

set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000e1');
update public.market_prices set verification = 'verified' where id = '40000000-0000-0000-0000-000000000001';
reset role;
select tests.assert((select verified_by from public.market_prices where id = '40000000-0000-0000-0000-000000000001')
  = '00000000-0000-0000-0000-0000000000e1', 'prix : la vérification enregistre qui a vérifié');

set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.market_prices) = 1, 'visiteur : voit le prix une fois vérifié');
reset role;

\echo '✔ Tests de la phase 5 (veille, articles, prix, ressources) passés.'
