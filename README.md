# Bug Note Frontend

Bug Note is a personal debugging memory workspace for developers. It helps save bug reports, observations, API responses, possible causes, final solutions, tags, stack context and linked issue metadata in one searchable dashboard.

## Highlights

- Next.js App Router and React client/server component structure
- TypeScript-first feature modules
- Redux Toolkit async CRUD state for bug notes
- Search, filters, sorting and related-note context
- Toast-based success/error feedback
- Loading, empty and error states for the bug list
- Accessible shared UI primitives with typed props
- Express backend integration through a typed API helper

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Redux Toolkit
- Tailwind CSS
- React Toastify
- Zod for auth form validation
- Storybook/Vitest tooling scaffold

## Related Backend



Run the backend on `http://localhost:4000` before starting the frontend.

## Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Core User Flows

- Register and land directly on the dashboard
- Login/logout with httpOnly cookie auth handled by the backend
- Create, edit, delete and filter bug notes
- Link a note to an external card such as GitHub, Jira, Trello or Linear
- Manage sidebar tags and account settings through backend-backed endpoints
- Generate a demo password reset link in local development
