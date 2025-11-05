/* eslint-disable no-unused-vars */
import { create } from "zustand";
import type { PlazzeWP } from "@/types/plazze";

interface MyPlazzesStore {
  // Estado
  plazzes: PlazzeWP[];
  loading: boolean;
  error: string | null;

  // Acciones para manipular el estado
  setPlazzes: (plazzes: PlazzeWP[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPlazzes: () => void;
  addPlazze: (plazze: PlazzeWP) => void;
  removePlazze: (plazzeId: number) => void;
  updatePlazze: (plazzeId: number, updatedPlazze: Partial<PlazzeWP>) => void;
}

export const useMyPlazzesStore = create<MyPlazzesStore>((set, get) => ({
  // Estado inicial
  plazzes: [],
  loading: false,
  error: null,

  // Setters básicos
  setPlazzes: (plazzes: PlazzeWP[]) => set({ plazzes, error: null }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearPlazzes: () => set({ plazzes: [], error: null }),

  // Agregar un nuevo plazze a la lista
  addPlazze: (newPlazze: PlazzeWP) => {
    const { plazzes } = get();
    set({ plazzes: [newPlazze, ...plazzes] });
  },

  // Remover un plazze de la lista
  removePlazze: (plazzeId: number) => {
    const { plazzes } = get();
    set({ plazzes: plazzes.filter((plazze) => plazze.id !== plazzeId) });
  },

  // Actualizar un plazze existente
  updatePlazze: (plazzeId: number, updatedPlazze: Partial<PlazzeWP>) => {
    const { plazzes } = get();
    set({
      plazzes: plazzes.map((plazze) =>
        plazze.id === plazzeId ? { ...plazze, ...updatedPlazze } : plazze
      ),
    });
  },
}));
