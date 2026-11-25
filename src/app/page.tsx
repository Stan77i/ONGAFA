import Image from "next/image";
import { site } from "@/config/site";

/**
 * Page provisoire (Phase 1). La vraie page d'accueil arrive en Phase 3,
 * après le design system (Phase 2).
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <Image
        src={site.logos.seal}
        alt={`Logo de l'${site.shortName} — ${site.name}`}
        width={200}
        height={200}
        priority
      />
      <h1 className="text-2xl font-bold text-afa-green-dark sm:text-3xl">{site.name}</h1>
      <p className="text-lg font-semibold text-afa-green-dark">{site.slogan}</p>
      <p className="max-w-md text-base">Notre plateforme est en cours de construction.</p>
    </main>
  );
}
