"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Fenêtre modale native (<dialog>) : focus piégé, fermeture par Échap, fond assombri.
 * Mobile : panneau qui glisse depuis le bas ; ordinateur : fenêtre centrée.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="modal-title"
      className="m-0 mt-auto max-h-[90dvh] w-full max-w-none rounded-t-card bg-white p-0 shadow-raised backdrop:bg-ink/50 sm:m-auto sm:max-w-lg sm:rounded-card"
    >
      <div className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3">
        <h2 id="modal-title" className="font-display text-h3 font-semibold text-forest">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="grid size-12 place-items-center rounded-full text-forest hover:bg-sand"
          aria-label="Fermer"
        >
          <X className="size-6" aria-hidden="true" />
        </button>
      </div>
      <div className="overflow-y-auto px-5 py-5">{children}</div>
    </dialog>
  );
}
