import type { Metadata } from "next";
import { NewsExplorer } from "@/components/content/NewsExplorer";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Alert } from "@/components/ui/Alert";
import { getNewsFilters, getNewsSources, getRecentNews } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "Veille du vivrier",
  description:
    "Actualités agricoles de Côte d'Ivoire sur le manioc, le maïs, le riz et le vivrier : informations datées et sourcées, issues de l'AIP, du CNRA, de l'ANADER et de la presse.",
};

export default async function VeillePage() {
  const [items, { categories, crops }, sources] = await Promise.all([
    getRecentNews(),
    getNewsFilters(),
    getNewsSources(),
  ]);
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/veille", label: "Veille du vivrier" },
        ]}
        eyebrow="Information agricole"
        title="La veille du vivrier"
        intro={
          <p>
            L&apos;actualité agricole de Côte d&apos;Ivoire, collectée chaque jour auprès de sources
            identifiées. Chaque information est datée et renvoie vers son article d&apos;origine.
          </p>
        }
      />

      <Section labelledBy="t-veille">
        <h2 id="t-veille" className="sr-only">
          Dernières informations
        </h2>
        <NewsExplorer items={items} categories={categories} crops={crops} />
      </Section>

      <Section tone="sand" labelledBy="t-sources">
        <SectionHeading
          id="t-sources"
          eyebrow="Transparence"
          title="Nos sources"
          intro="Institutions publiques et presse ivoirienne. Les sujets issus de la presse généraliste sont relus avant publication."
        />
        {sources.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {sources.map((s) => (
              <li key={s.siteUrl}>
                <a
                  href={s.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full bg-white px-4 font-semibold text-afa ring-1 ring-rule hover:ring-afa"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        )}
        <Alert tone="info" title="Droits des auteurs" className="mt-6">
          AFA ne reproduit jamais les articles : seuls le titre, un court extrait et le lien vers la source
          sont affichés. Pour lire l&apos;article complet, rendez-vous sur le site de son auteur.
        </Alert>
      </Section>
    </>
  );
}
