"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Ouvrir la fenêtre
        </Button>
        <Button onClick={() => setSent(true)}>Simuler un envoi</Button>
      </div>
      <div aria-live="polite">
        {sent && <Toast>Votre publication a été envoyée. Elle sera visible après validation.</Toast>}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Signaler ce contenu">
        <p className="text-ink-soft">Sur mobile, ce panneau glisse depuis le bas de l&apos;écran.</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={() => setOpen(false)}>
            Signaler
          </Button>
        </div>
      </Modal>
    </div>
  );
}
