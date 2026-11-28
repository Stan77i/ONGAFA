"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type MapElement = HTMLElement & { navigate?: (path: string) => void };

/**
 * Carte immersive (three.js) : `teaser` sur l'accueil (un clic ouvre /carte#r=<région>),
 * `full` sur la page /carte. Le module 3D (et three.js) n'est chargé que dans le navigateur,
 * puis la scène ne démarre qu'à l'approche de la section. Repli SVG accessible intégré.
 */
export function AfaMap3D({
  mode,
  shift = 0,
  shiftY = 0,
  className,
}: {
  mode: "full" | "teaser";
  /** Décalage horizontal de la carte (part de la largeur), pour laisser la place au texte. */
  shift?: number;
  shiftY?: number;
  className?: string;
}) {
  const ref = useRef<MapElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = ref.current;
    if (el) el.navigate = (path: string) => router.push(path);
  }, [router]);

  // Arrivée depuis l'aperçu de l'accueil (/carte#r=<région>) : la carte occupe le haut de la page.
  useEffect(() => {
    if (mode === "full" && /^#r=/.test(window.location.hash))
      window.scrollTo({ top: 0, behavior: "instant" });
  }, [mode]);

  useEffect(() => {
    let alive = true;
    import("./afa-map3d").then((m) => {
      if (alive) m.defineAfaMap3D();
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <afa-map3d
      ref={ref}
      mode={mode}
      shift={String(shift)}
      shift-y={String(shiftY)}
      href="/carte"
      className={cn("block bg-night", className)}
    />
  );
}
