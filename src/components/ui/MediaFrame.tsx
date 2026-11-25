import Image from "next/image";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

export type Media = {
  src: string;
  alt: string; // obligatoire : texte alternatif
  credit?: string; // crédit photo affiché
};

/**
 * Cadre d'image unique du site. Sans image : un fond crème avec le symbole AFA (jamais de photo générique).
 * Les images sont optimisées et chargées à la demande par Next.
 */
export function MediaFrame({
  media,
  ratio = "aspect-[16/10]",
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  priority = false,
  className,
}: {
  media?: Media | null;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("relative overflow-hidden rounded-card bg-cream", ratio, className)}>
      {media ? (
        <>
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
          {media.credit && (
            <figcaption className="absolute right-2 bottom-2 rounded bg-ink/70 px-2 py-0.5 text-xs text-white">
              © {media.credit}
            </figcaption>
          )}
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <Image
            src={site.logos.symbol}
            alt=""
            width={72}
            height={72}
            className="opacity-40 mix-blend-multiply"
          />
        </div>
      )}
    </figure>
  );
}
