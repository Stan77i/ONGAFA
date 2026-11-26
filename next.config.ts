import type { NextConfig } from "next";

/**
 * Deux modes de construction :
 *  - par défaut : site Next.js complet (serveur), pour un hébergeur comme Vercel ;
 *  - GITHUB_PAGES=true : site 100 % statique publié sur https://stan77i.github.io/ONGAFA/
 *    (sans comptes ni formulaires : ces fonctions sont rangées dans `src/app/(site)/_reporte/`).
 */
const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? "/ONGAFA" : "";

const nextConfig: NextConfig = {
  // Pas de `cacheComponents` : incompatible avec l'export statique. Les données (veille, carte, prix)
  // sont lues au moment de la construction ; le site est reconstruit automatiquement (voir pages.yml).
  ...(githubPages && {
    output: "export",
    basePath,
    trailingSlash: true, // /veille/ → veille/index.html, servi tel quel par GitHub Pages
    images: { unoptimized: true }, // pas de serveur d'optimisation d'images sur GitHub Pages
  }),
  // Préfixe des images (next/image ne l'ajoute pas automatiquement) : voir src/config/site.ts.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
