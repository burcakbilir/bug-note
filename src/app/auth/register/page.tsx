"use client";

import { ArrowRight, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { PasswordInput } from "@/components/ui/password-input";
import { useRegister } from "@/features/auth/hooks/use-register";
import { registerSchema } from "@/features/auth/schemas/auth.schemas";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isSubmitting } = useRegister();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const result = registerSchema.safeParse({
      name,
      email,
      password,
    });

    if (!result.success) {
      toast.error(
        result.error.issues[0]?.message ?? "Could not create account",
      );
      return;
    }

    try {
      await register(result.data);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not create account",
      );
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
            <UserPlus className="h-5 w-5" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold text-slate-950">
            Create your account
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Start building your private debugging memory.
          </p>

          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleRegister();
            }}
          >
            <label className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Developer"
              />
            </label>

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
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
            </label>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating account... " : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-5 text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-[#f54a00] hover:text-[#d94300]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white px-5 py-10 lg:border-l lg:border-t-0 lg:p-10">
        <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
          <div className="rounded-2xl border border-[#f54a00]/20 bg-[#f54a00]/5 p-5">
            <p className="text-sm font-semibold text-[#f54a00]">
              Just want to look around?
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              You can sign in with the shared demo account instead of
              creating a new one.
            </p>
            <Link href="/auth/login?demo=1">
              <Button type="button" className="mt-4 w-full">
                Sign in with the demo account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm font-semibold text-[#f54a00]">
            Private by default
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 lg:text-4xl">
            Keep every hard bug searchable and tied to your own notes.
          </h2>
          <p className="mt-5 text-sm leading-6 text-slate-500">
            Save the problem, observations, response, possible cause and final
            solution in one place.
          </p>
        </div>
      </section>
    </main>
  );
}
