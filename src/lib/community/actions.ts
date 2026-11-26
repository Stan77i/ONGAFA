"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { CONSENT_VERSION } from "@/config/consent";
import { getSessionUser } from "@/lib/auth/session";
import { keepValues, type FormState } from "@/lib/forms";
import { createClient } from "@/lib/supabase/server";
import { fieldErrors } from "@/lib/validation";
import { FORUM_TAG } from "./data";

const optionalId = z
  .uuid()
  .optional()
  .or(z.literal("").transform(() => undefined));

const postSchema = z.object({
  category_id: z.uuid({ error: "Choisissez un thème" }),
  crop_id: optionalId,
  region_id: optionalId,
  title: z
    .string()
    .trim()
    .min(8, "Titre trop court (8 caractères minimum)")
    .max(140, "140 caractères maximum"),
  body: z
    .string()
    .trim()
    .min(10, "Message trop court (10 caractères minimum)")
    .max(5000, "5 000 caractères maximum"),
});

const commentSchema = z.object({
  post_id: z.uuid(),
  body: z.string().trim().min(2, "Réponse trop courte").max(3000, "3 000 caractères maximum"),
});

const reportSchema = z.object({
  target_type: z.enum(["post", "comment"]),
  target_id: z.uuid(),
  reason: z.enum(["spam", "abuse", "false_info", "scam", "personal_data", "off_topic", "other"], {
    error: "Choisissez un motif",
  }),
  details: z.string().trim().max(1000).optional(),
});

const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom").max(80),
  place: z.string().trim().min(2, "Indiquez votre village ou ville").max(80),
  activity: z.string().trim().min(2, "Indiquez votre activité").max(80),
  quote: z.string().trim().min(20, "Votre témoignage est trop court (20 caractères minimum)").max(1200),
  consent: z.literal("on", { error: "Votre accord est nécessaire pour publier votre témoignage" }),
});

/** Messages de la base (limites anti-abus, sujet fermé) déjà rédigés pour le public. */
function dbMessage(error: { code?: string; message: string }): string {
  if (error.code === "54000" || error.message.startsWith("Ce sujet")) return error.message;
  if (error.code === "42501") return "Votre compte ne permet pas de publier pour le moment.";
  return "L'envoi n'a pas abouti. Réessayez dans un instant.";
}

async function requireUser(returnTo: string) {
  const user = await getSessionUser();
  if (!user) redirect(`/connexion?next=${encodeURIComponent(returnTo)}`);
  return user;
}

export async function createPostAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireUser("/communaute/nouveau");
  const values = keepValues(fd);
  const parsed = postSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), values };
  const supabase = await createClient();
  // author_name est remplacé en base par le nom du profil.
  const { data, error } = await supabase
    .from("posts")
    .insert({ ...parsed.data, author_name: "-" })
    .select("id, status")
    .single();
  if (error || !data)
    return { status: "error", message: error ? dbMessage(error) : "Envoi impossible.", values };
  updateTag(FORUM_TAG);
  redirect(`/communaute/${data.id}?envoi=${data.status === "published" ? "publie" : "attente"}`);
}

export async function createCommentAction(_: FormState, fd: FormData): Promise<FormState> {
  const postId = String(fd.get("post_id") ?? "");
  await requireUser(`/communaute/${postId}`);
  const parsed = commentSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), values: keepValues(fd) };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .insert({ ...parsed.data, author_name: "-" })
    .select("status")
    .single();
  if (error || !data)
    return {
      status: "error",
      message: error ? dbMessage(error) : "Envoi impossible.",
      values: keepValues(fd),
    };
  updateTag(FORUM_TAG);
  return {
    status: "success",
    message:
      data.status === "published"
        ? "Votre réponse est publiée."
        : "Merci ! Votre réponse sera visible après validation par l'équipe AFA.",
  };
}

export async function reportAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await getSessionUser();
  if (!user) return { status: "error", message: "Connectez-vous pour signaler un contenu." };
  const parsed = reportSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error) };
  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({ ...parsed.data, reporter_id: user.id });
  if (error) {
    if (error.code === "23505")
      return { status: "success", message: "Vous avez déjà signalé ce contenu. Merci." };
    return { status: "error", message: "Le signalement n'a pas abouti. Réessayez." };
  }
  updateTag(FORUM_TAG);
  return { status: "success", message: "Merci. L'équipe AFA va examiner ce contenu." };
}

export async function testimonialAction(_: FormState, fd: FormData): Promise<FormState> {
  await requireUser("/temoignages/proposer");
  const values = keepValues(fd);
  const parsed = testimonialSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), values };
  const supabase = await createClient();
  const { consent: _consent, ...row } = parsed.data;
  void _consent;
  const { error } = await supabase.from("testimonials").insert({ ...row, consent_version: CONSENT_VERSION });
  if (error) return { status: "error", message: "L'envoi n'a pas abouti. Réessayez.", values };
  return {
    status: "success",
    message: "Merci pour votre témoignage ! Il sera publié après relecture par l'équipe AFA.",
  };
}
