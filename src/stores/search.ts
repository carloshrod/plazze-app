/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { Dayjs } from "dayjs";

interface SearchFilters {
  location: string;
  date: Dayjs | null;
  time: Dayjs | null;
  people: number | null;
  category: string | null;
}

interface SearchStore {
  filters: SearchFilters;
  appliedFilters: SearchFilters;
  isSearching: boolean;
  hasSearched: boolean;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setAppliedFilters: (filters: SearchFilters) => void;
  setIsSearching: (isSearching: boolean) => void;
  setHasSearched: (hasSearched: boolean) => void;
  clearFilters: () => void;
  clearSearchFilters: () => void;
}

const initialFilters: SearchFilters = {
  location: "",
  date: null,
  time: null,
  people: null,
  category: null,
};

export const useSearchStore = create<SearchStore>((set) => ({
  filters: initialFilters,
  appliedFilters: initialFilters,
  isSearching: false,
  hasSearched: false,

  setFilters: (newFilters: Partial<SearchFilters>) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setAppliedFilters: (appliedFilters: SearchFilters) => set({ appliedFilters }),

  setIsSearching: (isSearching: boolean) => set({ isSearching }),

  setHasSearched: (hasSearched: boolean) => set({ hasSearched }),

  clearFilters: () =>
    set({
      filters: initialFilters,
      appliedFilters: initialFilters,
      hasSearched: false,
    }),

  clearSearchFilters: () =>
    set((state) => ({
      filters: {
        ...initialFilters,
        category: state.filters.category,
      },
      appliedFilters: {
        ...initialFilters,
        category: state.appliedFilters.category,
      },
    })),
}));
