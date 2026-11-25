# ONG AFA — consignes permanentes

@AGENTS.md

**Action des Femmes d'Afrique pour le Développement (ONG AFA)**, Côte d'Ivoire.
Slogan : « Valoriser la terre pour nourrir la Nation ».

Plateforme nationale évolutive (pas un site vitrine) autour du **manioc** (axe prioritaire), du vivrier
ivoirien, des producteurs et des femmes rurales. Question de conception permanente :
**« Pourquoi un producteur ivoirien reviendrait-il sur le site AFA demain ? »**
Utile avant esthétique, vivant avant institutionnel, évolutif avant terminé.

## Identité

- Nom officiel : « Action des Femmes d'Afrique pour le Développement », abrégé « ONG AFA ».
  Jamais « Association des Femmes en Action ». Source unique : `src/config/site.ts`.
- Couleurs : orange `#df8433`, vert `#4a7230`, vert clair `#59883c`.
  L'orange n'est pas assez contrasté pour du texte courant sur blanc : accents, boutons, grands titres.
- Logos : `public/brand/` (sceau circulaire et symbole seul).

## Règles absolues

- **Rien d'inventé** : ni prix, ni chiffre, ni témoignage, ni partenaire, ni réalisation, ni source.
  Une donnée agricole n'est jamais présentée comme actuelle sans date et vérification.
- **Données personnelles** : le téléphone d'un producteur n'est jamais public par défaut (seuls lui et
  l'administrateur AFA le voient, pour le contacter) ; position
  limitée à village ou ville ; consentement versionné ; séparation stricte public / privé.
- **Sécurité en base** : RLS activée sur toute table, accès accordé explicitement. Aucun rôle élevé
  attribuable par l'application ou par l'inscription. Toute nouvelle table a ses tests dans
  `supabase/tests/`. Aucune clé secrète dans le front (seule la clé « publishable »).
- **Contenu externe** (veille) : titre, extrait court, source, date, lien. Jamais de copie d'articles.
- **Données structurées** (Schema.org) : uniquement à partir de champs réels.
- **Par étapes** : ne jamais construire plusieurs phases d'un coup (voir `docs/ARCHITECTURE.md`).
- Français uniquement pour l'instant. Mobile d'abord (vérifier à 390 px) ; accessibilité AA.

## Vérifications avant chaque commit

```bash
pnpm check
```

```bash
PGHOST=/var/run/postgresql pnpm test:db
```

`test:db` exige un PostgreSQL local avec PostGIS et un superutilisateur (variables libpq standard).

## Repères

- Décisions et leurs raisons : `docs/DECISIONS.md`.
- Design system (couleurs, contrastes, composants, règles) : `docs/DESIGN.md`. Réutiliser les
  composants de `src/components/` plutôt qu'en recréer ; démonstration sur `/design-system` en développement.
- Architecture, modèle de données, rôles, feuille de route : `docs/ARCHITECTURE.md`.
- Next.js 16 : `middleware` s'appelle désormais `proxy` (`src/proxy.ts`). Lire
  `node_modules/next/dist/docs/` avant d'utiliser une API Next.
