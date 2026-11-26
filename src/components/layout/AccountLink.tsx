import Link from "next/link";
import { UserRound } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";

const cls =
  "inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-semibold text-forest hover:bg-sand";

/** Lien de compte selon la session (lit les cookies : à placer sous <Suspense>). */
export async function AccountLink() {
  const user = await getSessionUser();
  return (
    <Link href={user ? "/compte" : "/connexion"} className={cls}>
      <UserRound className="size-5" aria-hidden="true" />
      {user ? "Mon compte" : "Se connecter"}
    </Link>
  );
}

export function AccountLinkFallback() {
  return (
    <Link href="/compte" className={cls}>
      <UserRound className="size-5" aria-hidden="true" />
      Compte
    </Link>
  );
}
