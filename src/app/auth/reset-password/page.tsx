"use client";

import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { copy } from "@/lib/copy";
import { resetPasswordRequest } from "@/features/auth/api/auth-api";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function reset() {
    setIsSubmitting(true);

    try {
      await resetPasswordRequest({ token, password });
      setPassword("");
      toast.success(copy.passwordUpdatedSignIn);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : copy.passwordResetFailed,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f54a00] text-white">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-slate-950">
          {copy.chooseNewPassword}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {copy.resetPasswordInfo}
        </p>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void reset();
          }}
        >
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {copy.newPassword}
            </span>
            <PasswordInput
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={copy.passwordPlaceholder}
              autoComplete="new-password"
            />
          </label>

          <Button type="submit" disabled={isSubmitting || !token}>
            {isSubmitting ? copy.saving : copy.saveNewPassword}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          {copy.backTo}{" "}
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
