"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field } from "@/components/forms/Field";
import { FormFeedback, SubmitButton } from "@/components/forms/FormParts";
import { Input } from "@/components/forms/Inputs";
import { forgotPasswordAction, signInAction, signUpAction, updatePasswordAction } from "@/lib/auth/actions";
import { initialFormState, type FormState } from "@/lib/forms";

const err = (s: FormState, k: string) => s.errors?.[k];

export function SignInForm({ next, expired }: { next: string; expired?: boolean }) {
  const [state, action] = useActionState(signInAction, initialFormState);
  return (
    <form action={action} className="space-y-5" noValidate>
      {expired && state.status === "idle" && (
        <FormFeedback
          state={{
            status: "error",
            message: "Ce lien a expiré ou a déjà été utilisé. Connectez-vous, ou demandez un nouveau lien.",
          }}
        />
      )}
      <FormFeedback state={state} />
      <input type="hidden" name="next" value={next} />
      <Field id="email" label="Adresse email" error={err(state, "email")} required>
        {(a) => (
          <Input
            id={a.id}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            defaultValue={state.values?.email}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <Field id="password" label="Mot de passe" error={err(state, "password")} required>
        {(a) => (
          <Input
            id={a.id}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <SubmitButton>Se connecter</SubmitButton>
      <p className="flex flex-col gap-2 text-ink-soft sm:flex-row sm:gap-6">
        <Link href="/mot-de-passe-oublie" className="font-semibold text-afa underline">
          Mot de passe oublié ?
        </Link>
        <Link
          href={`/creer-un-compte?next=${encodeURIComponent(next)}`}
          className="font-semibold text-afa underline"
        >
          Créer un compte
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const [state, action] = useActionState(signUpAction, initialFormState);
  if (state.status === "success") return <FormFeedback state={state} />;
  return (
    <form action={action} className="space-y-5" noValidate>
      <FormFeedback state={state} />
      <input type="hidden" name="next" value={next} />
      <Field
        id="display_name"
        label="Votre nom"
        hint="Le nom affiché dans la communauté."
        error={err(state, "display_name")}
        required
      >
        {(a) => (
          <Input
            id={a.id}
            name="display_name"
            autoComplete="name"
            required
            defaultValue={state.values?.display_name}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <Field
        id="email"
        label="Adresse email"
        hint="Un lien de confirmation vous sera envoyé."
        error={err(state, "email")}
        required
      >
        {(a) => (
          <Input
            id={a.id}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            defaultValue={state.values?.email}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <Field
        id="password"
        label="Mot de passe"
        hint="8 caractères minimum."
        error={err(state, "password")}
        required
      >
        {(a) => (
          <Input
            id={a.id}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <p className="text-meta text-ink-soft">
        En créant un compte, vous acceptez que l&apos;ONG AFA conserve votre nom et votre email pour gérer
        votre compte.{" "}
        <Link href="/confidentialite" className="font-semibold text-afa underline">
          Politique de confidentialité
        </Link>
      </p>
      <SubmitButton>Créer mon compte</SubmitButton>
      <p className="text-ink-soft">
        Déjà inscrit ?{" "}
        <Link
          href={`/connexion?next=${encodeURIComponent(next)}`}
          className="font-semibold text-afa underline"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, initialFormState);
  if (state.status === "success") return <FormFeedback state={state} />;
  return (
    <form action={action} className="space-y-5" noValidate>
      <FormFeedback state={state} />
      <Field id="email" label="Adresse email du compte" error={err(state, "email")} required>
        {(a) => (
          <Input
            id={a.id}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            defaultValue={state.values?.email}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <SubmitButton>Recevoir un lien</SubmitButton>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action] = useActionState(updatePasswordAction, initialFormState);
  if (state.status === "success") {
    return (
      <div className="space-y-4">
        <FormFeedback state={state} />
        <Link href="/compte" className="font-semibold text-afa underline">
          Aller à mon compte
        </Link>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-5" noValidate>
      <FormFeedback state={state} />
      <Field
        id="password"
        label="Nouveau mot de passe"
        hint="8 caractères minimum."
        error={err(state, "password")}
        required
      >
        {(a) => (
          <Input
            id={a.id}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <Field
        id="password_confirm"
        label="Confirmez le mot de passe"
        error={err(state, "password_confirm")}
        required
      >
        {(a) => (
          <Input
            id={a.id}
            name="password_confirm"
            type="password"
            autoComplete="new-password"
            required
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <SubmitButton>Enregistrer</SubmitButton>
    </form>
  );
}
