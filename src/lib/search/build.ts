import "server-only";
import regionsData from "@/data/ci-regions.json";
import { menuNav } from "@/config/navigation";
import { cassava, domains, perspectives } from "@/content/afa";
import { getRecentNews, getResources } from "@/lib/content/data";
import type { SearchIndex, SearchItem } from "./types";

const pageHints: Record<string, string> = {
  "/": "Je suis AFA, devise, bilan, carte",
  "/a-propos": "Histoire, objet, réalisations, perspectives, gouvernance, présidente",
  "/actions": "Domaines d'intervention",
  "/manioc": "Chaîne de valeur, variétés, plats, dérivés",
  "/veille": "Actualités agricoles datées et sourcées",
  "/prix": "Prix des marchés, datés et vérifiés",
  "/ressources": "Guides, fiches techniques, études",
  "/carte": "Implantations d'AFA en Côte d'Ivoire",
};

/** Index de recherche du site : uniquement des contenus réels (src/content, Supabase, tracés de la carte). */
export async function buildSearchIndex(): Promise<SearchIndex> {
  const [news, resources] = await Promise.all([getRecentNews(120), getResources()]);
  const items: SearchItem[] = [
    ...menuNav.map((p) => ({ t: p.label, s: pageHints[p.href], href: p.href, g: "Pages" as const })),
    {
      t: "Rejoindre AFA",
      s: "Productrices, coopératives, commerçantes, partenaires",
      href: "/rejoindre-afa",
      g: "Pages",
    },
    ...domains.map((d) => ({
      t: d.title,
      s: d.text,
      href: `/actions#${d.slug}`,
      g: "Domaines" as const,
    })),
    ...cassava.varieties.map((v) => ({
      t: v.name,
      s: `Variété · ${v.text}`,
      href: "/manioc#varietes",
      g: "Manioc" as const,
    })),
    ...cassava.dishes.map((d) => ({
      t: d.name,
      s: `Plat · ${d.text}`,
      href: "/manioc#usages",
      g: "Manioc" as const,
    })),
    ...cassava.categories.map((c) => ({
      t: c.name,
      s: c.text,
      href: "/manioc#categories",
      g: "Manioc" as const,
    })),
    ...cassava.derivatives.flatMap((g) =>
      g.items.map((it) => ({
        t: it,
        s: `Dérivé · ${g.group}`,
        href: "/manioc#derives",
        g: "Manioc" as const,
      })),
    ),
    ...perspectives.map((p) => ({
      t: p,
      s: "Perspective d'AFA",
      href: "/a-propos#perspectives",
      g: "Domaines" as const,
    })),
    ...regionsData.regions.map((r) => ({
      t: r.name,
      s:
        r.slug === "nzi"
          ? "AFA implantée"
          : r.slug === "nawa"
            ? "Prochaine étape · chef-lieu Soubré"
            : "Déploiement progressif",
      href: `/carte#r=${r.slug}`,
      g: "Régions" as const,
      k: "région",
    })),
    ...news.map((n) => ({
      t: n.title,
      s: `${n.source}${n.category ? ` · ${n.category.name}` : ""}`,
      href: n.url,
      g: "Veille" as const,
      k: n.crops.map((c) => c.name).join(" "),
      d: n.publishedAt,
      external: true,
    })),
    ...resources.map((r) => ({
      t: r.title,
      s: r.crop ?? "Ressource",
      href: r.href,
      g: "Ressources" as const,
    })),
  ];
  return { builtAt: new Date().toISOString(), items };
}
