import type { Metadata } from "next";
import { VeillePulse } from "@/components/afa/dataviz";
import { AfaIcon } from "@/components/afa/icons";
import { Panel } from "@/components/afa/ui";
import { NewsExplorer } from "@/components/content/NewsExplorer";
import { VivrierHero } from "@/components/layout/VivrierHero";
import { getNewsFilters, getNewsSources, getRecentNews } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "Veille du vivrier",
  description:
    "Actualités agricoles de Côte d'Ivoire sur le manioc, le maïs, le riz et le vivrier : informations datées et sourcées, issues de l'AIP, du CNRA, de l'ANADER et de la presse.",
};

/** Sources annoncées tant que la table des sources n'est pas lisible (site construit sans base). */
const announcedSources = ["AIP", "CNRA", "ANADER", "Presse ivoirienne"];

export default async function VeillePage() {
  const [items, { categories, crops }, sources] = await Promise.all([
    getRecentNews(),
    getNewsFilters(),
    getNewsSources(),
  ]);
  return (
    <>
      <VivrierHero
        current="/veille"
        crumb="Veille du vivrier"
        title={
          <>
            <span className="block">Le vivrier,</span>
            <span className="block">en vrai.</span>
          </>
        }
        intro="L'actualité agricole de Côte d'Ivoire et les prix des marchés, collectés auprès de sources identifiées. Chaque information est datée et renvoie vers son origine."
      />

      {items.length > 0 && (
        <Panel tone="forest" label="Le pouls de la veille">
          <VeillePulse items={items} />
        </Panel>
      )}

      <Panel id="veille" tone="sand" labelledBy="t-veille">
        <NewsExplorer items={items} categories={categories} crops={crops} headingId="t-veille" />

        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4">
          <div className="afa-card on-dark flex flex-col gap-3.5 rounded-[22px] border-[1.5px] border-ink bg-forest px-7 py-6 text-sand">
            <p className="eyebrow text-mint">Transparence — nos sources</p>
            <ul className="flex flex-wrap gap-2">
              {sources.length > 0
                ? sources.map((s) => (
                    <li key={s.siteUrl}>
                      <a
                        href={s.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-sand/45 px-4 text-[15px] font-bold hover:bg-sand hover:text-ink"
                      >
                        {s.name}
                        <span className="sr-only"> (nouvel onglet)</span>
                      </a>
                    </li>
                  ))
                : announcedSources.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border-[1.5px] border-sand/45 px-4 py-2 text-[15px] font-bold"
                    >
                      {s}
                    </li>
                  ))}
            </ul>
            <p className="text-[15px] leading-normal">
              Les sujets issus de la presse généraliste sont relus avant publication.
            </p>
          </div>
          <div
            role="note"
            className="flex items-start gap-4 rounded-[22px] border-[1.5px] border-ink bg-white px-7 py-6"
          >
            <AfaIcon name="quote" size={36} />
            <p className="text-[16px] leading-[1.55]">
              <strong className="font-extrabold">Droits des auteurs.</strong> AFA ne reproduit jamais les
              articles : seuls le titre, un court extrait et le lien vers la source sont affichés. Pour lire
              l&apos;article complet, rendez-vous sur le site de son auteur.
            </p>
          </div>
        </div>
      </Panel>
    </>
  );
}
