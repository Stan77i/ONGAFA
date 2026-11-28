import { Archivo, Reenie_Beanie, Shrikhand } from "next/font/google";

/**
 * Polices auto-hébergées au moment du build (aucun appel à Google chez le visiteur).
 *  - Archivo : interface et texte (variable, 400 à 900) ;
 *  - Shrikhand : titres géants, passés au filtre « encre » (InkFilter) ;
 *  - Reenie Beanie : écriture au bic (notes manuscrites, papier ligné).
 */
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  display: "swap",
});

export const shrikhand = Shrikhand({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-shrikhand",
  display: "swap",
});

export const reenieBeanie = Reenie_Beanie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-reenie",
  display: "swap",
});
