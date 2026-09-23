"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Link2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Select } from "@/components/ui/select";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteBugRemote, updateBugRemote } from "../slices/bug-slice";
import type { BugSeverity, BugStatus } from "../types/bug.types";
import { EditBugForm } from "./edit-bug-form";
import { toast } from "react-toastify";

const detailSections = [
  { labelKey: "all", id: "all" },
  { labelKey: "problem", id: "problem" },
  { labelKey: "observations", id: "observations" },
  { labelKey: "response", id: "response" },
  { labelKey: "possibleCause", id: "possible-cause" },
  { labelKey: "solution", id: "solution" },
  { labelKey: "revisitNote", id: "revisit-note" },
] as const;

type DetailTab = (typeof detailSections)[number]["id"];

export function BugEditor() {
  const dispatch = useAppDispatch();
  const locale = "en-US";  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>("all");

  const selectedBug = useAppSelector((state) => {
    return state.bugs.bugs.find((bug) => bug.id === state.bugs.selectedBugId);
  });

  const statusLabels: Record<BugStatus, string> = {
    draft: copy.draft,
    investigating: copy.investigating,
    resolved: copy.resolved,
  };

  const severityLabels: Record<BugSeverity, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };

  async function handleDelete(id: string) {
    setIsDeleting(true);

    try {
      await dispatch(deleteBugRemote(id)).unwrap();
      toast.success("Bug note deleted.");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Bug note could not be deleted.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (!selectedBug) {
    return (
      <section className="flex h-full items-center justify-center bg-slate-50 p-6">
        <div className="rounded-md border border-dashed border-slate-200 bg-white p-6 text-center">
          <p className="text-sm font-medium text-slate-950">
            {copy.noSelectedBug}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {copy.selectBugFromList}
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-0 bg-slate-50 p-4 sm:p-6 xl:h-full xl:overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold tracking-normal text-slate-950 sm:text-2xl">
                {selectedBug.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {copy.createdAt}:{" "}
                {new Date(selectedBug.createdAt).toLocaleString(locale)} ·{" "}
                {copy.updatedAt}:{" "}
                {new Date(selectedBug.updatedAt).toLocaleString(locale)}
              </p>
            </div>

            <div className="relative shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={copy.bugActions}
                aria-expanded={isActionMenuOpen}
                onClick={() => setIsActionMenuOpen((current) => !current)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>

              {isActionMenuOpen ? (
                <div className="absolute right-0 top-11 z-20 w-44 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-left text-sm font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-700"
                    onClick={() => {
                      setIsActionMenuOpen(false);
                      setIsEditFormOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                    {copy.edit}
                  </button>

                  <button
                    type="button"
                    className="flex h-9 w-full items-center gap-2 rounded-md px-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setIsActionMenuOpen(false);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    {copy.delete}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
            <InfoCard
              icon={<Link2 className="h-4 w-4 text-blue-600" />}
              label={copy.linkedCard}
              value={
                selectedBug.linkedCard
                  ? `${selectedBug.linkedCard.id} · ${selectedBug.linkedCard.title}`
                  : copy.noCard
              }
            />
            <InfoCard
              icon={<Clock3 className="h-4 w-4 text-orange-500" />}
              label={copy.status}
              value={statusLabels[selectedBug.status]}
              control={
                <Select
                  value={selectedBug.status}
                  onChange={(event) =>
                    dispatch(
                      updateBugRemote({
                        id: selectedBug.id,
                        changes: { status: event.target.value as BugStatus },
                      }),
                    )
                  }
                >
                  <option value="draft">{copy.draft}</option>
                  <option value="investigating">{copy.investigating}</option>
                  <option value="resolved">{copy.resolved}</option>
                </Select>
              }
            />
            <InfoCard
              icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
              label={copy.priority}
              value={severityLabels[selectedBug.severity]}
              control={
                <Select
                  value={selectedBug.severity}
                  onChange={(event) =>
                    dispatch(
                      updateBugRemote({
                        id: selectedBug.id,
                        changes: {
                          severity: event.target.value as BugSeverity,
                        },
                      }),
                    )
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Select>
              }
            />
          </div>

          <nav className="sticky top-0 z-1 mb-5 flex gap-4 overflow-x-auto border-b border-slate-200 bg-slate-50 sm:gap-6">
            {detailSections.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveDetailTab(item.id)}
                className={cn(
                  "flex h-10 shrink-0 items-center border-b-2 text-sm font-medium transition-colors",
                  activeDetailTab === item.id
                    ? "border-orange-600 text-orange-700"
                    : "border-transparent text-slate-500 hover:text-slate-950",
                )}
              >
                {copy[item.labelKey]}
              </button>
            ))}
          </nav>

          <div className="grid gap-4">
            {(activeDetailTab === "all" || activeDetailTab === "problem") ? (
              <DetailField
                id="problem"
                icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
                label={copy.problem}
                value={selectedBug.problem}
                highlight={selectedBug.summary}
              />
            ) : null}

            {(activeDetailTab === "all" ||
              activeDetailTab === "observations") ? (
              <DetailField
                id="observations"
                icon={<Clock3 className="h-4 w-4 text-slate-500" />}
                label={copy.observations}
                value={selectedBug.observations}
              />
            ) : null}

            {(activeDetailTab === "all" || activeDetailTab === "response") ? (
              <DetailField
                id="response"
                label="Response"
                value={selectedBug.response}
                placeholder={copy.noResponse}
                monospace
                copyHint
              />
            ) : null}

            {(activeDetailTab === "all" ||
              activeDetailTab === "possible-cause") ? (
              <DetailField
                id="possible-cause"
                label={copy.possibleCause}
                value={selectedBug.possibleCause}
              />
            ) : null}

            {(activeDetailTab === "all" || activeDetailTab === "solution") ? (
              <DetailField
                id="solution"
                icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                label={copy.solution}
                value={selectedBug.solution}
                codeLine={
                  selectedBug.solution ? copy.solutionSaved : undefined
                }
              />
            ) : null}

            {(activeDetailTab === "all" ||
              activeDetailTab === "revisit-note") ? (
              <DetailField
                id="revisit-note"
                label={copy.revisitNote}
                value={selectedBug.revisitNote}
              />
            ) : null}
          </div>
        </div>
      </section>

      {isEditFormOpen ? (
        <EditBugForm
          bug={selectedBug}
          onClose={() => setIsEditFormOpen(false)}
        />
      ) : null}

      {isDeleteDialogOpen ? (
        <ConfirmationDialog
          title="Delete bug note?"
          description={copy.deleteBugConfirm}
          confirmLabel={copy.delete}
          cancelLabel={copy.cancel}
          isConfirming={isDeleting}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => handleDelete(selectedBug.id)}
        />
      ) : null}
    </>
  );
}

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  control?: React.ReactNode;
};

function InfoCard({ icon, label, value, control }: InfoCardProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        {icon}
        {label}
      </div>
      <div className="mt-2 min-h-6">
        {control ?? (
          <p className="line-clamp-2 text-sm font-medium text-slate-950">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

type DetailFieldProps = {
  id: string;
  icon?: React.ReactNode;
  label: string;
  value: string;
  placeholder?: string;
  highlight?: string;
  codeLine?: string;
  monospace?: boolean;
  copyHint?: boolean;
};

function DetailField({
  id,
  icon,
  label,
  value,
  placeholder = "No note added yet.",
  highlight,
  codeLine,
  monospace = false,
  copyHint = false,
}: DetailFieldProps) {
  async function handleCopy() {
    const textToCopy = value || placeholder;

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(`${label} copied.`);
    } catch {
      toast.error("Could not copy text.");
    }
  }

  return (
    <section
      id={id}
      className="scroll-mt-16 rounded-md border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-semibold text-slate-950">{label}</h2>
        </div>

        {copyHint ? (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            Copy
          </button>
        ) : null}
      </div>

      <div
        className={cn(
          "whitespace-pre-wrap text-sm leading-6 text-slate-700",
          monospace &&
            "overflow-x-auto rounded-md bg-orange-50 px-3 py-2 font-mono text-xs text-orange-700",
        )}
      >
        {value || placeholder}
      </div>

      {highlight ? (
        <div className="mt-4 rounded-md bg-orange-50 px-3 py-2 font-mono text-xs font-semibold text-orange-700">
          {highlight}
        </div>
      ) : null}

      {codeLine ? (
        <div className="mt-4 rounded-md bg-orange-50 px-3 py-2 font-mono text-xs font-semibold text-orange-700">
          {codeLine}
        </div>
      ) : null}
    </section>
  );
}
