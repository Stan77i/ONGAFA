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

export const hasDomainPhoto = (slug: Slug) => slug in photos;

/**
 * Photo détourée d'un domaine, à poser dans un cercle `relative` : l'objet déborde sur les côtés,
 * la personne sort du cercle par le haut (bas du buste découpé par le cercle). Décorative.
 */
export function DomainArt({ slug, wide = false }: { slug: Slug; wide?: boolean }) {
  const photo = photos[slug];
  if (!photo) return null;
  const img = (className: string) => (
    <img
      src={`${BASE}/photos/${photo.src}`}
      width={photo.w}
      height={photo.h}
      alt=""
      loading="lazy"
      className={className}
    />
  );
  return photo.kind === "portrait" ? (
    <span className="absolute inset-x-0 bottom-0 h-[150%] overflow-hidden rounded-b-[999px]">
      {img("absolute bottom-0 left-1/2 block h-auto w-[118%] max-w-none -translate-x-1/2")}
    </span>
  ) : (
    img(
      `absolute top-1/2 left-1/2 block h-auto max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-6 drop-shadow-[0_8px_6px_rgba(29,36,23,.3)] ${wide ? "w-[116%] sm:w-[138%]" : "w-[124%]"}`,
    )
  );
}

/**
 * Médaillon d'un domaine d'intervention : photo détourée si elle existe, sinon l'icône dessinée.
 * Décoratif : le titre du domaine est toujours écrit à côté.
 */
export function DomainMedallion({
  slug,
  bg = "#fff",
  className,
}: {
  slug: Slug;
  bg?: string;
  className?: string;
}) {
  const photo = slug in photos;
  return (
    <span
      aria-hidden="true"
      className={`relative grid flex-none place-items-center rounded-full border-[1.5px] border-ink ${className ?? "size-[clamp(72px,8vw,128px)]"}`}
      style={{ background: photo ? "#efe6d2" : bg }}
    >
      {photo ? (
        <DomainArt slug={slug} wide />
      ) : (
        <AfaIcon name={domainIcon[slug]} size={52} className="h-auto w-[56%]" />
      )}
    </span>
  );
}
