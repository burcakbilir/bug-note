"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin } from "@/features/auth/hooks/use-login";
import { loginSchema } from "@/features/auth/schemas/auth.schemas";

const demoAccount = {
  email: "demo@bugnote.dev",
  password: "demo1234",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isSubmitting } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (searchParams.get("demo") === "1") {
      setEmail(demoAccount.email);
      setPassword(demoAccount.password);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      toast.error(result.error?.issues[0]?.message ?? "Could not sign in");
      return;
    }

    try {
      await login(result.data);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign in");
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 px-5 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-0">
      <section className="flex flex-col items-center justify-center gap-6">
        <Link
          href="/"
          aria-label="BugNote home"
          className="flex items-center gap-2"
        >
          <Logo />
          <span className="text-lg font-semibold text-slate-950">
            BugNote
          </span>
        </Link>

        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f54a00] text-white">
            <LockKeyhole className="h-5 w-5" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-slate-950">
            Sign in
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Continue to your private debugging memory.
          </p>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleLogin();
            }}
          >
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                type="email"
                autoComplete="username"
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-700">
                Password
              </span>
              <PasswordInput
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
              />
            </label>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="lg:hidden"
              onClick={() => {
                setEmail(demoAccount.email);
                setPassword(demoAccount.password);
              }}
            >
              Use demo credentials
            </Button>
          </form>

          <p className="mt-5 text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-[#f54a00] hover:text-[#d94300]"
            >
              Create one
            </Link>
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Forgot password?{" "}
            <Link
              href="/auth/forgot-password"
              className="font-semibold text-[#f54a00] hover:text-[#d94300]"
            >
              Reset it
            </Link>
          </p>
        </div>
      </section>

      <section className="hidden border-l border-slate-200 bg-white p-10 lg:block">
        <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
          <p className="text-sm font-semibold text-[#f54a00]">Demo access</p>

          <h2 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">
            Explore BugNote with one shared demo workspace.
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            Use these credentials to sign in from the form on the left.
          </p>

          <div className="mt-8 rounded-2xl border border-[#f54a00]/20 bg-[#f54a00]/5 p-5">
            <div className="grid gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Email
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-slate-950">
                  {demoAccount.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Password
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-slate-950">
                  {demoAccount.password}
                </p>
              </div>
            </div>

            <Button
              type="button"
              className="mt-5 w-full"
              onClick={() => {
                setEmail(demoAccount.email);
                setPassword(demoAccount.password);
              }}
            >
              Use demo credentials
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
