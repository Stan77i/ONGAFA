import { z } from "zod";

/** Règles de validation partagées navigateur / serveur. Le serveur valide TOUJOURS, quoi qu'ait fait le navigateur. */

const trimmed = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max} caractères maximum`)
    .optional()
    .transform((v) => (v ? v : undefined));

/** « 2,5 » ou « 2.5 » → 2.5 ; vide → undefined. */
const frenchNumber = (min: number, max: number, message: string) =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((v, ctx) => {
      if (v === undefined || v === "") return undefined;
      const n = typeof v === "number" ? v : Number(String(v).replace(/\s/g, "").replace(",", "."));
      if (!Number.isFinite(n) || n <= min || n >= max) {
        ctx.addIssue({ code: "custom", message });
        return z.NEVER;
      }
      return n;
    });

export const phoneSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v.replace(/\s+/g, " ") : undefined))
  .refine((v) => v === undefined || /^[0-9+() .-]{6,20}$/.test(v), "Numéro de téléphone invalide");

// Nettoyer AVANT de vérifier : un espace en trop (fréquent au téléphone) ne doit pas bloquer.
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Adresse email invalide"));
export const passwordSchema = z.string().min(8, "8 caractères minimum").max(72, "72 caractères maximum");
export const displayNameSchema = trimmed(80).min(2, "Indiquez votre nom (2 caractères minimum)");

export const signUpSchema = z.object({
  display_name: displayNameSchema,
  email: emailSchema,
  password: passwordSchema,
});
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis"),
});

export const visibilitySchema = z.enum(["private", "members", "public"]);
export const PRODUCER_NEEDS = [
  ["buyer", "Trouver des acheteurs"],
  ["financing", "Financement"],
  ["inputs", "Intrants (semences, boutures, engrais)"],
  ["training", "Formation"],
  ["processing", "Transformation"],
  ["transport", "Transport"],
  ["support", "Accompagnement"],
  ["other", "Autre"],
] as const;

export const producerSchema = z.object({
  display_name: trimmed(100).min(2, "Indiquez votre nom ou celui de votre exploitation"),
  region_id: z
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  city: optionalText(80),
  village: optionalText(80),
  crops: z
    .array(z.object({ crop_id: z.uuid(), area_ha: frenchNumber(0, 100000, "Superficie invalide") }))
    .min(1, "Choisissez au moins une culture"),
  total_area_ha: frenchNumber(0, 100000, "Superficie invalide"),
  experience_years: frenchNumber(-1, 81, "Nombre d'années invalide").transform((v) =>
    v === undefined ? undefined : Math.round(v),
  ),
  production_note: optionalText(500),
  availability_note: optionalText(300),
  needs: z.array(z.enum(PRODUCER_NEEDS.map(([k]) => k) as [string, ...string[]])).default([]),
  description: optionalText(1500),
  phone: phoneSchema,
  phone_visibility: visibilitySchema.default("private"),
  visibility: visibilitySchema.default("members"),
});
export type ProducerInput = z.input<typeof producerSchema>;

export const CONTACT_CATEGORIES = [
  ["debouche", "Trouver un débouché pour ma production"],
  ["financement", "Financement"],
  ["formation", "Formation"],
  ["intrants", "Intrants"],
  ["transformation", "Transformation"],
  ["transport", "Transport"],
  ["information", "Demande d'information"],
  ["autre", "Autre"],
] as const;

export const JOIN_PROFILES = [
  ["producer", "Productrice ou producteur"],
  ["cooperative", "Coopérative"],
  ["trader", "Commerçante ou commerçant"],
  ["processor", "Transformatrice ou transformateur"],
  ["buyer", "Acheteur"],
  ["transporter", "Transporteur"],
  ["youth", "Jeune"],
  ["partner", "Partenaire ou institution"],
  ["other", "Autre"],
] as const;

const contactBase = {
  full_name: displayNameSchema,
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v.toLowerCase() : undefined))
    .refine((v) => v === undefined || z.email().safeParse(v).success, "Adresse email invalide"),
  phone: phoneSchema,
  region_id: z
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  city: optionalText(80),
  consent: z.literal("on", { error: "Votre accord est nécessaire pour traiter la demande" }),
  // Piège à robots : champ invisible qui doit rester vide.
  website: z.string().max(0, "Envoi refusé").optional(),
};

const reachable = (v: { email?: string; phone?: string }) => Boolean(v.email || v.phone);
const reachableMessage = {
  message: "Indiquez un email ou un numéro de téléphone pour que nous puissions vous répondre",
  path: ["phone"],
};

export const contactSchema = z
  .object({
    ...contactBase,
    category: z.enum(CONTACT_CATEGORIES.map(([k]) => k) as [string, ...string[]], {
      error: "Choisissez un sujet",
    }),
    message: z.string().trim().min(10, "Votre message est trop court (10 caractères minimum)").max(2000),
  })
  .refine(reachable, reachableMessage);

export const joinSchema = z
  .object({
    ...contactBase,
    profile_type: z.enum(JOIN_PROFILES.map(([k]) => k) as [string, ...string[]], {
      error: "Choisissez votre profil",
    }),
    organization: optionalText(120),
    message: optionalText(2000),
  })
  .refine(reachable, reachableMessage);

/** Erreurs zod → { champ: message } pour l'affichage sous chaque champ. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
