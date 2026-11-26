// Fonction Supabase « veille-ingest » : collecte automatique de la veille AFA.
// Déclenchée toutes les 2 heures par pg_cron (migration 0008). Sans paramètre d'entrée : elle lit
// uniquement les sources actives configurées en base. Idempotente (URL unique) et limitée à une
// exécution toutes les 15 minutes.
//
// Conserve : titre, extrait court, date, lien vers l'article d'origine. Jamais le texte complet.

import { createClient } from "npm:@supabase/supabase-js@2";
import { cropsIn, isAgricultural, parseFeed } from "./rss.ts";

const MIN_INTERVAL_MS = 15 * 60 * 1000;
const MAX_AGE_DAYS = 120; // on ne reprend pas les archives anciennes
const USER_AGENT = "VeilleAFA/1.0 (+https://github.com/Stan77i/ONGAFA)";

type Source = { id: string; name: string; feed_url: string; trust: "auto" | "review"; requires_keyword: boolean; default_category_id: string | null };

Deno.serve(async () => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  // Limitation de fréquence
  const { data: last } = await supabase.from("ingestion_runs").select("started_at").order("started_at", { ascending: false }).limit(1);
  if (last?.[0] && Date.now() - new Date(last[0].started_at).getTime() < MIN_INTERVAL_MS) {
    return Response.json({ skipped: "Collecte récente : réessayer plus tard." });
  }

  const [{ data: sources, error: sErr }, { data: crops, error: cErr }] = await Promise.all([
    supabase.from("news_sources").select("id, name, feed_url, trust, requires_keyword, default_category_id").eq("active", true),
    supabase.from("crops").select("id, keywords"),
  ]);
  if (sErr || cErr) return Response.json({ error: sErr?.message ?? cErr?.message }, { status: 500 });
  const allCropKeywords = (crops ?? []).flatMap((c) => c.keywords as string[]);

  const report: Record<string, unknown>[] = [];
  for (const source of (sources ?? []) as Source[]) {
    const { data: run } = await supabase.from("ingestion_runs").insert({ source_id: source.id }).select("id").single();
    let fetched = 0, inserted = 0, error: string | null = null;
    try {
      const res = await fetch(source.feed_url, {
        headers: { "user-agent": USER_AGENT, accept: "application/rss+xml, application/xml, text/xml" },
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const minDate = Date.now() - MAX_AGE_DAYS * 86_400_000;
      const maxDate = Date.now() + 3_600_000;
      const items = parseFeed(await res.text()).filter((i) => {
        const t = i.publishedAt.getTime();
        return t >= minDate && t <= maxDate;
      });
      fetched = items.length;
      const kept = source.requires_keyword
        ? items.filter((i) => isAgricultural(`${i.title} ${i.excerpt}`, allCropKeywords))
        : items;

      if (kept.length > 0) {
        const { data: rows, error: insErr } = await supabase
          .from("news_items")
          .upsert(
            kept.map((i) => ({
              source_id: source.id,
              title: i.title,
              excerpt: i.excerpt || null,
              url: i.url,
              published_at: i.publishedAt.toISOString(),
              status: source.trust === "auto" ? "published" : "pending",
              category_id: source.default_category_id,
            })),
            { onConflict: "url", ignoreDuplicates: true },
          )
          .select("id, title, excerpt");
        if (insErr) throw new Error(insErr.message);
        inserted = rows?.length ?? 0;

        const links = (rows ?? []).flatMap((r) =>
          cropsIn(`${r.title} ${r.excerpt ?? ""}`, (crops ?? []) as { id: string; keywords: string[] }[]).map((crop_id) => ({
            news_item_id: r.id,
            crop_id,
          })),
        );
        if (links.length) await supabase.from("news_item_crops").upsert(links, { ignoreDuplicates: true });
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }

    await Promise.all([
      run && supabase.from("ingestion_runs").update({ finished_at: new Date().toISOString(), fetched, inserted, error }).eq("id", run.id),
      supabase.from("news_sources").update({ last_fetched_at: new Date().toISOString(), last_error: error }).eq("id", source.id),
    ]);
    report.push({ source: source.name, fetched, inserted, error });
  }

  return Response.json({ ok: true, report });
});
