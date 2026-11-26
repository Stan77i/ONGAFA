import type { Metadata } from "next";
import { Suspense } from "react";
import { ProducerForm } from "@/components/producers/ProducerForm";
import { NarrowPage } from "@/components/layout/NarrowPage";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { consentTexts } from "@/config/consent";
import { getSessionUser } from "@/lib/auth/session";
import { getCrops, getMyProducer, getRegions } from "@/lib/producers/data";

export const metadata: Metadata = {
  title: "Inscription producteur",
  description:
    "Productrices et producteurs de manioc et de vivrier : rejoignez le réseau AFA en quelques minutes depuis votre téléphone.",
};

const RETURN = "/producteurs/inscription";

async function Content() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <div className="space-y-5">
        <p>
          Pour créer votre fiche, il faut d&apos;abord un compte AFA. Il suffit d&apos;un email et d&apos;un
          mot de passe.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={`/creer-un-compte?next=${encodeURIComponent(RETURN)}`} variant="accent" size="lg">
            Créer mon compte
          </Button>
          <Button href={`/connexion?next=${encodeURIComponent(RETURN)}`} variant="secondary" size="lg">
            J&apos;ai déjà un compte
          </Button>
        </div>
      </div>
    );
  }
  const [regions, crops, profile] = await Promise.all([getRegions(), getCrops(), getMyProducer(user.id)]);
  return (
    <ProducerForm regions={regions} crops={crops} profile={profile} consentText={consentTexts.producer} />
  );
}

export default function ProducerSignupPage() {
  return (
    <NarrowPage
      eyebrow="Espace producteurs"
      title="Ma fiche producteur"
      intro={
        <p>
          Être référencé par AFA, c&apos;est être visible des acheteurs, transformateurs et partenaires du
          réseau, et recevoir les opportunités qui vous concernent. Environ deux minutes.
        </p>
      }
    >
      <Suspense fallback={<CardSkeleton />}>
        <Content />
      </Suspense>
    </NarrowPage>
  );
}
