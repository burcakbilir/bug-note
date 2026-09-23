import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-950 shadow-sm outline-none transition-colors focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
        className,
      )}
      {...props}
    />
  );
}
