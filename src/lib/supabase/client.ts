import { createBrowserClient } from "@supabase/ssr";
import { requirePublicEnv } from "@/lib/env";

/** Client Supabase pour les composants exécutés dans le navigateur. */
export function createClient() {
  const env = requirePublicEnv();
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
