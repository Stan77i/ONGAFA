import type { Metadata } from "next";
import { Arrow } from "@/components/afa/icons";
import { Panel, PillLink, SectionHead } from "@/components/afa/ui";
import { ResourceCard } from "@/components/content/ResourceCard";
import { VivrierHero } from "@/components/layout/VivrierHero";
import { getResources } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "Ressources",
  description:
    "Guides, fiches techniques, études et formations sur le manioc et le vivrier en Côte d'Ivoire.",
};

/** Les vidéos et formations s'affichent comme guides tant qu'un format dédié n'existe pas. */
const cardKind = {
  guide: "guide",
  fiche: "fiche",
  pdf: "pdf",
  video: "video",
  etude: "etude",
  formation: "guide",
} as const;

const books: [number, number, string, number][] = [
  [46, 190, "#df8433", -3],
  [38, 220, "#f7f2e8", 0],
  [54, 170, "#59883c", 2],
  [34, 205, "#efe6d2", 0],
  [48, 150, "#df8433", 9],
];

export default async function ResourcesPage() {
  const resources = await getResources();
  return (
    <>
      <VivrierHero
        current="/ressources"
        crumb="Ressources"
        title="Ressources."
        intro="Des documents utiles pour produire, transformer et vendre : guides, fiches techniques, études. Chacun avec sa source."
      />
      {resources.length === 0 ? (
        <Panel
          id="ressources"
          tone="forest"
          labelledBy="t-ressources"
          className="grid items-center gap-[clamp(24px,4vw,64px)] lg:grid-cols-2"
        >
          <div className="flex flex-col gap-3.5">
            <p className="eyebrow text-mint">Bibliothèque</p>
            <h2 id="t-ressources" className="h-section text-white">
              La bibliothèque se constitue.
            </h2>
            <p className="max-w-[56ch] text-[17px] leading-[1.55] sm:text-[18px]">
              Guides pratiques, fiches techniques et études pour produire, transformer et vendre seront
              publiés ici, chacun avec sa source.
            </p>
            <PillLink href="/manioc" variant="orange" size="lg" className="mt-2 self-start">
              Découvrir l&apos;espace manioc <Arrow />
            </PillLink>
          </div>
          <div
            aria-hidden="true"
            data-fx-skip=""
            className="flex min-h-[240px] items-end justify-center gap-3"
          >
            {books.map(([w, h, bg, r], i) => (
              <span
                key={i}
                className="origin-bottom rounded-[8px_8px_4px_4px] border-[1.5px] border-ink shadow-[inset_-8px_0_0_rgba(29,36,23,.12)]"
                style={{ width: w, height: h, background: bg, rotate: `${r}deg` }}
              />
            ))}
          </div>
        </Panel>
      ) : (
        <Panel id="ressources" tone="sand" labelledBy="t-ressources">
          <SectionHead id="t-ressources" eyebrow="Bibliothèque" title="Les documents." />
          <ul className="grid gap-4 md:grid-cols-2">
            {resources.map((r) => (
              <li key={r.slug}>
                <ResourceCard
                  resource={{
                    href: r.href,
                    title: r.title,
                    kind: cardKind[r.kind],
                    sizeLabel: r.sizeLabel ?? undefined,
                    crop: r.crop ?? undefined,
                  }}
                />
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
