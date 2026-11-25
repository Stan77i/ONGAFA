# Registre des décisions

Décisions prises pour l'ONG AFA, avec leur raison. Une décision se remplace par une nouvelle entrée,
jamais par une réécriture silencieuse.

## Décidées par l'ONG AFA

| #   | Décision                                                                          | Date       |
| --- | --------------------------------------------------------------------------------- | ---------- |
| A1  | Nom officiel : « Action des Femmes d'Afrique pour le Développement » (ONG AFA)    | 2026-11-25 |
| A2  | Connexion par email. Téléphone facultatif, déclaratif, non vérifié                | 2026-11-25 |
| A3  | Annuaire des producteurs réservé aux membres connectés                            | 2026-11-25 |
| A4  | Français uniquement au départ                                                     | 2026-11-25 |
| A5  | Modération et rédaction confiées à Claude, avec validation humaine finale par AFA | 2026-11-25 |
| A6  | Veille automatique, sur sources validées, étiquetée « Source externe »            | 2026-11-25 |
| A7  | Choix techniques délégués à Claude (section suivante)                             | 2026-11-25 |

## Décidées par Claude (délégation A7)

| #   | Décision                                                                                       | Raison                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| T1  | **Next.js 16 (App Router) + TypeScript**                                                       | Pages rendues côté serveur : indispensable au SEO et à la visibilité dans les IA (un site Vite/SPA ne suffit pas) |
| T2  | **Supabase** (Postgres, Auth, Storage, RLS)                                                    | Un seul service pour données, comptes, fichiers et règles d'accès ; Postgres standard (pas d'enfermement fort)    |
| T3  | **Sécurité dans la base (RLS)**, l'interface ne fait que refléter                              | Une erreur d'interface ne peut pas exposer de données                                                             |
| T4  | **Rôles = ensembles de permissions** ; vérification par `has_permission()`                     | Ajouter un rôle ne demande pas de modifier le code                                                                |
| T5  | L'administrateur **n'a pas** accès aux données personnelles ; rôle explicite `privacy_officer` | Principe du moindre privilège ; limite les fuites                                                                 |
| T6  | Premier administrateur créé **hors application** (`supabase/bootstrap_admin.sql`)              | Aucun chemin applicatif vers un droit élevé                                                                       |
| T7  | **Un seul arbre de territoires** (`locations`), chemins d'URL calculés                         | Carte et pages territoriales pilotées par les données, jamais codées en dur                                       |
| T8  | **PostGIS** pour la géographie ; **MapLibre GL** pour la carte (phase 4)                       | Standard ouvert, pas de clé propriétaire obligatoire                                                              |
| T9  | Recherche : plein texte Postgres (français, sans accents) + `pg_trgm` ; pgvector plus tard     | Suffisant au départ, sans service supplémentaire                                                                  |
| T10 | Hébergement : **Vercel** (à confirmer au déploiement)                                          | Rendu serveur, CDN, prévisualisations ; Cloudflare en alternative                                                 |
| T11 | Emails : **SMTP dédié** (Resend ou Brevo) avec domaine d'envoi (SPF, DKIM, DMARC)              | Le SMTP par défaut de Supabase est trop limité pour une connexion par email                                       |
| T12 | Région Supabase : **Paris (eu-west-3)**                                                        | Probablement la plus rapide depuis la Côte d'Ivoire ; à mesurer                                                   |
| T13 | Projet Supabase **dédié à AFA** + projet de test séparé ; ne pas réutiliser `mgci`             | Isolation des données et des tests                                                                                |
| T14 | Fonds de carte : **geoBoundaries ou OCHA/HDX**, pas GADM                                       | GADM interdit l'usage commercial ; licence à vérifier avant import                                                |
| T15 | Vidéos hébergées en externe (YouTube ou équivalent)                                            | Coût et poids ; Supabase Storage réservé aux images et documents                                                  |
| T16 | Anti-robots : **Cloudflare Turnstile** à l'inscription (phase 6)                               | Gratuit, discret                                                                                                  |
| T17 | Statistiques sans cookies (Plausible ou Umami) + compteurs agrégés                             | Pas de bandeau cookies, données personnelles minimales                                                            |
| T18 | API expérimentales de Next (`forbidden()`, `unauthorized()`) **non utilisées**                 | La sécurité ne repose pas sur une API instable                                                                    |
| T19 | Veille : résumé par IA **non activé** tant que le budget d'API n'est pas décidé                | Coût et risque d'erreur ; extraits fournis par la source en attendant                                             |

## En attente (exigent une action ou un accord de l'ONG AFA)

- Création du projet Supabase (coût mensuel à confirmer) et du projet de test.
- Nom de domaine et adresse d'envoi des emails.
- Désignation des deux premiers administrateurs et de la personne de validation finale (modération).
- Liste des sources de veille à valider ; sources de prix fiables à identifier.
- Critères de « producteur référencé » et du badge « vérifié par AFA ».
- Relecture juridique (loi ivoirienne n° 2013-450, ARTCI) des textes de consentement.
- Logo en SVG (vectoriel) si disponible ; polices (phase 2).
