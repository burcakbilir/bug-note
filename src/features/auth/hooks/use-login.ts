"use client"

import { useState } from "react";
import type { LoginInput } from "../schemas/auth.schemas";
import { loginRequest } from "../api/auth-api";

export function useLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (input: LoginInput) => {
    setIsSubmitting(true);

    try {
      return await loginRequest(input);
    } finally {
      setIsSubmitting(false);
    }
  };

  return{
    login,
    isSubmitting
  }
}
