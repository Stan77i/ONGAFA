"use client";

import Link from "next/link";
import { Field } from "@/components/forms/Field";
import { FormFeedback, HoneypotField, SubmitButton, useFormSubmit } from "@/components/forms/FormParts";
import { Checkbox, Input, Select, Textarea } from "@/components/forms/Inputs";
import { initialFormState, type FormState } from "@/lib/forms";
import { contactAction, joinAction } from "@/lib/producers/actions";
import type { Ref } from "@/lib/producers/data";
import { CONTACT_CATEGORIES, JOIN_PROFILES } from "@/lib/validation";

type Prefill = { full_name?: string; email?: string };

function ContactFields({ state, regions, prefill }: { state: FormState; regions: Ref[]; prefill?: Prefill }) {
  const v = (k: keyof Prefill | string) =>
    state.values?.[k] ?? (prefill as Record<string, string | undefined> | undefined)?.[k];
  const err = (k: string) => state.errors?.[k];
  return (
    <>
      <Field id="full_name" label="Votre nom" error={err("full_name")} required>
        {(a) => (
          <Input
            id={a.id}
            name="full_name"
            autoComplete="name"
            defaultValue={v("full_name")}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="phone"
          label="Téléphone"
          hint="Email ou téléphone : au moins l'un des deux."
          error={err("phone")}
        >
          {(a) => (
            <Input
              id={a.id}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              defaultValue={v("phone")}
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
            />
          )}
        </Field>
        <Field id="email" label="Email" error={err("email")}>
          {(a) => (
            <Input
              id={a.id}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              defaultValue={v("email")}
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
            />
          )}
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="region_id" label="Région" optional>
          {(a) => (
            <Select id={a.id} name="region_id" defaultValue={v("region_id") ?? ""}>
              <option value="">Choisir</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="city" label="Ville ou village" optional>
          {(a) => <Input id={a.id} name="city" defaultValue={v("city")} />}
        </Field>
      </div>
    </>
  );
}

function Consent({ state, text }: { state: FormState; text: string }) {
  return (
    <div className="rounded-card bg-sand p-4 ring-1 ring-rule">
      <Checkbox
        name="consent"
        label={text}
        defaultChecked={state.values?.consent === "on"}
        aria-invalid={Boolean(state.errors?.consent)}
      />
      {state.errors?.consent && (
        <p className="pl-9 text-meta font-semibold text-danger">{state.errors.consent}</p>
      )}
      <p className="pl-9 text-meta">
        <Link href="/confidentialite" className="font-semibold text-afa underline">
          Politique de confidentialité
        </Link>
      </p>
    </div>
  );
}

export function ContactForm({
  regions,
  consentText,
  prefill,
}: {
  regions: Ref[];
  consentText: string;
  prefill?: Prefill;
}) {
  const { state, onSubmit, pending } = useFormSubmit(contactAction, initialFormState);
  if (state.status === "success") return <FormFeedback state={state} />;
  return (
    <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
      <FormFeedback state={state} />
      <HoneypotField />
      <Field id="category" label="Votre question concerne" error={state.errors?.category} required>
        {(a) => (
          <Select
            id={a.id}
            name="category"
            defaultValue={state.values?.category ?? ""}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          >
            <option value="" disabled>
              Choisir un sujet
            </option>
            {CONTACT_CATEGORIES.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field
        id="message"
        label="Votre question"
        hint="Exemple : « Je suis productrice de manioc à Soubré, je cherche un acheteur pour 2 tonnes. »"
        error={state.errors?.message}
        required
      >
        {(a) => (
          <Textarea
            id={a.id}
            name="message"
            rows={5}
            defaultValue={state.values?.message}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <ContactFields state={state} regions={regions} prefill={prefill} />
      <Consent state={state} text={consentText} />
      <SubmitButton pending={pending}>Envoyer ma question</SubmitButton>
    </form>
  );
}

export function JoinForm({
  regions,
  consentText,
  prefill,
}: {
  regions: Ref[];
  consentText: string;
  prefill?: Prefill;
}) {
  const { state, onSubmit, pending } = useFormSubmit(joinAction, initialFormState);
  if (state.status === "success") return <FormFeedback state={state} />;
  return (
    <form onSubmit={onSubmit} className="relative space-y-5" noValidate>
      <FormFeedback state={state} />
      <HoneypotField />
      <Field id="profile_type" label="Vous êtes" error={state.errors?.profile_type} required>
        {(a) => (
          <Select
            id={a.id}
            name="profile_type"
            defaultValue={state.values?.profile_type ?? ""}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          >
            <option value="" disabled>
              Choisir votre profil
            </option>
            {JOIN_PROFILES.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <ContactFields state={state} regions={regions} prefill={prefill} />
      <Field id="organization" label="Organisation, coopérative ou entreprise" optional>
        {(a) => <Input id={a.id} name="organization" defaultValue={state.values?.organization} />}
      </Field>
      <Field id="message" label="Votre message" optional error={state.errors?.message}>
        {(a) => (
          <Textarea
            id={a.id}
            name="message"
            rows={4}
            defaultValue={state.values?.message}
            aria-describedby={a.describedBy}
          />
        )}
      </Field>
      <Consent state={state} text={consentText} />
      <SubmitButton pending={pending}>Envoyer ma demande</SubmitButton>
    </form>
  );
}
