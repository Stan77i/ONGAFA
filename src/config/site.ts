/** Préfixe d'adresse ("/ONGAFA" sur GitHub Pages, vide ailleurs) : next/image ne l'ajoute pas tout seul. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Identité officielle de l'ONG. Source unique : ne pas réécrire ces valeurs ailleurs. */
export const site = {
  name: "Action des Femmes d'Afrique pour le Développement",
  shortName: "ONG AFA",
  slogan: "Valoriser la terre pour nourrir la Nation",
  country: "Côte d'Ivoire",
  /** Faits déclarés par l'ONG (docs/CONTEXTE_AFA.md). */
  foundedOn: "2016-06-03",
  registration: "n° 418 MEMIS/DGAT/DAG/SDVA",
  originRegion: "N'Zi",
  locale: "fr_CI",
  colors: {
    orange: "#df8433",
    green: "#4a7230",
    greenLight: "#59883c",
  },
  /** Coordonnées officielles : null tant qu'elles ne sont pas communiquées (rien d'inventé). */
  contact: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
  },
  /** Réseaux sociaux officiels : à compléter avec les vraies adresses. */
  social: [] as ReadonlyArray<{ label: string; href: string }>,
  logos: {
    seal: `${BASE_PATH}/brand/logo-sceau-ong-afa.webp`,
    symbol: `${BASE_PATH}/brand/symbole-afa.webp`,
    /** Sceau détouré, affiché sans cercle (menu, pied de page). */
    mark: `${BASE_PATH}/brand/logo-afa.webp`,
  },
} as const;
