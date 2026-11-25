# Architecture technique — ONG AFA

## Vue d'ensemble

```
Navigateur (mobile d'abord)
   │
   ▼
Next.js 16 (App Router, rendu serveur)        src/
   ├── src/proxy.ts           rafraîchit la session (aucune décision d'accès)
   ├── src/lib/supabase/*     clients navigateur / serveur
   ├── src/lib/auth/*         permissions typées, garde requirePermission()
   └── src/config/site.ts     identité officielle (source unique)
   │
   ▼
Supabase                                      supabase/
   ├── Postgres + PostGIS     migrations/ (source de vérité du modèle)
   ├── RLS                    toutes les tables, accès explicite
   ├── Auth                   email (+ mot de passe / lien magique)
   └── Storage                images et documents (phase 6+)
```

La sécurité des données est **dans la base** (RLS + `has_permission()`). L'application ne fait que
refléter ces droits (masquer un bouton, rediriger). Le client Supabase agit toujours avec les droits de
l'utilisateur connecté ; la clé secrète n'est jamais utilisée côté navigateur.

## Modèle de données — état actuel (Phase 1)

| Table                                      | Rôle                                                                                | Accès                                                              |
| ------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `profiles`                                 | Nom affiché, avatar, bio, territoire, statut du compte                              | Membres connectés (lecture) ; soi-même (modification, hors statut) |
| `user_private`                             | Téléphone (déclaratif), visibilité                                                  | Propriétaire ; `view_producer_private`                             |
| `roles`, `permissions`, `role_permissions` | Catalogue des droits                                                                | Lecture par les membres ; modification par migration uniquement    |
| `user_roles`                               | Rôles attribués (+ périmètre territorial optionnel)                                 | Ses propres rôles ; `manage_roles`                                 |
| `consents`                                 | Consentements versionnés                                                            | Propriétaire (ajout, retrait)                                      |
| `data_requests`                            | Demandes export / rectification / suppression                                       | Propriétaire ; `manage_users`                                      |
| `admin_audit_logs`                         | Journal (qui, quoi, quand, avant, après)                                            | `view_audit_logs` ; écriture par triggers uniquement               |
| `locations`                                | Arbre district → région → département → sous-préfecture → ville → village (+ zones) | Public (actifs) ; `manage_locations`                               |
| `afa_locations`                            | Implantations AFA (implantée / en cours / bientôt)                                  | Public (publiées) ; `manage_afa_locations`                         |
| `afa_map_points` (vue)                     | Données de la carte nationale                                                       | Public                                                             |

Automatismes :

- création du profil et du rôle `member` à l'inscription (jamais d'autre rôle) ;
- audit automatique des rôles, permissions, territoires et implantations ;
- impossible de retirer le dernier administrateur ;
- compte suspendu ou banni : perte immédiate de toutes les permissions ;
- chemin d'URL des territoires calculé, et recalculé pour les descendants en cas de renommage.

### Limite connue

`has_permission()` ne compte que les rôles **sans périmètre territorial**. Le rôle `territorial_agent`
(limité à une zone) existe mais n'a pas encore d'effet : la vérification par zone sera ajoutée avec
l'espace producteurs (phase 6).

## Modèle de données — à venir (une migration par phase)

| Phase                | Tables                                                                                                                                                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 3 Institutionnel     | `pages`, `team_members`, `organizations`, `organization_members`, `projects`, `impact_metrics`, `media`                                                                                                                                                              |
| 4 Carte              | géométries des territoires (import geoBoundaries / HDX), `project_locations`                                                                                                                                                                                         |
| 5 Veille et contenus | `articles`, `news_items`, `news_sources`, `categories`, `tags`, `entity_tags`, `entity_crops`, `entity_locations`, `resources`, `faqs`, `content_revisions`, `crops`, `crop_varieties`, `products`, `units`, `markets`, `data_sources`, `market_prices`, `redirects` |
| 6 Producteurs        | `producers`, `producer_private`, `producer_crops`, `productions`, `producer_needs`, `join_requests`, `contact_requests`, `contact_messages`                                                                                                                          |
| 7 Communauté         | `post_categories`, `posts`, `comments`, `reactions`, `reports`, `moderation_actions`, `user_sanctions`, `testimonials`                                                                                                                                               |
| 8 Agenda             | `events`, `event_registrations`, `opportunities`, `opportunity_applications`                                                                                                                                                                                         |
| 9 Back-office        | `notifications`, `notification_preferences`, `alert_subscriptions`, `analytics_daily`, `ingestion_runs`, `app_settings`                                                                                                                                              |

Tronc commun des contenus : `slug` unique, `status` (`draft` → `review` → `published` → `archived`),
`published_at`, `updated_at`, auteur, source, champs SEO, `search_vector`.

## Rôles et permissions

| Rôle                | Permissions principales                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| (visiteur)          | Aucune : lecture du contenu public                                                                |
| `member`            | `create_post`, `comment`                                                                          |
| `producer`          | `create_post`, `comment` (+ son profil producteur, par propriété)                                 |
| `partner`           | `comment`                                                                                         |
| `moderator`         | modération, signalements, sanctions, témoignages                                                  |
| `editor`            | articles, veille, ressources, pages, agenda, opportunités                                         |
| `data_manager`      | prix (saisie, vérification), sources de veille                                                    |
| `territorial_agent` | producteurs, agenda, demandes, sur sa zone (effectif en phase 6)                                  |
| `privacy_officer`   | `view_producer_private`, `export_producer_data`, `view_audit_logs`                                |
| `admin`             | tout, y compris la **lecture** des coordonnées privées (décision A8) ; **sauf** l'export en masse |

Catalogue complet : `supabase/migrations/20261125000400_seed_roles_permissions.sql`
(miroir TypeScript `src/lib/auth/permissions.ts`, vérifié par test).

## Feuille de route

1. **Architecture, base, authentification, rôles** ← terminé
2. Design system
3. Site institutionnel
4. Carte nationale
5. Veille et contenus
6. Espace producteurs
7. Communauté
8. Événements et opportunités
9. Back-office
10. SEO avancé et données structurées
11. Sécurité et performance
12. Tests et déploiement
