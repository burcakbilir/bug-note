import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "orange" | "red" | "green" | "slate";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  green: "bg-emerald-100 text-emerald-700",
  slate: "bg-slate-900 text-white",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md px-2 text-xs font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
