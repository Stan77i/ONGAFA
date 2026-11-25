import type { Metadata } from "next";
import { FlaskConical, Leaf, Sparkles, UtensilsCrossed } from "lucide-react";
import { ValueChain } from "@/components/brand/ValueChain";
import { KeyFigure } from "@/components/content/KeyFigure";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { links } from "@/config/navigation";
import { cassava, results } from "@/content/afa";

export const metadata: Metadata = {
  title: "Le manioc en Côte d'Ivoire",
  description:
    "Manioc doux et manioc amer, variétés cultivées en Côte d'Ivoire (Yavo, Bocou, Olekanga, Bonoua…), attiéké, placali, gari et dérivés alimentaires, pharmaceutiques et cosmétiques.",
};

const groupIcons = {
  Alimentation: UtensilsCrossed,
  Pharmacie: FlaskConical,
  Cosmétique: Sparkles,
  "Toute la plante": Leaf,
} as const;

export default function CassavaPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/manioc", label: "Manioc" },
        ]}
        eyebrow="Espace manioc"
        title="Le manioc en Côte d'Ivoire"
        intro={
          <p>
            Culture vivrière majeure du pays et axe prioritaire d&apos;AFA. De la variété plantée aux dizaines
            de produits qui en sont tirés, tout ce qu&apos;il faut savoir sur le manioc.
          </p>
        }
      >
        <nav aria-label="Sur cette page" className="flex flex-wrap gap-2 pt-2">
          {[
            ["#chaine", "Chaîne de valeur"],
            ["#categories", "Doux ou amer"],
            ["#varietes", "Variétés"],
            ["#usages", "Plats"],
            ["#derives", "Dérivés"],
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

      <Section id="chaine" labelledBy="t-chaine">
        <SectionHeading
          id="t-chaine"
          eyebrow="Chaîne de valeur"
          title="Du champ à l'autonomie des producteurs"
          intro="AFA veut agir à chaque étape, pour que la valeur créée par le manioc profite d'abord à celles et ceux qui le cultivent."
        />
        <ValueChain />
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {results.items.map((r) => (
            <KeyFigure
              key={r.label}
              value={r.value}
              label={r.label}
              period={results.period}
              source={results.source}
            />
          ))}
        </div>
      </Section>

      <Section id="categories" tone="sand" labelledBy="t-categories">
        <SectionHeading
          id="t-categories"
          eyebrow="Bien le connaître"
          title="Manioc doux ou manioc amer"
          intro="En Côte d'Ivoire, le manioc se répartit en deux grandes catégories, auxquelles s'ajoutent des variétés locales traditionnelles et des variétés améliorées diffusées par la recherche agronomique."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {cassava.categories.map((c) => (
            <article key={c.name} className="space-y-2 rounded-card bg-white p-6 text-ink ring-1 ring-rule">
              <h3 className="font-display text-h3 font-semibold text-forest">{c.name}</h3>
              <p className="text-ink-soft">{c.text}</p>
            </article>
          ))}
        </div>
        <Alert tone="warning" title="Sécurité alimentaire" className="mt-6">
          Le manioc amer ne doit jamais être consommé sans traitement : râpage, fermentation, pressage,
          séchage ou cuisson prolongée éliminent ses composés toxiques.
        </Alert>
      </Section>

      <Section id="varietes" labelledBy="t-varietes">
        <SectionHeading id="t-varietes" eyebrow="Variétés" title="Les variétés cultivées en Côte d'Ivoire" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cassava.varieties.map((v) => (
            <li key={v.name} className="space-y-1 rounded-card bg-white p-5 text-ink ring-1 ring-rule">
              <p className="font-display text-xl font-semibold text-forest">{v.name}</p>
              <p className="text-meta text-ink-soft">{v.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="usages" tone="cream" labelledBy="t-usages">
        <SectionHeading id="t-usages" eyebrow="Dans l'assiette" title="Les grands plats à base de manioc" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cassava.dishes.map((d) => (
            <li key={d.name} className="space-y-2 rounded-card bg-white p-5 text-ink ring-1 ring-rule">
              <p className="font-display text-h3 font-semibold text-forest">{d.name}</p>
              <p className="text-meta text-ink-soft">{d.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="derives" labelledBy="t-derives">
        <SectionHeading
          id="t-derives"
          eyebrow="Transformation"
          title="Une plante, des dizaines de produits"
          intro="Le manioc ne nourrit pas seulement : son amidon entre dans des médicaments et des cosmétiques, et chaque partie de la plante peut être valorisée."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {cassava.derivatives.map((g) => {
            const Icon = groupIcons[g.group];
            return (
              <article
                key={g.group}
                className="space-y-4 rounded-card bg-white p-6 text-ink ring-1 ring-rule"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full bg-cream text-afa">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-h3 font-semibold text-forest">{g.group}</h3>
                </div>
                {"intro" in g && <p className="text-meta text-ink-soft">{g.intro}</p>}
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-full bg-sand px-3 py-1.5 text-meta font-semibold text-ink ring-1 ring-rule"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Section>

      <Section tone="forest" labelledBy="t-manioc-cta">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h2 id="t-manioc-cta" className="font-display text-h2 font-semibold text-white">
              Vous produisez ou transformez du manioc ?
            </h2>
            <p className="text-sand">Rejoignez le réseau AFA.</p>
          </div>
          <Button href={links.join} variant="accent" size="lg">
            Rejoindre AFA
          </Button>
        </div>
      </Section>
    </>
  );
}
