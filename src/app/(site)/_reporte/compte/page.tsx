import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { DataRightsForms, SignOutButton } from "@/components/account/AccountParts";
import { Container } from "@/components/layout/Section";
import { Alert } from "@/components/ui/Alert";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { requireSessionUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/format";
import { getMyProducer, getMyRequests } from "@/lib/producers/data";
import { CONTACT_CATEGORIES } from "@/lib/validation";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false } };

const statusLabels: Record<string, string> = {
  new: "Envoyée",
  in_progress: "En cours",
  answered: "Répondue",
  closed: "Close",
};
const categoryLabels = Object.fromEntries(CONTACT_CATEGORIES);
const visibilityLabels = {
  private: "Visible seulement par AFA",
  members: "Visible des membres connectés",
  public: "Visible de tous",
};

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-card bg-white p-5 text-ink ring-1 ring-rule sm:p-6">
      <h2 className="font-display text-h3 font-semibold text-forest">{title}</h2>
      {children}
    </section>
  );
}

async function Account({ searchParams }: { searchParams: Promise<{ profil?: string }> }) {
  const user = await requireSessionUser("/compte");
  const [profile, requests, sp] = await Promise.all([getMyProducer(user.id), getMyRequests(), searchParams]);
  return (
    <div className="space-y-6">
      {sp.profil && (
        <Alert
          tone="success"
          title={sp.profil === "cree" ? "Votre fiche producteur est créée" : "Modifications enregistrées"}
        >
          {sp.profil === "cree"
            ? "Bienvenue dans le réseau AFA ! L'équipe pourra vérifier votre fiche et vous contacter."
            : "Votre fiche est à jour."}
        </Alert>
      )}

      <Card title="Ma fiche producteur">
        {profile ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-xl font-semibold text-forest">{profile.displayName}</p>
              {profile.verified ? <VerifiedBadge /> : <Badge>En attente de vérification par AFA</Badge>}
            </div>
            <p className="text-ink-soft">
              {[profile.village, profile.city, profile.region?.name].filter(Boolean).join(", ") ||
                "Localisation non renseignée"}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.crops.map((c) => (
                <Badge key={c.id} tone="crop">
                  {c.name}
                  {c.areaHa ? ` · ${String(c.areaHa).replace(".", ",")} ha` : ""}
                </Badge>
              ))}
            </div>
            <p className="text-meta text-ink-soft">{visibilityLabels[profile.visibility]}</p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button href="/producteurs/inscription" variant="secondary">
                Modifier ma fiche
              </Button>
              {profile.visibility !== "private" && (
                <Button href={`/producteurs/${profile.slug}`} variant="ghost">
                  Voir ma fiche publique
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-ink-soft">
              Vous produisez du manioc ou d&apos;autres cultures vivrières ? Rejoignez l&apos;annuaire du
              réseau AFA.
            </p>
            <Button href="/producteurs/inscription" variant="accent">
              Créer ma fiche producteur
            </Button>
          </div>
        )}
      </Card>

      <Card title="Mes questions à AFA">
        {requests.length === 0 ? (
          <p className="text-ink-soft">Aucune question pour le moment.</p>
        ) : (
          <ul className="divide-y divide-rule">
            {requests.map((r) => (
              <li key={r.id} className="space-y-1 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="category">{categoryLabels[r.category] ?? r.category}</Badge>
                  <Badge tone={r.status === "answered" ? "crop" : "neutral"}>
                    {statusLabels[r.status] ?? r.status}
                  </Badge>
                  <span className="text-meta text-ink-soft">{formatDate(r.createdAt)}</span>
                </div>
                <p className="line-clamp-2">{r.message}</p>
                {r.replies > 0 && (
                  <p className="text-meta font-semibold text-afa">
                    {r.replies} réponse{r.replies > 1 ? "s" : ""} d&apos;AFA
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
        <Button href="/question-a-afa" variant="secondary">
          Poser une question
        </Button>
      </Card>

      <Card title="Mes données">
        <p className="text-ink-soft">
          Connecté avec {user.email}. Vous pouvez demander une copie de vos données ou leur suppression à tout
          moment.{" "}
          <Link href="/confidentialite" className="font-semibold text-afa underline">
            En savoir plus
          </Link>
        </p>
        <DataRightsForms />
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button href="/compte/nouveau-mot-de-passe" variant="ghost">
          Changer mon mot de passe
        </Button>
        <SignOutButton />
      </div>
    </div>
  );
}

export default function AccountPage({ searchParams }: PageProps<"/compte">) {
  return (
    <div className="bg-sand py-10 sm:py-14">
      <Container className="max-w-3xl space-y-6">
        <h1 className="font-display text-h1 font-semibold text-forest">Mon compte</h1>
        <Suspense fallback={<CardSkeleton />}>
          <Account searchParams={searchParams as Promise<{ profil?: string }>} />
        </Suspense>
      </Container>
    </div>
  );
}
