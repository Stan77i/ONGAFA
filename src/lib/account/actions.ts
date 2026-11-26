"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import type { FormState } from "@/lib/forms";
import { createClient } from "@/lib/supabase/server";

/** Demande d'export ou de suppression des données personnelles (traitée par AFA, tracée). */
export async function dataRequestAction(_: FormState, fd: FormData): Promise<FormState> {
  const user = await getSessionUser();
  if (!user) redirect("/connexion?next=/compte");
  const type = fd.get("type");
  if (type !== "export" && type !== "delete") return { status: "error", message: "Demande invalide." };
  const supabase = await createClient();
  const { error } = await supabase.from("data_requests").insert({ user_id: user.id, type });
  if (error) return { status: "error", message: "La demande n'a pas pu être enregistrée. Réessayez." };
  revalidatePath("/compte");
  return {
    status: "success",
    message:
      type === "delete"
        ? "Votre demande de suppression est enregistrée. AFA la traitera et vous confirmera la suppression."
        : "Votre demande de copie de vos données est enregistrée. AFA vous l'enverra.",
  };
}
