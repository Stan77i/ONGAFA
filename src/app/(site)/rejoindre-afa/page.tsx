import type { Metadata } from "next";
import { Factory, GraduationCap, Handshake, ShoppingBasket, Sprout, Store, Truck, Users } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Rejoindre AFA",
  description:
    "Productrices, producteurs, coopératives, commerçantes, transformateurs, acheteurs, jeunes, partenaires : rejoignez le réseau de l'ONG AFA.",
};

const profiles = [
  { icon: Sprout, label: "Productrice ou producteur", text: "Manioc, maïs ou autres cultures vivrières." },
  { icon: Users, label: "Coopérative", text: "Groupement de producteurs ou de productrices." },
  { icon: Store, label: "Commerçante", text: "Commercialisation des produits vivriers et dérivés." },
  {
    icon: Factory,
    label: "Transformatrice ou transformateur",
    text: "Attiéké, gari, placali, farine, amidon…",
  },
  { icon: ShoppingBasket, label: "Acheteur", text: "Grossiste, centrale d'achat, entreprise." },
  { icon: Truck, label: "Transporteur", text: "Collecte, transport et conservation." },
  { icon: GraduationCap, label: "Jeune", text: "Formation et insertion dans la filière." },
  {
    icon: Handshake,
    label: "Partenaire ou institution",
    text: "Organisation, collectivité, structure d'encadrement.",
  },
] as const;

/**
 * Version statique (site publié sur GitHub Pages) : présentation des profils, sans formulaire.
 * Le formulaire d'adhésion et l'inscription producteur sont prêts dans `_reporte/` (réactivation : docs/DEPLOIEMENT.md).
 */
export default function JoinPage() {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/rejoindre-afa", label: "Rejoindre AFA" },
        ]}
        eyebrow="Le réseau AFA"
        title="Rejoindre AFA"
        intro={
          <p>
            AFA rassemble tous les acteurs de la filière manioc et du vivrier, du champ jusqu&apos;au marché.
          </p>
        }
      />
      <Section labelledBy="t-profils">
        <Alert tone="info" title="Inscriptions en ligne bientôt ouvertes" className="mb-10">
          L&apos;inscription en ligne sera disponible prochainement sur cette page : environ deux minutes,
          depuis votre téléphone.
        </Alert>
        <h2 id="t-profils" className="mb-6 font-display text-h2 font-semibold text-forest">
          Qui peut rejoindre le réseau ?
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profiles.map(({ icon: Icon, label, text }) => (
            <li
              key={label}
              className="flex flex-col gap-3 rounded-card bg-white p-5 text-ink ring-1 ring-rule"
            >
              <span className="grid size-12 place-items-center rounded-full bg-leaf/12 text-afa">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <p className="font-semibold text-ink">{label}</p>
              <p className="text-meta text-ink-soft">{text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/a-propos" variant="secondary">
            Découvrir l&apos;ONG AFA
          </Button>
          <Button href="/actions" variant="ghost">
            Nos domaines d&apos;action
          </Button>
        </div>
      </Section>
    </>
  );
}
