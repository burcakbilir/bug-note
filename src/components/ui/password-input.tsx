"use client";

import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
      >
        {isVisible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
