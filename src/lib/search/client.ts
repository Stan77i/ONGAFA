"use client";

import type { SearchIndex } from "./types";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
let pending: Promise<SearchIndex | null> | null = null;

/** Index de recherche, téléchargé une seule fois (à l'ouverture de la recherche ou au repos). */
export function loadSearchIndex(): Promise<SearchIndex | null> {
  pending ??= fetch(`${BASE}/recherche.json`)
    .then((r) => (r.ok ? (r.json() as Promise<SearchIndex>) : null))
    .catch(() => null);
  return pending;
}

/** Ouvre la recherche depuis n'importe quel bouton. */
export const openSearch = () => window.dispatchEvent(new Event("afa:search"));

const SEEN = "afa:veille-vue";
/** Date de la dernière consultation de la veille (localStorage, propre à ce navigateur). */
export function veilleSeenAt(): number | null {
  try {
    const v = window.localStorage.getItem(SEEN);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
}
export function markVeilleSeen() {
  try {
    window.localStorage.setItem(SEEN, String(Date.now()));
    window.dispatchEvent(new Event("afa:veille-vue"));
  } catch {
    /* navigation privée : sans mémoire, pas de pastille */
  }
}

/** Normalise pour comparer sans accents ni casse. */
export const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’']/g, " ");
