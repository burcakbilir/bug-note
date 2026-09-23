import { FormEvent, useState } from "react";
import { BugSeverity, BugStatus } from "../types/bug.types";
import { createBugRemote } from "../slices/bug-slice";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/store/hooks";
import { copy } from "@/lib/copy";
import { toast } from "react-toastify";
import { buildLinkedCard, parseCommaList } from "../utils/bug-form";

type NewBugFormProps = {
  onClose: () => void;
};

const initialFormState = {
  title: "",
  summary: "",
  status: "draft" as BugStatus,
  severity: "medium" as BugSeverity,
  project: "",
  stack: "",
  tags: "",
  linkedCardProvider: "trello",
  linkedCardId: "",
  linkedCardTitle: "",
  linkedCardUrl: "",
  problem: "",
  observations: "",
  response: "",
  possibleCause: "",
  solution: "",
  revisitNote: "",
};

export function NewBugForm({ onClose }: NewBugFormProps) {
  const [form, setForm] = useState(initialFormState);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  function updateField(field: keyof typeof initialFormState, value: string) {
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
        createBugRemote({
          title,
          summary: form.summary.trim(),
          status: form.status,
          severity: form.severity,
          project: form.project.trim(),
          stack: parseCommaList(form.stack),
          tags: parseCommaList(form.tags, { stripHash: true }),

          problem: form.problem.trim(),
          observations: form.observations.trim(),
          response: form.response.trim(),
          possibleCause: form.possibleCause.trim(),
          solution: form.solution.trim(),
          revisitNote: form.revisitNote.trim(),
          linkedCard: buildLinkedCard({
            provider: form.linkedCardProvider,
            id: form.linkedCardId,
            title: form.linkedCardTitle,
            url: form.linkedCardUrl,
          }),
        }),
      ).unwrap();

      toast.success("Bug note created.");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Bug note could not be created.",
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
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-950">
              {copy.createBugTitle}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {copy.createBugDescription}
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
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Cannot log in, API returns 500"
                aria-invalid={Boolean(titleError)}
              />
            </Field>

            <Field label={copy.summary}>
              <Input
                value={form.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                placeholder="POST /auth/login -> 500"
              />
            </Field>

            <Field label={copy.status}>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
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
                onChange={(event) =>
                  updateField("severity", event.target.value)
                }
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
                onChange={(event) => updateField("project", event.target.value)}
                placeholder="web-api"
              />
            </Field>

            <Field label={copy.stack}>
              <Input
                value={form.stack}
                onChange={(event) => updateField("stack", event.target.value)}
                placeholder="Next.js, Supabase, Auth"
              />
            </Field>

            <Field label={copy.tags}>
              <Input
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="auth, jwt, 500"
              />
            </Field>

            <Field label={copy.cardProvider}>
              <select
                value={form.linkedCardProvider}
                onChange={(event) =>
                  updateField("linkedCardProvider", event.target.value)
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
                onChange={(event) =>
                  updateField("linkedCardId", event.target.value)
                }
                placeholder="AUTH-142"
              />
            </Field>

            <Field label={copy.cardTitle}>
              <Input
                value={form.linkedCardTitle}
                onChange={(event) =>
                  updateField("linkedCardTitle", event.target.value)
                }
                placeholder="Login refactor"
              />
            </Field>

            <Field label={copy.cardUrl}>
              <Input
                value={form.linkedCardUrl}
                onChange={(event) =>
                  updateField("linkedCardUrl", event.target.value)
                }
                placeholder="https://..."
              />
            </Field>
          </div>

          <div className="mt-4 grid gap-4">
            <Field label={copy.problem}>
              <TextArea
                value={form.problem}
                onChange={(event) => updateField("problem", event.target.value)}
                placeholder="What is failing? When does it happen?"
              />
            </Field>

            <Field label={copy.observations}>
              <TextArea
                value={form.observations}
                onChange={(event) =>
                  updateField("observations", event.target.value)
                }
                placeholder="Local/production differences, logs, attempted fixes..."
              />
            </Field>

            <Field label="Response">
              <TextArea
                value={form.response}
                onChange={(event) =>
                  updateField("response", event.target.value)
                }
                placeholder="HTTP response, error message, stack trace..."
                className="font-mono text-xs"
              />
            </Field>

            <Field label={copy.possibleCause}>
              <TextArea
                value={form.possibleCause}
                onChange={(event) =>
                  updateField("possibleCause", event.target.value)
                }
                placeholder="What could be causing it?"
              />
            </Field>

            <Field label={copy.solution}>
              <TextArea
                value={form.solution}
                onChange={(event) =>
                  updateField("solution", event.target.value)
                }
                placeholder="How did you fix it?"
              />
            </Field>

            <Field label={copy.revisitNote}>
              <TextArea
                value={form.revisitNote}
                onChange={(event) =>
                  updateField("revisitNote", event.target.value)
                }
                placeholder="A short note for your future self..."
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
            {isSubmitting ? "Creating..." : copy.create}
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
        {required ? <span className="text-orange-600"> *</span> : null}
      </span>
      {children}
      {error ? <span className="text-sm font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
