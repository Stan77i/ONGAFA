import "server-only";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Permission } from "@/lib/auth/permissions";

/** Utilisateur connecté (jeton vérifié côté serveur), ou null. */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub ?? null;
}

/**
 * Vérifie une permission EN BASE (fonction has_permission, qui tient compte du statut du compte).
 * C'est une barrière d'interface : la vraie protection des données reste la RLS.
 */
export async function hasPermission(permission: Permission): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("has_permission", { p_permission: permission });
  if (error) return false; // en cas de doute, on refuse
  return data === true;
}

/**
 * À appeler en tête de toute page ou action d'administration.
 * Non connecté → page de connexion. Connecté sans droit → 404 (on ne révèle pas l'existence de la page).
 * (forbidden()/unauthorized() de Next sont encore expérimentaux : volontairement non utilisés.)
 */
export async function requirePermission(permission: Permission): Promise<void> {
  if (!(await getCurrentUserId())) redirect("/connexion");
  if (!(await hasPermission(permission))) notFound();
}
