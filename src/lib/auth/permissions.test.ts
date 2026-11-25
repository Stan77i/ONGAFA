import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PERMISSIONS, ROLES } from "./permissions";

const seed = readFileSync(
  join(process.cwd(), "supabase/migrations/20261125000400_seed_roles_permissions.sql"),
  "utf8",
);

/** Extrait les codes de la première colonne d'un bloc "insert into public.<table> ... values ... on conflict". */
function codesInserted(table: string): string[] {
  const block = seed.match(
    new RegExp(`insert into public\\.${table} \\([^)]*\\) values([\\s\\S]*?)on conflict`),
  );
  if (!block) throw new Error(`Bloc d'insertion introuvable pour ${table}`);
  return [...block[1].matchAll(/^\s*\('([a-z_]+)'/gm)].map((m) => m[1]);
}

describe("catalogue des droits", () => {
  it("les permissions TypeScript correspondent exactement à la base", () => {
    expect([...PERMISSIONS].sort()).toEqual(codesInserted("permissions").sort());
  });

  it("les rôles TypeScript correspondent exactement à la base", () => {
    expect([...ROLES].sort()).toEqual(codesInserted("roles").sort());
  });

  it("aucune permission n'est dupliquée", () => {
    expect(new Set(PERMISSIONS).size).toBe(PERMISSIONS.length);
  });
});
