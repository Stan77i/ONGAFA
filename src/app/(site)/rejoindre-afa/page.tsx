import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ArrowRight,
  Factory,
  GraduationCap,
  Handshake,
  ShoppingBasket,
  Sprout,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { JoinForm } from "@/components/forms/RequestForms";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { consentTexts } from "@/config/consent";
import { getSessionUser } from "@/lib/auth/session";
import { getRegions } from "@/lib/producers/data";

export const metadata: Metadata = {
  title: "Rejoindre AFA",
  description:
    "Productrices, producteurs, coopératives, commerçantes, transformateurs, acheteurs, jeunes, partenaires : rejoignez le réseau de l'ONG AFA.",
};

const profiles = [
  { icon: Users, label: "Coopérative", text: "Groupement de producteurs ou de productrices." },
  { icon: Store, label: "Commerçante", text: "Commercialisation des produits vivriers et dérivés." },
  {
    icon: Factory,
    label: "Transformatrice ou transformateur",
    text: "Attiéké, gari, placali, farine, amidon…",
  },
  { icon: ShoppingBasket, label: "Acheteur", text: "Grossiste, centrale d'achat, entreprise." },
  { icon: Truck, label: "Transporteur", text: "Collecte, transport et conservation." },
  { icon: GraduationCap, label: "Jeune", text: "Formation et insertion dans la filière." },
  {
    icon: Handshake,
    label: "Partenaire ou institution",
    text: "Organisation, collectivité, structure d'encadrement.",
  },
] as const;

async function Form() {
  const [regions, user] = await Promise.all([getRegions(), getSessionUser()]);
  return (
    <JoinForm
      regions={regions}
      consentText={consentTexts.request}
      prefill={{ email: user?.email ?? undefined }}
    />
  );
}

export default function JoinPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/rejoindre-afa", label: "Rejoindre AFA" },
        ]}
        eyebrow="Le réseau AFA"
        title="Rejoindre AFA"
        intro={
          <p>
            AFA rassemble tous les acteurs de la filière manioc et du vivrier, du champ jusqu&apos;au marché.
          </p>
        }
      />

      <Section labelledBy="t-producteur">
        <div className="flex flex-col gap-5 rounded-card bg-afa p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-afa">
              <Sprout className="size-7" aria-hidden="true" />
            </span>
            <div>
              <h2 id="t-producteur" className="font-display text-h3 font-semibold">
                Vous êtes productrice ou producteur ?
              </h2>
              <p className="text-sand">
                Créez votre fiche dans l&apos;annuaire AFA : environ deux minutes, depuis votre téléphone.
              </p>
            </div>
          </div>
          <Button
            href="/producteurs/inscription"
            variant="on-dark"
            size="lg"
            iconAfter={<ArrowRight className="size-5" aria-hidden="true" />}
          >
            Créer ma fiche
          </Button>
        </div>
      </Section>

      <Section tone="sand" labelledBy="t-autres">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading
              id="t-autres"
              eyebrow="Les autres acteurs"
              title="Coopératives, commerçantes, acheteurs, partenaires…"
              intro="Présentez-vous : l'équipe AFA vous recontacte pour voir comment travailler ensemble."
            />
            <ul className="grid gap-3 sm:grid-cols-2">
              {profiles.map(({ icon: Icon, label, text }) => (
                <li key={label} className="flex gap-3 rounded-card bg-white p-4 text-ink ring-1 ring-rule">
                  <Icon className="mt-0.5 size-6 shrink-0 text-afa" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold">{label}</span>
                    <span className="block text-meta text-ink-soft">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-white p-5 text-ink ring-1 ring-rule sm:p-8">
            <Suspense fallback={<CardSkeleton />}>
              <Form />
            </Suspense>
          </div>
        </div>
      </Section>
    </>
  );
}
