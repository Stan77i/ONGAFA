import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Skills Claude (outils tiers, hors code de l'application).
    ".claude/**",
    // Fonctions Supabase (Deno) : vérifiées à leur déploiement.
    "supabase/functions/**/index.ts",
  ]),
]);

export default eslintConfig;
