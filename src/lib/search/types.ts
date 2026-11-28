/** Entrée de l'index de recherche (générée à la construction, lue par la palette ⌘K). */
export type SearchItem = {
  /** Titre affiché. */
  t: string;
  /** Sous-titre (contexte). */
  s?: string;
  /** Lien interne (sans préfixe) ou externe (veille). */
  href: string;
  /** Groupe d'affichage. */
  g: "Pages" | "Domaines" | "Manioc" | "Régions" | "Veille" | "Ressources";
  /** Mots-clés supplémentaires. */
  k?: string;
  /** Date de publication (veille), ISO. */
  d?: string;
  external?: boolean;
};

export type SearchIndex = { builtAt: string; items: SearchItem[] };
