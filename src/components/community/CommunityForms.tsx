"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Flag } from "lucide-react";
import { Field } from "@/components/forms/Field";
import { FormFeedback, SubmitButton, useFormSubmit } from "@/components/forms/FormParts";
import { Checkbox, Input, Select, Textarea } from "@/components/forms/Inputs";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  createCommentAction,
  createPostAction,
  reportAction,
  testimonialAction,
} from "@/lib/community/actions";
import { initialFormState } from "@/lib/forms";

type Opt = { id: string; name: string };

export function PostForm({
  categories,
  crops,
  regions,
}: {
  categories: Opt[];
  crops: Opt[];
  regions: Opt[];
}) {
  const { state, onSubmit, pending } = useFormSubmit(createPostAction, initialFormState);
  const e = (k: string) => state.errors?.[k];
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormFeedback state={state} />
      <Field id="category_id" label="Thème" error={e("category_id")} required>
        {(a) => (
          <Select
            id={a.id}
            name="category_id"
            defaultValue=""
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          >
            <option value="" disabled>
              Choisir un thème
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field
        id="title"
        label="Votre question ou votre sujet, en une phrase"
        hint="Exemple : « Quelle variété de manioc pour un sol sableux ? »"
        error={e("title")}
        required
      >
        {(a) => (
          <Input
            id={a.id}
            name="title"
            maxLength={140}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <Field
        id="body"
        label="Détails"
        hint="Donnez le contexte : où, quelle culture, quelle quantité…"
        error={e("body")}
        required
      >
        {(a) => (
          <Textarea
            id={a.id}
            name="body"
            rows={6}
            maxLength={5000}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="crop_id" label="Culture concernée" optional>
          {(a) => (
            <Select id={a.id} name="crop_id" defaultValue="">
              <option value="">Aucune en particulier</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="region_id" label="Région" optional>
          {(a) => (
            <Select id={a.id} name="region_id" defaultValue="">
              <option value="">Non précisée</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <p className="text-meta text-ink-soft">
        Votre nom affiché apparaîtra avec votre message. Ne publiez jamais de numéro de téléphone ou
        d&apos;informations personnelles.{" "}
        <Link href="/charte-communaute" className="font-semibold text-afa underline">
          Charte de la communauté
        </Link>
      </p>
      <SubmitButton pending={pending}>Publier</SubmitButton>
    </form>
  );
}

/** Réponse : formulaire simple, vidé automatiquement après envoi réussi. */
export function CommentForm({ postId }: { postId: string }) {
  const [state, action] = useActionState(createCommentAction, initialFormState);
  return (
    <form action={action} className="space-y-3" noValidate>
      <FormFeedback state={state} />
      <input type="hidden" name="post_id" value={postId} />
      <Field id="body" label="Votre réponse" error={state.errors?.body}>
        {(a) => (
          <Textarea
            id={a.id}
            name="body"
            rows={4}
            maxLength={3000}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <SubmitButton>Répondre</SubmitButton>
    </form>
  );
}

const REASONS = [
  ["spam", "Publicité ou spam"],
  ["scam", "Arnaque ou fausse opportunité"],
  ["false_info", "Information fausse ou dangereuse"],
  ["abuse", "Propos insultants ou haineux"],
  ["personal_data", "Données personnelles exposées"],
  ["off_topic", "Hors sujet"],
  ["other", "Autre"],
] as const;

export function ReportButton({
  targetType,
  targetId,
  signedIn,
}: {
  targetType: "post" | "comment";
  targetId: string;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { state, onSubmit, pending } = useFormSubmit(reportAction, initialFormState);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-1 text-meta font-semibold text-ink-soft hover:text-danger"
      >
        <Flag className="size-4" aria-hidden="true" /> Signaler
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Signaler ce contenu">
        {!signedIn ? (
          <div className="space-y-4">
            <p>Connectez-vous pour signaler un contenu à l&apos;équipe AFA.</p>
            <Button href="/connexion">Se connecter</Button>
          </div>
        ) : state.status === "success" ? (
          <div className="space-y-4">
            <FormFeedback state={state} />
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <FormFeedback state={state} />
            <input type="hidden" name="target_type" value={targetType} />
            <input type="hidden" name="target_id" value={targetId} />
            <fieldset className="space-y-1">
              <legend className="mb-2 font-semibold">Pourquoi ce contenu pose-t-il problème ?</legend>
              {state.errors?.reason && (
                <p className="text-meta font-semibold text-danger">{state.errors.reason}</p>
              )}
              {REASONS.map(([k, l]) => (
                <label key={k} className="flex min-h-11 cursor-pointer items-center gap-3">
                  <input type="radio" name="reason" value={k} className="size-5 accent-afa" /> {l}
                </label>
              ))}
            </fieldset>
            <Field id="details" label="Précisions" optional>
              {(a) => <Textarea id={a.id} name="details" rows={3} maxLength={1000} />}
            </Field>
            <SubmitButton pending={pending}>Envoyer le signalement</SubmitButton>
          </form>
        )}
      </Modal>
    </>
  );
}

export function TestimonialForm({ consentText, defaultName }: { consentText: string; defaultName?: string }) {
  const { state, onSubmit, pending } = useFormSubmit(testimonialAction, initialFormState);
  const e = (k: string) => state.errors?.[k];
  if (state.status === "success") return <FormFeedback state={state} />;
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <FormFeedback state={state} />
      <Field
        id="quote"
        label="Votre témoignage"
        hint="Racontez ce que votre activité ou le réseau AFA a changé pour vous."
        error={e("quote")}
        required
      >
        {(a) => (
          <Textarea
            id={a.id}
            name="quote"
            rows={6}
            maxLength={1200}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <Field id="name" label="Nom affiché" hint="Votre prénom suffit." error={e("name")} required>
        {(a) => (
          <Input
            id={a.id}
            name="name"
            defaultValue={defaultName}
            aria-describedby={a.describedBy}
            aria-invalid={a.invalid}
          />
        )}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="place" label="Village ou ville" error={e("place")} required>
          {(a) => <Input id={a.id} name="place" aria-describedby={a.describedBy} aria-invalid={a.invalid} />}
        </Field>
        <Field
          id="activity"
          label="Activité"
          hint="Exemple : productrice de manioc"
          error={e("activity")}
          required
        >
          {(a) => (
            <Input id={a.id} name="activity" aria-describedby={a.describedBy} aria-invalid={a.invalid} />
          )}
        </Field>
      </div>
      <div className="rounded-card bg-sand p-4 ring-1 ring-rule">
        <Checkbox name="consent" label={consentText} aria-invalid={Boolean(e("consent"))} />
        {e("consent") && <p className="pl-9 text-meta font-semibold text-danger">{e("consent")}</p>}
      </div>
      <SubmitButton pending={pending}>Envoyer mon témoignage</SubmitButton>
    </form>
  );
}
