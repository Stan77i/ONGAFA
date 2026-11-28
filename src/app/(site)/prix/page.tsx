import type { Metadata } from "next";
import { Suspense } from "react";
import { AfaIcon, type AfaIconName } from "@/components/afa/icons";
import { Panel, SectionHead } from "@/components/afa/ui";
import { PriceTable } from "@/components/content/PriceTable";
import { VivrierHero } from "@/components/layout/VivrierHero";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { getVerifiedPrices } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "Prix du vivrier",
  description:
    "Prix des produits vivriers en Côte d'Ivoire (manioc, attiéké, maïs, igname…) : chaque prix est daté, sourcé et vérifié par AFA avant publication.",
};

const priceTypes = { farmgate: "bord champ", wholesale: "gros", retail: "détail" } as const;
const columns = ["Produit", "Marché", "Unité", "Prix", "Relevé le", "Source"];

const rules: { icon: AfaIconName; title: string; text: string }[] = [
  {
    icon: "calendar",
    title: "Daté",
    text: "Chaque prix indique le jour du relevé. Un prix ancien n'est jamais présenté comme actuel.",
  },
  {
    icon: "search",
    title: "Sourcé",
    text: "Chaque prix indique qui l'a relevé et où : marché, ville ou région.",
  },
  {
    icon: "badge",
    title: "Vérifié",
    text: "Un prix n'est publié qu'après vérification par une personne habilitée d'AFA.",
  },
];

function EmptyPrices() {
  return (
    <div className="overflow-hidden rounded-[22px] border-[1.5px] border-ink bg-sand shadow-[0_8px_0_#1d2417]">
      <div
        aria-hidden="true"
        className="hidden grid-cols-[1.4fr_1fr_.7fr_.8fr_.9fr_1fr] gap-3 bg-ink px-6 py-4 text-[13px] font-extrabold tracking-[0.08em] text-sand uppercase md:grid"
      >
        {columns.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2.5 px-6 py-[clamp(32px,4vw,56px)] text-center">
        <AfaIcon name="scale" size={64} />
        <h3 className="text-[clamp(20px,2vw,24px)] font-extrabold tracking-[-0.02em]">
          Aucun prix vérifié publié pour le moment
        </h3>
        <p className="max-w-[56ch] text-[16px] leading-normal text-ink-soft">
          Les premiers relevés seront publiés dès qu&apos;ils auront été vérifiés. AFA ne publie jamais un
          prix sans date ni source.
        </p>
      </div>
    </div>
  );
}

async function Prices() {
  const prices = await getVerifiedPrices();
  if (prices.length === 0) return <EmptyPrices />;
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
  return (
    <>
      <VivrierHero
        current="/prix"
        crumb="Prix du vivrier"
        title={
          <>
            <span className="block">Prix du</span>
            <span className="block">vivrier.</span>
          </>
        }
        intro="Suivre les prix du manioc, de l'attiéké et des autres produits vivriers, marché par marché, pour mieux vendre et mieux acheter."
      />
      <Panel id="prix" tone="orange" labelledBy="t-prix">
        <SectionHead
          id="t-prix"
          tone="orange"
          eyebrow="Marchés"
          title="Les prix relevés."
          intro="Chaque prix est daté, sourcé et vérifié par AFA avant publication."
        />
        <Suspense fallback={<CardSkeleton />}>
          <Prices />
        </Suspense>
        <ul className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
          {rules.map((r) => (
            <li key={r.title} className="afa-card sticker flex flex-col gap-2.5 bg-white p-6">
              <AfaIcon name={r.icon} size={44} data-card-icon="" />
              <span className="text-[26px] font-extrabold tracking-[-0.02em]">{r.title}</span>
              <span className="text-[16px] leading-normal text-ink-soft">{r.text}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
