import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";
import { NarrowPage } from "@/components/layout/NarrowPage";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <NarrowPage
      eyebrow="Mon compte"
      title="Mot de passe oublié"
      intro={
        <p>
          Indiquez l&apos;email de votre compte : vous recevrez un lien pour choisir un nouveau mot de passe.
        </p>
      }
    >
      <ForgotPasswordForm />
    </NarrowPage>
  );
}
