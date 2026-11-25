-- ONG AFA — Création du PREMIER administrateur (à exécuter UNE fois, par le propriétaire du projet,
-- dans l'éditeur SQL de Supabase). Ce n'est volontairement PAS une migration :
-- aucun droit élevé ne doit pouvoir être obtenu par l'application.
--
-- 1. Le futur administrateur crée d'abord son compte normalement (inscription par email).
-- 2. Remplacer l'adresse ci-dessous, puis exécuter.
-- 3. Recommandé : répéter pour un SECOND administrateur (éviter de dépendre d'une seule personne).
insert into public.user_roles (user_id, role_code)
select id, 'admin' from auth.users where email = 'REMPLACER@exemple.org'
on conflict do nothing;
