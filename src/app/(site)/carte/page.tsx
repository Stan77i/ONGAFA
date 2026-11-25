import type { Metadata } from "next";
import { NationalMap, mapAttribution } from "@/components/map/NationalMap";
import { NationalMapExplorer } from "@/components/map/NationalMapExplorer";
import { MapLegend } from "@/components/map/StatusPill";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { links } from "@/config/navigation";
import { site } from "@/config/site";
import { formatDate } from "@/lib/format";
import { getAfaMapPoints } from "@/lib/map/data";

export const metadata: Metadata = {
  title: "Carte nationale",
  description:
    "Où l'ONG AFA est-elle présente en Côte d'Ivoire ? Implantée dans la région du N'Zi, AFA prépare son déploiement dans la Nawa puis sur l'ensemble du territoire.",
};

export default async function MapPage() {
  const points = await getAfaMapPoints();

  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/carte", label: "Carte nationale" },
        ]}
        eyebrow="Déploiement national"
        title="AFA en Côte d'Ivoire"
        intro={
          <p>
            Née dans la région du N&apos;Zi, AFA prépare son déploiement dans la Nawa, puis progressivement
            dans les autres régions du pays. Touchez une région colorée pour en savoir plus.
          </p>
        }
      >
        <MapLegend className="pt-2" />
      </PageHero>

      <Section labelledBy="t-carte">
        <h2 id="t-carte" className="sr-only">
          Carte des implantations
        </h2>
        <NationalMapExplorer points={points}>
          <NationalMap points={points} interactive className="h-auto w-full" />
        </NationalMapExplorer>
        <p className="mt-4 text-meta text-ink-soft">Limites administratives : {mapAttribution}.</p>
      </Section>

      <Section id="chronologie" tone="sand" labelledBy="t-chronologie">
        <SectionHeading
          id="t-chronologie"
          eyebrow="Chronologie"
          title="Les étapes du déploiement"
          intro="La carte s'enrichira à chaque nouvelle implantation."
        />
        <ol className="relative space-y-8 border-l-2 border-leaf/40 pl-8">
          <li className="relative">
            <span
              className="absolute top-1 -left-[2.6rem] grid size-5 place-items-center rounded-full bg-afa ring-4 ring-sand"
              aria-hidden="true"
            />
            <p className="text-meta font-semibold text-accent-text">
              <time dateTime={site.foundedOn}>{formatDate(site.foundedOn)}</time>
            </p>
            <p className="font-display text-h3 font-semibold text-forest">
              Création d&apos;AFA dans le N&apos;Zi
            </p>
            <p className="text-ink-soft">
              Plantations de manioc, unités de transformation et coopératives accompagnées dans une dizaine de
              sous-préfectures.
            </p>
          </li>
          <li className="relative">
            <span
              className="absolute top-1 -left-[2.6rem] size-5 rounded-full border-2 border-dashed border-ink bg-white ring-4 ring-sand"
              aria-hidden="true"
            />
            <p className="text-meta font-semibold text-accent-text">Prochaine étape</p>
            <p className="font-display text-h3 font-semibold text-forest">Région de la Nawa</p>
            <p className="text-ink-soft">Première étape du déploiement national annoncé par AFA.</p>
          </li>
          <li className="relative">
            <span
              className="absolute top-1 -left-[2.6rem] size-5 rounded-full border-2 border-dashed border-ink bg-white ring-4 ring-sand"
              aria-hidden="true"
            />
            <p className="text-meta font-semibold text-accent-text">Ensuite</p>
            <p className="font-display text-h3 font-semibold text-forest">
              Les autres régions de Côte d&apos;Ivoire
            </p>
            <p className="text-ink-soft">
              Un déploiement progressif sur l&apos;ensemble du territoire national.
            </p>
          </li>
        </ol>
        <div className="mt-10">
          <Button href={links.join} variant="accent" size="lg">
            AFA dans ma région ? Rejoignez le réseau
          </Button>
        </div>
      </Section>
    </>
  );
}
