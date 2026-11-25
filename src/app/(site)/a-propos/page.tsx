import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { KeyFigure } from "@/components/content/KeyFigure";
import { PresidentCard } from "@/components/content/PresidentCard";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { StatusPill } from "@/components/map/StatusPill";
import { Button } from "@/components/ui/Button";
import { links } from "@/config/navigation";
import { site } from "@/config/site";
import { ambitions, perspectives, purpose, results, territories } from "@/content/afa";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "L'ONG AFA",
  description: `${site.name} : ONG ivoirienne créée en 2016, née dans la région du N'Zi, engagée pour l'autonomisation des femmes et la filière manioc.`,
};

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <CheckCircle2 className="mt-1 size-5 shrink-0 text-afa" aria-hidden="true" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/a-propos", label: "L'ONG AFA" },
        ]}
        eyebrow="Qui sommes-nous"
        title={site.name}
        intro={
          <p>
            Une organisation non gouvernementale ivoirienne qui œuvre pour l&apos;autonomisation économique et
            sociale des femmes et des communautés rurales, avec la filière manioc comme axe prioritaire.
          </p>
        }
      >
        <nav aria-label="Sur cette page" className="flex flex-wrap gap-2 pt-2">
          {[
            ["#histoire", "Histoire"],
            ["#objet", "Notre objet"],
            ["#realisations", "Réalisations"],
            ["#perspectives", "Perspectives"],
            ["#gouvernance", "Gouvernance"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="inline-flex min-h-11 items-center rounded-full border-2 border-rule bg-white px-4 font-semibold text-ink-soft hover:border-afa hover:text-afa"
            >
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section id="histoire" labelledBy="t-histoire">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <SectionHeading id="t-histoire" eyebrow="Notre histoire" title="Née dans le N'Zi en 2016" />
          <div className="space-y-5 text-body">
            <p>
              L&apos;ONG {site.name} ({site.shortName}) a été créée le{" "}
              <time dateTime={site.foundedOn}>{formatDate(site.foundedOn)}</time> et reconnue sous le{" "}
              {site.registration}.
            </p>
            <p>
              Elle est née dans la région du N&apos;Zi, où elle a développé pendant une dizaine d&apos;années
              un modèle centré sur le manioc : plantations, unités de transformation et accompagnement des
              coopératives.
            </p>
            <p>
              Forte de ces résultats, AFA ambitionne aujourd&apos;hui de devenir un acteur de référence de la
              filière manioc en Côte d&apos;Ivoire et de se déployer sur l&apos;ensemble du territoire
              national.
            </p>
          </div>
        </div>
      </Section>

      <Section id="objet" tone="sand" labelledBy="t-objet">
        <SectionHeading
          id="t-objet"
          eyebrow="Notre objet"
          title="Ce pour quoi AFA a été créée"
          intro="Extrait de l'objet de l'association."
        />
        <div className="max-w-3xl">
          <CheckList items={purpose} />
        </div>
      </Section>

      <Section id="realisations" tone="forest" labelledBy="t-realisations">
        <SectionHeading
          id="t-realisations"
          onDark
          eyebrow="Nos réalisations"
          title="Le bilan d'AFA dans le N'Zi"
          intro="Résultats obtenus après une dizaine d'années d'activité, tels que déclarés par l'ONG."
        />
        <div className="grid gap-8 md:grid-cols-3">
          {results.items.map((r) => (
            <KeyFigure
              key={r.label}
              onDark
              value={r.value}
              label={r.label}
              period={results.period}
              source={results.source}
            />
          ))}
        </div>
      </Section>

      <Section id="perspectives" labelledBy="t-perspectives">
        <SectionHeading
          id="t-perspectives"
          eyebrow="Nos perspectives"
          title="Structurer toute la filière manioc"
          intro="Après le N'Zi, AFA prévoit de se déployer dans la Nawa puis progressivement dans les autres régions, en travaillant sur toute la chaîne de valeur avec les structures d'encadrement du secteur."
        />
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-display text-h3 font-semibold text-forest">
              Pour y parvenir, AFA prévoit de :
            </h3>
            <CheckList items={perspectives} />
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-h3 font-semibold text-forest">À terme, AFA vise à :</h3>
            <CheckList items={ambitions} />
          </div>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {territories.map((t) => (
            <li key={t.name} className="space-y-2 rounded-card bg-sand p-5 text-ink ring-1 ring-rule">
              <StatusPill status={t.status} />
              <p className="font-display text-xl font-semibold text-forest">{t.name}</p>
              <p className="text-meta text-ink-soft">{t.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="gouvernance" tone="cream" labelledBy="t-gouvernance">
        <SectionHeading id="t-gouvernance" eyebrow="Gouvernance" title="La présidence de l'ONG" />
        <div className="max-w-2xl">
          <PresidentCard />
        </div>
      </Section>

      <Section labelledBy="t-cta">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="t-cta" className="max-w-2xl font-display text-h2 font-semibold text-forest">
            Vous souhaitez travailler avec AFA ?
          </h2>
          <Button href={links.join} variant="accent" size="lg">
            Rejoindre le réseau
          </Button>
        </div>
      </Section>
    </>
  );
}
