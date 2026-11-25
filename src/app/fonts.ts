import { Fraunces, Source_Sans_3 } from "next/font/google";

/**
 * Polices auto-hébergées au moment du build (aucun appel à Google chez le visiteur).
 * Variables : seul l'axe de graisse est chargé, pour limiter le poids.
 */
export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

export const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-sans",
  display: "swap",
});
