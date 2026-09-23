import type { LinkedCard, LinkedCardProvider } from "../types/bug.types";

export function parseCommaList(value: string, options?: { stripHash?: boolean }) {
  return value
    .split(",")
    .map((item) => item.trim())
    .map((item) => (options?.stripHash ? item.replace(/^#/, "") : item))
    .filter(Boolean);
}

type LinkedCardFormInput = {
  provider: string;
  id: string;
  title: string;
  url: string;
};

export function buildLinkedCard(input: LinkedCardFormInput): LinkedCard | undefined {
  const id = input.id.trim();
  const title = input.title.trim();

  if (!id || !title) {
    return undefined;
  }

  return {
    provider: input.provider as LinkedCardProvider,
    id,
    title,
    url: input.url.trim() || undefined,
  };
}
