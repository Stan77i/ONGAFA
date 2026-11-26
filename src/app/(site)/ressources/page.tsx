import type { Metadata } from "next";
import { Suspense } from "react";
import { ResourceCard } from "@/components/content/ResourceCard";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
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

async function Resources() {
  const resources = await getResources();
  if (resources.length === 0) {
    return (
      <EmptyState
        title="La bibliothèque se constitue"
        action={
          <Button href="/manioc" variant="secondary">
            Découvrir l&apos;espace manioc
          </Button>
        }
      >
        Guides pratiques, fiches techniques et études seront publiés ici, chacun avec sa source.
      </EmptyState>
    );
  }
  return (
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
  );
}

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/ressources", label: "Ressources" },
        ]}
        eyebrow="Bibliothèque"
        title="Ressources"
        intro={
          <p>
            Des documents utiles pour produire, transformer et vendre : guides, fiches techniques, études.
          </p>
        }
      />
      <Section labelledBy="t-ressources">
        <h2 id="t-ressources" className="sr-only">
          Documents
        </h2>
        <Suspense fallback={<CardSkeleton />}>
          <Resources />
        </Suspense>
      </Section>
    </>
  );
}
