"use client";

import { useFormStatus } from "react-dom";
import { startTransition, useActionState, type FormEvent, type ReactNode } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import type { FormState } from "@/lib/forms";

/**
 * Envoi d'un formulaire SANS la réinitialisation automatique de React 19.
 * Indispensable quand le formulaire contient des listes déroulantes, des cases contrôlées ou des étapes :
 * React remettrait sinon ces champs à leur valeur initiale après une erreur, en silence.
 */
export function useFormSubmit(
  action: (state: FormState, fd: FormData) => Promise<FormState>,
  initial: FormState,
) {
  const [state, dispatch, pending] = useActionState(action, initial);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return { state, onSubmit, pending };
}

/** Bouton d'envoi : « Envoi en cours » et blocage pendant l'envoi (pas de double envoi). */
export function SubmitButton({
  children,
  className,
  pending: forced,
}: {
  children: ReactNode;
  className?: string;
  pending?: boolean;
}) {
  const { pending: formPending } = useFormStatus();
  const pending = forced ?? formPending;
  return (
    <Button type="submit" loading={pending} className={className ?? "w-full sm:w-auto"} size="lg">
      {children}
    </Button>
  );
}

/** Message global du formulaire (erreur ou succès), annoncé aux lecteurs d'écran. */
export function FormFeedback({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <Alert
      tone={state.status === "success" ? "success" : "error"}
      title={state.status === "success" ? "C'est fait" : undefined}
    >
      {state.message}
    </Alert>
  );
}

/** Champ piège pour les robots : invisible pour les humains et les lecteurs d'écran. */
export function HoneypotField() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Site web
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
