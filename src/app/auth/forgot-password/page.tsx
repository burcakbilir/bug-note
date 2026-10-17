"use client";

import { ArrowRight, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import { requestPasswordReset } from "@/features/auth/api/auth-api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  async function requestReset() {
    setIsSubmitting(true);
    try {
      await requestPasswordReset({ email });
      toast.success(copy.resetGenerated);
      setIsSent(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : copy.resetRequestFailed,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f54a00] text-white">
          <KeyRound className="h-5 w-5" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-slate-950">
          {copy.resetPasswordTitle}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {copy.resetPasswordDescription}
        </p>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void requestReset();
          }}
        >
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {copy.email}
            </span>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              type="email"
              autoComplete="username"
            />
          </label>

         {isSent && <p>If this email is registered, we have sent a reset link.</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? copy.generating : copy.generateResetLink}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          {copy.rememberedIt}{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-[#f54a00] hover:text-[#d94300]"
          >
            {copy.signIn}
          </Link>
        </p>
      </div>
    </main>
  );
}
