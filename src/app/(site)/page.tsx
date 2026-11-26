import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InkMark } from "@/components/brand/InkUnderline";
import { ValueChain } from "@/components/brand/ValueChain";
import { DomainIcon } from "@/components/content/DomainIcon";
import { KeyFigure } from "@/components/content/KeyFigure";
import { Container, Section, SectionHeading } from "@/components/layout/Section";
import { MapLegend } from "@/components/map/StatusPill";
import { NationalMap } from "@/components/map/NationalMap";
import { getAfaMapPoints } from "@/lib/map/data";
import { NewsListItem } from "@/components/content/NewsListItem";
import { getNews } from "@/lib/content/data";
import { getTestimonials, listPosts } from "@/lib/community/data";
import { DiscussionCard } from "@/components/content/DiscussionCard";
import { TestimonialQuote } from "@/components/content/TestimonialQuote";
import { Button } from "@/components/ui/Button";
import { links } from "@/config/navigation";
import { site } from "@/config/site";
import { VALUE_CHAIN_STEPS } from "@/components/brand/ValueChain";
import { cassava, domains, president, results } from "@/content/afa";

/**
 * Accueil. Sections affichées uniquement si leur contenu existe :
 * communauté, agenda, témoignages et partenaires s'ajouteront à leur phase.
 */
export default async function HomePage() {
  const [points, news, forum, testimonials] = await Promise.all([
    getAfaMapPoints(),
    getNews({ page: 1 }),
    listPosts({ page: 1 }),
    getTestimonials(1),
  ]);
  const latestPosts = forum.items.slice(0, 3);
  const testimonial = testimonials[0];
  const latestNews = news.items.slice(0, 4);

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

      {/* D — Carte nationale (aperçu ; carte interactive sur /carte) */}
      <Section tone="forest" labelledBy="t-territoires">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-6">
            <SectionHeading
              id="t-territoires"
              onDark
              eyebrow="Déploiement national"
              title="Du N'Zi à toute la Côte d'Ivoire"
              intro="Après sa région d'origine, AFA prévoit de se déployer dans la Nawa, puis progressivement dans les autres régions du pays."
            />
            <MapLegend />
            <ul className="space-y-3">
              {points.map((p) => (
                <li key={p.slug} className="rounded-card bg-white/8 p-4 ring-1 ring-white/15">
                  <p className="font-display text-h3 font-semibold text-white">{p.name}</p>
                  {p.description && <p className="text-sand">{p.description}</p>}
                </li>
              ))}
            </ul>
            <Button
              href="/carte"
              variant="on-dark"
              iconAfter={<ArrowRight className="size-5" aria-hidden="true" />}
            >
              Explorer la carte
            </Button>
          </div>
          <Link
            href="/carte"
            aria-label="Ouvrir la carte nationale d'AFA"
            className="block rounded-card bg-sand p-4 transition-transform hover:-translate-y-1 sm:p-6"
          >
            <NationalMap points={points} className="h-auto w-full" />
          </Link>
        </div>
      </Section>

      {/* E — Veille du vivrier (masquée tant qu'aucune information n'est publiée) */}
      {latestNews.length > 0 && (
        <Section labelledBy="t-veille">
          <SectionHeading
            id="t-veille"
            eyebrow="Veille du vivrier"
            title="Les dernières informations agricoles"
            intro="Collectées toutes les deux heures auprès de l'AIP, du CNRA, de l'ANADER et de la presse ivoirienne. Chaque information renvoie vers sa source."
            action={
              <Button href="/veille" variant="secondary">
                Toute la veille
              </Button>
            }
          />
          <ul className="grid gap-4 md:grid-cols-2">
            {latestNews.map((it) => (
              <li key={it.id} className="flex">
                <NewsListItem item={it} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* G — Communauté (masquée tant qu'aucune discussion n'est publiée) */}
      {latestPosts.length > 0 && (
        <Section tone="sand" labelledBy="t-communaute">
          <SectionHeading
            id="t-communaute"
            eyebrow="Communauté"
            title="Les dernières discussions"
            intro="Producteurs, transformatrices, commerçantes et équipe AFA s'entraident."
            action={
              <Button href="/communaute/nouveau" variant="secondary">
                Poser une question
              </Button>
            }
          />
          <ul className="space-y-3">
            {latestPosts.map((p) => (
              <li key={p.id}>
                <DiscussionCard
                  discussion={{
                    href: `/communaute/${p.id}`,
                    question: p.title,
                    authorName: p.authorName,
                    place: p.region ?? undefined,
                    crop: p.crop?.name,
                    replies: p.replyCount,
                    askedAt: p.createdAt,
                  }}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* J — Témoignage (masqué tant qu'aucun témoignage n'est validé) */}
      {testimonial && (
        <Section labelledBy="t-temoignage">
          <h2 id="t-temoignage" className="sr-only">
            La parole aux producteurs
          </h2>
          <TestimonialQuote
            testimonial={{
              quote: testimonial.quote,
              name: testimonial.name,
              place: testimonial.place,
              activity: testimonial.activity,
              date: testimonial.publishedAt,
            }}
          />
          <div className="mt-8 text-center">
            <Button href="/temoignages" variant="ghost">
              Tous les témoignages
            </Button>
          </div>
        </Section>
      )}

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
