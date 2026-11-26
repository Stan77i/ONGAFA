"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CONSENT_VERSION } from "@/config/consent";
import { getSessionUser } from "@/lib/auth/session";
import { keepValues, type FormState } from "@/lib/forms";
import { createClient } from "@/lib/supabase/server";
import { contactSchema, fieldErrors, joinSchema, producerSchema } from "@/lib/validation";
import { toRpcPayload } from "./payload";

/** Le formulaire envoie crop=<id> (cases cochées) et area_<id>=<superficie>. */
function producerPayload(fd: FormData) {
  const crops = fd
    .getAll("crop")
    .map((id) => ({ crop_id: String(id), area_ha: String(fd.get(`area_${id}`) ?? "") }));
  return {
    display_name: fd.get("display_name"),
    region_id: fd.get("region_id") ?? "",
    city: fd.get("city") ?? undefined,
    village: fd.get("village") ?? undefined,
    crops,
    total_area_ha: fd.get("total_area_ha") ?? undefined,
    experience_years: fd.get("experience_years") ?? undefined,
    production_note: fd.get("production_note") ?? undefined,
    availability_note: fd.get("availability_note") ?? undefined,
    needs: fd.getAll("needs").map(String),
    description: fd.get("description") ?? undefined,
    phone: fd.get("phone") ?? undefined,
    phone_visibility: fd.get("phone_visibility") ?? undefined,
    visibility: fd.get("visibility") ?? undefined,
  };
}

export async function saveProducerAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await getSessionUser();
  if (!user) redirect("/connexion?next=/producteurs/inscription");

  const values = keepValues(fd);
  const parsed = producerSchema.safeParse(producerPayload(fd));
  const isNew = fd.get("is_new") === "1";
  const errors = parsed.success ? {} : fieldErrors(parsed.error);
  if (isNew && fd.get("consent") !== "on")
    errors.consent = "Votre accord est nécessaire pour vous référencer";
  if (!parsed.success || Object.keys(errors).length) {
    return { status: "error", message: "Certaines informations sont à corriger.", errors, values };
  }

  const supabase = await createClient();
  const { data: slug, error } = await supabase.rpc("save_producer_profile", {
    p: toRpcPayload(parsed.data, isNew ? CONSENT_VERSION : undefined),
  });
  if (error || !slug) {
    console.error("Profil producteur :", error?.message);
    return {
      status: "error",
      message: "L'enregistrement n'a pas abouti. Réessayez dans un instant.",
      values,
    };
  }
  revalidatePath("/compte");
  redirect(`/compte?profil=${isNew ? "cree" : "modifie"}`);
}

/** Retire les champs propres au formulaire (case de consentement, piège à robots) avant l'enregistrement. */
function formOnly(data: Record<string, unknown>): Record<string, unknown> {
  const row = { ...data };
  delete row.consent;
  delete row.website;
  return row;
}

async function insertRequest(
  table: "contact_requests" | "join_requests",
  row: Record<string, unknown>,
): Promise<string | null> {
  const supabase = await createClient();
  // Pas de « .select() » : un visiteur peut envoyer une demande mais pas la relire.
  const { error } = await supabase.from(table).insert({ ...row, consent_version: CONSENT_VERSION });
  if (!error) return null;
  console.error(`${table} :`, error.message);
  if (error.code === "54000") return error.message; // limite anti-abus, message déjà rédigé pour le public
  return "L'envoi n'a pas abouti. Réessayez dans un instant.";
}

export async function contactAction(_: FormState, fd: FormData): Promise<FormState> {
  const values = keepValues(fd, ["website"]);
  const parsed = contactSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), values };
  const failure = await insertRequest("contact_requests", formOnly(parsed.data));
  if (failure) return { status: "error", message: failure, values };
  return {
    status: "success",
    message:
      "Votre question a bien été envoyée à l'équipe AFA. Nous vous répondrons par email ou par téléphone.",
  };
}

export async function joinAction(_: FormState, fd: FormData): Promise<FormState> {
  const values = keepValues(fd, ["website"]);
  const parsed = joinSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { status: "error", errors: fieldErrors(parsed.error), values };
  const failure = await insertRequest("join_requests", formOnly(parsed.data));
  if (failure) return { status: "error", message: failure, values };
  return {
    status: "success",
    message: "Merci ! Votre demande a bien été reçue. L'équipe AFA vous recontactera.",
  };
}
