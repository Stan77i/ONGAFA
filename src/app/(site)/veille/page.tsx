import type { Metadata } from "next";
import { VeillePulse } from "@/components/afa/dataviz";
import { Signpost, type SignBlade } from "@/components/afa/Signpost";
import { NewsTicker } from "@/components/content/NewsTicker";
import { formatDate } from "@/lib/format";
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

/** Rubriques fixes du carrefour (textes repris des pages Prix et Ressources). */
const rubriques: SignBlade[] = [
  {
    label: "Prix du vivrier",
    tag: "Rubrique",
    title: "Prix du vivrier",
    detail: "Chaque prix est daté, sourcé et vérifié par AFA avant publication.",
    href: "/prix",
    cta: "Voir les prix",
  },
  {
    label: "Ressources",
    tag: "Rubrique",
    title: "Ressources",
    detail: "Guides, fiches techniques, études. Chacun avec sa source.",
    href: "/ressources",
    cta: "Voir les ressources",
  },
];

/** Une plaque par thème : la dernière information réellement publiée (deux au plus). */
function signBlades(items: Awaited<ReturnType<typeof getRecentNews>>): SignBlade[] {
  const seen = new Set<string>();
  const latest: SignBlade[] = [];
  for (const it of items) {
    if (!it.category || seen.has(it.category.slug)) continue;
    seen.add(it.category.slug);
    latest.push({
      label: it.category.name,
      tag: `${it.category.name} · ${it.source}`,
      title: it.title,
      detail: `${formatDate(it.publishedAt)} · ${it.source}`,
      href: "#veille",
      cta: "Lire dans la veille",
    });
    if (latest.length === 2) break;
  }
  return [...latest, ...rubriques];
}

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
        art={<Signpost blades={signBlades(items)} />}
      />

      {items.length > 0 && (
        <Panel tone="forest" label="Le pouls de la veille">
          <VeillePulse items={items} />
        </Panel>
      )}

      <Panel id="veille" tone="sand" labelledBy="t-veille">
        <NewsExplorer items={items} categories={categories} crops={crops} headingId="t-veille" />

        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4">
          <div className="sticker flex flex-col bg-white p-2.5 text-ink">
            <div className="on-dark flex flex-1 flex-col gap-[18px] rounded-[15px] rounded-br-none bg-forest p-[clamp(20px,2vw,28px)] text-sand">
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
              <p className="text-[16px] leading-normal">
                Les sujets issus de la presse généraliste sont relus avant publication.
              </p>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
              <h3 className="pt-[18px] pr-2 pb-2 pl-2.5 text-[clamp(30px,3vw,44px)] leading-[0.95] font-black tracking-[-0.04em]">
                Nos sources.
              </h3>
              <span className="self-start rounded-b-[15px] bg-forest px-3.5 pt-2 pb-3 text-[12px] font-extrabold tracking-[0.12em] text-leaf-light uppercase">
                Transparence
              </span>
            </div>
          </div>
          <div role="note" className="sticker flex flex-col bg-white p-2.5 text-ink">
            <div className="flex flex-1 items-center rounded-[15px] rounded-br-none bg-cream p-[clamp(20px,2vw,28px)]">
              <p className="text-[17px] leading-[1.55]">
                AFA ne reproduit jamais les articles : seuls le titre, un court extrait et le lien vers la
                source sont affichés. Pour lire l&apos;article complet, rendez-vous sur le site de son auteur.
              </p>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
              <h3 className="pt-[18px] pr-2 pb-2 pl-2.5 text-[clamp(30px,3vw,44px)] leading-[0.95] font-black tracking-[-0.04em]">
                Droits des auteurs.
              </h3>
              <span
                aria-hidden="true"
                className="self-start rounded-b-[15px] bg-cream px-4 pt-0.5 pb-2 font-ink text-[40px] leading-none text-laterite"
              >
                “
              </span>
            </div>
          </div>
        </div>
      </Panel>
      <NewsTicker items={items} />
    </>
  );
}
