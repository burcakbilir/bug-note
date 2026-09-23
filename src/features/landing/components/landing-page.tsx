"use client";

import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GitBranch,
  Link2,
  Search,
  Terminal,
} from "lucide-react";
import Link from "next/link";

import { copy } from "@/lib/copy";
import { cn } from "@/lib/utils";

const featureTiles = [
  {
    icon: Terminal,
    title: "Debug context",
    body: "Response, endpoint, stack trace and environment notes stay next to the fix.",
  },
  {
    icon: Search,
    title: "Searchable memory",
    body: "Find old solutions by title, project, tag, response text or linked card.",
  },
  {
    icon: Link2,
    title: "Task card links",
    body: "Connect personal notes to Trello, GitHub, Jira or Linear work items.",
  },
];

const memoryBlocks = [
  "Problem",
  "Observations",
  "Response",
  "Possible cause",
  "Solution",
  "Revisit note",
];

function BugNoteLogo() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#f54a00] shadow-sm shadow-[#f54a00]/20">
      <span className="absolute left-2.5 top-2.5 h-2 w-2 rounded-full bg-slate-950" />
      <span className="absolute right-2.5 bottom-2.5 h-2 w-2 rounded-full bg-slate-950" />
      <span className="h-[18px] w-1.5 -rotate-45 rounded-full bg-white" />
      <span className="ml-0.5 h-[18px] w-1.5 -rotate-45 rounded-full bg-slate-950" />
    </div>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <BugNoteLogo />
            <div>
              <p className="text-sm font-semibold">BugNote</p>
              <p className="text-xs text-slate-500">Personal debug memory</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-500 md:flex">
            <a href="#product" className="hover:text-slate-950">
              {copy.product}
            </a>
            <a href="#memory" className="hover:text-slate-950">
              {copy.memory}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth/login"
              className="hidden h-8 items-center rounded-full px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 md:inline-flex"
            >
              {copy.signIn}
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex h-8 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              {copy.createAccount}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_50%_0%,#fff1eb_0%,transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 lg:pb-20 lg:pt-24">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex items-center rounded-full border border-[#f54a00]/20 bg-[#f54a00]/5 px-3 py-1.5 text-sm font-medium text-[#a83300] shadow-sm">
              {copy.landingEyebrow}
            </div>

            <h1 className="mx-auto mt-7 max-w-5xl text-[clamp(3.5rem,8vw,7rem)] font-semibold leading-[0.9] tracking-normal text-slate-950">
              {copy.landingTitle}
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              {copy.landingDescription}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#f54a00] px-5 text-sm font-medium text-white shadow-lg shadow-[#f54a00]/20 transition-colors hover:bg-[#d94300]"
              >
                {copy.createAccount}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-slate-950 shadow-sm transition-colors hover:bg-slate-50"
              >
                {copy.openDemo}
              </Link>
            </div>
          </div>

          <div className="mt-14">
            <ProductPreview />
          </div>
        </div>
      </section>

      <section id="product" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-semibold text-[#f54a00]">
              Designed around real debugging
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
              Keep the messy trail and the final answer together.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureTiles.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f54a00]/10 text-[#f54a00]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="memory" className="border-y border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold text-[#f54a00]">
              Note structure
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              A bug note should be scannable later.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              Each section answers one question, so future you can find the
              useful part without rereading everything.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {memoryBlocks.map((block, index) => (
              <div
                key={block}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-semibold text-[#f54a00]">
                  0{index + 1}
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-950">
                  {block}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}

function ProductPreview() {
  return (
    <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-2 shadow-2xl shadow-[#f54a00]/10">
      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
        <div className="flex h-11 items-center gap-3 border-b border-slate-200 bg-slate-50 px-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto hidden h-7 w-80 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-400 sm:flex">
            bugnote.app/my-bugs
          </div>
        </div>

        <div className="grid min-h-[500px] bg-slate-50 lg:grid-cols-[260px_minmax(0,1fr)_240px]">
          <aside className="hidden border-r border-slate-200 bg-white p-4 lg:block">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-950">My Bugs</p>
              <span className="rounded-full bg-[#f54a00]/10 px-2 py-1 text-xs font-semibold text-[#a83300]">
                24
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                ["Cannot log in, API returns 500", "POST /auth/login"],
                ["Token refresh returns 401", "POST /auth/refresh"],
                ["CSV export runs out of memory", "GET /export/users"],
              ].map(([title, subtitle], index) => (
                <div
                  key={title}
                  className={cn(
                    "rounded-xl border p-3",
                    index === 0
                      ? "border-[#f54a00] bg-[#fff4ef] text-slate-950 shadow-sm shadow-[#f54a00]/10"
                      : "border-slate-200 bg-white text-slate-950",
                  )}
                >
                  <p className="truncate text-sm font-semibold">{title}</p>
                  <p
                    className={cn(
                      "mt-2 truncate text-xs",
                      index === 0 ? "text-[#a83300]" : "text-slate-500",
                    )}
                  >
                    {subtitle}
                  </p>
                </div>
              ))}
            </div>
          </aside>

          <section className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[#f54a00]">
                  Investigating
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                  Cannot log in, API returns 500
                </h2>
              </div>
              <span className="rounded-full bg-[#f54a00]/10 px-3 py-1 text-xs font-semibold text-[#a83300]">
                High
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniMetric icon={GitBranch} label="Status" value="Investigating" />
              <MiniMetric icon={FileText} label="Project" value="web-api" />
              <MiniMetric icon={Link2} label="Card" value="AUTH-142" />
            </div>

            <div className="mt-5 space-y-3">
              <PreviewSection
                title="Problem"
                body="The user signs in with the correct password, but the API returns 500. It only happens in production; local works fine."
                code="POST /auth/login -> 500 Internal Server Error"
              />
              <PreviewSection
                title="Response"
                body={`{\n  "error": "token_secret_missing",\n  "status": 500\n}`}
                isCode
              />
            </div>
          </section>

          <aside className="hidden border-l border-slate-200 bg-white p-4 lg:block">
            <p className="text-sm font-semibold text-slate-950">
              Links and Memory
            </p>
            <div className="mt-4 rounded-xl border border-[#f54a00]/20 bg-[#f54a00]/5 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <CheckCircle2 className="h-4 w-4 text-[#f54a00]" />
                Fix saved
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Check environment secrets first when similar auth issues appear.
              </p>
            </div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold text-slate-500">
                Linked card
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                AUTH-142
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

type MiniMetricProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

function MiniMetric({ icon: Icon, label, value }: MiniMetricProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="h-4 w-4 text-[#f54a00]" />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

type PreviewSectionProps = {
  title: string;
  body: string;
  code?: string;
  isCode?: boolean;
};

function PreviewSection({
  title,
  body,
  code,
  isCode = false,
}: PreviewSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
      <p
        className={cn(
          "mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600",
          isCode &&
            "rounded-lg bg-slate-950 p-3 font-mono text-xs text-orange-100",
        )}
      >
        {body}
      </p>
      {code ? (
        <div className="mt-3 overflow-x-auto rounded-lg bg-[#f54a00]/5 px-3 py-2 font-mono text-xs font-semibold text-[#a83300]">
          {code}
        </div>
      ) : null}
    </section>
  );
}
