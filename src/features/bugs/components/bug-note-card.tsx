"use client";

import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import type { BugNote, BugSeverity, BugStatus } from "../types/bug.types";

type BugNoteCardProps = {
  bug: BugNote;
  isSelected: boolean;
  onSelect: () => void;
};

const severityLabels: Record<BugSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const severityVariants = {
  low: "green",
  medium: "orange",
  high: "red",
  critical: "slate",
} as const;

const statusVariants = {
  draft: "default",
  investigating: "orange",
  resolved: "green",
} as const;

const statusDots = {
  draft: "bg-blue-500",
  investigating: "bg-orange-500",
  resolved: "bg-emerald-500",
} as const;

export function BugNoteCard({ bug, isSelected, onSelect }: BugNoteCardProps) {
  const locale = "en-US";  const statusLabels: Record<BugStatus, string> = {
    draft: copy.draft,
    investigating: copy.investigating,
    resolved: copy.resolved,
  };
  const linkedCardId = bug.linkedCard?.id;
  const stackLabel = bug.stack[0] ?? bug.tags[0] ?? "";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-md border bg-white p-3 text-left transition-colors hover:border-orange-200 hover:bg-orange-50/40",
        isSelected
          ? "border-orange-300 bg-orange-50 shadow-[0_0_0_1px_rgba(234,88,12,0.18)]"
          : "border-slate-200",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <span
            className={cn(
              "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
              statusDots[bug.status],
            )}
          />

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-slate-950">
              {bug.title}
            </h3>
            <p className="mt-1 truncate text-xs text-slate-500">
              {bug.summary || copy.noNote}
            </p>
          </div>
        </div>

        <span className="shrink-0 text-xs font-medium text-slate-400">
          {formatTime(bug.updatedAt, locale)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {linkedCardId ? (
          <Badge variant="default" className="gap-1 bg-blue-50 text-blue-700">
            <FileText className="h-3 w-3" />
            {linkedCardId}
          </Badge>
        ) : null}

        <Badge variant={statusVariants[bug.status]}>
          {statusLabels[bug.status]}
        </Badge>

        <Badge variant={severityVariants[bug.severity]}>
          {severityLabels[bug.severity]}
        </Badge>

        {stackLabel && <Badge variant="default">{stackLabel}</Badge>}
      </div>
    </button>
  );
}

function formatTime(value: string, locale: string) {
  return new Date(value).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
