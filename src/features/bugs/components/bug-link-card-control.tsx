"use client";

import { Link2, X } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { updateBugRemote } from "@/features/bugs/slices/bug-slice";
import type {
  BugNote,
  LinkedCard,
  LinkedCardProvider,
} from "@/features/bugs/types/bug.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function BugLinkCardControl() {
  const dispatch = useAppDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const selectedBug = useAppSelector((state) =>
    state.bugs.bugs.find((bug) => bug.id === state.bugs.selectedBugId),
  );

  async function handleSave(linkedCard: LinkedCard) {
    if (!selectedBug) return;

    try {
      await dispatch(
        updateBugRemote({
          id: selectedBug.id,
          changes: { linkedCard },
        }),
      ).unwrap();

      toast.success("Card linked.");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Card could not be linked.",
      );
    }
  }

  async function handleRemove() {
    if (!selectedBug) return;

    try {
      await dispatch(
        updateBugRemote({
          id: selectedBug.id,
          changes: { linkedCard: null },
        }),
      ).unwrap();

      toast.success("Card removed.");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Card could not be removed.",
      );
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        aria-label="Link card"
        onClick={() => setIsDialogOpen(true)}
        disabled={!selectedBug}
      >
        <Link2 className="h-4 w-4" />
      </Button>

      {isDialogOpen ? (
        <LinkCardDialog
          selectedBug={selectedBug}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          onRemove={handleRemove}
        />
      ) : null}
    </>
  );
}

type LinkCardDialogProps = {
  selectedBug: BugNote | null | undefined;
  onClose: () => void;
  onSave: (linkedCard: LinkedCard) => void | Promise<void>;
  onRemove: () => void | Promise<void>;
};

function LinkCardDialog({
  selectedBug,
  onClose,
  onSave,
  onRemove,
}: LinkCardDialogProps) {
  const [provider, setProvider] = useState<LinkedCardProvider>(
    selectedBug?.linkedCard?.provider ?? "trello",
  );
  const [cardId, setCardId] = useState(selectedBug?.linkedCard?.id ?? "");
  const [title, setTitle] = useState(selectedBug?.linkedCard?.title ?? "");
  const [url, setUrl] = useState(selectedBug?.linkedCard?.url ?? "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedCardId = cardId.trim();
    const normalizedTitle = title.trim();

    if (!normalizedCardId || !normalizedTitle) return;

    onSave({
      provider,
      id: normalizedCardId,
      title: normalizedTitle,
      url: url.trim() || undefined,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-md border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-5">
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Link card
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Connect this bug note with an external task or issue.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close link card form"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 p-5">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">Service</span>
            <Select
              value={provider}
              onChange={(event) =>
                setProvider(event.target.value as LinkedCardProvider)
              }
            >
              <option value="trello">Trello</option>
              <option value="github">GitHub</option>
              <option value="jira">Jira</option>
              <option value="linear">Linear</option>
            </Select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">Card ID</span>
            <Input
              value={cardId}
              onChange={(event) => setCardId(event.target.value)}
              placeholder="AUTH-142"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              Card title
            </span>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Login refactor"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">Card URL</span>
            <Input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://..."
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          {selectedBug?.linkedCard ? (
            <Button type="button" variant="ghost" onClick={onRemove}>
              Remove card
            </Button>
          ) : (
            <span />
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
