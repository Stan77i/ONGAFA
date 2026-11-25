import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InkMark } from "@/components/brand/InkUnderline";
import { ValueChain } from "@/components/brand/ValueChain";
import { DomainIcon } from "@/components/content/DomainIcon";
import { KeyFigure } from "@/components/content/KeyFigure";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { StatusPill } from "@/components/map/StatusPill";
import { Button } from "@/components/ui/Button";
import { links } from "@/config/navigation";
import { site } from "@/config/site";
import { VALUE_CHAIN_STEPS } from "@/components/brand/ValueChain";
import { cassava, domains, president, results, territories } from "@/content/afa";

/**
 * Accueil (phase 3). Sections affichées uniquement si leur contenu existe :
 * veille, communauté, agenda, témoignages et partenaires s'ajouteront à leur phase.
 */
export default function HomePage() {
  return (
    <>
      {/* B — Ouverture (version sans photo, en attendant les photos de l'ONG) */}
      <section className="relative overflow-hidden bg-cream">
        <Container className="grid items-center gap-10 py-12 sm:py-20 lg:grid-cols-[1.25fr_1fr] lg:py-24">
          <div className="space-y-6">
            <p className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">
              ONG ivoirienne · depuis 2016
            </p>
            <h1 className="font-display text-display font-semibold text-forest">
              Valoriser la terre pour <InkMark>nourrir la Nation</InkMark>
            </h1>
            <p className="max-w-xl text-body text-ink">
              L&apos;ONG {site.name} œuvre pour l&apos;autonomisation économique des femmes et des communautés
              rurales, en structurant la filière manioc de la plantation à la transformation.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                href="/a-propos"
                size="lg"
                iconAfter={<ArrowRight className="size-5" aria-hidden="true" />}
              >
                Découvrir AFA
              </Button>
              <Button href={links.join} size="lg" variant="accent">
                Rejoindre le réseau
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[14rem] sm:max-w-sm lg:max-w-none" aria-hidden="true">
            <div className="absolute inset-[8%] rounded-full bg-white/70" />
            <Image
              src={site.logos.symbol}
              alt=""
              width={560}
              height={560}
              priority
              sizes="(min-width: 1024px) 40vw, 80vw"
              className="relative mx-auto w-full max-w-md mix-blend-multiply"
            />
          </div>
        </Container>
        <div className="border-t border-rule bg-white/60">
          <Container className="flex flex-col gap-1 py-4 text-meta text-ink-soft sm:flex-row sm:flex-wrap sm:gap-x-6">
            <span>
              Reconnue sous le <strong className="font-semibold text-ink">{site.registration}</strong>
            </span>
            <span>
              Présidée par{" "}
              <strong className="font-semibold text-ink">
                {president.title} {president.name}
              </strong>
            </span>
          </Container>
        </div>
      </section>

      {/* Réalisations — la preuve d'abord */}
      <Section tone="forest" labelledBy="t-resultats">
        <SectionHeading
          id="t-resultats"
          onDark
          eyebrow="Nos réalisations"
          title="Une dizaine d'années d'action dans le N'Zi"
          intro="Né dans la région du N'Zi, AFA y a bâti un modèle complet autour du manioc : plantations, transformation et coopératives."
          action={
            <Button href="/a-propos#realisations" variant="on-dark">
              Voir le bilan
            </Button>
          }
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

      {/* C — AFA en action */}
      <Section labelledBy="t-actions">
        <SectionHeading
          id="t-actions"
          eyebrow="AFA en action"
          title="Nos domaines d'intervention"
          intro="Le manioc est notre axe prioritaire. Autour de lui, AFA agit sur tout ce qui permet aux femmes et aux producteurs de vivre de leur travail."
          action={
            <Button href="/actions" variant="secondary">
              Toutes nos actions
            </Button>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((d, i) => {
            const featured = i === 0;
            const body = (
              <>
                <DomainIcon name={d.icon} className={featured ? "bg-white text-forest" : undefined} />
                <h3
                  className={`font-display text-h3 font-semibold ${featured ? "text-white" : "text-forest"}`}
                >
                  {d.title}
                </h3>
                <p className={featured ? "text-sand" : "text-ink-soft"}>{d.text}</p>
              </>
            );
            const cls = `flex h-full flex-col gap-3 rounded-card p-5 ring-1 ${
              featured ? "on-dark bg-afa ring-afa" : "bg-white text-ink ring-rule"
            }`;
            return (
              <li
                key={d.slug}
                className={
                  featured
                    ? "sm:col-span-2 lg:row-span-2"
                    : i === domains.length - 1
                      ? "lg:col-span-2"
                      : undefined
                }
              >
                {"href" in d ? (
                  <Link href={d.href} className={`${cls} group transition-shadow hover:shadow-raised`}>
                    {body}
                    <div className="mt-4 border-t border-white/20 pt-5">
                      <p className="font-display text-h2 font-semibold text-white">
                        {results.items[0].value}
                      </p>
                      <p className="text-sand">{results.items[0].label}</p>
                      <p className="text-meta text-leaf-light">
                        {results.period} · Source : {results.source}
                      </p>
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Chaîne de valeur">
                      {VALUE_CHAIN_STEPS.slice(0, 6).map((s) => (
                        <li
                          key={s.key}
                          className="rounded-full bg-white/12 px-3 py-1 text-meta font-semibold text-white"
                        >
                          {s.label}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-2 pt-2 font-semibold text-white group-hover:underline">
                      Explorer l&apos;espace manioc <ArrowRight className="size-5" aria-hidden="true" />
                    </span>
                  </Link>
                ) : (
                  <div className={cls}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      {/* D — Ancrage territorial (la carte interactive arrive en phase 4) */}
      <Section tone="sand" labelledBy="t-territoires">
        <SectionHeading
          id="t-territoires"
          eyebrow="Déploiement national"
          title="Du N'Zi à toute la Côte d'Ivoire"
          intro="Après sa région d'origine, AFA prévoit de se déployer dans la Nawa, puis progressivement dans les autres régions du pays."
        />
        <ol className="grid gap-4 md:grid-cols-3">
          {territories.map((t, i) => (
            <li
              key={t.name}
              className="relative flex flex-col gap-3 rounded-card bg-white p-5 text-ink ring-1 ring-rule"
            >
              <span
                className="font-display text-h2 leading-none font-semibold text-accent/70"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <StatusPill status={t.status} className="self-start" />
              <h3 className="font-display text-h3 font-semibold text-forest">{t.name}</h3>
              <p className="text-ink-soft">{t.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* H — Manioc et transformation */}
      <Section tone="cream" labelledBy="t-manioc">
        <SectionHeading
          id="t-manioc"
          eyebrow="Filière manioc"
          title="Du champ aux produits finis"
          intro="AFA veut agir sur toute la chaîne de valeur du manioc, pour que la valeur créée profite d'abord aux productrices et aux producteurs."
          action={
            <Button href="/manioc" variant="secondary">
              L&apos;espace manioc
            </Button>
          }
        />
        <ValueChain />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cassava.derivatives.map((g) => (
            <li key={g.group}>
              <Link
                href="/manioc#derives"
                className="group flex h-full flex-col gap-2 rounded-card bg-white p-5 text-ink ring-1 ring-rule transition-shadow hover:shadow-raised"
              >
                <span className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">
                  {g.items.length} dérivés
                </span>
                <span className="font-display text-h3 font-semibold text-forest group-hover:underline">
                  {g.group}
                </span>
                <span className="text-meta text-ink-soft">{g.items.slice(0, 3).join(" · ")}…</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* F — Rejoindre le réseau */}
      <Section labelledBy="t-rejoindre">
        <div className="grid items-center gap-8 rounded-card bg-accent/15 p-6 ring-1 ring-accent/30 sm:p-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <p className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">
              Le réseau AFA
            </p>
            <h2 id="t-rejoindre" className="font-display text-h2 font-semibold text-forest">
              Productrices, producteurs, coopératives, commerçantes : faites partie du réseau
            </h2>
            <p className="text-ink-soft">
              AFA rassemble les acteurs du manioc et du vivrier pour créer des débouchés, des formations et
              des opportunités de financement.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button href={links.join} size="lg" variant="accent">
              Rejoindre AFA
            </Button>
            <Button href="/actions" variant="ghost">
              Découvrir nos actions
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
