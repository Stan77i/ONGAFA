import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import { InkFilter } from "@/components/afa/InkFilter";
import { archivo, reenieBeanie, shrikhand } from "./fonts";
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
  themeColor: "#1d2417",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${archivo.variable} ${shrikhand.variable} ${reenieBeanie.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <InkFilter />
        {children}
      </body>
    </html>
  );
}
