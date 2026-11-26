# Mise en ligne du site

## Pourquoi pas GitHub Pages ?

GitHub Pages ne sert que des pages fixes (HTML). Le site AFA a besoin d'un serveur : comptes et connexion,
formulaires, fiche producteur, forum, lecture de la base Supabase. Activé sur ce dépôt, GitHub Pages
affiche seulement le fichier README, pas le site.

Le site est donc hébergé sur **Vercel** (décision T10), qui exécute Next.js. `vercel.json` place le serveur
à **Dublin** (`dub1`), à côté de la base Supabase (Irlande), pour des pages rapides.

## Première mise en ligne (une seule fois, environ 5 minutes)

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
