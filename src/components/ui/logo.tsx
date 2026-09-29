import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full bg-[#f54a00] shadow-sm shadow-[#f54a00]/20",
        className,
      )}
    >
      <span className="absolute left-2.5 top-2.5 h-2 w-2 rounded-full bg-slate-950" />
      <span className="absolute right-2.5 bottom-2.5 h-2 w-2 rounded-full bg-slate-950" />
      <span className="h-[18px] w-1.5 -rotate-45 rounded-full bg-white" />
      <span className="ml-0.5 h-[18px] w-1.5 -rotate-45 rounded-full bg-slate-950" />
    </div>
  );
}
