// Lecture de flux RSS / Atom et règles éditoriales de la veille AFA.
// Module pur (sans API Deno ni Node) : utilisé par la fonction Supabase et testé par vitest.

export type FeedItem = { title: string; url: string; publishedAt: Date; excerpt: string };

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", rdquo: "”",
  ldquo: "“", hellip: "…", ndash: "–", mdash: "—", laquo: "«", raquo: "»", eacute: "é", egrave: "è",
  agrave: "à", ccedil: "ç", ecirc: "ê", ocirc: "ô", icirc: "î", ucirc: "û", acirc: "â", euml: "ë", iuml: "ï",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

/** Texte brut : CDATA retiré, balises HTML supprimées, entités décodées, espaces normalisés. */
export function toPlainText(s: string): string {
  const noCdata = s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  const noTags = decodeEntities(noCdata).replace(/<[^>]*>/g, " ");
  return decodeEntities(noTags).replace(/\s+/g, " ").trim();
}

/** Extrait court (citation courte, jamais l'article complet) coupé sur une fin de mot. */
export function makeExcerpt(text: string, max = 280): string {
  const clean = text.replace(/\s*(The post|L’article|L'article) .* est apparu en premier sur .*$/i, "").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 40)).replace(/[\s,;:.–-]+$/, "")}…`;
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : null;
}

function atomLink(block: string): string | null {
  const alt = block.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i);
  const any = block.match(/<link[^>]*href=["']([^"']+)["']/i);
  return (alt ?? any)?.[1] ?? null;
}

/** Analyse un flux RSS 2.0 ou Atom. Les éléments incomplets (sans titre, lien ou date valide) sont ignorés. */
export function parseFeed(xml: string): FeedItem[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) ?? [];
  const items: FeedItem[] = [];
  for (const b of blocks) {
    const title = toPlainText(tag(b, "title") ?? "");
    const rawLink = toPlainText(tag(b, "link") ?? "") || atomLink(b) || toPlainText(tag(b, "guid") ?? "");
    const date = new Date(toPlainText(tag(b, "pubDate") ?? tag(b, "published") ?? tag(b, "updated") ?? tag(b, "dc:date") ?? ""));
    const description = tag(b, "description") ?? tag(b, "summary") ?? tag(b, "content") ?? "";
    if (!title || !/^https?:\/\//.test(rawLink) || Number.isNaN(date.getTime())) continue;
    items.push({ title: title.slice(0, 300), url: rawLink, publishedAt: date, excerpt: makeExcerpt(toPlainText(description)) });
  }
  return items;
}

const strip = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * Un mot-clé « mot » = mot entier ; « mot* » = début de mot.
 * Un mot-clé accentué est comparé au texte accentué (« maïs » ≠ « mais ») ; sinon au texte sans accents.
 */
export function matchesKeyword(text: string, keyword: string): boolean {
  const prefix = keyword.endsWith("*");
  const kw = (prefix ? keyword.slice(0, -1) : keyword).toLowerCase();
  const accented = strip(kw) !== kw;
  const haystack = accented ? text.toLowerCase() : strip(text.toLowerCase());
  const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}${prefix ? "" : "(?![\\p{L}\\p{N}])"}`, "u").test(haystack);
}

/** Sujets agricoles pour filtrer les flux généralistes. */
export const AGRI_KEYWORDS = [
  "agricult*", "agricole*", "vivrier*", "vivrière*", "paysan*", "cooperative*", "coopérative*", "recolte*", "récolte*",
  "semence*", "engrais", "intrant*", "anader", "cnra", "firca", "ocpv", "elevage", "élevage", "securite alimentaire",
  "sécurité alimentaire", "cherte de la vie", "cherté de la vie", "productrice*", "producteur*",
];

export function isAgricultural(text: string, cropKeywords: string[]): boolean {
  return [...AGRI_KEYWORDS, ...cropKeywords].some((k) => matchesKeyword(text, k));
}

/** Cultures citées dans un texte. */
export function cropsIn(text: string, crops: { id: string; keywords: string[] }[]): string[] {
  return crops.filter((c) => c.keywords.some((k) => matchesKeyword(text, k))).map((c) => c.id);
}
