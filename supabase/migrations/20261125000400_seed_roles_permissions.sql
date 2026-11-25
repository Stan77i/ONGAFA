-- ONG AFA — Migration 0004 : catalogue des rôles et des permissions
-- Le visiteur n'est PAS un rôle : c'est l'absence de compte.
-- Le premier administrateur n'est jamais créé ici : voir supabase/bootstrap_admin.sql.

insert into public.roles (code, label, description) values
  ('member',           'Membre',               'Compte de base : participe à la communauté.'),
  ('producer',         'Producteur / Productrice', 'Gère son profil producteur et ses productions.'),
  ('partner',          'Partenaire',           'Profil organisationnel avec participation limitée.'),
  ('moderator',        'Modérateur',           'Modère publications, commentaires et témoignages.'),
  ('editor',           'Éditeur',              'Gère articles, veille, ressources, agenda et opportunités.'),
  ('data_manager',     'Responsable données',  'Gère et vérifie les prix et les sources de veille.'),
  ('territorial_agent','Agent territorial',    'Agent de terrain limité à un territoire (périmètre appliqué dans une étape ultérieure).'),
  ('privacy_officer',  'Responsable données personnelles', 'Seul rôle autorisé à consulter les données privées et à les exporter. À attribuer explicitement.'),
  ('admin',            'Administrateur',       'Accès complet au back-office, hors données personnelles sensibles.')
on conflict (code) do nothing;

insert into public.permissions (code, label, domain) values
  ('create_post',            'Publier dans la communauté',            'community'),
  ('comment',                'Commenter',                              'community'),
  ('moderate_post',          'Modérer les publications',               'community'),
  ('hide_content',           'Masquer ou supprimer un contenu',        'community'),
  ('manage_reports',         'Traiter les signalements',               'community'),
  ('sanction_user',          'Sanctionner un utilisateur',             'community'),
  ('create_article',         'Créer un article',                       'content'),
  ('edit_article',           'Modifier un article',                    'content'),
  ('publish_article',        'Publier un article',                     'content'),
  ('manage_news',            'Gérer la veille',                        'content'),
  ('manage_news_sources',    'Gérer les sources de veille',            'content'),
  ('manage_resources',       'Gérer les ressources',                   'content'),
  ('manage_pages',           'Gérer les pages',                        'content'),
  ('manage_testimonials',    'Valider les témoignages',                'content'),
  ('manage_events',          'Gérer l''agenda',                        'agenda'),
  ('manage_opportunities',   'Gérer les opportunités',                 'agenda'),
  ('manage_projects',        'Gérer les projets',                      'territory'),
  ('manage_locations',       'Gérer les territoires',                  'territory'),
  ('manage_afa_locations',   'Gérer les implantations AFA',            'territory'),
  ('manage_prices',          'Saisir les prix',                        'agriculture'),
  ('verify_prices',          'Vérifier les prix',                      'agriculture'),
  ('manage_producers',       'Gérer les producteurs',                  'users'),
  ('manage_users',           'Gérer les utilisateurs',                 'users'),
  ('manage_roles',           'Attribuer les rôles',                    'users'),
  ('view_producer_private',  'Consulter les données privées',          'privacy'),
  ('export_producer_data',   'Exporter les données personnelles',      'privacy'),
  ('answer_contact_requests','Répondre aux demandes adressées à AFA',  'support'),
  ('view_statistics',        'Consulter les statistiques',             'insights'),
  ('view_audit_logs',        'Consulter le journal d''audit',          'insights')
on conflict (code) do nothing;

insert into public.role_permissions (role_code, permission_code) values
  ('member',   'create_post'), ('member',   'comment'),
  ('producer', 'create_post'), ('producer', 'comment'),
  ('partner',  'comment'),

  ('moderator','create_post'), ('moderator','comment'), ('moderator','moderate_post'),
  ('moderator','hide_content'), ('moderator','manage_reports'), ('moderator','sanction_user'),
  ('moderator','manage_testimonials'),

  ('editor','create_article'), ('editor','edit_article'), ('editor','publish_article'),
  ('editor','manage_news'), ('editor','manage_resources'), ('editor','manage_pages'),
  ('editor','manage_events'), ('editor','manage_opportunities'), ('editor','comment'),

  ('data_manager','manage_prices'), ('data_manager','verify_prices'), ('data_manager','manage_news_sources'),

  ('territorial_agent','manage_producers'), ('territorial_agent','manage_events'),
  ('territorial_agent','answer_contact_requests'),

  ('privacy_officer','view_producer_private'), ('privacy_officer','export_producer_data'),
  ('privacy_officer','view_audit_logs')
on conflict do nothing;

-- Administrateur : toutes les permissions SAUF les deux permissions de données personnelles,
-- qui exigent le rôle explicite « privacy_officer ».
insert into public.role_permissions (role_code, permission_code)
select 'admin', code from public.permissions
where code not in ('view_producer_private', 'export_producer_data')
on conflict do nothing;
