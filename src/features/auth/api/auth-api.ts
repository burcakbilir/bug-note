import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import type { LoginInput, RegisterInput } from "../schemas/auth.schemas";
import type { AuthResponse } from "../types/auth.types";

export type UpdateCurrentUserInput = {
  name?: string;
  email?: string;
  role?: string;
  currentPassword?: string;
  newPassword?: string;
  savedTags?: string[];
};

export function registerRequest(input: RegisterInput) {
  return apiPost<AuthResponse>("/auth/register", input);
}

export function loginRequest(input: LoginInput) {
  return apiPost<AuthResponse>("/auth/login", input);
}

export function logoutRequest() {
  return apiPost<{ ok: true }>("/auth/logout", {});
}

export function getCurrentUserRequest() {
  return apiGet<AuthResponse>("/auth/me");
}

export function updateCurrentUserRequest(input: UpdateCurrentUserInput) {
  return apiPatch<AuthResponse>("/auth/me", input);
}

export function deleteCurrentUserRequest(input: { currentPassword: string }) {
  return apiDelete<{ ok: true }>("/auth/me", input);
}

export function requestPasswordReset(input: { email: string }) {
  return apiPost<{ resetUrl: string | null }>("/auth/forgot-password", input);
}

export function resetPasswordRequest(input: {
  token: string;
  password: string;
}) {
  return apiPost<{ ok: true }>("/auth/reset-password", input);
}
