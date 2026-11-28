import type { NewsEntry } from "@/lib/content/data";
import { formatDate } from "@/lib/format";

/** Mot d'appel du bandeau, par thème (repli : nom du thème). */
const kickers: Record<string, string> = {
  actualites: "Actualité",
  recherche: "Recherche",
  terrain: "Terrain",
  marches: "Marchés",
  opportunites: "Opportunité",
  afa: "AFA",
};

/**
 * Élément de veille externe en « une de journal » : titre, extrait court, source, date, lien vers
 * l'article d'origine, tenu par une baguette porte-journal. Pas d'image (droits). `index` alterne la mise en page.
 */
export function NewsListItem({
  item,
  isNew = false,
  index = 0,
}: {
  item: NewsEntry;
  isNew?: boolean;
  index?: number;
}) {
  const kicker = item.category ? (kickers[item.category.slug] ?? item.category.name) : "Veille";
  const alt = index % 2 === 1;
  const rot = alt ? "rotate-[1.2deg]" : "-rotate-[1.4deg]";
  return (
    <article className="group relative w-full px-[clamp(14px,2.4vw,30px)] pt-[clamp(30px,3.4vw,44px)] pb-[clamp(30px,3.6vw,48px)] text-ink">
      <span
        aria-hidden="true"
        className="absolute top-0 right-[4%] z-[3] text-[34px] leading-none font-black"
      >
        ✱
      </span>

      <div className="relative">
        <div
          aria-hidden="true"
          className={`absolute inset-0 translate-x-4 translate-y-[18px] opacity-70 ${rot}`}
          style={{
            backgroundImage: "radial-gradient(#1d2417 1.2px,transparent 1.7px)",
            backgroundSize: "6px 6px",
          }}
        />
        <div
          className={`relative flex flex-col gap-3 rounded-[3px] border-2 border-ink bg-paper p-[clamp(16px,2vw,24px)] pt-[clamp(26px,2.6vw,34px)] shadow-[5px_5px_0_-1px_#fbf7ee,5px_5px_0_1px_#1d2417,10px_10px_0_-1px_#fbf7ee,10px_10px_0_1px_#1d2417,0_26px_30px_-14px_rgba(29,36,23,.35)] transition-transform duration-300 ease-(--ease-afa) group-hover:translate-y-[-4px] group-hover:rotate-0 ${rot}`}
        >
          {/* Baguette porte-journal (comme dans un salon de lecture) */}
          <div
            aria-hidden="true"
            className="absolute -top-[11px] -right-[18px] -left-[18px] h-5 rounded-[10px] border-[1.5px] border-ink shadow-[0_5px_8px_rgba(29,36,23,.3),inset_0_2px_0_rgba(255,255,255,.3)]"
            style={{ background: "linear-gradient(180deg,#c89160 0%,#a5653a 45%,#8c4a2f 70%,#6b3520 100%)" }}
          >
            {["-left-3", "-right-3"].map((pos) => (
              <span
                key={pos}
                className={`absolute top-1/2 -mt-[11px] size-[22px] rounded-full border-[1.5px] border-ink ${pos}`}
                style={{ background: "radial-gradient(circle at 35% 35%,#f6d58a,#e9b44c 45%,#a8761c)" }}
              />
            ))}
            {["left-[28%]", "right-[28%]"].map((pos) => (
              <span
                key={pos}
                className={`absolute -top-[5px] h-7 w-3.5 rounded-[3px] border-[1.5px] border-ink ${pos}`}
                style={{ background: "linear-gradient(90deg,#9aa094,#f1f2ec,#9aa094)" }}
              />
            ))}
          </div>
          <p
            aria-hidden="true"
            className="border-t-2 border-b-[1.5px] border-ink pt-1.5 pb-0.5 text-center font-ink text-[clamp(24px,2.6vw,36px)] leading-[1.15]"
          >
            La Veille du Vivrier
          </p>
          <p className="-mt-1 flex flex-wrap justify-between gap-2.5 border-b-4 border-ink pb-2 text-[12px] font-semibold text-ink-soft">
            <span>{item.source}</span>
            {isNew ? (
              <span className="rounded-full bg-accent px-2 font-extrabold text-ink uppercase">Nouveau</span>
            ) : (
              <span>Daté &amp; sourcé</span>
            )}
            <span>
              Édition du <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
            </span>
          </p>

          {alt ? (
            <>
              <p className="text-center text-[13px] font-extrabold tracking-[0.14em] text-accent-text uppercase">
                — {kicker} —
              </p>
              <h3 className="text-center text-[clamp(26px,2.6vw,38px)] leading-[1.02] font-black tracking-[-0.035em] [text-wrap:balance]">
                {item.title}
              </h3>
            </>
          ) : (
            <>
              <p className="bg-ink px-3 pt-1.5 pb-1 text-center text-[clamp(28px,3.6vw,52px)] leading-none font-black tracking-[-0.03em] text-paper uppercase">
                {kicker}
              </p>
              <h3 className="text-[clamp(22px,2.1vw,30px)] leading-[1.08] font-extrabold tracking-[-0.025em] [text-wrap:balance]">
                {item.title}
              </h3>
            </>
          )}

          {item.crops.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {item.crops.map((c) => (
                <li
                  key={c.slug}
                  className="rounded-full border-[1.5px] border-afa px-3 py-0.5 text-[12px] font-bold text-afa"
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
          {item.excerpt && (
            <p className="line-clamp-6 text-[15px] leading-normal [column-gap:20px] [column-rule:1px_solid_#ddd5c3] [columns:2_190px]">
              {item.excerpt}
            </p>
          )}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-extrabold text-forest underline decoration-2 underline-offset-4 after:absolute after:inset-0"
          >
            Lire l&apos;article sur {item.source.split(" — ")[0]} <span aria-hidden="true">↗</span>
            <span className="sr-only"> (ouvre le site de la source dans un nouvel onglet)</span>
          </a>
        </div>
      </div>
    </article>
  );
}
