import type { Metadata } from "next";
import { Suspense } from "react";
import { NewsListItem } from "@/components/content/NewsListItem";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { Pagination } from "@/components/ui/Pagination";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { NEWS_PAGE_SIZE, getNews, getNewsFilters, getNewsSources } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "Veille du vivrier",
  description:
    "Actualités agricoles de Côte d'Ivoire sur le manioc, le maïs, le riz et le vivrier : informations datées et sourcées, issues de l'AIP, du CNRA, de l'ANADER et de la presse.",
};

type Search = { categorie?: string; culture?: string; page?: string };

function hrefFor(params: Search, patch: Partial<Search>): string {
  const next = { ...params, ...patch };
  const qs = new URLSearchParams();
  if (next.categorie) qs.set("categorie", next.categorie);
  if (next.culture) qs.set("culture", next.culture);
  if (next.page && next.page !== "1") qs.set("page", next.page);
  const s = qs.toString();
  return s ? `/veille?${s}` : "/veille";
}

/** Filtres + liste : lisent l'adresse (?categorie=, ?culture=, ?page=), donc rendus à la demande. */
async function NewsResults({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const [{ categories, crops }, { items, total }] = await Promise.all([
    getNewsFilters(),
    getNews({ category: params.categorie, crop: params.culture, page }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / NEWS_PAGE_SIZE));
  const filtered = Boolean(params.categorie || params.culture);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <FilterChips
          label="Filtrer par thème"
          activeValue={params.categorie ?? "tout"}
          items={[
            {
              value: "tout",
              label: "Tous les thèmes",
              href: hrefFor(params, { categorie: undefined, page: undefined }),
            },
            ...categories.map((c) => ({
              value: c.slug,
              label: c.name,
              href: hrefFor(params, { categorie: c.slug, page: undefined }),
            })),
          ]}
        />
        <FilterChips
          label="Filtrer par culture"
          activeValue={params.culture ?? "toutes"}
          items={[
            {
              value: "toutes",
              label: "Toutes les cultures",
              href: hrefFor(params, { culture: undefined, page: undefined }),
            },
            ...crops.map((c) => ({
              value: c.slug,
              label: c.name,
              href: hrefFor(params, { culture: c.slug, page: undefined }),
            })),
          ]}
        />
      </div>

      {!(items.length === 0 && page > 1) && (
        <p className="text-meta text-ink-soft" aria-live="polite">
          {total === 0 ? "Aucune information" : `${total} information${total > 1 ? "s" : ""}`}
          {filtered && " pour ces filtres"}
        </p>
      )}

      {items.length === 0 && page > 1 ? (
        <EmptyState
          title="Cette page n'existe pas"
          action={
            <Button href={hrefFor(params, { page: undefined })} variant="secondary">
              Revenir à la première page
            </Button>
          }
        />
      ) : items.length === 0 ? (
        <EmptyState title={filtered ? "Rien pour ces filtres pour le moment" : "La veille se remplit"}>
          {filtered
            ? "Essayez un autre thème ou une autre culture. De nouvelles informations sont collectées toutes les deux heures."
            : "Les informations sont collectées automatiquement toutes les deux heures auprès de nos sources."}
        </EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((it) => (
            <li key={it.id} className="flex">
              <NewsListItem item={it} />
            </li>
          ))}
        </ul>
      )}

      <Pagination page={page} totalPages={totalPages} hrefFor={(p) => hrefFor(params, { page: String(p) })} />
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Chargement de la veille">
      {Array.from({ length: 4 }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

async function Sources() {
  const sources = await getNewsSources();
  if (sources.length === 0) return null;
  return (
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
  );
}

export default function VeillePage({ searchParams }: PageProps<"/veille">) {
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
        <Suspense fallback={<ResultsSkeleton />}>
          <NewsResults searchParams={searchParams as Promise<Search>} />
        </Suspense>
      </Section>

      <Section tone="sand" labelledBy="t-sources">
        <SectionHeading
          id="t-sources"
          eyebrow="Transparence"
          title="Nos sources"
          intro="Institutions publiques et presse ivoirienne. Les sujets issus de la presse généraliste sont relus avant publication."
        />
        <Suspense fallback={null}>
          <Sources />
        </Suspense>
        <Alert tone="info" title="Droits des auteurs" className="mt-6">
          AFA ne reproduit jamais les articles : seuls le titre, un court extrait et le lien vers la source
          sont affichés. Pour lire l&apos;article complet, rendez-vous sur le site de son auteur.
        </Alert>
      </Section>
    </>
  );
}
