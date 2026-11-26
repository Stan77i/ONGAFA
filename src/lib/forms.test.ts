import { describe, expect, it } from "vitest";
import { authErrorMessage, keepValues, safeNext } from "./forms";

describe("formulaires", () => {
  it("redirection : uniquement vers une page du site", () => {
    expect(safeNext("/producteurs/inscription")).toBe("/producteurs/inscription");
    expect(safeNext("https://pirate.example")).toBe("/compte");
    expect(safeNext("//pirate.example")).toBe("/compte");
    expect(safeNext("/\\pirate.example")).toBe("/compte");
    expect(safeNext(undefined)).toBe("/compte");
  });
  it("valeurs conservées après erreur, sans le mot de passe", () => {
    const fd = new FormData();
    fd.set("email", "a@b.ci");
    fd.set("password", "secret123");
    fd.set("$ACTION_KEY", "interne");
    expect(keepValues(fd)).toEqual({ email: "a@b.ci" });
  });
  it("erreurs Supabase traduites", () => {
    expect(authErrorMessage("Invalid login credentials")).toBe("Email ou mot de passe incorrect.");
    expect(authErrorMessage("User already registered")).toMatch(/existe déjà/);
    expect(authErrorMessage('Email address "x@y.z" is not authorized')).toMatch(/momentanément indisponible/);
    expect(authErrorMessage('Email address "x@example.com" is invalid')).toMatch(/adresse email est refusée/);
    expect(authErrorMessage("quelque chose d'inattendu")).toMatch(/Réessayez/);
  });
});
