"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requirePublicEnv } from "@/lib/env";
import { authErrorMessage, keepValues, safeNext, type FormState } from "@/lib/forms";
import { emailSchema, fieldErrors, passwordSchema, signInSchema, signUpSchema } from "@/lib/validation";

function confirmUrl(next: string) {
  const { NEXT_PUBLIC_SITE_URL } = requirePublicEnv();
  return `${NEXT_PUBLIC_SITE_URL}/auth/confirm?next=${encodeURIComponent(next)}`;
}

export async function signUpAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(fd));
  const values = keepValues(fd);
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), values };

  const next = safeNext(fd.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: parsed.data.display_name }, emailRedirectTo: confirmUrl(next) },
  });
  if (error) {
    console.error("Inscription :", error.message);
    return { status: "error", message: authErrorMessage(error.message), values };
  }
  // Compte déjà existant : Supabase renvoie un utilisateur sans identité (pour ne pas révéler l'existence du compte).
  if (data.user && data.user.identities?.length === 0) {
    return { status: "error", message: authErrorMessage("already registered"), values };
  }
  if (data.session) redirect(next); // confirmation d'email désactivée côté Supabase
  return {
    status: "success",
    message: `Un email de confirmation a été envoyé à ${parsed.data.email}. Ouvrez-le et touchez le lien pour activer votre compte.`,
  };
}

export async function signInAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(fd));
  const values = keepValues(fd);
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), values };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { status: "error", message: authErrorMessage(error.message), values };
  redirect(safeNext(fd.get("next")));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function forgotPasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = emailSchema.safeParse(fd.get("email"));
  if (!parsed.success)
    return { status: "error", errors: { email: "Adresse email invalide" }, values: keepValues(fd) };
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: confirmUrl("/compte/nouveau-mot-de-passe"),
  });
  if (error) console.error("Mot de passe oublié :", error.message);
  // Même réponse que le compte existe ou non (ne pas révéler les comptes existants).
  return {
    status: "success",
    message:
      "Si un compte existe avec cette adresse, un lien pour choisir un nouveau mot de passe vient d'être envoyé.",
  };
}

export async function updatePasswordAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = passwordSchema.safeParse(fd.get("password"));
  if (!parsed.success)
    return {
      status: "error",
      errors: { password: parsed.error.issues[0]?.message ?? "Mot de passe invalide" },
    };
  if (fd.get("password") !== fd.get("password_confirm")) {
    return { status: "error", errors: { password_confirm: "Les deux mots de passe ne correspondent pas" } };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) return { status: "error", message: authErrorMessage(error.message) };
  return { status: "success", message: "Votre mot de passe a été modifié." };
}
