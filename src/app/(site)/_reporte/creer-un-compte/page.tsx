import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/AuthForms";
import { NarrowPage } from "@/components/layout/NarrowPage";
import { safeNext } from "@/lib/forms";

export const metadata: Metadata = { title: "Créer un compte", robots: { index: false } };

async function Form({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <SignUpForm next={safeNext((await searchParams).next)} />;
}

export default function SignUpPage({ searchParams }: PageProps<"/creer-un-compte">) {
  return (
    <NarrowPage
      eyebrow="Rejoindre la plateforme"
      title="Créer un compte"
      intro={
        <p>
          Un compte vous permet de vous inscrire comme producteur, de consulter l&apos;annuaire et de suivre
          vos questions à AFA.
        </p>
      }
    >
      <Suspense>
        <Form searchParams={searchParams as Promise<{ next?: string }>} />
      </Suspense>
    </NarrowPage>
  );
}
