"use client";

import { useState } from "react";
import type{ RegisterInput } from "../schemas/auth.schemas";
import { registerRequest } from "../api/auth-api";


export function useRegister() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = async (input: RegisterInput) => {
    setIsSubmitting(true);

    try {
      return await registerRequest(input);
    } finally {
      setIsSubmitting(false);
    }
  };
  return {
    register,
    isSubmitting,
  };
}
