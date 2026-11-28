"use client";

import { useState } from "react";
import { AfaIcon, type AfaIconName } from "@/components/afa/icons";
import { cn } from "@/lib/cn";

const profiles: { icon: AfaIconName; label: string; text: string }[] = [
  { icon: "manioc", label: "Productrice ou producteur", text: "Manioc, maïs ou autres cultures vivrières." },
  { icon: "coop", label: "Coopérative", text: "Groupement de producteurs ou de productrices." },
  { icon: "commerce", label: "Commerçante", text: "Commercialisation des produits vivriers et dérivés." },
  {
    icon: "transfo",
    label: "Transformatrice ou transformateur",
    text: "Attiéké, gari, placali, farine, amidon…",
  },
  { icon: "acheteur", label: "Acheteur", text: "Grossiste, centrale d'achat, entreprise." },
  { icon: "logistique", label: "Transporteur", text: "Collecte, transport et conservation." },
  { icon: "jeunes", label: "Jeune", text: "Formation et insertion dans la filière." },
  {
    icon: "partenaire",
    label: "Partenaire ou institution",
    text: "Organisation, collectivité, structure d'encadrement.",
  },
];

/**
 * Choix du profil (version statique, avant l'ouverture des inscriptions en ligne) :
 * le choix est confirmé par un message ; aucune donnée n'est envoyée ni enregistrée.
 */
export function ProfilePicker() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4 xl:grid-cols-4">
        {profiles.map((p, i) => {
          const on = sel === i;
          return (
            <li key={p.label}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setSel(on ? null : i)}
                className={cn(
                  "flex size-full cursor-pointer flex-col gap-3 rounded-[22px] border-[1.5px] border-ink p-[22px] text-left text-ink transition-[transform,box-shadow,background-color] duration-200",
                  on
                    ? "translate-y-1 bg-accent shadow-[0_2px_0_#1d2417]"
                    : "bg-white shadow-[0_6px_0_#1d2417] hover:-translate-y-1 hover:shadow-[0_10px_0_#1d2417]",
                )}
              >
                <span className="grid size-[68px] place-items-center rounded-full border-[1.5px] border-ink bg-sand">
                  <AfaIcon name={p.icon} size={42} />
                </span>
                <span className="text-[21px] leading-[1.15] font-extrabold tracking-[-0.015em]">
                  {p.label}
                </span>
                <span className="text-[15px] leading-[1.45] opacity-85">{p.text}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="on-dark mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[22px] bg-forest px-7 py-[22px] text-sand">
        <p aria-live="polite" className="flex-[1_1_380px] text-[17px] leading-[1.45] sm:text-[18px]">
          {sel === null
            ? "Choisissez votre profil ci-dessus. L'inscription en ligne ouvre bientôt sur cette page."
            : `${profiles[sel].label} : votre place est dans le réseau AFA. L'inscription en ligne ouvre bientôt sur cette page.`}
        </p>
        <span className="hand text-[38px] text-mint">à très vite !</span>
      </div>
    </>
  );
}
