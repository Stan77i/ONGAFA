"use client";

import { useEffect, useState } from "react";
import { loadSearchIndex, veilleSeenAt } from "@/lib/search/client";

/**
 * Nombre d'informations de veille publiées depuis la dernière consultation de la veille
 * (mémorisée dans ce navigateur). Rien au premier passage.
 */
export function NewsBadge({ className }: { className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let alive = true;
    const compute = () => {
      const seen = veilleSeenAt();
      if (seen === null) return setN(0);
      loadSearchIndex().then((idx) => {
        if (!alive || !idx) return;
        setN(idx.items.filter((i) => i.g === "Veille" && i.d && Date.parse(i.d) > seen).length);
      });
    };
    const idle = window.setTimeout(compute, 1200);
    window.addEventListener("afa:veille-vue", compute);
    return () => {
      alive = false;
      window.clearTimeout(idle);
      window.removeEventListener("afa:veille-vue", compute);
    };
  }, []);
  if (n === 0) return null;
  return (
    <span
      className={
        className ??
        "ml-1.5 inline-grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] leading-5 font-extrabold text-ink"
      }
    >
      {n > 99 ? "99+" : n}
      <span className="sr-only">
        {" "}
        nouvelle{n > 1 ? "s" : ""} information{n > 1 ? "s" : ""}
      </span>
    </span>
  );
}
