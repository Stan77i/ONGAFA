import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Section";
import { CONSENT_VERSION } from "@/config/consent";
import { site } from "@/config/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: `Comment l'ONG ${site.shortName} collecte, utilise et protège vos données personnelles.`,
};

/**
 * Version initiale. À faire relire par un juriste (loi ivoirienne n° 2013-450 du 19 juin 2013 relative à la
 * protection des données à caractère personnel ; autorité de contrôle : ARTCI). Voir docs/DECISIONS.md.
 */
export default function PrivacyPage() {
  const h2 = "font-display text-h3 font-semibold text-forest";
  return (
    <div className="py-10 sm:py-16">
      <Container className="max-w-3xl">
        <article className="space-y-6 text-body [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1">
          <header className="space-y-2">
            <p className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">
              Vos données
            </p>
            <h1 className="font-display text-h1 font-semibold text-forest">Politique de confidentialité</h1>
            <p className="text-meta text-ink-soft">Version du {formatDate(CONSENT_VERSION)}</p>
          </header>

          <section className="space-y-2">
            <h2 className={h2}>Qui est responsable de vos données ?</h2>
            <p>
              L&apos;ONG {site.name} ({site.shortName}), reconnue sous le {site.registration}, en Côte
              d&apos;Ivoire.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className={h2}>Quelles données collectons-nous ?</h2>
            <ul>
              <li>Pour votre compte : votre nom et votre adresse email.</li>
              <li>
                Pour votre fiche producteur : nom ou nom d&apos;exploitation, région, ville et village (jamais
                d&apos;adresse précise), cultures, superficies, production, besoins, présentation et, si vous
                le souhaitez, votre numéro de téléphone.
              </li>
              <li>
                Pour une question ou une demande d&apos;adhésion : votre nom, votre email ou téléphone, et
                votre message.
              </li>
            </ul>
            <p>
              Nous ne demandons que ce qui est utile. Les champs marqués « facultatif » peuvent rester vides.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className={h2}>Pourquoi ?</h2>
            <ul>
              <li>
                Vous référencer dans le réseau AFA et vous mettre en relation avec des acheteurs,
                transformateurs et partenaires.
              </li>
              <li>Vous contacter au sujet de votre activité et répondre à vos questions.</li>
              <li>Vous informer des formations, opportunités et événements qui vous concernent.</li>
            </ul>
            <p>
              Ces traitements reposent sur votre consentement, donné au moment de l&apos;inscription ou de
              l&apos;envoi.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className={h2}>Qui peut voir vos informations ?</h2>
            <ul>
              <li>
                Votre fiche producteur : vous choisissez (seulement AFA, membres connectés, ou tout le monde).
              </li>
              <li>
                Votre numéro de téléphone : seulement vous et l&apos;administration d&apos;AFA, sauf si vous
                choisissez de le partager avec les membres connectés.
              </li>
              <li>
                Vos questions et demandes : seulement vous et l&apos;équipe AFA chargée d&apos;y répondre.
              </li>
            </ul>
            <p>Vos données ne sont jamais vendues.</p>
          </section>

          <section className="space-y-2">
            <h2 className={h2}>Combien de temps ?</h2>
            <p>
              Tant que votre compte existe, ou jusqu&apos;à ce que vous demandiez leur suppression. Les
              actions d&apos;administration sont tracées pour la sécurité de la plateforme.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className={h2}>Vos droits</h2>
            <p>
              Vous pouvez à tout moment consulter et modifier vos informations, demander une copie de vos
              données ou leur suppression, depuis{" "}
              <Link href="/compte" className="font-semibold text-afa underline">
                votre compte
              </Link>
              , ou en écrivant à l&apos;équipe via{" "}
              <Link href="/question-a-afa" className="font-semibold text-afa underline">
                Question à AFA
              </Link>
              . Vous pouvez aussi saisir l&apos;Autorité de Régulation des Télécommunications/TIC de Côte
              d&apos;Ivoire (ARTCI).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className={h2}>Sécurité</h2>
            <p>
              Les données sont hébergées chez Supabase (centre de données en Irlande). Les accès sont
              contrôlés personne par personne et les mots de passe ne sont jamais stockés en clair.
            </p>
          </section>
        </article>
      </Container>
    </div>
  );
}
