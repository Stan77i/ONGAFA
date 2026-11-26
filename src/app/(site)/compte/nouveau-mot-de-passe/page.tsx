import type { Metadata } from "next";
import { Suspense } from "react";
import { NewPasswordForm } from "@/components/auth/AuthForms";
import { NarrowPage } from "@/components/layout/NarrowPage";
import { requireSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Nouveau mot de passe", robots: { index: false } };

async function Guarded() {
  await requireSessionUser("/compte/nouveau-mot-de-passe");
  return <NewPasswordForm />;
}

export default function NewPasswordPage() {
  return (
    <NarrowPage eyebrow="Mon compte" title="Choisir un nouveau mot de passe">
      <Suspense>
        <Guarded />
      </Suspense>
    </NarrowPage>
  );
}
