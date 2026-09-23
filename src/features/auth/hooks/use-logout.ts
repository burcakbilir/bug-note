"use client";
import { useState } from "react";
import { logoutRequest } from "../api/auth-api";

export function useLogout() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logout = async () => {
    setIsSubmitting(true);
    try {
      return await logoutRequest();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    logout,
    isSubmitting
  }
}
