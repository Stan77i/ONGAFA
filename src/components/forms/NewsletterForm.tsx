import { Button } from "@/components/ui/Button";

/**
 * Inscription à la lettre d'information. `action` = Server Action branchée en phase 9 (notifications).
 * Sans action fournie, le composant ne doit pas être affiché.
 */
export function NewsletterForm({ action }: { action: (formData: FormData) => void | Promise<void> }) {
  return (
    <form action={action} className="grid gap-4 lg:grid-cols-[1fr_1.2fr] lg:items-end">
      <div>
        <p className="font-display text-h3 font-semibold text-white">La lettre du vivrier</p>
        <p className="text-sand">L&apos;essentiel de la veille et de l&apos;agenda AFA, une fois par mois.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Adresse email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="votre@email.com"
          className="min-h-12 flex-1 rounded-full border-2 border-transparent bg-white px-5 text-ink placeholder:text-ink-soft/70 focus:border-harvest"
        />
        <Button type="submit" variant="accent">
          M&apos;inscrire
        </Button>
      </div>
    </form>
  );
}
