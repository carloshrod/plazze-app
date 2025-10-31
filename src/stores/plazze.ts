import { create } from "zustand";
import type { Plazze, PlazzeStore } from "@/types/plazze";

export const usePlazzeStore = create<PlazzeStore>((set) => ({
  plazzes: [],
  loading: true,
  error: null,

  setPlazzes: (plazzes: Plazze[]) => set({ plazzes, error: null }),

  setLoading: (loading: boolean) => set({ loading }),

  setError: (error: string | null) => set({ error }),

  clearPlazzes: () => set({ plazzes: [], error: null }),
}));
