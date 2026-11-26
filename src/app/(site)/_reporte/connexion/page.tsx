import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/AuthForms";
import { NarrowPage } from "@/components/layout/NarrowPage";
import { safeNext } from "@/lib/forms";

export const metadata: Metadata = { title: "Se connecter", robots: { index: false } };

type Search = { next?: string; lien?: string };

async function Form({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  return <SignInForm next={safeNext(sp.next)} expired={sp.lien === "expire"} />;
}

export default function SignInPage({ searchParams }: PageProps<"/connexion">) {
  return (
    <NarrowPage eyebrow="Mon compte" title="Se connecter">
      <Suspense>
        <Form searchParams={searchParams as Promise<Search>} />
      </Suspense>
    </NarrowPage>
  );
}
