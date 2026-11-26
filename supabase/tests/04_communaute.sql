-- Tests de sécurité de la phase 7 : forum, réponses, signalements, modération, témoignages.

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-0000000000c1', 'nouveau@test.ci', '{"display_name":"Nouvelle Membre"}'),
  ('00000000-0000-0000-0000-0000000000c2', 'confirme@test.ci', '{"display_name":"Membre Confirmé"}'),
  ('00000000-0000-0000-0000-0000000000c3', 'r1@test.ci', '{"display_name":"Lecteur Un"}'),
  ('00000000-0000-0000-0000-0000000000c4', 'r2@test.ci', '{"display_name":"Lecteur Deux"}'),
  ('00000000-0000-0000-0000-0000000000c5', 'modo@test.ci', '{"display_name":"Modération AFA"}');
insert into public.user_roles (user_id, role_code) values ('00000000-0000-0000-0000-0000000000c5', 'moderator');

-- Contourne la limite « 20 secondes entre deux envois » pour les tests : on vieillit les envois précédents.
create function tests.age(p_user uuid) returns void language sql security definer as $$
  update public.posts set created_at = created_at - interval '1 minute' where author_id = p_user;
  update public.comments set created_at = created_at - interval '1 minute' where author_id = p_user;
$$;
grant execute on function tests.age(uuid) to authenticated;

select tests.assert((select count(*) from public.post_categories) = 5, 'forum : 5 thèmes');

-- ───────── Nouveau membre : publication en attente ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c1');
insert into public.posts (id, category_id, title, body, author_name, status, is_pinned)
  select '60000000-0000-0000-0000-000000000001', id, 'Quelle variété de manioc pour Bouaké ?', 'Je cherche une variété adaptée au climat.',
         'Faux nom', 'published', true from public.post_categories where slug = 'questions-techniques';
select tests.assert((select status from public.posts where id = '60000000-0000-0000-0000-000000000001') = 'pending',
  'nouveau membre : son premier sujet est en attente de validation');
select tests.assert((select author_name from public.posts where id = '60000000-0000-0000-0000-000000000001') = 'Nouvelle Membre',
  'nom affiché : celui du profil, impossible de se faire passer pour quelqu''un d''autre');
select tests.assert((select is_pinned from public.posts where id = '60000000-0000-0000-0000-000000000001') = false,
  'nouveau membre : ne peut pas épingler son sujet');
select tests.assert_fails($$insert into public.posts (category_id, title, body, author_name)
  select id, 'Deuxième sujet trop rapide', 'Envoyé dans la foulée du premier.', 'x' from public.post_categories limit 1$$,
  'anti-flood : deux envois à moins de 20 secondes refusés');
select tests.assert_fails($$update public.posts set status = 'published' where id = '60000000-0000-0000-0000-000000000001'$$,
  'auteur : ne peut pas valider son propre sujet');
reset role;

set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.posts) = 0, 'visiteur : ne voit pas un sujet en attente');
select tests.assert_fails($$insert into public.posts (category_id, title, body, author_name)
  select id, 'Sujet anonyme interdit', 'Pas de publication sans compte.', 'x' from public.post_categories limit 1$$,
  'visiteur : ne peut pas publier');
reset role;

-- ───────── Modération ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c3');
select tests.assert_fails($$select public.moderate_content('post', '60000000-0000-0000-0000-000000000001', 'published')$$,
  'membre : ne peut pas modérer');
reset role;
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c5');
select public.moderate_content('post', '60000000-0000-0000-0000-000000000001', 'published', 'Question utile');
insert into public.posts (id, category_id, title, body, author_name)
  select '60000000-0000-0000-0000-000000000002', id, 'Règles de la communauté AFA', 'Respect, entraide et informations vérifiées.', 'x'
  from public.post_categories where slug = 'vie-du-reseau';
reset role;
select tests.assert((select status from public.posts where id = '60000000-0000-0000-0000-000000000002') = 'published',
  'modérateur : publié directement');
select tests.assert(exists (select 1 from public.moderation_actions where target_id = '60000000-0000-0000-0000-000000000001'
  and previous_status = 'pending' and new_status = 'published' and actor_id = '00000000-0000-0000-0000-0000000000c5'),
  'modération : la décision est enregistrée (qui, avant, après)');

set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.posts) = 2, 'visiteur : lit les sujets publiés (forum ouvert)');
reset role;

-- ───────── Réponses et compteur ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c1');
select tests.age(auth.uid());
insert into public.comments (id, post_id, body, author_name)
  values ('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'Merci, je précise : sol sableux.', 'x');
reset role;
-- 1 seul contenu validé : la réponse doit être en attente.
select tests.assert((select status from public.comments where id = '70000000-0000-0000-0000-000000000001') = 'pending',
  'nouveau membre : sa réponse est en attente tant qu''il a moins de 2 contenus validés');
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c5');
select public.moderate_content('comment', '70000000-0000-0000-0000-000000000001', 'published');
reset role;
select tests.assert((select reply_count from public.posts where id = '60000000-0000-0000-0000-000000000001') = 1,
  'compteur : la réponse validée est comptée (fonction interne non bloquée)');

set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c1');
select tests.age(auth.uid());
insert into public.comments (id, post_id, body, author_name)
  values ('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', 'Autre précision, sans lien.', 'x');
select tests.age(auth.uid());
insert into public.comments (id, post_id, body, author_name)
  values ('70000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', 'Voir https://site-douteux.example pour plus.', 'x');
reset role;
select tests.assert((select status from public.comments where id = '70000000-0000-0000-0000-000000000002') = 'published',
  'membre confirmé (2 contenus validés) : réponse publiée directement');
select tests.assert((select status from public.comments where id = '70000000-0000-0000-0000-000000000003') = 'pending',
  'lien : mis en attente même pour un membre confirmé récent');

-- ───────── Signalements et masquage automatique ─────────
do $$
declare r uuid;
begin
  foreach r in array array['00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-0000000000c4']::uuid[] loop
    perform set_config('request.jwt.claim.sub', r::text, false);
    set local role authenticated;
    insert into public.reports (target_type, target_id, reporter_id, reason)
      values ('comment', '70000000-0000-0000-0000-000000000002', r, 'spam');
    reset role;
  end loop;
end $$;
select tests.assert((select status from public.comments where id = '70000000-0000-0000-0000-000000000002') = 'hidden',
  'signalements : 3 signalements masquent automatiquement le contenu');
select tests.assert((select reply_count from public.posts where id = '60000000-0000-0000-0000-000000000001') = 1,
  'compteur : le contenu masqué n''est plus compté');

set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c3');
select tests.assert_fails($$insert into public.reports (target_type, target_id, reporter_id, reason)
  values ('comment', '70000000-0000-0000-0000-000000000002', auth.uid(), 'spam')$$, 'signalement : une seule fois par personne');
select tests.assert((select count(*) from public.reports) = 1, 'membre : ne voit que ses propres signalements');
select tests.assert((select count(*) from public.moderation_actions) = 0, 'membre : ne voit pas l''historique de modération');
reset role;

-- ───────── Compte suspendu ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000ad');
select public.set_account_status('00000000-0000-0000-0000-0000000000c4', 'suspended');
reset role;
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c4');
select tests.assert_fails($$insert into public.posts (category_id, title, body, author_name)
  select id, 'Sujet d''un compte suspendu', 'Ne doit pas passer.', 'x' from public.post_categories limit 1$$,
  'compte suspendu : ne peut plus publier');
reset role;

-- ───────── Témoignages ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c2');
insert into public.testimonials (id, name, place, activity, quote, consent_version, status, published_at)
  values ('80000000-0000-0000-0000-000000000001', 'Membre Confirmé', 'Dimbokro', 'Productrice', 'Grâce au réseau, j''ai trouvé un acheteur pour mon manioc.', '2026-11-26', 'published', now());
reset role;
select tests.assert((select status from public.testimonials where id = '80000000-0000-0000-0000-000000000001') = 'pending',
  'témoignage : toujours en attente de validation à l''envoi');
set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.testimonials) = 0, 'visiteur : ne voit pas un témoignage non validé');
reset role;
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000c5');
select public.moderate_content('testimonial', '80000000-0000-0000-0000-000000000001', 'published');
reset role;
set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.testimonials) = 1, 'visiteur : voit le témoignage une fois validé');
reset role;

\echo '✔ Tests de la phase 7 (communauté) passés.'
