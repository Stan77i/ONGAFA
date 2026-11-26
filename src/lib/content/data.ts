import { createPublicClient } from "@/lib/supabase/public";

/** Étiquettes de cache (réservées au mode serveur, back-office phase 9). */
export const CONTENT_TAGS = {
  news: "veille",
  prices: "prix",
  resources: "ressources",
  refs: "referentiels",
} as const;

export type Option = { slug: string; name: string };

export type NewsEntry = {
  id: string;
  title: string;
  excerpt: string | null;
  url: string;
  publishedAt: string;
  source: string;
  category: Option | null;
  crops: Option[];
};

export const NEWS_PAGE_SIZE = 12;

type Row = {
  id: string;
  title: string;
  excerpt: string | null;
  url: string;
  published_at: string;
  news_sources: { name: string } | null;
  categories: Option | null;
  news_item_crops: { crops: Option | null }[];
};

const toEntry = (r: Row): NewsEntry => ({
  id: r.id,
  title: r.title,
  excerpt: r.excerpt,
  url: r.url,
  publishedAt: r.published_at,
  source: r.news_sources?.name ?? "Source externe",
  category: r.categories,
  crops: r.news_item_crops.map((c) => c.crops).filter((c): c is Option => c !== null),
});

/** Référentiels : catégories de veille et cultures (changent rarement). */
export async function getNewsFilters(): Promise<{ categories: Option[]; crops: Option[] }> {
  const supabase = createPublicClient();
  if (!supabase) return { categories: [], crops: [] };
  const [cats, crops] = await Promise.all([
    supabase
      .from("categories")
      .select("slug, name")
      .eq("scope", "news")
      .neq("slug", "afa")
      .order("sort_order"),
    supabase.from("crops").select("slug, name").order("sort_order"),
  ]);
  return { categories: cats.data ?? [], crops: crops.data ?? [] };
}

/** Veille publiée, filtrée et paginée. En cas d'erreur : liste vide (la page reste affichée). */
export async function getNews(opts: { category?: string; crop?: string; page?: number }): Promise<{
  items: NewsEntry[];
  total: number;
}> {
  const supabase = createPublicClient();
  if (!supabase) return { items: [], total: 0 };

  const page = Math.max(1, opts.page ?? 1);
  const select = [
    "id, title, excerpt, url, published_at",
    "news_sources(name)",
    opts.category ? "categories!inner(slug, name)" : "categories(slug, name)",
    opts.crop ? "news_item_crops!inner(crops!inner(slug, name))" : "news_item_crops(crops(slug, name))",
  ].join(", ");

  let query = supabase.from("news_items").select(select, { count: "exact" }).eq("status", "published");
  if (opts.category) query = query.eq("categories.slug", opts.category);
  if (opts.crop) query = query.eq("news_item_crops.crops.slug", opts.crop);
  const { data, count, error } = await query
    .order("published_at", { ascending: false })
    .range((page - 1) * NEWS_PAGE_SIZE, page * NEWS_PAGE_SIZE - 1);

  if (error) {
    console.error("Veille : lecture impossible", error.message);
    return { items: [], total: 0 };
  }
  return { items: (data as unknown as Row[]).map(toEntry), total: count ?? 0 };
}

/** Dernières informations publiées (site statique : filtrage fait dans le navigateur). */
export async function getRecentNews(limit = 240): Promise<NewsEntry[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("news_items")
    .select(
      "id, title, excerpt, url, published_at, news_sources(name), categories(slug, name), news_item_crops(crops(slug, name))",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("Veille : lecture impossible", error.message);
    return [];
  }
  return (data as unknown as Row[]).map(toEntry);
}

/** Sources actives (transparence éditoriale). */
export async function getNewsSources(): Promise<{ name: string; siteUrl: string }[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("news_sources")
    .select("name, site_url")
    .eq("active", true)
    .order("name");
  return (data ?? []).map((s) => ({ name: s.name, siteUrl: s.site_url }));
}

export type PriceEntry = {
  id: string;
  product: string;
  crop: string;
  market: string;
  unit: string;
  amount: number;
  observedOn: string;
  source: string;
  priceType: "farmgate" | "wholesale" | "retail";
};

/** Prix VÉRIFIÉS uniquement (garanti aussi par la RLS). */
export async function getVerifiedPrices(): Promise<PriceEntry[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("market_prices")
    .select(
      "id, product_label, amount, observed_on, source, price_type, crops(name), markets(name), locations(name), units(label)",
    )
    .eq("verification", "verified")
    .order("observed_on", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  type P = {
    id: string;
    product_label: string;
    amount: number;
    observed_on: string;
    source: string;
    price_type: PriceEntry["priceType"];
    crops: { name: string } | null;
    markets: { name: string } | null;
    locations: { name: string } | null;
    units: { label: string } | null;
  };
  return (data as unknown as P[]).map((p) => ({
    id: p.id,
    product: p.product_label,
    crop: p.crops?.name ?? "",
    market: p.markets?.name ?? p.locations?.name ?? "—",
    unit: p.units?.label ?? "",
    amount: Number(p.amount),
    observedOn: p.observed_on,
    source: p.source,
    priceType: p.price_type,
  }));
}

export type ResourceEntry = {
  slug: string;
  title: string;
  description: string | null;
  kind: "guide" | "fiche" | "pdf" | "video" | "etude" | "formation";
  href: string;
  sizeLabel: string | null;
  crop: string | null;
  source: string;
};

export async function getResources(): Promise<ResourceEntry[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("resources")
    .select("slug, title, description, kind, file_path, external_url, size_label, source, crops(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  type R = {
    slug: string;
    title: string;
    description: string | null;
    kind: ResourceEntry["kind"];
    file_path: string | null;
    external_url: string | null;
    size_label: string | null;
    source: string;
    crops: { name: string } | null;
  };
  return (data as unknown as R[]).map((r) => ({
    slug: r.slug,
    title: r.title,
    description: r.description,
    kind: r.kind,
    href: r.external_url ?? r.file_path ?? "#",
    sizeLabel: r.size_label,
    crop: r.crops?.name ?? null,
    source: r.source,
  }));
}
