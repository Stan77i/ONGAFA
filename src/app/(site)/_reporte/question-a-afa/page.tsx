import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/RequestForms";
import { NarrowPage } from "@/components/layout/NarrowPage";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { consentTexts } from "@/config/consent";
import { getSessionUser } from "@/lib/auth/session";
import { getRegions } from "@/lib/producers/data";

export const metadata: Metadata = {
  title: "Poser une question à AFA",
  description:
    "Un débouché pour votre manioc, un financement, une formation ? Posez votre question à l'équipe de l'ONG AFA.",
};

async function Form() {
  const [regions, user] = await Promise.all([getRegions(), getSessionUser()]);
  return (
    <ContactForm
      regions={regions}
      consentText={consentTexts.request}
      prefill={{ email: user?.email ?? undefined }}
    />
  );
}

export default function AskPage() {
  return (
    <NarrowPage
      eyebrow="Question à AFA"
      title="Posez votre question à l'équipe AFA"
      intro={
        <p>
          Débouché, financement, formation, transformation… L&apos;équipe AFA lit chaque question et vous
          répond par email ou par téléphone. Connecté, vous retrouvez aussi le suivi dans votre compte.
        </p>
      }
    >
      <Suspense fallback={<CardSkeleton />}>
        <Form />
      </Suspense>
    </NarrowPage>
  );
}
