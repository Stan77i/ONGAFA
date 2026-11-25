import { afterEach, describe, expect, it, vi } from "vitest";
import { getPublicEnv } from "./env";

afterEach(() => vi.unstubAllEnvs());

describe("configuration publique", () => {
  it("retourne null tant que Supabase n'est pas configuré", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(getPublicEnv()).toBeNull();
  });

  it("refuse une clé secrète côté client", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemple.supabase.co");
    // Fausse clé construite à l'exécution pour ne pas déclencher le détecteur de secrets.
    vi.stubEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      ["sb", "secret", "abcdefghijklmnopqrstuvwxyz"].join("_"),
    );
    expect(getPublicEnv()).toBeNull();
  });

  it("accepte une clé publiable", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://exemple.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_abcdefghijklmnopqrstuvwxyz");
    expect(getPublicEnv()?.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });
});
