import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export const FORUM_TAG = "forum";
export const TESTIMONIALS_TAG = "temoignages";
export const FORUM_PAGE_SIZE = 15;

export type Option = { id: string; slug: string; name: string };

export type PostSummary = {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  category: Option | null;
  crop: Option | null;
  region: string | null;
  replyCount: number;
  isPinned: boolean;
  createdAt: string;
  lastActivityAt: string;
};

type PostRow = {
  id: string;
  title: string;
  body: string;
  author_name: string;
  reply_count: number;
  is_pinned: boolean;
  created_at: string;
  last_activity_at: string;
  post_categories: Option | null;
  crops: Option | null;
  locations: { name: string } | null;
};

const POST_SELECT =
  "id, title, body, author_name, reply_count, is_pinned, created_at, last_activity_at, post_categories(id, slug, name), crops(id, slug, name), locations:region_id(name)";

const toSummary = (r: PostRow): PostSummary => ({
  id: r.id,
  title: r.title,
  excerpt: r.body.length > 180 ? `${r.body.slice(0, 180).replace(/\s+\S*$/, "")}…` : r.body,
  authorName: r.author_name,
  category: r.post_categories,
  crop: r.crops,
  region: r.locations?.name ?? null,
  replyCount: r.reply_count,
  isPinned: r.is_pinned,
  createdAt: r.created_at,
  lastActivityAt: r.last_activity_at,
});

export async function getPostCategories(): Promise<(Option & { description: string | null })[]> {
  "use cache";
  cacheLife("days");
  cacheTag("referentiels");
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("post_categories")
    .select("id, slug, name, description")
    .order("sort_order");
  return data ?? [];
}

/** Sujets publiés (identiques pour tous les visiteurs : mis en cache, rafraîchis à chaque publication). */
export async function listPosts(opts: { category?: string; crop?: string; page?: number }) {
  "use cache";
  cacheLife("minutes");
  cacheTag(FORUM_TAG);
  const supabase = createPublicClient();
  if (!supabase) return { items: [] as PostSummary[], total: 0 };
  const page = Math.max(1, opts.page ?? 1);
  const select = [
    POST_SELECT,
    ...(opts.category ? ["filtre_cat:post_categories!inner(slug)"] : []),
    ...(opts.crop ? ["filtre_cult:crops!inner(slug)"] : []),
  ].join(", ");
  let q = supabase.from("posts").select(select, { count: "exact" }).eq("status", "published");
  if (opts.category) q = q.eq("filtre_cat.slug", opts.category);
  if (opts.crop) q = q.eq("filtre_cult.slug", opts.crop);
  const { data, count, error } = await q
    .order("is_pinned", { ascending: false })
    .order("last_activity_at", { ascending: false })
    .range((page - 1) * FORUM_PAGE_SIZE, page * FORUM_PAGE_SIZE - 1);
  if (error) {
    console.error("Forum : lecture impossible", error.message);
    return { items: [], total: 0 };
  }
  return { items: (data as unknown as PostRow[]).map(toSummary), total: count ?? 0 };
}

export type PostDetail = PostSummary & {
  body: string;
  status: "pending" | "published" | "hidden" | "removed";
  authorId: string | null;
  comments: {
    id: string;
    authorName: string;
    authorId: string | null;
    body: string;
    status: string;
    createdAt: string;
  }[];
};

/** Un sujet et ses réponses, vus par la personne connectée (la RLS montre à l'auteur ses messages en attente). */
export async function getPost(id: string): Promise<PostDetail | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(
      `${POST_SELECT}, status, author_id, comments(id, author_name, author_id, body, status, created_at)`,
    )
    .eq("id", id)
    .order("created_at", { referencedTable: "comments", ascending: true })
    .maybeSingle();
  if (!data) return null;
  type Row = PostRow & {
    status: PostDetail["status"];
    author_id: string | null;
    comments: {
      id: string;
      author_name: string;
      author_id: string | null;
      body: string;
      status: string;
      created_at: string;
    }[];
  };
  const r = data as unknown as Row;
  return {
    ...toSummary(r),
    body: r.body,
    status: r.status,
    authorId: r.author_id,
    comments: r.comments.map((c) => ({
      id: c.id,
      authorName: c.author_name,
      authorId: c.author_id,
      body: c.body,
      status: c.status,
      createdAt: c.created_at,
    })),
  };
}

export type Testimonial = {
  id: string;
  name: string;
  place: string;
  activity: string;
  quote: string;
  publishedAt: string;
};

export async function getTestimonials(limit = 50): Promise<Testimonial[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(TESTIMONIALS_TAG);
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("testimonials")
    .select("id, name, place, activity, quote, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((t) => ({ ...t, publishedAt: t.published_at as string }));
}
