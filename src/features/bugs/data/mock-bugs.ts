import { BugNote } from "../types/bug.types";

export const mockBugs: BugNote[] = [
    {
    id: "bug-1",
    title: "Cannot log in, API returns 500",
    summary: "POST /auth/login returns a 500 response with valid credentials.",
    status: "investigating",
    severity: "high",
    project: "web-api",
    stack: ["Next.js", "Supabase", "Auth"],
    tags: ["auth", "login", "500"],
    linkedCard: {
      id: "AUTH-142",
      provider: "trello",
      title: "Login refactor regression",
      url: "https://trello.com/c/example",
    },
    problem:
      "The user tries to sign in with the correct email and password, but the API returns 500.",
    observations:
      "It works locally. Only the /auth/login endpoint fails in production.",
    response: "{ error: 'token_secret_missing', status: 500 }",
    possibleCause:
      "The JWT secret from .env may not be loaded in production.",
    solution: "",
    revisitNote:
      "For similar auth issues, check environment variables and deployment secrets first.",
    createdAt: "2026-05-05T09:30:00.000Z",
    updatedAt: "2026-05-05T10:12:00.000Z",
  },
  {
    id: "bug-2",
    title: "Dashboard list resets when filter changes",
    summary: "The selected bug disappears when the status filter changes.",
    status: "draft",
    severity: "medium",
    project: "bug-note",
    stack: ["React", "Redux Toolkit"],
    tags: ["state", "filter", "ui"],
    problem:
      "When the bug list filter changes, the selected record resets and the editor becomes empty.",
    observations:
      "When selectedBugId falls outside the filtered list, the UI fallback behavior is unclear.",
    response: "",
    possibleCause:
      "When filter state changes, selectedBugId is left unchanged without validation.",
    solution: "",
    revisitNote:
      "When list filters change, handle selected item state explicitly. Move to the first visible record if needed.",
    createdAt: "2026-05-04T14:10:00.000Z",
    updatedAt: "2026-05-04T15:05:00.000Z",
  },
  {
    id: "bug-3",
    title: "Tailwind class conflict during build",
    summary: "Button variant padding classes override each other.",
    status: "resolved",
    severity: "low",
    project: "bug-note",
    stack: ["TailwindCSS", "UI"],
    tags: ["tailwind", "button", "style"],
    problem:
      "The Button component applies default padding and externally provided padding at the same time.",
    observations:
      "Both p-2 and p-4 appear in className. The result changes depending on component usage.",
    response: "",
    possibleCause:
      "Tailwind class conflicts are not cleaned up during className merging.",
    solution:
      "Collected conditional classes with clsx and removed conflicting utility classes with tailwind-merge.",
    revisitNote:
      "Use the cn() helper when building reusable UI components that merge className values.",
    createdAt: "2026-05-03T11:20:00.000Z",
    updatedAt: "2026-05-03T12:00:00.000Z",
  },
]
