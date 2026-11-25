import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";

/**
 * Rafraîchit la session Supabase à chaque requête et réécrit les cookies d'authentification.
 * Ne prend AUCUNE décision d'autorisation : celles-ci sont faites côté serveur et en base (RLS).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = getPublicEnv();
  if (!env) return response; // Supabase pas encore configuré : le site public reste servi.

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Ne rien intercaler entre la création du client et cet appel : il valide et rafraîchit le jeton.
  await supabase.auth.getClaims();
  return response;
}
