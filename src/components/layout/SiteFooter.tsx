import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { footerNav, legalNav } from "@/config/navigation";
import { site } from "@/config/site";
import { InkUnderline } from "@/components/brand/InkUnderline";

/**
 * Pied de page. Les coordonnées et réseaux sociaux ne s'affichent que s'ils sont renseignés
 * dans src/config/site.ts (rien d'inventé). La newsletter est fournie par la page (formulaire relié).
 */
export function SiteFooter({ newsletter }: { newsletter?: ReactNode }) {
  const { email, phone, address } = site.contact;
  return (
    <footer className="on-dark bg-forest text-sand">
      <div className="mx-auto max-w-[75rem] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div className="space-y-4">
            <Image
              src={site.logos.seal}
              alt={`Sceau de l'${site.shortName}`}
              width={96}
              height={96}
              className="rounded-full bg-white"
            />
            <p className="font-display text-h3 font-semibold text-white">{site.name}</p>
            <div className="max-w-xs">
              <p className="font-display text-lg text-leaf-light italic">{site.slogan}</p>
              <InkUnderline color="#df8433" className="mt-1 w-48" />
            </div>
            {(email || phone || address) && (
              <address className="space-y-1 not-italic">
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

          <div className="grid gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="mb-3 text-meta font-semibold tracking-[0.12em] text-leaf-light uppercase">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-block py-3 hover:text-white hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {newsletter && <div className="mt-12 border-t border-white/15 pt-10">{newsletter}</div>}

        <div className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-6 text-meta sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.shortName} — {site.name}
          </p>
          {legalNav.length > 0 && (
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-3 hover:text-white hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
