import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import { InkMark, InkUnderline } from "@/components/brand/InkUnderline";
import { ValueChain } from "@/components/brand/ValueChain";
import { ArticleCard } from "@/components/content/ArticleCard";
import { DerivativeCard } from "@/components/content/DerivativeCard";
import { DiscussionCard } from "@/components/content/DiscussionCard";
import { EventCard } from "@/components/content/EventCard";
import { DataStamp, KeyFigure } from "@/components/content/KeyFigure";
import { OpportunityCard } from "@/components/content/OpportunityCard";
import { PriceTable } from "@/components/content/PriceTable";
import { ProducerCard } from "@/components/content/ProducerCard";
import { ResourceCard } from "@/components/content/ResourceCard";
import { TestimonialQuote } from "@/components/content/TestimonialQuote";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { Field } from "@/components/forms/Field";
import { ChoiceChips, Input, Select, Textarea } from "@/components/forms/Inputs";
import { Stepper } from "@/components/forms/Stepper";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Section, SectionHeading } from "@/components/layout/Section";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MapLegend } from "@/components/map/StatusPill";
import { TerritoryPanel } from "@/components/map/TerritoryPanel";
import { Alert } from "@/components/ui/Alert";
import { Badge, ExternalSourceBadge, VerifiedBadge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { ModalDemo } from "./ModalDemo";

export const metadata: Metadata = {
  title: "Design system (interne)",
  robots: { index: false, follow: false },
};

/** Page interne de démonstration. Invisible en production sauf SHOW_DESIGN_SYSTEM=1. */
export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production" && process.env.SHOW_DESIGN_SYSTEM !== "1") notFound();

  const colors = [
    ["Vert forêt", "bg-forest", "#2c4520", "text-white"],
    ["Vert AFA", "bg-afa", "#4a7230", "text-white"],
    ["Vert feuille", "bg-leaf", "#59883c", "text-white"],
    ["Orange AFA", "bg-accent", "#df8433", "text-ink"],
    ["Orange texte", "bg-accent-text", "#9a4c15", "text-white"],
    ["Latérite", "bg-laterite", "#8c4a2f", "text-white"],
    ["Or récolte", "bg-harvest", "#e9b44c", "text-ink"],
    ["Sable", "bg-sand", "#f7f2e8", "text-ink"],
    ["Crème manioc", "bg-cream", "#efe6d2", "text-ink"],
    ["Encre", "bg-ink", "#1d2417", "text-white"],
  ] as const;

  return (
    <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <SiteHeader />
      <main id="contenu">
        <div className="bg-harvest/30 px-4 py-3 text-center text-meta font-semibold text-ink">
          Page interne de démonstration — tous les contenus ci-dessous sont fictifs et servent uniquement à
          montrer les composants.
        </div>

        {/* Ouverture */}
        <section className="bg-cream py-16 sm:py-24">
          <div className="mx-auto max-w-[75rem] space-y-6 px-4 sm:px-6 lg:px-8">
            <p className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">
              Design system · Terre et trait
            </p>
            <h1 className="max-w-4xl font-display text-display font-semibold text-forest">
              Valoriser la terre pour <InkMark>nourrir la Nation</InkMark>
            </h1>
            <p className="max-w-2xl text-body text-ink-soft">
              Fraunces pour les titres, Source Sans 3 pour la lecture. Texte de base à 17 px, lignes limitées
              à environ 68 caractères.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                iconAfter={<ArrowRight className="size-5" aria-hidden="true" />}
                href="#couleurs"
              >
                Découvrir AFA
              </Button>
              <Button size="lg" variant="accent" href="#formulaires">
                Rejoindre le réseau
              </Button>
            </div>
          </div>
        </section>

        <Section id="couleurs" labelledBy="t-couleurs">
          <SectionHeading
            id="t-couleurs"
            eyebrow="Fondations"
            title="Couleurs"
            intro="Contrastes vérifiés (WCAG AA). L'orange ne porte jamais de texte blanc."
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {colors.map(([name, bg, hex, fg]) => (
              <li
                key={hex}
                className={`${bg} ${fg} flex aspect-[4/3] flex-col justify-end rounded-card p-3 ring-1 ring-rule`}
              >
                <span className="font-semibold">{name}</span>
                <span className="text-meta opacity-90">{hex}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section tone="sand" labelledBy="t-typo">
          <SectionHeading id="t-typo" eyebrow="Fondations" title="Typographie" />
          <div className="space-y-4">
            <p className="font-display text-display font-semibold text-forest">Titre d&apos;accueil</p>
            <p className="font-display text-h1 font-semibold text-forest">Titre de niveau 1</p>
            <p className="font-display text-h2 font-semibold text-forest">Titre de niveau 2</p>
            <p className="text-h3 font-bold text-ink">Titre de niveau 3</p>
            <p className="max-w-[68ch]">
              Texte courant : le manioc est cultivé dans de nombreuses régions de Côte d&apos;Ivoire. Ce
              paragraphe montre la taille, l&apos;interligne et la longueur de ligne retenues pour un confort
              de lecture sur téléphone.
            </p>
            <p className="text-meta font-semibold tracking-[0.12em] text-ink-soft uppercase">
              Mention · 25 novembre 2026
            </p>
            <div className="w-64">
              <p className="font-display text-lg text-forest italic">Trait d&apos;encre</p>
              <InkUnderline color="#df8433" />
            </div>
          </div>
        </Section>

        <Section labelledBy="t-actions">
          <SectionHeading id="t-actions" eyebrow="Composants" title="Boutons et étiquettes" />
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Button>Principal</Button>
              <Button variant="accent">Rejoindre AFA</Button>
              <Button variant="secondary">Secondaire</Button>
              <Button variant="ghost">Lien discret</Button>
              <Button variant="danger">Supprimer</Button>
              <Button loading>Envoyer</Button>
              <Button disabled>Désactivé</Button>
              <Button icon={<Plus className="size-5" aria-hidden="true" />}>Publier</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="category">Actualité</Badge>
              <Badge tone="crop">Manioc</Badge>
              <VerifiedBadge />
              <ExternalSourceBadge />
              <Badge tone="warning">Non vérifié</Badge>
              <Badge>Neutre</Badge>
            </div>
            <MapLegend />
            <div className="rounded-card bg-forest p-6">
              <Button variant="on-dark">Bouton sur fond sombre</Button>
            </div>
          </div>
        </Section>

        <Section tone="sand" labelledBy="t-chaine">
          <SectionHeading
            id="t-chaine"
            eyebrow="Signature"
            title="Chaîne de valeur du manioc"
            intro="Fil visuel récurrent : vertical sur mobile, horizontal sur grand écran."
          />
          <ValueChain current="transformation" />
        </Section>

        <Section labelledBy="t-cartes">
          <SectionHeading
            id="t-cartes"
            eyebrow="Composants"
            title="Cartes de contenu"
            action={
              <Button variant="secondary" href="#t-cartes">
                Voir tout
              </Button>
            }
          />
          <FilterChips
            label="Catégories (exemple)"
            activeValue="tout"
            items={[
              { value: "tout", label: "Tout", href: "#t-cartes" },
              { value: "manioc", label: "Manioc", href: "#t-cartes" },
              { value: "prix", label: "Prix", href: "#t-cartes" },
              { value: "evenements", label: "Événements", href: "#t-cartes" },
              { value: "opportunites", label: "Opportunités", href: "#t-cartes" },
            ]}
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ArticleCard
              featured
              article={{
                href: "#",
                title: "Exemple : titre d'un article à la une sur la filière manioc",
                excerpt:
                  "Résumé fictif de deux ou trois lignes, pour montrer la longueur maximale affichée sur la carte avant la coupure.",
                category: "Manioc",
                publishedAt: "2026-11-20T09:00:00Z",
                source: "ONG AFA",
              }}
            />
            <ArticleCard
              article={{
                href: "#",
                title: "Exemple : information de veille provenant d'une source externe",
                excerpt:
                  "Extrait court, avec lien vers la source d'origine. Jamais de copie de l'article complet.",
                category: "Veille",
                publishedAt: "2026-11-18T09:00:00Z",
                source: "Nom de la source",
                external: true,
              }}
            />
            <CardSkeleton />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <EventCard
              event={{
                href: "#",
                title: "Exemple : journée de formation",
                startsAt: "2026-12-12T09:00:00Z",
                place: "Ville exemple",
                kind: "Formation",
                registrationOpen: true,
              }}
            />
            <DiscussionCard
              discussion={{
                href: "#",
                question: "Exemple : quelle variété choisir pour un sol sableux ?",
                authorName: "Membre Exemple",
                place: "Ville exemple",
                crop: "Manioc",
                replies: 0,
                askedAt: "2026-11-24T10:00:00Z",
              }}
            />
            <OpportunityCard
              opportunity={{
                href: "#",
                title: "Exemple : appel à projets",
                kind: "Financement",
                organization: "Organisme exemple",
                deadline: "2027-01-31T23:59:00Z",
                verified: true,
              }}
            />
            <ResourceCard
              resource={{
                href: "#",
                title: "Exemple : fiche technique",
                kind: "fiche",
                sizeLabel: "PDF · 1,2 Mo",
                crop: "Manioc",
              }}
            />
            <ProducerCard
              producer={{
                href: "#",
                name: "Productrice Exemple",
                place: "Village exemple",
                crops: ["Manioc", "Maïs"],
                verified: true,
              }}
            />
          </div>
        </Section>

        <Section tone="cream" labelledBy="t-manioc">
          <SectionHeading id="t-manioc" eyebrow="Manioc" title="Dérivés et transformation" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Attiéké", "Gari", "Placali", "Amidon"].map((n) => (
              <DerivativeCard key={n} name={n} description="Description fictive du dérivé." href="#" />
            ))}
          </div>
        </Section>

        <Section tone="forest" labelledBy="t-carte">
          <SectionHeading
            id="t-carte"
            onDark
            eyebrow="Carte nationale"
            title="Composants de carte"
            intro="La carte interactive arrive en phase 4 ; voici la légende et la fiche de territoire."
          />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <MapLegend />
              <KeyFigure onDark value="00" label="Chiffre clé fictif" asOf="2026-11-25" source="exemple" />
            </div>
            <TerritoryPanel
              territory={{
                name: "Ville exemple",
                region: "Région exemple",
                status: "in_progress",
                activities: ["Activité exemple"],
                href: "#",
              }}
            />
          </div>
        </Section>

        <Section labelledBy="t-donnees">
          <SectionHeading
            id="t-donnees"
            eyebrow="Données"
            title="Prix et fraîcheur"
            intro="Chaque prix porte sa date, sa source et son statut. Valeurs fictives."
          />
          <PriceTable
            caption="Exemple de tableau de prix (données fictives)"
            rows={[
              {
                product: "Produit A",
                market: "Marché exemple",
                unit: "kg",
                amount: 100,
                observedOn: "2026-11-20",
                source: "Source exemple",
                verified: true,
                trend: "stable",
              },
              {
                product: "Produit B",
                market: "Marché exemple",
                unit: "sac",
                amount: 1000,
                observedOn: "2026-11-19",
                source: "Source exemple",
                verified: false,
                trend: "up",
              },
            ]}
          />
          <DataStamp className="mt-3" updatedAt="2026-11-25" source="exemple" />
        </Section>

        <Section tone="sand" labelledBy="t-temoignage">
          <SectionHeading id="t-temoignage" eyebrow="Composants" title="Témoignage" />
          <TestimonialQuote
            testimonial={{
              quote: "Citation fictive pour montrer la mise en forme d'un témoignage validé.",
              name: "Personne Exemple",
              place: "Village exemple",
              activity: "Productrice",
              date: "2026-11-01",
            }}
          />
        </Section>

        <Section labelledBy="formulaires" id="formulaires">
          <SectionHeading
            id="t-formulaires"
            eyebrow="Composants"
            title="Formulaires"
            intro="Une question par écran sur mobile, grandes zones tactiles, erreurs sous le champ."
          />
          <form className="max-w-xl space-y-6">
            <Stepper current={2} total={4} title="Vos cultures" />
            <Field id="ds-nom" label="Nom et prénom" required>
              {({ id, describedBy, invalid }) => (
                <Input id={id} aria-describedby={describedBy} aria-invalid={invalid} autoComplete="name" />
              )}
            </Field>
            <Field
              id="ds-tel"
              label="Téléphone"
              optional
              hint="Visible seulement par vous et l'administrateur AFA, pour vous contacter."
              error="Ce numéro semble incomplet."
            >
              {({ id, describedBy, invalid }) => (
                <Input
                  id={id}
                  type="tel"
                  inputMode="tel"
                  aria-describedby={describedBy}
                  aria-invalid={invalid}
                />
              )}
            </Field>
            <Field id="ds-region" label="Région">
              {({ id, describedBy }) => (
                <Select id={id} aria-describedby={describedBy} defaultValue="">
                  <option value="" disabled>
                    Choisir une région
                  </option>
                  <option>Région exemple</option>
                </Select>
              )}
            </Field>
            <ChoiceChips
              legend="Quelles cultures produisez-vous ?"
              name="cultures"
              hint="Plusieurs choix possibles."
              defaultValue={["manioc"]}
              options={[
                { value: "manioc", label: "Manioc" },
                { value: "mais", label: "Maïs" },
                { value: "igname", label: "Igname" },
                { value: "plantain", label: "Banane plantain" },
                { value: "riz", label: "Riz" },
                { value: "legumes", label: "Légumes" },
              ]}
            />
            <Field id="ds-besoin" label="Votre besoin" optional>
              {({ id, describedBy }) => <Textarea id={id} aria-describedby={describedBy} />}
            </Field>
            <ConsentCheckbox name="consentement" version="exemple">
              J&apos;accepte que l&apos;ONG AFA conserve ces informations et me contacte au sujet de mon
              activité.
            </ConsentCheckbox>
          </form>
        </Section>

        <Section tone="sand" labelledBy="t-retours">
          <SectionHeading id="t-retours" eyebrow="Composants" title="Retours et navigation" />
          <div className="space-y-4">
            <Breadcrumb
              items={[
                { href: "#", label: "Accueil" },
                { href: "#", label: "Manioc" },
                { href: "#", label: "Transformation" },
              ]}
            />
            <Alert tone="info" title="Information">
              Message d&apos;information.
            </Alert>
            <Alert tone="success" title="Inscription enregistrée">
              Nous vous contacterons bientôt.
            </Alert>
            <Alert tone="warning" title="Donnée non vérifiée">
              Ce prix n&apos;a pas encore été vérifié par AFA.
            </Alert>
            <Alert tone="error" title="Envoi impossible">
              Vérifiez votre connexion puis réessayez.
            </Alert>
            <ModalDemo />
            <EmptyState
              title="Pas encore d'événement dans votre région"
              action={<Button variant="secondary">Être prévenu</Button>}
            >
              Les prochains rendez-vous apparaîtront ici dès leur publication.
            </EmptyState>
          </div>
        </Section>
      </main>
      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
