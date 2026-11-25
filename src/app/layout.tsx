import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { fraunces, sourceSans } from "./fonts";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.shortName} — ${site.name}`,
    template: `%s | ${site.shortName}`,
  },
  description: `${site.name} (${site.shortName}) : autonomisation des femmes rurales, filière manioc et vivrier en ${site.country}. ${site.slogan}.`,
  applicationName: site.shortName,
  // Phase 1 : le site n'est pas encore ouvert. Retirer à l'ouverture (phase SEO).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: site.colors.green,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${sourceSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
