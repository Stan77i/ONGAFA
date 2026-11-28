import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { footerNav, legalNav } from "@/config/navigation";
import { site } from "@/config/site";

/**
 * Pied de page (panneau forêt). Coordonnées et réseaux sociaux affichés uniquement s'ils sont
 * renseignés dans src/config/site.ts (rien d'inventé).
 */
export function SiteFooter({ newsletter }: { newsletter?: ReactNode }) {
  const { email, phone, address } = site.contact;
  return (
    <footer className="panel-frame pb-2 sm:pb-4">
      <div className="on-dark rounded-[22px] bg-forest px-[clamp(20px,4vw,64px)] pt-[clamp(32px,4.5vw,64px)] pb-7 text-sand sm:rounded-[28px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-10">
          <div className="flex flex-col gap-4">
            <Image
              src={site.logos.mark}
              alt={`Logo de l'${site.shortName}`}
              width={132}
              height={132}
              className="size-[132px] object-contain"
            />
            <p className="text-[20px] leading-[1.2] font-extrabold text-white">{site.name}</p>
            <p className="hand text-[34px] text-mint">{site.slogan}</p>
            <p className="text-[13px] text-mint">Reconnue sous le {site.registration}</p>
            {(email || phone || address) && (
              <address className="space-y-1 text-[15px] not-italic">
                {address && <p>{address}</p>}
                {phone && (
                  <p>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="underline">
                      {phone}
                    </a>
                  </p>
                )}
                {email && (
                  <p>
                    <a href={`mailto:${email}`} className="underline">
                      {email}
                    </a>
                  </p>
                )}
              </address>
            )}
            {site.social.length > 0 && (
              <ul className="flex flex-wrap gap-3">
                {site.social.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      className="font-semibold underline"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title} className="flex flex-col">
              <p className="eyebrow mb-2 text-mint">{group.title}</p>
              <ul>
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex min-h-11 items-center text-sand hover:text-white hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {newsletter && <div className="mt-12 border-t border-sand/20 pt-10">{newsletter}</div>}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-sand/20 pt-[22px] text-[13px] text-mint">
          <span>
            © {site.shortName} — {site.name}
          </span>
          {legalNav.length > 0 && (
            <ul className="flex flex-wrap gap-x-5">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex min-h-11 items-center hover:text-white hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <span>{site.country}</span>
        </div>
      </div>
    </footer>
  );
}
