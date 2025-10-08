"use client";

import { useEffect } from "react";
import { useAuthService } from "@/service/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initAuth } = useAuthService();

  useEffect(() => {
    initAuth();
  }, []);

  return children;
}
