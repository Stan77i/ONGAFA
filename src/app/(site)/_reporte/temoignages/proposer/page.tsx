import type { Metadata } from "next";
import { Suspense } from "react";
import { TestimonialForm } from "@/components/community/CommunityForms";
import { NarrowPage } from "@/components/layout/NarrowPage";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { consentTexts } from "@/config/consent";
import { requireSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Partager mon expérience", robots: { index: false } };

async function Form() {
  await requireSessionUser("/temoignages/proposer");
  return <TestimonialForm consentText={consentTexts.testimonial} />;
}

export default function ProposeTestimonialPage() {
  return (
    <NarrowPage
      eyebrow="La parole aux producteurs"
      title="Partager mon expérience"
      intro={
        <p>Votre témoignage sera relu par l&apos;équipe AFA avant d&apos;être publié, avec votre accord.</p>
      }
    >
      <Suspense fallback={<CardSkeleton />}>
        <Form />
      </Suspense>
    </NarrowPage>
  );
}
