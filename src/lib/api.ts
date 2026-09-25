

const API_URL = "/api";

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed.");
  }

  return data as T;
}

export async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
}

export async function apiDelete<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
}
