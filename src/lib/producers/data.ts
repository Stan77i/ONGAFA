import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";

export type Ref = { id: string; slug: string; name: string };

/** Régions et districts autonomes (sélecteurs de localisation). */
export async function getRegions(): Promise<Ref[]> {
  "use cache";
  cacheLife("days");
  cacheTag("referentiels");
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("locations")
    .select("id, slug, name")
    .in("level", ["region", "district"])
    .is("parent_id", null)
    .not("centroid", "is", null)
    .order("name");
  return (data ?? []).sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

export async function getCrops(): Promise<Ref[]> {
  "use cache";
  cacheLife("days");
  cacheTag("referentiels");
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase.from("crops").select("id, slug, name").order("sort_order");
  return data ?? [];
}

export type ProducerProfile = {
  userId: string;
  slug: string;
  displayName: string;
  region: Ref | null;
  city: string | null;
  village: string | null;
  description: string | null;
  experienceYears: number | null;
  totalAreaHa: number | null;
  productionNote: string | null;
  availabilityNote: string | null;
  visibility: "private" | "members" | "public";
  verified: boolean;
  crops: { id: string; slug: string; name: string; areaHa: number | null }[];
  needs: string[];
  phone: string | null;
  phoneVisibility: "private" | "members" | "public";
};

const PRODUCER_SELECT =
  "user_id, slug, display_name, city, village, description, experience_years, total_area_ha, production_note, availability_note, visibility, verification, locations:region_id(id, slug, name), producer_crops(area_ha, crops(id, slug, name)), producer_needs(need)";

type Row = {
  user_id: string;
  slug: string;
  display_name: string;
  city: string | null;
  village: string | null;
  description: string | null;
  experience_years: number | null;
  total_area_ha: number | null;
  production_note: string | null;
  availability_note: string | null;
  visibility: ProducerProfile["visibility"];
  verification: "verified" | "unverified";
  locations: Ref | null;
  producer_crops: { area_ha: number | null; crops: Ref | null }[];
  producer_needs: { need: string }[];
};

function toProfile(
  r: Row,
  phone: { phone: string | null; phone_visibility: ProducerProfile["phoneVisibility"] } | null,
): ProducerProfile {
  return {
    userId: r.user_id,
    slug: r.slug,
    displayName: r.display_name,
    region: r.locations,
    city: r.city,
    village: r.village,
    description: r.description,
    experienceYears: r.experience_years,
    totalAreaHa: r.total_area_ha === null ? null : Number(r.total_area_ha),
    productionNote: r.production_note,
    availabilityNote: r.availability_note,
    visibility: r.visibility,
    verified: r.verification === "verified",
    crops: r.producer_crops
      .filter((c) => c.crops)
      .map((c) => ({ ...(c.crops as Ref), areaHa: c.area_ha === null ? null : Number(c.area_ha) })),
    needs: r.producer_needs.map((n) => n.need),
    phone: phone?.phone ?? null,
    phoneVisibility: phone?.phone_visibility ?? "private",
  };
}

/** Lectures avec la session de l'utilisateur : la RLS décide de ce qui est visible. */
async function phoneOf(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_private")
    .select("phone, phone_visibility")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function getMyProducer(userId: string): Promise<ProducerProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("producers")
    .select(PRODUCER_SELECT)
    .eq("user_id", userId)
    .maybeSingle();
  return data ? toProfile(data as unknown as Row, await phoneOf(userId)) : null;
}

export async function getProducerBySlug(slug: string): Promise<ProducerProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("producers").select(PRODUCER_SELECT).eq("slug", slug).maybeSingle();
  if (!data) return null;
  return toProfile(data as unknown as Row, await phoneOf((data as unknown as Row).user_id));
}

export const DIRECTORY_PAGE_SIZE = 24;

export async function listProducers(opts: { region?: string; crop?: string; page?: number }) {
  const supabase = await createClient();
  const page = Math.max(1, opts.page ?? 1);
  const select = [
    "user_id, slug, display_name, city, village, verification",
    opts.region ? "locations:region_id!inner(slug, name)" : "locations:region_id(slug, name)",
    // Toutes les cultures pour l'affichage ; une jointure séparée (alias « filtre ») pour filtrer,
    // sinon la carte n'afficherait plus que la culture filtrée.
    "producer_crops(crops(slug, name))",
    ...(opts.crop ? ["filtre:producer_crops!inner(crops!inner(slug))"] : []),
  ].join(", ");
  let q = supabase.from("producers").select(select, { count: "exact" });
  if (opts.region) q = q.eq("locations.slug", opts.region);
  if (opts.crop) q = q.eq("filtre.crops.slug", opts.crop);
  const { data, count, error } = await q
    .order("verification", { ascending: false })
    .order("created_at", { ascending: false })
    .range((page - 1) * DIRECTORY_PAGE_SIZE, page * DIRECTORY_PAGE_SIZE - 1);
  if (error) return { items: [], total: 0 };
  type L = {
    slug: string;
    display_name: string;
    city: string | null;
    village: string | null;
    verification: string;
    locations: { name: string } | null;
    producer_crops: { crops: { name: string } | null }[];
  };
  return {
    total: count ?? 0,
    items: (data as unknown as L[]).map((p) => ({
      slug: p.slug,
      name: p.display_name,
      place: [p.village ?? p.city, p.locations?.name].filter(Boolean).join(", ") || "Côte d'Ivoire",
      crops: p.producer_crops.map((c) => c.crops?.name).filter((n): n is string => Boolean(n)),
      verified: p.verification === "verified",
    })),
  };
}

export type MyRequest = {
  id: string;
  category: string;
  message: string;
  status: string;
  createdAt: string;
  replies: number;
};

export async function getMyRequests(): Promise<MyRequest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_requests")
    .select("id, category, message, status, created_at, contact_messages(id)")
    .order("created_at", { ascending: false })
    .limit(20);
  type R = {
    id: string;
    category: string;
    message: string;
    status: string;
    created_at: string;
    contact_messages: { id: string }[];
  };
  return ((data ?? []) as unknown as R[]).map((r) => ({
    id: r.id,
    category: r.category,
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
    replies: r.contact_messages.length,
  }));
}
