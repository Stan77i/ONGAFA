import Link from "next/link";
import { Checkbox } from "./Inputs";

/**
 * Consentement explicite et versionné (la version est enregistrée avec la réponse, table consents).
 * Jamais pré-coché.
 */
export function ConsentCheckbox({
  name,
  version,
  children,
}: {
  name: string;
  version: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card bg-sand p-4 ring-1 ring-rule">
      <input type="hidden" name={`${name}_version`} value={version} />
      <Checkbox name={name} required label={children} />
      <p className="pl-9 text-meta text-ink-soft">
        <Link href="/confidentialite" className="font-semibold text-afa underline">
          Lire la politique de confidentialité
        </Link>
      </p>
    </div>
  );
}
