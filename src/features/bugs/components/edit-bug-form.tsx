"use client";

import { useAppDispatch } from "@/store/hooks";
import { BugNote } from "../types/bug.types";
import { FormEvent, useState } from "react";
import { updateBugRemote } from "../slices/bug-slice";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { copy } from "@/lib/copy";
import { toast } from "react-toastify";
import { buildLinkedCard, parseCommaList } from "../utils/bug-form";

type EditBugFormProps = {
  bug: BugNote;
  onClose: () => void;
};

export function EditBugForm({ bug, onClose }: EditBugFormProps) {
  const dispatch = useAppDispatch();
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: bug.title,
    summary: bug.summary,
    status: bug.status,
    severity: bug.severity,
    project: bug.project,
    stack: bug.stack.join(", "),
    tags: bug.tags.join(", "),
    linkedCardProvider: bug.linkedCard?.provider ?? "trello",
    linkedCardId: bug.linkedCard?.id ?? "",
    linkedCardTitle: bug.linkedCard?.title ?? "",
    linkedCardUrl: bug.linkedCard?.url ?? "",
    problem: bug.problem,
    observations: bug.observations,
    response: bug.response,
    possibleCause: bug.possibleCause,
    solution: bug.solution,
    revisitNote: bug.revisitNote,
  });

  function updateField(field: keyof typeof form, value: string) {
    if (field === "title" && value.trim()) {
      setTitleError(null);
    }

    setForm((curr) => ({
      ...curr,
      [field]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const title = form.title.trim();

    if (!title) {
      setTitleError("Bug title is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        updateBugRemote({
          id: bug.id,
          changes: {
            title,
            summary: form.summary.trim(),
            status: form.status,
            severity: form.severity,
            project: form.project.trim(),
            stack: parseCommaList(form.stack),
            tags: parseCommaList(form.tags, { stripHash: true }),
            linkedCard:
              buildLinkedCard({
                provider: form.linkedCardProvider,
                id: form.linkedCardId,
                title: form.linkedCardTitle,
                url: form.linkedCardUrl,
              }) ?? null,
            problem: form.problem.trim(),
            observations: form.observations.trim(),
            response: form.response.trim(),
            possibleCause: form.possibleCause.trim(),
            solution: form.solution.trim(),
            revisitNote: form.revisitNote.trim(),
          },
        }),
      ).unwrap();

      toast.success("Bug note updated.");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Bug note could not be updated.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/30 px-3 py-4 sm:px-4 sm:py-8">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl sm:max-h-[calc(100vh-4rem)]"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-300 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-950">
              {copy.editBugTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {copy.editBugDescription}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={copy.closeForm}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={copy.title} required error={titleError}>
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                aria-invalid={Boolean(titleError)}
              />
            </Field>
            <Field label={copy.summary}>
              <Input
                value={form.summary}
                onChange={(e) => updateField("summary", e.target.value)}
              />
            </Field>

            <Field label={copy.status}>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="draft">{copy.draft}</option>
                <option value="investigating">{copy.investigating}</option>
                <option value="resolved">{copy.resolved}</option>
              </select>
            </Field>

            <Field label={copy.priority}>
              <select
                value={form.severity}
                onChange={(e) => updateField("severity", e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </Field>

            <Field label={copy.project}>
              <Input
                value={form.project}
                onChange={(e) => updateField("project", e.target.value)}
              />
            </Field>

            <Field label={copy.stack}>
              <Input
                value={form.stack}
                onChange={(e) => updateField("stack", e.target.value)}
                placeholder="Next.js, PostgreSQL, Auth"
              />
            </Field>

            <Field label={copy.tags}>
              <Input
                value={form.tags}
                onChange={(e) => updateField("tags", e.target.value)}
                placeholder="auth, jwt, 500"
              />
            </Field>

            <Field label={copy.cardProvider}>
              <select
                value={form.linkedCardProvider}
                onChange={(e) =>
                  updateField("linkedCardProvider", e.target.value)
                }
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="trello">Trello</option>
                <option value="github">GitHub</option>
                <option value="jira">Jira</option>
                <option value="linear">Linear</option>
              </select>
            </Field>

            <Field label={copy.cardId}>
              <Input
                value={form.linkedCardId}
                onChange={(e) => updateField("linkedCardId", e.target.value)}
                placeholder="AUTH-142"
              />
            </Field>

            <Field label={copy.cardTitle}>
              <Input
                value={form.linkedCardTitle}
                onChange={(e) =>
                  updateField("linkedCardTitle", e.target.value)
                }
                placeholder="Login refactor"
              />
            </Field>

            <Field label={copy.cardUrl}>
              <Input
                value={form.linkedCardUrl}
                onChange={(e) => updateField("linkedCardUrl", e.target.value)}
                placeholder="https://..."
              />
            </Field>
          </div>

          <div className="mt-4 grid gap-4">
            <Field label={copy.problem}>
              <TextArea
                value={form.problem}
                onChange={(e) => updateField("problem", e.target.value)}
              />
            </Field>

            <Field label={copy.observations}>
              <TextArea
                value={form.observations}
                onChange={(e) => updateField("observations", e.target.value)}
              />
            </Field>

            <Field label="Response">
              <TextArea
                value={form.response}
                onChange={(e) => updateField("response", e.target.value)}
                className="font-mono text-xs"
              />
            </Field>

            <Field label={copy.possibleCause}>
              <TextArea
                value={form.possibleCause}
                onChange={(e) => updateField("possibleCause", e.target.value)}
              />
            </Field>

            <Field label={copy.solution}>
              <TextArea
                value={form.solution}
                onChange={(e) => updateField("solution", e.target.value)}
              />
            </Field>

            <Field label={copy.revisitNote}>
              <TextArea
                value={form.revisitNote}
                onChange={(e) => updateField("revisitNote", e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-5">
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={onClose}
          >
            {copy.cancel}
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : copy.save}
          </Button>
        </div>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode;
};

function Field({ label, required = false, error, children }: FieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required ? <span className="text-orange-600">*</span> : null}
      </span>
      {children}
      {error ? <span className="text-sm font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
