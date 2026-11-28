import { buildSearchIndex } from "@/lib/search/build";

/** Index de recherche, généré à la construction (fichier statique sur GitHub Pages). */
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await buildSearchIndex());
}
