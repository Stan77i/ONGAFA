-- Tests de sécurité de la Phase 1 : identité, rôles, permissions, RLS, audit, territoires.
-- Chaque test affiche "OK : ..." ; le premier échec arrête tout (ON_ERROR_STOP).

create schema tests;
grant usage on schema tests, extensions to anon, authenticated;

create function tests.assert(p_cond boolean, p_msg text) returns void language plpgsql as $$
begin
  if p_cond is not true then raise exception 'ÉCHEC : %', p_msg; end if;
  raise notice 'OK : %', p_msg;
end $$;

create function tests.assert_fails(p_stmt text, p_msg text) returns void language plpgsql as $$
begin
  begin
    execute p_stmt;
  exception when others then
    raise notice 'OK (refusé : %) : %', sqlerrm, p_msg;
    return;
  end;
  raise exception 'ÉCHEC (aurait dû être refusé) : %', p_msg;
end $$;

create function tests.rows(p_stmt text) returns bigint language plpgsql as $$
declare n bigint;
begin
  execute p_stmt;
  get diagnostics n = row_count;
  return n;
end $$;

create function tests.login(p_user uuid) returns void language sql as $$
  select set_config('request.jwt.claim.sub', coalesce(p_user::text, ''), false);
$$;
grant execute on all functions in schema tests to anon, authenticated;

-- ───────── Jeu de données (superutilisateur) ─────────
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'alice@test.ci', '{"display_name":"Alice"}'),
  ('00000000-0000-0000-0000-00000000000b', 'bob@test.ci',   '{"display_name":"Bob"}'),
  ('00000000-0000-0000-0000-00000000000c', 'carol@test.ci', '{"display_name":"Carol"}'),
  ('00000000-0000-0000-0000-0000000000ad', 'admin@test.ci', '{"display_name":"Admin"}'),
  ('00000000-0000-0000-0000-0000000000ee', 'pirate@test.ci','{"display_name":"X","role":"admin","status":"active"}');

-- Bootstrap du premier administrateur (équivalent de supabase/bootstrap_admin.sql).
insert into public.user_roles (user_id, role_code)
select id, 'admin' from auth.users where email = 'admin@test.ci';

select tests.assert((select count(*) from public.profiles) = 5, 'un profil est créé pour chaque compte');
select tests.assert((select display_name from public.profiles where id = '00000000-0000-0000-0000-00000000000a') = 'Alice',
                    'le nom affiché vient des métadonnées');
select tests.assert((select display_name from public.profiles where id = '00000000-0000-0000-0000-0000000000ee') = 'pirate',
                    'un nom trop court est remplacé (partie locale de l''email)');
select tests.assert((select array_agg(role_code) from public.user_roles where user_id = '00000000-0000-0000-0000-0000000000ee') = array['member'],
                    'les métadonnées ne peuvent PAS attribuer un rôle (seul "member" à l''inscription)');
select tests.assert(not exists (
  select 1 from public.role_permissions where role_code = 'admin'
  and permission_code in ('view_producer_private', 'export_producer_data')),
  'l''administrateur n''a pas d''accès par défaut aux données personnelles');

-- ───────── Visiteur anonyme ─────────
set role anon;
select tests.login(null);
select tests.assert_fails('select * from public.profiles',     'visiteur : pas d''accès aux profils (annuaire réservé aux connectés)');
select tests.assert_fails('select * from public.user_private', 'visiteur : pas d''accès aux données privées');
select tests.assert_fails('select * from public.user_roles',   'visiteur : pas d''accès aux rôles');
select tests.assert_fails('select * from public.admin_audit_logs', 'visiteur : pas d''accès au journal d''audit');
select tests.assert(not public.has_permission('create_post'), 'visiteur : aucune permission');
reset role;

-- ───────── Membre (Alice) ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-00000000000a');
select tests.assert(public.has_permission('create_post'), 'membre : peut publier dans la communauté');
select tests.assert(not public.has_permission('manage_roles'), 'membre : ne peut pas attribuer de rôles');
select tests.assert((select count(*) from public.user_roles) = 1, 'membre : ne voit que ses propres rôles');
select tests.assert_fails(
  $$insert into public.user_roles (user_id, role_code, granted_by)
    values ('00000000-0000-0000-0000-00000000000a', 'admin', '00000000-0000-0000-0000-00000000000a')$$,
  'membre : ne peut pas s''auto-attribuer le rôle admin');
select tests.assert(tests.rows($$update public.user_roles set role_code = 'admin'$$) = 0,
  'membre : ne peut pas transformer son rôle en admin');
select tests.assert_fails($$update public.profiles set status = 'active' where id = auth.uid()$$,
  'membre : ne peut pas modifier son propre statut de compte');
select tests.assert(tests.rows($$update public.profiles set bio = 'Productrice de manioc' where id = auth.uid()$$) = 1,
  'membre : peut modifier sa bio');
select tests.assert(tests.rows($$update public.profiles set bio = 'piratage' where id = '00000000-0000-0000-0000-00000000000b'$$) = 0,
  'membre : ne peut pas modifier le profil d''un autre');
insert into public.user_private (user_id, phone) values (auth.uid(), '+225 07 00 00 00 00');
select tests.assert((select phone_visibility from public.user_private) = 'private', 'téléphone : privé par défaut');
select tests.assert_fails($$update public.user_private set phone_verified = true$$,
  'téléphone : ne peut pas être marqué "vérifié" (déclaratif uniquement)');
select tests.assert_fails(
  $$insert into public.user_private (user_id, phone) values ('00000000-0000-0000-0000-00000000000b', '0102030405')$$,
  'membre : ne peut pas écrire les données privées d''un autre');
select tests.assert_fails($$select public.set_account_status('00000000-0000-0000-0000-00000000000b', 'banned')$$,
  'membre : ne peut pas bannir quelqu''un');
insert into public.consents (user_id, consent_type, version) values (auth.uid(), 'privacy', '2026-11');
select tests.assert_fails($$update public.consents set version = '1999'$$,
  'consentement : la version acceptée ne peut pas être réécrite');
select tests.assert(tests.rows($$update public.consents set revoked_at = now()$$) = 1, 'consentement : peut être retiré');
insert into public.data_requests (user_id, type) values (auth.uid(), 'delete');
select tests.assert_fails($$insert into public.data_requests (user_id, type, status) values (auth.uid(), 'export', 'done')$$,
  'demande de données : ne peut pas être créée déjà "traitée"');
select tests.assert((select count(*) from public.admin_audit_logs) = 0, 'membre : ne voit pas le journal d''audit');
reset role;

-- ───────── Autre membre (Bob) ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-00000000000b');
select tests.assert((select count(*) from public.user_private) = 0, 'membre : ne voit pas le téléphone d''Alice');
select tests.assert((select count(*) from public.data_requests) = 0, 'membre : ne voit pas les demandes d''Alice');
select tests.assert((select count(*) from public.profiles) = 5, 'membre connecté : voit les profils publics actifs');
reset role;

-- ───────── Administrateur ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000ad');
select tests.assert(public.has_permission('manage_roles'), 'admin : peut attribuer des rôles');
select tests.assert_fails(
  $$insert into public.user_roles (user_id, role_code) values ('00000000-0000-0000-0000-00000000000b', 'editor')$$,
  'admin : une attribution doit indiquer qui l''a faite (granted_by)');
insert into public.user_roles (user_id, role_code, granted_by)
  values ('00000000-0000-0000-0000-00000000000b', 'editor', auth.uid());
select tests.assert(exists (select 1 from public.admin_audit_logs
  where entity_type = 'user_roles' and action = 'insert'
    and actor_id = '00000000-0000-0000-0000-0000000000ad'
    and new_value ->> 'role_code' = 'editor'),
  'audit : l''attribution du rôle éditeur est tracée avec son auteur');
select tests.assert_fails($$update public.admin_audit_logs set action = 'effacé'$$, 'audit : le journal ne peut pas être modifié');
select tests.assert_fails($$delete from public.admin_audit_logs$$,                 'audit : le journal ne peut pas être effacé');
select tests.assert((select count(*) from public.user_private) = 0,
  'admin : ne voit PAS les téléphones sans le rôle privacy_officer');
insert into public.user_roles (user_id, role_code, granted_by)
  values ('00000000-0000-0000-0000-00000000000c', 'privacy_officer', auth.uid());
select tests.assert_fails(
  $$delete from public.user_roles where user_id = auth.uid() and role_code = 'admin'$$,
  'admin : impossible de retirer le dernier administrateur');
reset role;

-- ───────── Responsable données personnelles (Carol) ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-00000000000c');
select tests.assert((select count(*) from public.user_private) = 1, 'privacy_officer : peut consulter les données privées');
select tests.assert(not public.has_permission('manage_roles'), 'privacy_officer : ne peut pas attribuer de rôles');
reset role;

-- ───────── Éditeur (Bob) ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-00000000000b');
select tests.assert(public.has_permission('manage_events'), 'éditeur : peut gérer l''agenda');
select tests.assert_fails(
  $$insert into public.user_roles (user_id, role_code, granted_by)
    values ('00000000-0000-0000-0000-00000000000a', 'moderator', auth.uid())$$,
  'éditeur : ne peut pas attribuer de rôles');
select tests.assert_fails(
  $$insert into public.locations (level, name, slug) values ('region', 'Nawa', 'nawa')$$,
  'éditeur : ne peut pas gérer les territoires');
reset role;

-- ───────── Suspension ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000ad');
select public.set_account_status('00000000-0000-0000-0000-00000000000b', 'suspended');
reset role;
set role authenticated;
select tests.login('00000000-0000-0000-0000-00000000000b');
select tests.assert(not public.has_permission('manage_events'), 'compte suspendu : perd toutes ses permissions');
reset role;
select tests.assert(exists (select 1 from public.admin_audit_logs where action = 'set_account_status'),
  'audit : la suspension est tracée');

-- ───────── Territoires et carte ─────────
set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000ad');
insert into public.locations (id, level, name, slug) values
  ('10000000-0000-0000-0000-000000000001', 'region', 'Nawa', 'nawa');
insert into public.locations (id, parent_id, level, name, slug) values
  ('10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'department', 'Soubré', 'soubre');
insert into public.locations (id, parent_id, level, name, slug, centroid) values
  ('10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'city', 'Soubré', 'soubre',
   extensions.st_setsrid(extensions.st_makepoint(-6.59, 5.78), 4326));
select tests.assert((select path_slug from public.locations where id = '10000000-0000-0000-0000-000000000003') = 'nawa/soubre/soubre',
  'territoire : chemin d''URL calculé automatiquement');
select tests.assert_fails(
  $$insert into public.locations (parent_id, level, name, slug)
    values ('10000000-0000-0000-0000-000000000003', 'region', 'Invalide', 'invalide')$$,
  'territoire : une région ne peut pas être sous une ville');
update public.locations set slug = 'region-nawa' where id = '10000000-0000-0000-0000-000000000001';
select tests.assert((select path_slug from public.locations where id = '10000000-0000-0000-0000-000000000003') = 'region-nawa/soubre/soubre',
  'territoire : renommer une région met à jour les chemins de ses descendants');
insert into public.afa_locations (location_id, status, since_date)
  values ('10000000-0000-0000-0000-000000000003', 'active', null);
reset role;

set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.locations) = 3, 'visiteur : voit les territoires actifs');
select tests.assert((select count(*) from public.afa_map_points) = 0, 'carte : une implantation non publiée est invisible');
select tests.assert_fails($$insert into public.locations (level, name, slug) values ('region', 'X', 'x')$$,
  'visiteur : ne peut pas créer de territoire');
reset role;

set role authenticated;
select tests.login('00000000-0000-0000-0000-0000000000ad');
update public.afa_locations set is_published = true;
reset role;

set role anon;
select tests.login(null);
select tests.assert((select count(*) from public.afa_map_points where status = 'active' and point is not null) = 1,
  'carte : implantation publiée visible avec un point (repli sur le centre du territoire)');
reset role;

select tests.assert(exists (select 1 from public.admin_audit_logs where entity_type = 'afa_locations' and action = 'update'),
  'audit : la publication d''une implantation est tracée');

\echo '✔ Tous les tests de sécurité de la Phase 1 sont passés.'
