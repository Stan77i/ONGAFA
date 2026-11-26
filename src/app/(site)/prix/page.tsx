import type { Metadata } from "next";
import { Suspense } from "react";
import { BadgeCheck, CalendarDays, FileSearch } from "lucide-react";
import { PriceTable } from "@/components/content/PriceTable";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { getVerifiedPrices } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "Prix du vivrier",
  description:
    "Prix des produits vivriers en Côte d'Ivoire (manioc, attiéké, maïs, igname…) : chaque prix est daté, sourcé et vérifié par AFA avant publication.",
};

const priceTypes = { farmgate: "bord champ", wholesale: "gros", retail: "détail" } as const;

async function Prices() {
  const prices = await getVerifiedPrices();
  if (prices.length === 0) {
    return (
      <EmptyState title="Aucun prix vérifié publié pour le moment">
        Les premiers relevés seront publiés dès qu&apos;ils auront été vérifiés. AFA ne publie jamais un prix
        sans date ni source.
      </EmptyState>
    );
  }
  return (
    <PriceTable
      caption="Prix vérifiés des produits vivriers"
      rows={prices.map((p) => ({
        product: `${p.product} (${priceTypes[p.priceType]})`,
        market: p.market,
        unit: p.unit,
        amount: p.amount,
        observedOn: p.observedOn,
        source: p.source,
        verified: true,
      }))}
    />
  );
}

export default function PricesPage() {
  const rules = [
    {
      icon: CalendarDays,
      title: "Daté",
      text: "Chaque prix indique le jour du relevé. Un prix ancien n'est jamais présenté comme actuel.",
    },
    {
      icon: FileSearch,
      title: "Sourcé",
      text: "Chaque prix indique qui l'a relevé et où : marché, ville ou région.",
    },
    {
      icon: BadgeCheck,
      title: "Vérifié",
      text: "Un prix n'est publié qu'après vérification par une personne habilitée d'AFA.",
    },
  ];
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/prix", label: "Prix du vivrier" },
        ]}
        eyebrow="Marchés"
        title="Prix du vivrier"
        intro={
          <p>
            Suivre les prix du manioc, de l&apos;attiéké et des autres produits vivriers, marché par marché,
            pour mieux vendre et mieux acheter.
          </p>
        }
      />
      <Section labelledBy="t-prix">
        <h2 id="t-prix" className="sr-only">
          Prix publiés
        </h2>
        <Suspense fallback={<CardSkeleton />}>
          <Prices />
        </Suspense>
      </Section>
      <Section tone="sand" labelledBy="t-methode">
        <SectionHeading id="t-methode" eyebrow="Méthode" title="Des prix fiables avant tout" />
        <ul className="grid gap-4 md:grid-cols-3">
          {rules.map(({ icon: Icon, title, text }) => (
            <li key={title} className="space-y-2 rounded-card bg-white p-5 text-ink ring-1 ring-rule">
              <Icon className="size-7 text-afa" aria-hidden="true" />
              <p className="font-display text-h3 font-semibold text-forest">{title}</p>
              <p className="text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
