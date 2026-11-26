# Veille du vivrier — fonctionnement et exploitation

## Principe

Toutes les 2 heures (à la 17e minute), `pg_cron` appelle la fonction Supabase **`veille-ingest`**
(`supabase/functions/veille-ingest/`). Elle :

1. lit les flux RSS des **sources actives** (table `news_sources`) ;
2. garde uniquement **titre, extrait court (≤ 280 caractères), date, lien** — jamais l'article complet ;
3. ignore les doublons (adresse unique) et les articles de plus de 120 jours ;
4. pour une source généraliste (`requires_keyword`), ne garde que les sujets agricoles ;
5. rattache chaque information aux cultures citées (mots-clés de la table `crops`) ;
6. publie directement les sources de confiance (`trust = auto`) et met les autres **en attente**
   (`status = pending`) ;
7. note chaque passage dans `ingestion_runs` (lus, insérés, erreur).

La fonction ne prend aucun paramètre, s'exécute au plus une fois toutes les 15 minutes et ne lit que les
sources configurées en base. Secrets utilisés par la planification : `afa_project_url` et
`afa_function_key` dans Supabase Vault (jamais dans le code).

## Sources (2026-11-26)

| Source            | Flux                                 | Publication    | Catégorie               |
| ----------------- | ------------------------------------ | -------------- | ----------------------- |
| AIP — Agriculture | aip.ci, rubrique agriculture         | automatique    | Actualités agricoles    |
| CNRA              | cnra.ci                              | automatique    | Recherche et innovation |
| ANADER            | anader.ci                            | automatique    | Encadrement et terrain  |
| Linfodrome        | linfodrome.com (flux général filtré) | **validation** | Actualités agricoles    |

Écartées : Agence Ecofin (bloque les lecteurs automatiques), Fraternité Matin, ministère de l'Agriculture,
FAO (pas de flux disponible au 2026-11-26).

## Mots-clés

- `mot` = mot entier ; `mot*` = mot qui commence ainsi.
- Un mot-clé accentué n'est comparé qu'au texte accentué : « maïs » ne trouve pas la conjonction « mais ».
- Règles testées dans `supabase/functions/veille-ingest/rss.test.ts`.

## Opérations courantes (en attendant le back-office, phase 9)

Valider les informations en attente :

```sql
update public.news_items set status = 'published', reviewed_at = now() where status = 'pending' and id in (...);
```

Rejeter : `status = 'rejected'`. Désactiver une source : `update public.news_sources set active = false where name = '…';`

Après une modification manuelle, la page `/veille` se met à jour dans l'heure (cache).

Contrôler la collecte :

```sql
select s.name, r.started_at, r.fetched, r.inserted, r.error
from public.ingestion_runs r join public.news_sources s on s.id = r.source_id
order by r.started_at desc limit 20;
```

## Redéployer la fonction

Après modification de `supabase/functions/veille-ingest/*.ts` : redéployer la fonction (`verify_jwt` activé),
puis vérifier un passage dans `ingestion_runs`.
