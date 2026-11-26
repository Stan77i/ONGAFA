import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/forms";

/**
 * Lien reçu par email (confirmation d'inscription, nouveau mot de passe).
 * Accepte les deux formats Supabase :
 *  - `token_hash` + `type` (recommandé : fonctionne même si l'email est ouvert sur un autre appareil) ;
 *  - `code` (format par défaut : le lien doit être ouvert dans le même navigateur que l'inscription).
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNext(url.searchParams.get("next"));
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const code = url.searchParams.get("code");

  const supabase = await createClient();
  let error: { message: string } | null = null;
  if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  } else if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else {
    error = { message: "lien incomplet" };
  }

  if (error) {
    console.error("Confirmation :", error.message);
    return NextResponse.redirect(new URL("/connexion?lien=expire", url.origin));
  }
  return NextResponse.redirect(new URL(next, url.origin));
}
