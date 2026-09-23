"use client";

import { Filter, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  clearBugFilters,
  setLinkedOnly,
  setSeverityFilter,
  setStatusFilter,
  setTagFilter,
} from "@/features/bugs/slices/bug-slice";
import type { BugNote } from "@/features/bugs/types/bug.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function BugFilterMenu() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const statusFilter = useAppSelector((state) => state.bugs.statusFilter);
  const severityFilter = useAppSelector((state) => state.bugs.severityFilter);
  const linkedOnly = useAppSelector((state) => state.bugs.linkedOnly);
  const tagFilter = useAppSelector((state) => state.bugs.tagFilter);

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        menuRef.current?.contains(event.target)
      ) {
        return;
      }

      setIsOpen(false);
    }

    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <Button
        variant="secondary"
        size="icon"
        aria-label="Open filters"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Filter className="h-4 w-4" />
      </Button>

      {isOpen ? (
        <FilterPanel
          statusFilter={statusFilter}
          severityFilter={severityFilter}
          linkedOnly={linkedOnly}
          tagFilter={tagFilter}
          onClose={() => setIsOpen(false)}
          onStatusChange={(value) => dispatch(setStatusFilter(value))}
          onSeverityChange={(value) => dispatch(setSeverityFilter(value))}
          onLinkedOnlyChange={(value) => dispatch(setLinkedOnly(value))}
          onClearTag={() => dispatch(setTagFilter(null))}
          onClearFilters={() => dispatch(clearBugFilters())}
        />
      ) : null}
    </div>
  );
}

type FilterPanelProps = {
  statusFilter: "all" | BugNote["status"];
  severityFilter: "all" | BugNote["severity"];
  linkedOnly: boolean;
  tagFilter: string | null;
  onClose: () => void;
  onStatusChange: (value: "all" | BugNote["status"]) => void;
  onSeverityChange: (value: "all" | BugNote["severity"]) => void;
  onLinkedOnlyChange: (value: boolean) => void;
  onClearTag: () => void;
  onClearFilters: () => void;
};

function FilterPanel({
  statusFilter,
  severityFilter,
  linkedOnly,
  tagFilter,
  onClose,
  onStatusChange,
  onSeverityChange,
  onLinkedOnlyChange,
  onClearTag,
  onClearFilters,
}: FilterPanelProps) {
  return (
    <div className="fixed left-3 right-3 top-20 z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-md border border-slate-200 bg-white p-4 shadow-xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-3 sm:max-h-[min(34rem,calc(100dvh-7rem))] sm:w-80">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">Filters</h2>
          <p className="mt-1 text-xs text-slate-500">
            Narrow the list by status, priority, linked card or tag.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close filters"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-slate-600">Status</span>
          <Select
            value={statusFilter}
            onChange={(event) =>
              onStatusChange(event.target.value as typeof statusFilter)
            }
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </Select>
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-slate-600">Priority</span>
          <Select
            value={severityFilter}
            onChange={(event) =>
              onSeverityChange(event.target.value as typeof severityFilter)
            }
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
        </label>

        <label className="flex items-center gap-2 rounded-md border border-slate-200 p-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={linkedOnly}
            onChange={(event) => onLinkedOnlyChange(event.target.checked)}
            className="h-4 w-4 accent-orange-600"
          />
          Linked cards only
        </label>

        {tagFilter ? (
          <div className="flex items-center justify-between rounded-md bg-orange-50 px-3 py-2 text-sm text-orange-700">
            <span>Tag: #{tagFilter}</span>
            <button type="button" className="font-medium" onClick={onClearTag}>
              Clear
            </button>
          </div>
        ) : null}

        <Button type="button" variant="secondary" onClick={onClearFilters}>
          Clear filters
        </Button>
      </div>
    </div>
  );
}
