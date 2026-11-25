import { cacheLife, cacheTag } from "next/cache";
import type { AfaStatus } from "@/components/map/StatusPill";
import { createPublicClient } from "@/lib/supabase/public";

export type AfaMapPoint = {
  slug: string; // path_slug du territoire ; pour une région = identifiant de la forme sur la carte
  name: string;
  level: string;
  status: AfaStatus;
  sinceDate: string | null;
  description: string | null;
  activities: string[];
};

/** Étiquette de cache à invalider quand une implantation change (back-office, phase 9). */
export const AFA_MAP_TAG = "afa-map";

const order: Record<AfaStatus, number> = { active: 0, in_progress: 1, upcoming: 2 };

/**
 * Implantations publiées (vue afa_map_points, lisible par les visiteurs).
 * Mise en cache quelques heures ; en cas d'erreur ou sans configuration : liste vide (la carte reste affichée).
 */
export async function getAfaMapPoints(): Promise<AfaMapPoint[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(AFA_MAP_TAG);

  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("afa_map_points")
    .select("path_slug, name, level, status, since_date, description, activities");
  if (error || !data) {
    console.error("Carte AFA : lecture impossible", error?.message);
    return [];
  }
  return data
    .map((r) => ({
      slug: r.path_slug as string,
      name: r.name as string,
      level: r.level as string,
      status: r.status as AfaStatus,
      sinceDate: (r.since_date as string | null) ?? null,
      description: (r.description as string | null) ?? null,
      activities: (r.activities as string[] | null) ?? [],
    }))
    .sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name, "fr"));
}
