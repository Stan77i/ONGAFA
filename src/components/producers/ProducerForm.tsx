"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Field } from "@/components/forms/Field";
import { FormFeedback, SubmitButton, useFormSubmit } from "@/components/forms/FormParts";
import { Checkbox, Input, Select, Textarea } from "@/components/forms/Inputs";
import { Stepper } from "@/components/forms/Stepper";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { initialFormState } from "@/lib/forms";
import { saveProducerAction } from "@/lib/producers/actions";
import type { ProducerProfile, Ref } from "@/lib/producers/data";
import { PRODUCER_NEEDS } from "@/lib/validation";

const STEPS = [
  "Vous",
  "Où produisez-vous ?",
  "Vos cultures",
  "Production et besoins",
  "Présentation",
] as const;
/** Étape où se trouve chaque champ, pour y revenir en cas d'erreur. */
const FIELD_STEP: Record<string, number> = {
  display_name: 0,
  phone: 0,
  phone_visibility: 0,
  region_id: 1,
  city: 1,
  village: 1,
  crops: 2,
  total_area_ha: 2,
  experience_years: 2,
  production_note: 3,
  availability_note: 3,
  needs: 3,
  description: 4,
  visibility: 4,
  consent: 4,
};

const VISIBILITY = [
  ["members", "Membres connectés", "Recommandé : visible des membres du réseau AFA."],
  ["public", "Tout le monde", "Visible aussi des visiteurs non connectés."],
  ["private", "Seulement AFA", "Votre fiche n'apparaît pas dans l'annuaire."],
] as const;

function Choice({
  name,
  value,
  label,
  hint,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "flex min-h-14 cursor-pointer items-start gap-3 rounded-card p-4 ring-2 transition-colors",
        checked ? "bg-leaf/10 ring-afa" : "bg-white ring-rule hover:ring-field",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 size-5 accent-afa"
      />
      <span>
        <span className="block font-semibold text-ink">{label}</span>
        {hint && <span className="block text-meta text-ink-soft">{hint}</span>}
      </span>
    </label>
  );
}

export function ProducerForm({
  regions,
  crops,
  profile,
  consentText,
}: {
  regions: Ref[];
  crops: Ref[];
  profile: ProducerProfile | null;
  consentText: string;
}) {
  const { state, onSubmit, pending } = useFormSubmit(saveProducerAction, initialFormState);
  const [step, setStep] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>(profile?.crops.map((c) => c.id) ?? []);
  const [phoneVis, setPhoneVis] = useState(profile?.phoneVisibility ?? "private");
  const [visibility, setVisibility] = useState(profile?.visibility ?? "members");
  const topRef = useRef<HTMLDivElement>(null);
  const isNew = !profile;
  const v = (k: string, fallback?: string | number | null) =>
    state.values?.[k] ?? (fallback ?? undefined)?.toString();
  const err = (k: string) =>
    state.errors?.[k] ?? (k === "crops" ? state.errors?.["crops.0.area_ha"] : undefined);

  // Après une erreur serveur : revenir à la première étape concernée
  // (ajustement pendant le rendu quand la réponse change, sans effet ni rendu en cascade).
  const [handledState, setHandledState] = useState(state);
  if (state !== handledState) {
    setHandledState(state);
    const steps = Object.keys(state.errors ?? {}).map((k) => FIELD_STEP[k.split(".")[0]] ?? 0);
    if (state.status === "error" && steps.length) setStep(Math.min(...steps));
  }

  const go = (n: number) => {
    setLocalError(null);
    setStep(n);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const next = () => {
    const form = topRef.current?.closest("form");
    if (step === 0 && String(new FormData(form ?? undefined).get("display_name") ?? "").trim().length < 2) {
      return setLocalError("Indiquez votre nom ou celui de votre exploitation.");
    }
    if (step === 2 && selected.length === 0) return setLocalError("Choisissez au moins une culture.");
    go(step + 1);
  };
  const toggleCrop = (id: string) => {
    setLocalError(null); // le message « choisissez une culture » disparaît dès qu'on coche
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <div ref={topRef} className="scroll-mt-24 space-y-4">
        <Stepper current={step + 1} total={STEPS.length} title={STEPS[step]} />
        <FormFeedback state={state} />
        {localError && <FormFeedback state={{ status: "error", message: localError }} />}
      </div>
      <input type="hidden" name="is_new" value={isNew ? "1" : "0"} />

      {/* 1 — Vous */}
      <fieldset hidden={step !== 0} className="space-y-5">
        <legend className="sr-only">{STEPS[0]}</legend>
        <Field
          id="display_name"
          label="Votre nom ou celui de votre exploitation"
          error={err("display_name")}
          required
        >
          {(a) => (
            <Input
              id={a.id}
              name="display_name"
              autoComplete="name"
              defaultValue={v("display_name", profile?.displayName)}
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
            />
          )}
        </Field>
        <Field
          id="phone"
          label="Téléphone"
          optional
          hint="Pour qu'AFA puisse vous appeler. Jamais affiché publiquement sans votre accord."
          error={err("phone")}
        >
          {(a) => (
            <Input
              id={a.id}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              defaultValue={v("phone", profile?.phone)}
              aria-describedby={a.describedBy}
              aria-invalid={a.invalid}
            />
          )}
        </Field>
        <fieldset className="space-y-2">
          <legend className="font-semibold text-ink">Qui peut voir votre numéro ?</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <Choice
              name="phone_visibility"
              value="private"
              label="Seulement AFA"
              hint="Recommandé"
              checked={phoneVis === "private"}
              onChange={() => setPhoneVis("private")}
            />
            <Choice
              name="phone_visibility"
              value="members"
              label="Les membres connectés"
              hint="Acheteurs, transformateurs du réseau"
              checked={phoneVis === "members"}
              onChange={() => setPhoneVis("members")}
            />
          </div>
        </fieldset>
      </fieldset>

      {/* 2 — Où */}
      <fieldset hidden={step !== 1} className="space-y-5">
        <legend className="sr-only">{STEPS[1]}</legend>
        <Field id="region_id" label="Région" error={err("region_id")}>
          {(a) => (
            <Select
              id={a.id}
              name="region_id"
              defaultValue={v("region_id", profile?.region?.id) ?? ""}
              aria-describedby={a.describedBy}
            >
              <option value="">Choisir votre région</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="city" label="Ville ou sous-préfecture" optional error={err("city")}>
          {(a) => (
            <Input
              id={a.id}
              name="city"
              defaultValue={v("city", profile?.city)}
              aria-describedby={a.describedBy}
            />
          )}
        </Field>
        <Field
          id="village"
          label="Village"
          optional
          hint="Nous n'enregistrons jamais d'adresse précise."
          error={err("village")}
        >
          {(a) => (
            <Input
              id={a.id}
              name="village"
              defaultValue={v("village", profile?.village)}
              aria-describedby={a.describedBy}
            />
          )}
        </Field>
      </fieldset>

      {/* 3 — Cultures */}
      <fieldset hidden={step !== 2} className="space-y-5">
        <legend className="font-semibold text-ink">
          Quelles cultures produisez-vous ?{" "}
          <span className="font-normal text-ink-soft">Plusieurs choix possibles.</span>
        </legend>
        {err("crops") && <p className="text-meta font-semibold text-danger">{err("crops")}</p>}
        <ul className="grid gap-2 sm:grid-cols-2">
          {crops.map((c) => {
            const on = selected.includes(c.id);
            const area = profile?.crops.find((pc) => pc.id === c.id)?.areaHa;
            return (
              <li
                key={c.id}
                className={cn(
                  "rounded-card p-4 ring-2 transition-colors",
                  on ? "bg-leaf/10 ring-afa" : "bg-white ring-rule",
                )}
              >
                <label className="flex min-h-8 cursor-pointer items-center gap-3 font-semibold text-ink">
                  <input
                    type="checkbox"
                    name="crop"
                    value={c.id}
                    checked={on}
                    onChange={() => toggleCrop(c.id)}
                    className="size-6 accent-afa"
                  />
                  {c.name}
                </label>
                {on && (
                  <label className="mt-3 block text-meta text-ink-soft">
                    Superficie (hectares, facultatif)
                    <Input
                      name={`area_${c.id}`}
                      inputMode="decimal"
                      placeholder="ex. 2,5"
                      defaultValue={v(`area_${c.id}`, area)}
                      className="mt-1"
                    />
                  </label>
                )}
              </li>
            );
          })}
        </ul>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="total_area_ha"
            label="Superficie totale (hectares)"
            optional
            error={err("total_area_ha")}
          >
            {(a) => (
              <Input
                id={a.id}
                name="total_area_ha"
                inputMode="decimal"
                placeholder="ex. 4"
                defaultValue={v("total_area_ha", profile?.totalAreaHa)}
                aria-describedby={a.describedBy}
                aria-invalid={a.invalid}
              />
            )}
          </Field>
          <Field id="experience_years" label="Années d'expérience" optional error={err("experience_years")}>
            {(a) => (
              <Input
                id={a.id}
                name="experience_years"
                inputMode="numeric"
                defaultValue={v("experience_years", profile?.experienceYears)}
                aria-describedby={a.describedBy}
                aria-invalid={a.invalid}
              />
            )}
          </Field>
        </div>
      </fieldset>

      {/* 4 — Production et besoins */}
      <fieldset hidden={step !== 3} className="space-y-5">
        <legend className="sr-only">{STEPS[3]}</legend>
        <Field
          id="production_note"
          label="Votre production"
          optional
          hint="Par exemple : quantités récoltées, saisons, produits transformés."
          error={err("production_note")}
        >
          {(a) => (
            <Textarea
              id={a.id}
              name="production_note"
              rows={3}
              defaultValue={v("production_note", profile?.productionNote)}
              aria-describedby={a.describedBy}
            />
          )}
        </Field>
        <Field
          id="availability_note"
          label="Disponibilité"
          optional
          hint="Par exemple : « 2 tonnes de manioc disponibles en mars »."
          error={err("availability_note")}
        >
          {(a) => (
            <Input
              id={a.id}
              name="availability_note"
              defaultValue={v("availability_note", profile?.availabilityNote)}
              aria-describedby={a.describedBy}
            />
          )}
        </Field>
        <fieldset className="space-y-2">
          <legend className="font-semibold text-ink">
            De quoi avez-vous besoin ? <span className="font-normal text-ink-soft">(facultatif)</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {PRODUCER_NEEDS.map(([key, label]) => (
              <label key={key} className="cursor-pointer">
                <input
                  type="checkbox"
                  name="needs"
                  value={key}
                  defaultChecked={profile?.needs.includes(key)}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-12 items-center rounded-full border-2 border-field bg-white px-4 font-semibold text-ink transition-colors peer-checked:border-afa peer-checked:bg-afa peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>

      {/* 5 — Présentation et accord */}
      <fieldset hidden={step !== 4} className="space-y-5">
        <legend className="sr-only">{STEPS[4]}</legend>
        <Field id="description" label="Présentez-vous en quelques mots" optional error={err("description")}>
          {(a) => (
            <Textarea
              id={a.id}
              name="description"
              rows={4}
              defaultValue={v("description", profile?.description)}
              aria-describedby={a.describedBy}
            />
          )}
        </Field>
        <fieldset className="space-y-2">
          <legend className="font-semibold text-ink">Qui peut voir votre fiche ?</legend>
          <div className="grid gap-2">
            {VISIBILITY.map(([key, label, hint]) => (
              <Choice
                key={key}
                name="visibility"
                value={key}
                label={label}
                hint={hint}
                checked={visibility === key}
                onChange={() => setVisibility(key)}
              />
            ))}
          </div>
        </fieldset>
        {isNew && (
          <div className="rounded-card bg-sand p-4 ring-1 ring-rule">
            <Checkbox
              name="consent"
              label={consentText}
              defaultChecked={state.values?.consent === "on"}
              aria-invalid={Boolean(err("consent"))}
            />
            {err("consent") && <p className="pl-9 text-meta font-semibold text-danger">{err("consent")}</p>}
            <p className="pl-9 text-meta">
              <Link href="/confidentialite" className="font-semibold text-afa underline">
                Politique de confidentialité
              </Link>
            </p>
          </div>
        )}
      </fieldset>

      <div className="flex flex-col-reverse gap-3 border-t border-rule pt-5 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button
            variant="ghost"
            onClick={() => go(step - 1)}
            icon={<ArrowLeft className="size-5" aria-hidden="true" />}
          >
            Retour
          </Button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <Button onClick={next} size="lg" iconAfter={<ArrowRight className="size-5" aria-hidden="true" />}>
            Continuer
          </Button>
        ) : (
          <SubmitButton pending={pending}>
            {isNew ? "Créer ma fiche producteur" : "Enregistrer les modifications"}
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
