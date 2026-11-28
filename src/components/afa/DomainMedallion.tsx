/* eslint-disable @next/next/no-img-element -- export statique (GitHub Pages) */
import type { domains } from "@/content/afa";
import { domainIcon } from "./domains";
import { AfaIcon } from "./icons";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Slug = (typeof domains)[number]["slug"];
type Photo = { src: string; w: number; h: number; kind: "object" | "portrait" };

/** Photos détourées (public/photos/) qui remplacent l'icône dessinée d'un domaine. */
const photos: Partial<Record<Slug, Photo>> = {
  manioc: { src: "manioc-detoure.webp", w: 1030, h: 524, kind: "object" },
  mais: { src: "mais-detoure.webp", w: 945, h: 562, kind: "object" },
  femmes: { src: "femme-detoure.webp", w: 480, h: 520, kind: "portrait" },
  jeunes: { src: "homme-detoure.webp", w: 480, h: 466, kind: "portrait" },
  commercialisation: { src: "camion-detoure.webp", w: 640, h: 501, kind: "object" },
};

/**
 * Médaillon d'un domaine d'intervention. Avec photo : l'objet déborde du cercle sur les côtés,
 * la personne sort du cercle par le haut (bas du buste découpé par le cercle). Sinon : l'icône.
 * Décoratif : le titre du domaine est toujours écrit à côté.
 */
export function DomainMedallion({ slug, bg = "#fff" }: { slug: Slug; bg?: string }) {
  const photo = photos[slug];
  return (
    <span
      aria-hidden="true"
      className="relative grid size-[clamp(72px,8vw,128px)] flex-none place-items-center rounded-full border-[1.5px] border-ink"
      style={{ background: photo ? "#efe6d2" : bg }}
    >
      {!photo ? (
        <AfaIcon name={domainIcon[slug]} size={52} className="h-auto w-[56%]" />
      ) : photo.kind === "portrait" ? (
        <span className="absolute inset-x-0 bottom-0 h-[150%] overflow-hidden rounded-b-[999px]">
          <img
            src={`${BASE}/photos/${photo.src}`}
            width={photo.w}
            height={photo.h}
            alt=""
            loading="lazy"
            className="absolute bottom-0 left-1/2 block h-auto w-[118%] max-w-none -translate-x-1/2"
          />
        </span>
      ) : (
        <img
          src={`${BASE}/photos/${photo.src}`}
          width={photo.w}
          height={photo.h}
          alt=""
          loading="lazy"
          className="absolute top-1/2 left-1/2 block h-auto w-[116%] max-w-none sm:w-[138%] -translate-x-1/2 -translate-y-1/2 -rotate-6 drop-shadow-[0_8px_6px_rgba(29,36,23,.3)]"
        />
      )}
    </span>
  );
}
