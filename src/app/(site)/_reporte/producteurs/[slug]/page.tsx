import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MapPin, Phone } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { getSessionUser } from "@/lib/auth/session";
import { getProducerBySlug } from "@/lib/producers/data";
import { PRODUCER_NEEDS } from "@/lib/validation";

export const metadata: Metadata = { title: "Fiche producteur", robots: { index: false } };

const needLabels = Object.fromEntries(PRODUCER_NEEDS);

async function Profile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [user, p] = await Promise.all([getSessionUser(), getProducerBySlug(slug)]);
  if (!p) {
    if (!user) {
      return (
        <div className="space-y-4 rounded-card bg-white p-6 text-ink ring-1 ring-rule">
          <p>Cette fiche est réservée aux membres connectés du réseau AFA.</p>
          <Button href={`/connexion?next=/producteurs/${encodeURIComponent(slug)}`}>Se connecter</Button>
        </div>
      );
    }
    notFound();
  }
  const place = [p.village, p.city, p.region?.name].filter(Boolean).join(", ");
  return (
    <article className="space-y-6 rounded-card bg-white p-5 text-ink ring-1 ring-rule sm:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar name={p.displayName} size={80} className="text-2xl" />
        <div className="space-y-2">
          <h1 className="font-display text-h1 font-semibold text-forest">{p.displayName}</h1>
          {place && (
            <p className="flex items-center gap-1 text-ink-soft">
              <MapPin className="size-5" aria-hidden="true" />
              {place}
            </p>
          )}
          {p.verified && <VerifiedBadge />}
        </div>
      </header>
      <section className="space-y-2">
        <h2 className="font-semibold">Cultures</h2>
        <div className="flex flex-wrap gap-2">
          {p.crops.map((c) => (
            <Badge key={c.id} tone="crop">
              {c.name}
              {c.areaHa ? ` · ${String(c.areaHa).replace(".", ",")} ha` : ""}
            </Badge>
          ))}
        </div>
        {(p.totalAreaHa || p.experienceYears) && (
          <p className="text-ink-soft">
            {p.totalAreaHa ? `${String(p.totalAreaHa).replace(".", ",")} ha au total` : ""}
            {p.totalAreaHa && p.experienceYears ? " · " : ""}
            {p.experienceYears
              ? `${p.experienceYears} an${p.experienceYears > 1 ? "s" : ""} d'expérience`
              : ""}
          </p>
        )}
      </section>
      {p.description && (
        <section className="space-y-2">
          <h2 className="font-semibold">Présentation</h2>
          <p className="whitespace-pre-line">{p.description}</p>
        </section>
      )}
      {(p.productionNote || p.availabilityNote) && (
        <section className="space-y-2">
          <h2 className="font-semibold">Production</h2>
          {p.productionNote && <p className="whitespace-pre-line">{p.productionNote}</p>}
          {p.availabilityNote && (
            <p className="rounded-card bg-leaf/10 p-3 font-semibold text-forest">
              Disponible : {p.availabilityNote}
            </p>
          )}
        </section>
      )}
      {p.needs.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold">Recherche</h2>
          <div className="flex flex-wrap gap-2">
            {p.needs.map((n) => (
              <Badge key={n} tone="category">
                {needLabels[n] ?? n}
              </Badge>
            ))}
          </div>
        </section>
      )}
      {p.phone && user && (
        <Button
          href={`tel:${p.phone.replace(/[^0-9+]/g, "")}`}
          icon={<Phone className="size-5" aria-hidden="true" />}
        >
          Appeler {p.phone}
        </Button>
      )}
    </article>
  );
}

export default function ProducerPage({ params }: PageProps<"/producteurs/[slug]">) {
  return (
    <div className="bg-sand py-8 sm:py-12">
      <Container className="max-w-3xl space-y-6">
        <Breadcrumb
          items={[
            { href: "/", label: "Accueil" },
            { href: "/producteurs", label: "Producteurs" },
            { href: "#", label: "Fiche" },
          ]}
        />
        <Suspense fallback={<CardSkeleton />}>
          <Profile params={params} />
        </Suspense>
      </Container>
    </div>
  );
}
