import type { Metadata } from "next";
import { Suspense } from "react";
import { TestimonialQuote } from "@/components/content/TestimonialQuote";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { getTestimonials } from "@/lib/community/data";

export const metadata: Metadata = {
  title: "La parole aux producteurs",
  description:
    "Témoignages de productrices, producteurs et acteurs du manioc et du vivrier accompagnés par l'ONG AFA.",
};

async function List() {
  const items = await getTestimonials();
  if (items.length === 0) {
    return (
      <EmptyState
        title="Les premiers témoignages arrivent"
        action={
          <Button href="/temoignages/proposer" variant="accent">
            Partager mon expérience
          </Button>
        }
      >
        Chaque témoignage est publié avec l&apos;accord de son auteur, après relecture par l&apos;équipe AFA.
      </EmptyState>
    );
  }
  return (
    <ul className="space-y-16">
      {items.map((t) => (
        <li key={t.id}>
          <TestimonialQuote
            testimonial={{
              quote: t.quote,
              name: t.name,
              place: t.place,
              activity: t.activity,
              date: t.publishedAt,
            }}
          />
        </li>
      ))}
    </ul>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/temoignages", label: "Témoignages" },
        ]}
        eyebrow="Témoignages"
        title="La parole aux producteurs"
        intro={<p>Ce que vivent les femmes et les producteurs du réseau AFA, raconté par eux-mêmes.</p>}
      >
        <Button href="/temoignages/proposer" variant="accent">
          Partager mon expérience
        </Button>
      </PageHero>
      <Section tone="sand" labelledBy="t-temoignages">
        <h2 id="t-temoignages" className="sr-only">
          Témoignages publiés
        </h2>
        <Suspense fallback={<CardSkeleton />}>
          <List />
        </Suspense>
      </Section>
    </>
  );
}
