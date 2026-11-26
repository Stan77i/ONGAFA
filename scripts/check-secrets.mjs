// Bloque la publication de secrets dans le dépôt (clés Supabase secrètes, JWT service_role, clés privées).
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = execSync("git ls-files --cached --others --exclude-standard", { encoding: "utf8" })
  .split("\n")
  .filter((f) => f && !f.startsWith(".claude/") && !/\.(webp|png|jpe?g|ico|gif|avif|woff2?)$/.test(f))
  .filter((f) => f !== "scripts/check-secrets.mjs");

const patterns = [
  [/sb_secret_[A-Za-z0-9_-]{10,}/, "clé secrète Supabase"],
  [/service_role/i, "mention de service_role (vérifier qu'aucune clé n'est présente)"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "clé privée"],
  [/eyJhbGciOi[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/, "jeton JWT"],
];
// service_role est légitime dans les fichiers SQL (nom de rôle Postgres), la documentation et les fonctions
// Supabase côté serveur (qui lisent la clé depuis leur environnement, jamais en dur). Les VALEURS de clés
// (JWT, sb_secret_…) restent détectées partout.
const allowServiceRoleIn = (f) =>
  f.endsWith(".sql") || f.endsWith(".md") || f.startsWith("supabase/functions/");

const problems = [];
for (const f of files) {
  let text;
  try {
    text = readFileSync(f, "utf8");
  } catch {
    continue;
  }
  for (const [re, label] of patterns) {
    if (label.startsWith("mention de service_role") && allowServiceRoleIn(f)) continue;
    if (re.test(text)) problems.push(`${f} : ${label}`);
  }
}
if (problems.length) {
  console.error("Secrets potentiels détectés :\n" + problems.map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(`Aucun secret détecté (${files.length} fichiers analysés).`);
