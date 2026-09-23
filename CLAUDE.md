# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Bug Note frontend — a personal debugging memory workspace. Users save bug reports (problem, observations, response, possible cause, solution, revisit notes), tag/link them to external cards (GitHub/Jira/Trello/Linear), and search/filter them in a dashboard.

This repo is the Next.js frontend only. The API lives in the sibling repo `bug-note-be` (Express + Prisma + PostgreSQL) and must be running on `http://localhost:4000` for the app to work locally.

## Commands

```bash
npm install              # install deps
npm run dev               # start dev server (next dev), http://localhost:3000
npm run build              # production build
npm run start               # run production build
npm run lint                # eslint (flat config, includes eslint-plugin-storybook)
npm run storybook            # component workbench, http://localhost:6006
npm run build-storybook       # static storybook build
```

There is no configured test runner (no `test` script, no vitest/jest config) — do not assume one exists.

Required env (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

To work on a full end-to-end flow, start the backend first (see `bug-note-be`'s own docs — it needs Docker Postgres via its `docker-compose.yml` and `npm run db:migrate`), then this frontend.

## Architecture

**Feature-based structure**, not layer-based. `src/app/**` contains only route/page files (App Router) — no business logic. Everything else lives under `src/features/<name>/`, each shaped as:
- `api/` — thin wrappers around `src/lib/api.ts` fetch helpers, one function per endpoint
- `hooks/` — client hooks wrapping the api calls (e.g. `use-login.ts`) for local `isSubmitting` state
- `schemas/` — Zod schemas + inferred types (currently only `auth` has these)
- `types/` — domain types
- `components/` — feature UI
- `slices/` — Redux slice, only present for `bugs`

Current features: `auth`, `bugs`, `landing`.

**State management is split, not uniform** — this is intentional and worth knowing before "fixing" it:
- `bugs` domain: Redux Toolkit (`src/store/store.ts`, `src/features/bugs/slices/bug-slice.ts`). CRUD goes through `createAsyncThunk`s (`fetchBugs`, `createBugRemote`, `updateBugRemote`, `deleteBugRemote`) that call `src/lib/api.ts`. Filtering/sorting/selection (search query, status/severity/tag filters, selected bug id) also lives in this slice.
- `auth` domain: **no Redux**, no global store. Each auth action (`useLogin`, `useLogout`, `useRegister`) is a local hook with its own `isSubmitting` state calling `src/features/auth/api/auth-api.ts` directly. There is no client-side "current user" store — components that need the user re-fetch via `getCurrentUserRequest()` (`GET /auth/me`) as needed.

**Auth/session model**: the backend issues an httpOnly JWT cookie (`bug_note_session`) on login/register; the frontend never touches the token. All `src/lib/api.ts` calls use `credentials: "include"`. Route protection for `/dashboard/**` happens in `src/proxy.ts` (Next 16's renamed `middleware.ts` convention) but it only checks **whether the cookie exists**, not whether the JWT is valid/expired — real authorization is enforced backend-side (`requireAuth` middleware in `bug-note-be`). Don't rely on `proxy.ts` for anything beyond a redirect-to-login UX nicety.

**Validation is not centralized**: `auth` forms use Zod schemas (`features/auth/schemas/auth.schemas.ts`). `bugs` forms use hand-written parsing helpers instead (`features/bugs/utils/bug-form.ts`, e.g. `parseCommaList`, `buildLinkedCard`) — there's no Zod schema for bug notes on the frontend. Mirror whichever pattern the feature you're touching already uses; don't introduce a third validation approach.

**Path alias**: `@/*` → `src/*` (see `tsconfig.json`).

**BugList grouping quirk**: the "Today / This Week / Older" groups in `features/bugs/components/bug-list.tsx` are **not** date-computed — they're positional slices (`sortedBugs.slice(0,3)`, `slice(3,8)`, `slice(8)`) of the sorted, filtered list. Keep this in mind if asked to fix related-looking date bugs there.

**Resizable panels**: `features/bugs/components/bug-workspace.tsx` implements column-resize by hand with raw `pointermove`/`pointerup` listeners and a `clamp()` helper — there's no resizable-panel library in use.
