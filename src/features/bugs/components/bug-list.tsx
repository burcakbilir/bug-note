"use client";

import { ArrowUpDown } from "lucide-react";
import { useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { copy } from "@/lib/copy";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBug, toggleSortDirection } from "../slices/bug-slice";
import type { BugNote } from "../types/bug.types";
import { BugNoteCard } from "./bug-note-card";

const severityLabels: Record<BugNote["severity"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function BugList() {
  const dispatch = useAppDispatch();
  const bugs = useAppSelector((state) => state.bugs.bugs);
  const selectedBugId = useAppSelector((state) => state.bugs.selectedBugId);
  const searchQuery = useAppSelector((state) => state.bugs.searchQuery);
  const statusFilter = useAppSelector((state) => state.bugs.statusFilter);
  const severityFilter = useAppSelector((state) => state.bugs.severityFilter);
  const linkedOnly = useAppSelector((state) => state.bugs.linkedOnly);
  const tagFilter = useAppSelector((state) => state.bugs.tagFilter);
  const sortDirection = useAppSelector((state) => state.bugs.sortDirection);
  const requestStatus = useAppSelector((state) => state.bugs.requestStatus);
  const errorMessage = useAppSelector((state) => state.bugs.errorMessage);

  const isInitialLoading = requestStatus === "loading" && bugs.length === 0;
  const hasInitialError = requestStatus === "error" && bugs.length === 0;

  const filteredBugs = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase("tr");

    return bugs.filter((bug) => {
      if (statusFilter !== "all" && bug.status !== statusFilter) {
        return false;
      }

      if (severityFilter !== "all" && bug.severity !== severityFilter) {
        return false;
      }

      if (linkedOnly && !bug.linkedCard) {
        return false;
      }

      if (tagFilter && !bug.tags.includes(tagFilter)) {
        return false;
      }

      if (!normalizedSearchQuery) {
        return true;
      }

      const searchableText = [
        bug.title,
        bug.summary,
        bug.problem,
        bug.observations,
        bug.response,
        bug.possibleCause,
        bug.solution,
        bug.revisitNote,
        bug.project,
        ...bug.tags,
        ...bug.stack,
      ]
        .join(" ")
        .toLocaleLowerCase("tr");

      return searchableText.includes(normalizedSearchQuery);
    });
  }, [bugs, linkedOnly, searchQuery, severityFilter, statusFilter, tagFilter]);

  useEffect(() => {
    if (filteredBugs.some((bug) => bug.id === selectedBugId)) {
      return;
    }

    dispatch(selectBug(filteredBugs[0]?.id ?? null));
  }, [dispatch, filteredBugs, selectedBugId]);

  const groupedBugs = useMemo(() => {
    const sortedBugs = [...filteredBugs].sort((first, second) => {
      const result =
        new Date(second.updatedAt).getTime() -
        new Date(first.updatedAt).getTime();

      return sortDirection === "desc" ? result : -result;
    });

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(startOfToday)
    startOfWeek.setDate(startOfWeek.getDate() - 6)

    const today: BugNote[] = [];
    const thisWeek: BugNote[] = [];
    const older: BugNote[] = [];

    for(const bug of sortedBugs){
      const updatedAt = new Date(bug.updatedAt)

      if(updatedAt >= startOfToday){
        today.push(bug)
      }
      else if(updatedAt >= startOfWeek){
        thisWeek.push(bug)
      }
      else{
        older.push(bug)
      }
    }
    return {today, thisWeek, older}
  }, [filteredBugs, sortDirection]);

  const listTitle = useMemo(() => {
    if (tagFilter) return `#${tagFilter}`;
    if (linkedOnly) return copy.linkedCards;
    if (statusFilter === "resolved") return copy.solved;
    if (statusFilter === "draft") return copy.draftPlural;
    if (statusFilter === "investigating") return copy.investigatingPlural;
    if (severityFilter !== "all") {
      return `${copy.priority}: ${severityLabels[severityFilter]}`;
    }
    return copy.myBugs;
  }, [linkedOnly, severityFilter, statusFilter, tagFilter]);

  return (
    <aside className="flex min-h-0 flex-col border-b border-slate-200 bg-white xl:h-full xl:border-b-0 xl:border-r">
      <div className="shrink-0 border-b border-slate-200 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              {listTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {copy.listRecordCount.replace("{count}", String(filteredBugs.length))}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => dispatch(toggleSortDirection())}
              className="h-9 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-950"
            >
              {sortDirection === "desc" ? copy.sortedLatest : copy.sortedOldest}
            </button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={copy.sort}
              onClick={() => dispatch(toggleSortDirection())}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-h-130 min-h-0 flex-1 overflow-y-auto p-4 xl:max-h-none">
        {isInitialLoading ? (
          <ListStateMessage message="Loading bug notes..." />
        ) : null}

        {hasInitialError ? (
          <ListStateMessage
            message={errorMessage ?? "Bug notes could not load."}
            tone="error"
          />
        ) : null}

        {!isInitialLoading && !hasInitialError ? (
          <>
            <BugGroup
              label={copy.today}
              bugs={groupedBugs.today}
              selectedBugId={selectedBugId}
              onSelect={(id) => dispatch(selectBug(id))}
            />

            <BugGroup
              label={copy.thisWeek}
              bugs={groupedBugs.thisWeek}
              selectedBugId={selectedBugId}
              onSelect={(id) => dispatch(selectBug(id))}
            />

            {groupedBugs.older.length > 0 ? (
              <BugGroup
                label={copy.older}
                bugs={groupedBugs.older}
                selectedBugId={selectedBugId}
                onSelect={(id) => dispatch(selectBug(id))}
              />
            ) : null}

            {filteredBugs.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                {bugs.length === 0 ? copy.noBugNotes : copy.noSearchResults}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </aside>
  );
}

type BugGroupProps = {
  label: string;
  bugs: BugNote[];
  selectedBugId: string | null;
  onSelect: (id: string) => void;
};

function BugGroup({ label, bugs, selectedBugId, onSelect }: BugGroupProps) {
  if (bugs.length === 0) {
    return null;
  }

  return (
    <section className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="text-sm font-medium text-slate-600">{label}</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
          {bugs.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {bugs.map((bug) => (
          <BugNoteCard
            key={bug.id}
            bug={bug}
            isSelected={bug.id === selectedBugId}
            onSelect={() => onSelect(bug.id)}
          />
        ))}
      </div>
    </section>
  );
}

type ListStateMessageProps = {
  message: string;
  tone?: "default" | "error";
};

function ListStateMessage({
  message,
  tone = "default",
}: ListStateMessageProps) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-slate-200 bg-white text-slate-500";

  return (
    <div className={`rounded-md border border-dashed p-4 text-sm ${toneClass}`}>
      {message}
    </div>
  );
}
