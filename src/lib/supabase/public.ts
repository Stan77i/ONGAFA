import { createClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env";

/**
 * Client Supabase SANS session, pour lire les données publiques (visibles des visiteurs selon la RLS).
 * Sans cookies : ses lectures peuvent être mises en cache. Retourne null si Supabase n'est pas configuré.
 */
export function createPublicClient() {
  const env = getPublicEnv();
  if (!env) return null;
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
