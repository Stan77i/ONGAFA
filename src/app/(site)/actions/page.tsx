import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DomainIcon } from "@/components/content/DomainIcon";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { links } from "@/config/navigation";
import { domains, perspectives } from "@/content/afa";

export const metadata: Metadata = {
  title: "Nos actions",
  description:
    "Filière manioc, maïs, transformation agroalimentaire, femmes et revenus, jeunes et formation, coopératives, commercialisation et développement local : les domaines d'intervention de l'ONG AFA.",
};

export default function ActionsPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/actions", label: "Nos actions" },
        ]}
        eyebrow="AFA en action"
        title="Nos domaines d'intervention"
        intro={
          <p>
            Le manioc est l&apos;axe prioritaire d&apos;AFA. Autour de lui, l&apos;ONG agit sur la production,
            la transformation, la formation, l&apos;organisation des producteurs et l&apos;accès aux marchés.
          </p>
        }
      />

      <Section labelledBy="t-domaines">
        <h2 id="t-domaines" className="sr-only">
          Domaines
        </h2>
        <ul className="grid gap-5 md:grid-cols-2">
          {domains.map((d) => (
            <li
              key={d.slug}
              id={d.slug}
              className="flex scroll-mt-24 gap-5 rounded-card bg-white p-6 text-ink ring-1 ring-rule"
            >
              <DomainIcon name={d.icon} />
              <div className="space-y-2">
                <h3 className="font-display text-h3 font-semibold text-forest">{d.title}</h3>
                <p className="text-ink-soft">{d.text}</p>
                {"href" in d && (
                  <Link
                    href={d.href}
                    className="inline-flex min-h-11 items-center gap-2 font-semibold text-afa hover:underline"
                  >
                    Explorer l&apos;espace manioc <ArrowRight className="size-5" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand" labelledBy="t-prochaines">
        <SectionHeading
          id="t-prochaines"
          eyebrow="Prochaines étapes"
          title="Ce qu'AFA prépare"
          intro="Les chantiers annoncés par l'ONG pour accompagner son déploiement national."
        />
        <ol className="grid gap-4 md:grid-cols-2">
          {perspectives.map((p, i) => (
            <li key={p} className="flex gap-4 rounded-card bg-white p-5 text-ink ring-1 ring-rule">
              <span
                className="font-display text-h2 leading-none font-semibold text-accent"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Button href={links.join} variant="accent" size="lg">
            Rejoindre le réseau
          </Button>
        </div>
      </Section>
    </>
  );
}
