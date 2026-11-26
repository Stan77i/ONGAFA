import type { Metadata } from "next";
import { Container } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Charte de la communauté",
  description:
    "Les règles de la communauté AFA : respect, entraide, informations vérifiées, protection des personnes.",
};

const rules = [
  [
    "Respecter chacun",
    "Pas d'insulte, de moquerie ni de propos discriminants. On critique une idée, jamais une personne.",
  ],
  [
    "S'entraider",
    "Répondez avec ce que vous savez vraiment. Dites d'où vient une information quand vous la partagez.",
  ],
  [
    "Protéger les personnes",
    "Ne publiez jamais de numéro de téléphone, d'adresse ou de photo de quelqu'un sans son accord. Pour être contacté, utilisez votre fiche producteur.",
  ],
  [
    "Se méfier des arnaques",
    "AFA ne demande jamais d'argent pour une formation, un financement ou une inscription. Signalez toute offre de ce type.",
  ],
  [
    "Rester dans le sujet",
    "Le forum parle de manioc, de vivrier, de transformation, de commerce et de la vie du réseau.",
  ],
  [
    "Pas de publicité abusive",
    "Proposer sa production est bienvenu dans « Vente et achat ». Les messages répétés ou les liens douteux sont retirés.",
  ],
] as const;

export default function CharterPage() {
  return (
    <div className="py-10 sm:py-16">
      <Container className="max-w-3xl space-y-8">
        <header className="space-y-2">
          <p className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">Communauté</p>
          <h1 className="font-display text-h1 font-semibold text-forest">Charte de la communauté</h1>
          <p className="text-ink-soft">Un espace utile et sûr pour tous, grâce à quelques règles simples.</p>
        </header>
        <ol className="space-y-4">
          {rules.map(([title, text], i) => (
            <li key={title} className="flex gap-4 rounded-card bg-white p-5 text-ink ring-1 ring-rule">
              <span
                className="font-display text-h2 leading-none font-semibold text-accent"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h2 className="font-display text-h3 font-semibold text-forest">{title}</h2>
                <p className="text-ink-soft">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <section className="space-y-2 rounded-card bg-sand p-5 ring-1 ring-rule">
          <h2 className="font-display text-h3 font-semibold text-forest">Comment fonctionne la modération</h2>
          <ul className="list-inside list-disc space-y-1 text-ink-soft">
            <li>
              Les premiers messages d&apos;un nouveau membre sont relus avant publication, ainsi que les
              messages contenant un lien.
            </li>
            <li>
              Chacun peut signaler un contenu ; trois signalements le masquent en attendant l&apos;examen de
              l&apos;équipe AFA.
            </li>
            <li>
              Un contenu contraire à la charte peut être masqué ou supprimé ; en cas d&apos;abus répétés, le
              compte peut être suspendu.
            </li>
          </ul>
        </section>
      </Container>
    </div>
  );
}
