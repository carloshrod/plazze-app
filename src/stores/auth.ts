import { create } from "zustand";
import type { AuthState, User } from "@/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoadingAuth: true,

  setAuth: (token: string, user: User) =>
    set({
      token,
      user,
      isAuthenticated: true,
      isLoadingAuth: false,
    }),

  clearAuth: () =>
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoadingAuth: false,
    }),

  setIsLoadingAuth: (isLoadingAuth: boolean) => set({ isLoadingAuth }),
}));
