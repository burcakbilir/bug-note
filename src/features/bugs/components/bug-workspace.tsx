"use client";

import { PanelRightOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { copy } from "@/lib/copy";
import { BugEditor } from "./bug-editor";
import { BugList } from "./bug-list";
import { BugMemoryPanel } from "./bug-memory-panel";
import { fetchBugs } from "../slices/bug-slice";
import { useAppDispatch } from "@/store/hooks";

type DragState = {
  panel: "list" | "memory";
  startX: number;
  startWidth: number;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export function BugWorkspace() {
  const dispatch = useAppDispatch();  const [listWidth, setListWidth] = useState(360);
  const [memoryWidth, setMemoryWidth] = useState(320);
  const [isMemoryOpen, setIsMemoryOpen] = useState(true);
  const [dragState, setDragState] = useState<DragState | null>(null);

  useEffect(() => {
    void dispatch(fetchBugs());
  }, [dispatch]);

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const currentDrag = dragState;

    function handlePointerMove(event: PointerEvent) {
      const deltaX = event.clientX - currentDrag.startX;

      if (currentDrag.panel === "list") {
        setListWidth(clamp(currentDrag.startWidth + deltaX, 280, 520));
        return;
      }

      setMemoryWidth(clamp(currentDrag.startWidth - deltaX, 260, 520));
    }

    function handlePointerUp() {
      setDragState(null);
    }

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragState]);

  const desktopColumns = useMemo(() => {
    if (!isMemoryOpen) {
      return `${listWidth}px 8px minmax(0, 1fr) 48px`;
    }

    return `${listWidth}px 8px minmax(0, 1fr) 8px ${memoryWidth}px`;
  }, [isMemoryOpen, listWidth, memoryWidth]);

  return (
    <section
      className="grid min-h-full grid-cols-1 gap-0 xl:h-full xl:grid-cols-(--bug-workspace-columns)"
      style={
        {
          "--bug-workspace-columns": desktopColumns,
        } as React.CSSProperties
      }
    >
      <BugList />

      <ResizeHandle
        label="Resize bug list"
        isDragging={dragState?.panel === "list"}
        onPointerDown={(event) =>
          setDragState({
            panel: "list",
            startX: event.clientX,
            startWidth: listWidth,
          })
        }
      />

      <BugEditor />

      {isMemoryOpen ? (
        <>
          <ResizeHandle
            label="Resize memory panel"
            isDragging={dragState?.panel === "memory"}
            onPointerDown={(event) =>
              setDragState({
                panel: "memory",
                startX: event.clientX,
                startWidth: memoryWidth,
              })
            }
          />
          <BugMemoryPanel onClose={() => setIsMemoryOpen(false)} />
        </>
      ) : (
        <button
          type="button"
          onClick={() => setIsMemoryOpen(true)}
          className="flex min-h-16 items-center justify-center border-t border-slate-200 bg-white text-sm font-medium text-slate-500 transition-colors hover:bg-orange-50 hover:text-orange-700 xl:h-full xl:border-l xl:border-t-0"
          aria-label={copy.openMemoryPanel}
        >
          <span className="flex items-center gap-2 xl:[writing-mode:vertical-rl]">
            <PanelRightOpen className="h-4 w-4 xl:rotate-90" />
            {copy.openMemoryPanel}
          </span>
        </button>
      )}
    </section>
  );
}

type ResizeHandleProps = {
  label: string;
  isDragging: boolean;
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void;
};

function ResizeHandle({
  label,
  isDragging,
  onPointerDown,
}: ResizeHandleProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={onPointerDown}
      className={cn(
        "hidden cursor-col-resize bg-slate-100 transition-colors hover:bg-orange-100 xl:block",
        isDragging && "bg-orange-200",
      )}
    />
  );
}
