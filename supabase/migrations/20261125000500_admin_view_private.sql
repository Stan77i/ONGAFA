-- ONG AFA — Migration 0005 : l'administrateur voit les données privées
-- Décision de l'ONG AFA (2026-11-25, décision A8) : l'administrateur doit pouvoir contacter
-- les producteurs ; il obtient donc la lecture des données privées (téléphone, etc.).
-- L'EXPORT en masse reste réservé au rôle explicite « privacy_officer ».
-- Ces données ne sont toujours JAMAIS visibles des visiteurs ni des autres membres.

insert into public.role_permissions (role_code, permission_code)
values ('admin', 'view_producer_private')
on conflict do nothing;

update public.roles
set description = 'Accès complet au back-office, y compris la lecture des coordonnées privées pour contacter les membres. Export en masse exclu.'
where code = 'admin';
