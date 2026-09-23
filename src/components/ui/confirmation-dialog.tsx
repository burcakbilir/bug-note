"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export type ConfirmationDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  isConfirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmationDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  isConfirming = false,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      role="presentation"
    >
      <section
        aria-modal="true"
        role="dialog"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        className="w-full max-w-md rounded-md border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-start gap-3 border-b border-slate-200 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2
              id="confirmation-dialog-title"
              className="text-base font-semibold text-slate-950"
            >
              {title}
            </h2>
            <p
              id="confirmation-dialog-description"
              className="mt-1 text-sm leading-6 text-slate-500"
            >
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 p-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
            onClick={() => void onConfirm()}
            disabled={isConfirming}
          >
            {isConfirming ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </section>
    </div>
  );
}
