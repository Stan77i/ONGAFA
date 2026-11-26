/** État renvoyé par les actions de formulaire (useActionState). */
export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export const initialFormState: FormState = { status: "idle" };

/** Valeurs texte du formulaire, pour les réafficher après une erreur (jamais les mots de passe). */
export function keepValues(fd: FormData, exclude: string[] = ["password"]): Record<string, string> {
  const out: Record<string, string> = {};
  // Les champs « $ACTION_… » sont internes à Next : jamais renvoyés au navigateur.
  for (const [k, v] of fd.entries()) {
    if (typeof v === "string" && !k.startsWith("$") && !exclude.includes(k)) out[k] = v;
  }
  return out;
}

/** Destination interne sûre après connexion (jamais vers un autre site). */
export function safeNext(next: unknown, fallback = "/compte"): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : fallback;
}

/** Messages d'erreur Supabase Auth → français clair. */
export function authErrorMessage(message: string | undefined): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login credentials")) return "Email ou mot de passe incorrect.";
  if (m.includes("email not confirmed"))
    return "Confirmez d'abord votre adresse email : un lien vous a été envoyé.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Un compte existe déjà avec cet email. Connectez-vous.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Trop de tentatives. Patientez quelques minutes puis réessayez.";
  if (m.includes("not authorized") || m.includes("sending") || m.includes("smtp"))
    return "L'envoi d'emails est momentanément indisponible. Réessayez plus tard ou posez votre question à AFA.";
  if (m.includes("email address") && m.includes("invalid"))
    return "Cette adresse email est refusée. Vérifiez-la ou utilisez une autre adresse.";
  if (m.includes("weak") || m.includes("password should"))
    return "Mot de passe trop faible : 8 caractères minimum, mélangez lettres et chiffres.";
  if (m.includes("expired") || (m.includes("invalid") && m.includes("token")))
    return "Ce lien a expiré. Demandez-en un nouveau.";
  return "Une erreur est survenue. Réessayez dans un instant.";
}
