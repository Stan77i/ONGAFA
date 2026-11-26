# Mise en ligne du site

## Aujourd'hui : site statique sur GitHub Pages (décision A13)

Adresse : **https://stan77i.github.io/ONGAFA/**

Le site publié est une version **simple et statique** : pages fixes, sans comptes ni formulaires.
Les données publiques (veille, carte, prix, ressources) sont lues dans Supabase au moment de la
construction. Le fichier `.github/workflows/pages.yml` reconstruit et publie le site :

- à chaque modification de la branche `main` ;
- toutes les 6 heures (nouvelles informations de la veille) ;
- à la demande : GitHub → **Actions** → « Site GitHub Pages » → **Run workflow**.

**Réglage à faire une seule fois** : GitHub → dépôt `ONGAFA` → **Settings → Pages → Build and deployment →
Source = « GitHub Actions »** (et non « Deploy from a branch », qui n'affiche que le README).

Construire la version statique en local (résultat dans `out/`) :

```bash
GITHUB_PAGES=true NEXT_PUBLIC_SITE_URL=https://stan77i.github.io/ONGAFA pnpm build
```

Règles propres à ce mode : liens internes via `next/link` (le préfixe `/ONGAFA` est ajouté
automatiquement) ; chemins d'images via `site.logos` ou `process.env.NEXT_PUBLIC_BASE_PATH` ; pas de
cookies, de session, d'actions serveur ni de `"use cache"`.

## Fonctions mises de côté (à réactiver au signal de l'ONG)

Rangées sans être supprimées : `src/app/(site)/_reporte/` (connexion, compte, producteurs, question à AFA,
communauté, témoignages, charte, confidentialité, confirmation d'email) et `src/_reporte/proxy.ts`.
Pour les réactiver, il faudra un hébergeur avec serveur (Vercel, ci-dessous) :

1. remettre les dossiers de `_reporte/` à leur place et `proxy.ts` dans `src/` ;
2. retirer `_reporte` des exclusions de `tsconfig.json` et `eslint.config.mjs` ;
3. remettre `cacheComponents: true` dans `next.config.ts` (et `"use cache"` dans `src/lib/content/data.ts`
   et `src/lib/map/data.ts`) ;
4. repasser les rubriques à `available: true` dans `src/config/navigation.ts` et rétablir le lien
   « Mon compte » dans `src/app/(site)/layout.tsx` ;
5. `pnpm check`, puis suivre la mise en ligne Vercel.

## Plus tard : site complet sur Vercel

Les comptes, formulaires et la communauté ont besoin d'un serveur, que GitHub Pages n'offre pas. Le site
complet sera hébergé sur **Vercel** (décision T10) ; `vercel.json` place le serveur à **Dublin** (`dub1`),
à côté de la base Supabase (Irlande).

### Première mise en ligne (une seule fois, environ 5 minutes)

1. Aller sur **vercel.com** → **Sign Up** → **Continue with GitHub** (compte `Stan77i`).
2. **Add New… → Project** → importer le dépôt **`Stan77i/ONGAFA`** (autoriser Vercel à le lire si demandé).
3. Vercel détecte Next.js et pnpm : ne rien changer au « Build Command » ni au « Output Directory ».
4. Ouvrir **Environment Variables** et ajouter :

   | Nom                                    | Valeur                                                                                        |
   | -------------------------------------- | --------------------------------------------------------------------------------------------- |
   | `NEXT_PUBLIC_SUPABASE_URL`             | `https://jpoeuqywbuwtuvefxpcb.supabase.co`                                                    |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | la clé « publishable » du projet (`sb_publishable_…`, Supabase → Project Settings → API Keys) |

   Ces deux valeurs sont publiques par conception (la sécurité est assurée par la base). Ne **jamais** ajouter
   la clé secrète (`sb_secret_…`).

5. **Deploy**. Après 1 à 2 minutes, Vercel donne l'adresse du site, du type `https://ongafa.vercel.app`.
6. Revenir dans **Settings → Environment Variables**, ajouter `NEXT_PUBLIC_SITE_URL` = cette adresse,
   puis **Deployments → … → Redeploy**.

## Après la première mise en ligne

- **Supabase → Authentication → URL Configuration** : Site URL = l'adresse Vercel ; ajouter
  `https://<adresse>/auth/confirm` aux Redirect URLs (voir `docs/COMPTES.md`).
- **GitHub → dépôt ONGAFA → About (roue dentée) → Website** : mettre l'adresse Vercel. C'est ce lien qui
  s'affiche sur la page du dépôt.
- **GitHub → Settings → Pages** : désactiver GitHub Pages (Source : _None_), devenu inutile.

Ensuite, **chaque envoi sur `main` met le site à jour automatiquement** (Vercel reconstruit et publie).

## Nom de domaine (plus tard)

Vercel → Project → Settings → Domains : ajouter le domaine de l'ONG, puis mettre à jour `NEXT_PUBLIC_SITE_URL`
et les adresses dans Supabase.

## Toujours vrai tant que le site n'est pas ouvert

Les pages portent l'instruction « ne pas indexer » (`robots: noindex` dans `src/app/layout.tsx`) : le site
est consultable par lien mais n'apparaît pas dans Google. À retirer à l'ouverture (phase SEO).
