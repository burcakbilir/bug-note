export type BugStatus = "draft" | "investigating" | "resolved";

export type BugSeverity = "low" | "medium" | "high" | "critical";

export type LinkedCardProvider = "trello" | "github" | "jira" | "linear";

export type LinkedCard = {
  id: string;
  provider: LinkedCardProvider;
  title: string;
  url?: string;
};

export type BugNote = {
  id: string;
  title: string;
  summary: string;
  status: BugStatus;
  severity: BugSeverity;
  project: string;
  stack: string[];
  tags: string[];
  linkedCard?: LinkedCard;
  problem: string;
  observations: string;
  response: string;
  possibleCause: string;
  solution: string;
  revisitNote: string;
  createdAt: string;
  updatedAt: string;
};
