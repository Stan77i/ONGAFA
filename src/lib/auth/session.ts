import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type SessionUser = { id: string; email: string | null };

/** Utilisateur connecté (jeton vérifié), ou null. Lit les cookies : à appeler sous <Suspense>. */
export async function getSessionUser(): Promise<SessionUser | null> {
  // La session dépend de la requête : on le signale explicitement à Next avant toute lecture
  // (sinon l'horloge utilisée par la vérification du jeton est vue comme une « valeur instable »).
  await connection();
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  return claims?.sub ? { id: claims.sub, email: (claims.email as string | undefined) ?? null } : null;
}

/** Exige une connexion ; sinon renvoie vers la page de connexion puis revient ici. */
export async function requireSessionUser(returnTo: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(`/connexion?next=${encodeURIComponent(returnTo)}`);
  return user;
}
