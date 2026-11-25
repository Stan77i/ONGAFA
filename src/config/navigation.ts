/**
 * Navigation du site. `available: false` = page pas encore construite : le lien est masqué
 * (jamais de lien vers une page inexistante). Passer à `true` à la phase concernée.
 */
type NavItem = { href: string; label: string; available: boolean };

const filterAvailable = <T extends NavItem>(items: readonly T[]) => items.filter((i) => i.available);

const allMainNav = [
  { href: "/a-propos", label: "L'ONG AFA", available: true },
  { href: "/actions", label: "Nos actions", available: true },
  { href: "/manioc", label: "Manioc", available: true },
  { href: "/vivrier", label: "Vivrier", available: false }, // phase 5
  { href: "/veille", label: "Veille", available: false }, // phase 5
  { href: "/carte", label: "Carte", available: false }, // phase 4
  { href: "/communaute", label: "Communauté", available: false }, // phase 7
] as const satisfies readonly NavItem[];

export const mainNav = filterAvailable(allMainNav);

/** Barre basse mobile : les usages les plus fréquents, à portée du pouce. */
const allMobileTabs = [
  { href: "/", label: "Accueil", icon: "home", available: true },
  { href: "/a-propos", label: "L'ONG", icon: "landmark", available: true },
  { href: "/veille", label: "Veille", icon: "newspaper", available: false },
  { href: "/carte", label: "Carte", icon: "map", available: false },
  { href: "/manioc", label: "Manioc", icon: "sprout", available: true },
  { href: "/communaute", label: "Communauté", icon: "messages", available: false },
  { href: "/actions", label: "Actions", icon: "layers", available: true },
  { href: "/compte", label: "Compte", icon: "user", available: false },
] as const satisfies readonly (NavItem & { icon: string })[];

export const mobileTabs = filterAvailable(allMobileTabs).slice(0, 5);

const allFooterNav: { title: string; links: NavItem[] }[] = [
  {
    title: "L'ONG AFA",
    links: [
      { href: "/a-propos", label: "Qui sommes-nous", available: true },
      { href: "/a-propos#realisations", label: "Nos réalisations", available: true },
      { href: "/a-propos#gouvernance", label: "Gouvernance", available: true },
      { href: "/actions", label: "Nos actions", available: true },
      { href: "/deploiement", label: "Déploiement national", available: false },
      { href: "/a-propos/partenaires", label: "Partenaires", available: false },
    ],
  },
  {
    title: "Filières",
    links: [
      { href: "/manioc", label: "Espace manioc", available: true },
      { href: "/manioc#derives", label: "Dérivés du manioc", available: true },
      { href: "/vivrier", label: "Le vivrier ivoirien", available: false },
      { href: "/prix", label: "Prix du vivrier", available: false },
      { href: "/ressources", label: "Ressources", available: false },
    ],
  },
  {
    title: "Participer",
    links: [
      { href: "/rejoindre-afa", label: "Rejoindre AFA", available: true },
      { href: "/producteurs/inscription", label: "Inscription producteur", available: false },
      { href: "/communaute", label: "Communauté", available: false },
      { href: "/question-a-afa", label: "Poser une question à AFA", available: false },
    ],
  },
];

export const footerNav = allFooterNav.map((g) => ({ title: g.title, links: filterAvailable(g.links) }));

const allLegalNav = [
  { href: "/mentions-legales", label: "Mentions légales", available: false }, // avant l'ouverture publique
  { href: "/confidentialite", label: "Confidentialité", available: false }, // avant toute collecte de données
  { href: "/accessibilite", label: "Accessibilité", available: false },
] as const;

export const legalNav = filterAvailable(allLegalNav);

/** Liens de bouton visibles seulement si la page existe. */
export const links = {
  join: "/rejoindre-afa",
  producerSignup: null as string | null, // phase 6
  ask: null as string | null, // phase 6
  search: null as string | null, // phase 5
};
