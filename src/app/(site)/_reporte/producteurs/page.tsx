import type { Metadata } from "next";
import { Suspense } from "react";
import { ProducerCard } from "@/components/content/ProducerCard";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { Pagination } from "@/components/ui/Pagination";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { getSessionUser } from "@/lib/auth/session";
import { DIRECTORY_PAGE_SIZE, getCrops, getRegions, listProducers } from "@/lib/producers/data";

export const metadata: Metadata = {
  title: "Annuaire des producteurs",
  description: "L'annuaire des productrices et producteurs du réseau AFA, réservé aux membres connectés.",
  robots: { index: false },
};

type Search = { region?: string; culture?: string; page?: string };

function hrefFor(p: Search, patch: Partial<Search>) {
  const n = { ...p, ...patch };
  const qs = new URLSearchParams();
  if (n.region) qs.set("region", n.region);
  if (n.culture) qs.set("culture", n.culture);
  if (n.page && n.page !== "1") qs.set("page", n.page);
  const s = qs.toString();
  return s ? `/producteurs?${s}` : "/producteurs";
}

async function Directory({ searchParams }: { searchParams: Promise<Search> }) {
  const user = await getSessionUser();
  if (!user) {
    return (
      <EmptyState
        title="Annuaire réservé aux membres"
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/connexion?next=/producteurs">Se connecter</Button>
            <Button href="/creer-un-compte?next=/producteurs" variant="secondary">
              Créer un compte
            </Button>
          </div>
        }
      >
        Pour protéger les producteurs, l&apos;annuaire n&apos;est visible que des membres connectés du réseau
        AFA.
      </EmptyState>
    );
  }
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const [regions, crops, { items, total }] = await Promise.all([
    getRegions(),
    getCrops(),
    listProducers({ region: params.region, crop: params.culture, page }),
  ]);
  return (
    <div className="space-y-6">
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
      <form action="/producteurs" className="flex flex-col gap-2 sm:flex-row sm:items-end">
        {params.culture && <input type="hidden" name="culture" value={params.culture} />}
        <label className="flex-1 font-semibold text-ink">
          Région
          <select
            name="region"
            defaultValue={params.region ?? ""}
            className="mt-1 block min-h-12 w-full rounded-field border-2 border-field bg-white px-3"
          >
            <option value="">Toutes les régions</option>
            {regions.map((r) => (
              <option key={r.id} value={r.slug}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="secondary">
          Filtrer
        </Button>
      </form>
      <p className="text-meta text-ink-soft" aria-live="polite">
        {total} producteur{total > 1 ? "s" : ""}
      </p>
      {items.length === 0 ? (
        <EmptyState
          title="Aucun producteur pour ces critères"
          action={
            <Button href="/producteurs/inscription" variant="accent">
              Créer ma fiche
            </Button>
          }
        >
          L&apos;annuaire s&apos;enrichit à chaque inscription.
        </EmptyState>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <li key={p.slug}>
              <ProducerCard
                producer={{
                  href: `/producteurs/${p.slug}`,
                  name: p.name,
                  place: p.place,
                  crops: p.crops,
                  verified: p.verified,
                }}
              />
            </li>
          ))}
        </ul>
      )}
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / DIRECTORY_PAGE_SIZE))}
        hrefFor={(n) => hrefFor(params, { page: String(n) })}
      />
    </div>
  );
}

export default function DirectoryPage({ searchParams }: PageProps<"/producteurs">) {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/producteurs", label: "Producteurs" },
        ]}
        eyebrow="Le réseau AFA"
        title="Annuaire des producteurs"
        intro={
          <p>Productrices et producteurs de manioc et de vivrier du réseau AFA, par culture et par région.</p>
        }
      >
        <Button href="/producteurs/inscription" variant="accent">
          Je suis producteur / productrice
        </Button>
      </PageHero>
      <Section labelledBy="t-annuaire">
        <h2 id="t-annuaire" className="sr-only">
          Producteurs
        </h2>
        <Suspense fallback={<CardSkeleton />}>
          <Directory searchParams={searchParams as Promise<Search>} />
        </Suspense>
      </Section>
    </>
  );
}
