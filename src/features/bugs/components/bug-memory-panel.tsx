"use client";

import {
  ExternalLink,
  GitBranch,
  Link2,
  PanelRightClose,
  Tags,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { copy } from "@/lib/copy";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMemo } from "react";
import { updateBugRemote } from "../slices/bug-slice";

const providerLabels = {
  trello: "Trello",
  github: "GitHub",
  jira: "Jira",
  linear: "Linear",
};

type BugMemoryPanelProps = {
  onClose?: () => void;
};

export function BugMemoryPanel({ onClose }: BugMemoryPanelProps) {
  const dispatch = useAppDispatch();  const bugs = useAppSelector((state) => state.bugs.bugs);
  const selectedBugId = useAppSelector((state) => state.bugs.selectedBugId);

  const selectedBug = useMemo(() => {
    return bugs.find((bug) => bug.id === selectedBugId);
  }, [bugs, selectedBugId]);

  const relatedBugs = useMemo(() => {
    if (!selectedBug) return [];

    return bugs
      .filter((bug) => {
        if (bug.id === selectedBug.id) {
          return false;
        }

        return bug.tags.some((tag) => selectedBug.tags.includes(tag));
      })
      .slice(0, 3);
  }, [bugs, selectedBug]);

  function removeTagFromSelectedBug(tagToRemove: string) {
    if (!selectedBug) return;

    void dispatch(
      updateBugRemote({
        id: selectedBug.id,
        changes: {
          tags: selectedBug.tags.filter((tag) => tag !== tagToRemove),
        },
      }),
    );
  }

  if (!selectedBug) {
    return (
      <aside className="border-t border-slate-200 bg-white p-5 xl:border-l xl:border-t-0">
        <p className="text-sm text-slate-500">{copy.noConnection}</p>
      </aside>
    );
  }

  return (
    <aside className="border-t border-slate-200 bg-white p-5 xl:h-full xl:overflow-y-auto xl:border-l xl:border-t-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            {copy.linksAndMemory}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {copy.quickContext}
          </p>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
            aria-label={copy.closeMemoryPanel}
          >
            <PanelRightClose className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <section className="mt-5">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
          <Link2 className="h-4 w-4 text-orange-600" />
          {copy.linkedCard}
        </div>

        {selectedBug.linkedCard ? (
          <div className="rounded-md border border-orange-200 bg-orange-50 p-3">
            <p className="text-xs font-medium uppercase text-orange-700">
              {providerLabels[selectedBug.linkedCard.provider]} ·{" "}
              {selectedBug.linkedCard.id}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-950">
              {selectedBug.linkedCard.title}
            </p>

            {selectedBug.linkedCard.url ? (
              <a
                href={selectedBug.linkedCard.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-orange-700 hover:text-orange-800"
              >
                {copy.openCard}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-500">
            {copy.noLinkedCard}
          </div>
        )}
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
          <Tags className="h-4 w-4 text-orange-600" />
          {copy.tags}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {selectedBug.tags.length > 0 ? (
            selectedBug.tags.map((tag) => (
              <Badge key={tag} variant="orange" className="gap-1 pr-1">
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTagFromSelectedBug(tag)}
                  className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-sm hover:bg-orange-200"
                  aria-label={`${tag} ${copy.removeTagFromNote}`}
                  title={copy.removeTagFromNote}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <p className="text-sm text-slate-500">{copy.noTagsInNote}</p>
          )}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
          <GitBranch className="h-4 w-4 text-orange-600" />
          {copy.stack}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {selectedBug.stack.map((item) => (
            <Badge key={item} variant="default">
              {item}
            </Badge>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-slate-950">
          {copy.revisitNote}
        </h3>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm leading-6 text-slate-600">
            {selectedBug.revisitNote || copy.noMemoryNote}
          </p>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-slate-950">
          {copy.relatedNotes}
        </h3>

        <div className="space-y-2">
          {relatedBugs.length > 0 ? (
            relatedBugs.map((bug) => (
              <div
                key={bug.id}
                className="rounded-md border border-slate-200 p-3"
              >
                <p className="line-clamp-2 text-sm font-medium text-slate-950">
                  {bug.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">{bug.project}</p>
              </div>
            ))
          ) : (
            <div className="rounded-md border border-dashed border-slate-200 p-3 text-sm text-slate-500">
              {copy.noRelatedNotes}
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}
