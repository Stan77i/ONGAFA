/**
 * Navigation du site. `available: false` = page pas encore construite : le lien est masqué
 * (jamais de lien vers une page inexistante). Passer à `true` à la phase concernée.
 */
type NavItem = { href: string; label: string; available: boolean };

const filterAvailable = <T extends NavItem>(items: readonly T[]) => items.filter((i) => i.available);

/** `header` : affiché dans l'en-tête sur ordinateur (les autres restent dans le menu et le pied de page). */
const allMainNav = [
  { href: "/a-propos", label: "L'ONG", available: true, header: true },
  { href: "/actions", label: "Nos actions", available: true, header: false },
  { href: "/manioc", label: "Manioc", available: true, header: true },
  { href: "/vivrier", label: "Vivrier", available: false, header: true }, // quand des contenus sourcés par culture existeront
  { href: "/veille", label: "Veille", available: true, header: true },
  { href: "/prix", label: "Prix", available: true, header: true },
  { href: "/carte", label: "Carte", available: true, header: true },
  { href: "/producteurs", label: "Producteurs", available: true, header: true },
  { href: "/communaute", label: "Communauté", available: true, header: true },
] as const satisfies readonly (NavItem & { header: boolean })[];

export const mainNav = filterAvailable(allMainNav);

/** Barre basse mobile : les usages les plus fréquents, à portée du pouce. */
const allMobileTabs = [
  { href: "/", label: "Accueil", icon: "home", available: true },
  { href: "/veille", label: "Veille", icon: "newspaper", available: true },
  { href: "/communaute", label: "Communauté", icon: "messages", available: true },
  { href: "/carte", label: "Carte", icon: "map", available: true },
  { href: "/compte", label: "Compte", icon: "user", available: true },
  { href: "/manioc", label: "Manioc", icon: "sprout", available: true },
  { href: "/a-propos", label: "L'ONG", icon: "landmark", available: true },
  { href: "/actions", label: "Actions", icon: "layers", available: true },
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
      { href: "/carte", label: "Carte nationale", available: true },
      { href: "/carte#chronologie", label: "Déploiement national", available: true },
      { href: "/a-propos/partenaires", label: "Partenaires", available: false },
    ],
  },
  {
    title: "Filières",
    links: [
      { href: "/manioc", label: "Espace manioc", available: true },
      { href: "/manioc#derives", label: "Dérivés du manioc", available: true },
      { href: "/vivrier", label: "Le vivrier ivoirien", available: false },
      { href: "/veille", label: "Veille du vivrier", available: true },
      { href: "/prix", label: "Prix du vivrier", available: true },
      { href: "/ressources", label: "Ressources", available: true },
    ],
  },
  {
    title: "Participer",
    links: [
      { href: "/rejoindre-afa", label: "Rejoindre AFA", available: true },
      { href: "/producteurs/inscription", label: "Inscription producteur", available: true },
      { href: "/producteurs", label: "Annuaire des producteurs", available: true },
      { href: "/communaute", label: "Communauté", available: true },
      { href: "/temoignages", label: "Témoignages", available: true },
      { href: "/charte-communaute", label: "Charte de la communauté", available: true },
      { href: "/question-a-afa", label: "Poser une question à AFA", available: true },
    ],
  },
];

export const footerNav = allFooterNav.map((g) => ({ title: g.title, links: filterAvailable(g.links) }));

const allLegalNav = [
  { href: "/mentions-legales", label: "Mentions légales", available: false }, // avant l'ouverture publique
  { href: "/confidentialite", label: "Confidentialité", available: true },
  { href: "/accessibilite", label: "Accessibilité", available: false },
] as const;

export const legalNav = filterAvailable(allLegalNav);

/** Liens de bouton visibles seulement si la page existe. */
export const links = {
  join: "/rejoindre-afa",
  producerSignup: "/producteurs/inscription" as string | null,
  ask: "/question-a-afa" as string | null,
  search: null as string | null, // recherche globale : phase ultérieure
};
