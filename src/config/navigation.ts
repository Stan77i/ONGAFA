/** Navigation principale. Les pages arriveront phase par phase (voir docs/ARCHITECTURE.md). */
export const mainNav = [
  { href: "/a-propos", label: "AFA" },
  { href: "/actions", label: "Nos actions" },
  { href: "/manioc", label: "Manioc" },
  { href: "/vivrier", label: "Vivrier" },
  { href: "/veille", label: "Veille" },
  { href: "/carte", label: "Carte" },
  { href: "/communaute", label: "Communauté" },
] as const;

/** Barre basse mobile : les 5 usages les plus fréquents, à portée du pouce. */
export const mobileTabs = [
  { href: "/", label: "Accueil", icon: "home" },
  { href: "/veille", label: "Veille", icon: "newspaper" },
  { href: "/carte", label: "Carte", icon: "map" },
  { href: "/communaute", label: "Communauté", icon: "messages" },
  { href: "/compte", label: "Compte", icon: "user" },
] as const;

export const footerNav = [
  {
    title: "L'ONG AFA",
    links: [
      { href: "/a-propos", label: "Qui sommes-nous" },
      { href: "/actions", label: "Nos actions" },
      { href: "/deploiement", label: "Déploiement national" },
      { href: "/a-propos/partenaires", label: "Partenaires" },
    ],
  },
  {
    title: "Filières",
    links: [
      { href: "/manioc", label: "Espace manioc" },
      { href: "/vivrier", label: "Le vivrier ivoirien" },
      { href: "/prix", label: "Prix du vivrier" },
      { href: "/ressources", label: "Ressources" },
    ],
  },
  {
    title: "Participer",
    links: [
      { href: "/producteurs/inscription", label: "Inscription producteur" },
      { href: "/communaute", label: "Communauté" },
      { href: "/question-a-afa", label: "Poser une question à AFA" },
      { href: "/rejoindre-afa", label: "Rejoindre AFA" },
    ],
  },
] as const;

export const legalNav = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/accessibilite", label: "Accessibilité" },
] as const;
