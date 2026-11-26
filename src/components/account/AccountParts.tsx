"use client";

import { useActionState } from "react";
import { FormFeedback } from "@/components/forms/FormParts";
import { Button } from "@/components/ui/Button";
import { dataRequestAction } from "@/lib/account/actions";
import { signOutAction } from "@/lib/auth/actions";
import { initialFormState } from "@/lib/forms";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="secondary">
        Se déconnecter
      </Button>
    </form>
  );
}

/** Droits sur les données : copie ou suppression (confirmation demandée avant la suppression). */
export function DataRightsForms() {
  const [state, action] = useActionState(dataRequestAction, initialFormState);
  if (state.status === "success") return <FormFeedback state={state} />;
  return (
    <div className="space-y-3">
      <FormFeedback state={state} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <form action={action}>
          <input type="hidden" name="type" value="export" />
          <Button type="submit" variant="secondary" className="w-full sm:w-auto">
            Recevoir une copie de mes données
          </Button>
        </form>
        <form
          action={action}
          onSubmit={(e) => {
            if (
              !window.confirm(
                "Demander la suppression de votre compte et de vos données ? AFA vous confirmera la suppression.",
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="type" value="delete" />
          <Button type="submit" variant="ghost" className="w-full text-danger sm:w-auto">
            Demander la suppression de mes données
          </Button>
        </form>
      </div>
    </div>
  );
}
