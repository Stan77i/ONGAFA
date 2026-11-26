-- Tests de sécurité de la phase 6 : producteurs, adhésions, questions à AFA.

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-0000000000b1', 'awa@test.ci',    '{"display_name":"Awa"}'),
  ('00000000-0000-0000-0000-0000000000b2', 'kofi@test.ci',   '{"display_name":"Kofi"}'),
  ('00000000-0000-0000-0000-0000000000b3', 'agent@test.ci',  '{"display_name":"Agent"}');
insert into public.user_roles (user_id, role_code) values ('00000000-0000-0000-0000-0000000000b3', 'territorial_agent');
-- territorial_agent n'a d'effet qu'avec un rôle global : on lui donne un rôle de test global pour répondre.
insert into public.roles (code, label) values ('support_test', 'Support (test)');
insert into public.role_permissions values ('support_test', 'answer_contact_requests');
insert into public.user_roles (user_id, role_code) values ('00000000-0000-0000-0000-0000000000b3', 'support_test');

select tests.assert((select count(*) from public.locations where level in ('region', 'district') and centroid is not null) = 33,
  'référentiel : les 31 régions et 2 districts autonomes sont disponibles');

-- ───────── Productrice (Awa) ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000b1');
select tests.assert_fails(
  $$insert into public.producers (user_id, slug, display_name) values (auth.uid(), 'awa', 'Awa')$$,
  'producteur : profil refusé sans consentement');
insert into public.consents (user_id, consent_type, version) values (auth.uid(), 'producer_data', '2026-11');
select tests.assert_fails(
  $$insert into public.producers (user_id, slug, display_name, verification) values (auth.uid(), 'awa', 'Awa', 'verified')$$,
  'producteur : ne peut pas se déclarer « Vérifié par AFA »');
insert into public.producers (user_id, slug, display_name, region_id, village, total_area_ha)
  select auth.uid(), 'awa-nzi', 'Awa', id, 'Village test', 2.5 from public.locations where path_slug = 'nzi';
insert into public.producer_crops (producer_id, crop_id, area_ha) select auth.uid(), id, 2 from public.crops where slug = 'manioc';
insert into public.producer_needs (producer_id, need) values (auth.uid(), 'buyer');
insert into public.user_private (user_id, phone) values (auth.uid(), '+225 07 11 22 33 44');
select tests.assert(public.has_role('producer'), 'producteur : le rôle « producteur » est attribué à la création du profil');
select tests.assert_fails($$update public.producers set verification = 'verified' where user_id = auth.uid()$$,
  'producteur : ne peut pas s''attribuer le badge après coup');
select tests.assert_fails(
  $$insert into public.producers (user_id, slug, display_name) values ('00000000-0000-0000-0000-0000000000b2', 'faux', 'Faux')$$,
  'producteur : ne peut pas créer le profil de quelqu''un d''autre');
reset role;

-- ───────── Visiteur ─────────
set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.producers) = 0, 'visiteur : ne voit pas l''annuaire (réservé aux membres)');
select tests.assert((select count(*) from public.producer_crops) = 0, 'visiteur : ne voit pas les cultures des producteurs');
insert into public.contact_requests (full_name, email, category, message, consent_version, status)
  values ('Visiteur', 'visiteur@test.ci', 'debouche', 'Je cherche un débouché pour mon manioc.', '2026-11', 'closed');
select tests.assert_fails('select * from public.contact_requests', 'visiteur : ne peut pas lire les questions');
insert into public.contact_requests (full_name, email, category, message, consent_version) values
  ('Visiteur', 'visiteur@test.ci', 'information', 'Question numéro deux.', '2026-11'),
  ('Visiteur', 'visiteur@test.ci', 'information', 'Question numéro trois.', '2026-11'),
  ('Visiteur', 'visiteur@test.ci', 'information', 'Question numéro quatre.', '2026-11'),
  ('Visiteur', 'visiteur@test.ci', 'information', 'Question numéro cinq.', '2026-11');
select tests.assert_fails($$insert into public.contact_requests (full_name, email, category, message, consent_version)
  values ('Visiteur', 'VISITEUR@test.ci', 'information', 'Sixième question du jour.', '2026-11')$$,
  'anti-abus : 6e demande du jour avec le même email refusée');
select tests.assert_fails($$insert into public.contact_requests (full_name, category, message, consent_version)
  values ('Sans contact', 'information', 'Aucun moyen de répondre.', '2026-11')$$,
  'question : un email ou un téléphone est obligatoire');
insert into public.join_requests (full_name, phone, profile_type, consent_version) values ('Coopérative test', '0102030405', 'cooperative', '2026-11');
reset role;
select tests.assert((select status from public.contact_requests order by created_at limit 1) = 'new',
  'question : le statut est imposé à « nouvelle » (impossible de l''envoyer déjà « close »)');

-- ───────── Autre membre (Kofi) ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000b2');
select tests.assert((select count(*) from public.producers) = 1, 'membre : voit l''annuaire des producteurs');
select tests.assert((select count(*) from public.producer_crops) = 1, 'membre : voit les cultures déclarées');
select tests.assert((select count(*) from public.user_private where user_id = '00000000-0000-0000-0000-0000000000b1') = 0,
  'membre : ne voit pas le téléphone d''un producteur par défaut');
select tests.assert(tests.rows($$update public.producers set display_name = 'Piraté'$$) = 0, 'membre : ne peut pas modifier le profil d''un autre');
select tests.assert((select count(*) from public.contact_requests) = 0, 'membre : ne voit pas les questions des autres');
select tests.assert((select count(*) from public.join_requests) = 0, 'membre : ne voit pas les demandes d''adhésion des autres');
reset role;

-- Awa choisit de partager son téléphone avec les membres.
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000b1');
update public.user_private set phone_visibility = 'members' where user_id = auth.uid();
reset role;
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000b2');
select tests.assert((select phone from public.user_private where user_id = '00000000-0000-0000-0000-0000000000b1') is not null,
  'membre : voit le téléphone quand le producteur a choisi de le partager');
reset role;

-- ───────── Administrateur et support ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000ad');
update public.producers set verification = 'verified' where slug = 'awa-nzi';
select tests.assert((select count(*) from public.join_requests) = 1, 'admin : voit les demandes d''adhésion');
reset role;
select tests.assert((select verified_by from public.producers where slug = 'awa-nzi') = '00000000-0000-0000-0000-0000000000ad',
  'badge : AFA peut vérifier un producteur, et l''auteur est enregistré');

set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000b3');
select tests.assert((select count(*) from public.contact_requests) = 5, 'support : voit les questions adressées à AFA');
insert into public.contact_messages (request_id, author_id, body, is_internal)
  select id, auth.uid(), 'Note interne', true from public.contact_requests order by created_at limit 1;
update public.contact_requests set status = 'answered' where id = (select id from public.contact_requests order by created_at limit 1);
reset role;

-- Une question posée par un membre connecté : il voit les réponses, pas les notes internes.
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000b2');
insert into public.contact_requests (id, full_name, email, category, message, consent_version)
  values ('50000000-0000-0000-0000-000000000001', 'Kofi', 'kofi@test.ci', 'financement', 'Comment financer ma plantation ?', '2026-11');
reset role;
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000b3');
insert into public.contact_messages (request_id, author_id, body, is_internal) values
  ('50000000-0000-0000-0000-000000000001', auth.uid(), 'Réponse visible', false),
  ('50000000-0000-0000-0000-000000000001', auth.uid(), 'Note interne', true);
reset role;
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000b2');
select tests.assert((select count(*) from public.contact_requests) = 1, 'membre : retrouve sa propre question');
select tests.assert((select count(*) from public.contact_messages) = 1, 'membre : voit la réponse, pas la note interne');
select tests.assert_fails($$insert into public.contact_messages (request_id, author_id, body, is_internal)
  values ('50000000-0000-0000-0000-000000000001', auth.uid(), 'Je me fais passer pour AFA', true)$$,
  'membre : ne peut pas écrire de note interne');
reset role;

-- ───────── Enregistrement atomique d'un profil (save_producer_profile) ─────────
insert into auth.users (id, email, raw_user_meta_data) values ('00000000-0000-0000-0000-0000000000b4', 'mariam@test.ci', '{"display_name":"Mariam"}');
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000b4');
select tests.assert_fails($$select public.save_producer_profile('{"display_name":"Mariam Koné"}'::jsonb)$$,
  'profil : refusé sans consentement');
select tests.assert(public.save_producer_profile(jsonb_build_object(
  'display_name', 'Mariam Koné', 'consent_version', '2026-11', 'village', 'Village test', 'total_area_ha', '3',
  'region_id', (select id from public.locations where path_slug = 'nawa'),
  'crops', jsonb_build_array(jsonb_build_object('crop_id', (select id from public.crops where slug = 'manioc'), 'area_ha', '2'),
                             jsonb_build_object('crop_id', (select id from public.crops where slug = 'mais'))),
  'needs', jsonb_build_array(jsonb_build_object('need', 'buyer'), jsonb_build_object('need', 'transport')),
  'phone', '0707070707')) ~ '^mariam-kone-[0-9a-f]{5}$', 'profil : créé en une fois, adresse lisible « mariam-kone-… »');
select tests.assert((select count(*) from public.producer_crops where producer_id = auth.uid()) = 2, 'profil : cultures enregistrées');
select tests.assert((select phone_visibility from public.user_private where user_id = auth.uid()) = 'private', 'profil : téléphone privé par défaut');
select public.save_producer_profile(jsonb_build_object('display_name', 'Mariam Koné', 'crops', jsonb_build_array(
  jsonb_build_object('crop_id', (select id from public.crops where slug = 'riz')))));
select tests.assert((select array_agg(c.slug) from public.producer_crops pc join public.crops c on c.id = pc.crop_id where pc.producer_id = auth.uid()) = array['riz'],
  'profil : la modification remplace les cultures');
select tests.assert_fails($$select public.save_producer_profile(jsonb_build_object('display_name', 'Mariam', 'crops',
  jsonb_build_array(jsonb_build_object('crop_id', '00000000-0000-0000-0000-000000000000'))))$$,
  'profil : une culture inconnue annule tout l''enregistrement');
select tests.assert((select count(*) from public.producer_crops where producer_id = auth.uid()) = 1,
  'profil : après une erreur, rien n''est modifié (transaction)');
reset role;

set role anon;
select tests.login(null);
select tests.assert_fails($$select public.save_producer_profile('{"display_name":"Anonyme"}'::jsonb)$$, 'visiteur : ne peut pas créer de profil');
reset role;

\echo '✔ Tests de la phase 6 (producteurs, adhésions, questions) passés.'
