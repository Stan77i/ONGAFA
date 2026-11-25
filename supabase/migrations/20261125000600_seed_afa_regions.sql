-- ONG AFA — Migration 0006 : premières implantations sur la carte nationale
-- Régions : N'Zi (zone de naissance, implantée) et Nawa (prochaine étape annoncée).
-- Source : document « Présentation & perspectives » de l'ONG (voir docs/CONTEXTE_AFA.md).
-- Centres calculés à partir de geoBoundaries (CC BY 4.0) par scripts/build-map.mjs.
-- Idempotente : peut être rejouée sans doublon.

insert into public.locations (level, name, slug, centroid)
values
  ('region', 'N''Zi', 'nzi', extensions.st_setsrid(extensions.st_makepoint(-4.56082, 6.97377), 4326)),
  ('region', 'Nawa', 'nawa', extensions.st_setsrid(extensions.st_makepoint(-6.66921, 5.85311), 4326))
on conflict (path_slug) do nothing;

insert into public.afa_locations (location_id, status, description, activities, is_published)
select l.id, v.status::public.afa_status, v.description, v.activities, true
from (values
  ('nzi', 'active',
   'Zone de naissance d''AFA, créée en 2016. Plantations de manioc, unités de transformation et coopératives accompagnées dans une dizaine de sous-préfectures.',
   array['Plantations de manioc', 'Unités de transformation du manioc', 'Structuration et accompagnement des coopératives']),
  ('nawa', 'upcoming',
   'Première étape du déploiement national annoncé par AFA.',
   array[]::text[])
) as v(slug, status, description, activities)
join public.locations l on l.path_slug = v.slug
on conflict (location_id) do nothing;
