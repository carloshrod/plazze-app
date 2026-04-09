/* eslint-disable no-unused-vars */
import { create } from "zustand";
import type { Banner } from "@/types/plazze";

interface BannersStore {
  banners: Banner[];
  loading: boolean;
  error: string | null;
  pricingModalOpen: boolean;

  setBanners: (banners: Banner[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addBanner: (banner: Banner) => void;
  updateBanner: (id: number, updated: Partial<Banner>) => void;
  removeBanner: (id: number) => void;
  openPricingModal: () => void;
  closePricingModal: () => void;
}

export const useBannersStore = create<BannersStore>((set, get) => ({
  banners: [],
  loading: true,
  error: null,
  pricingModalOpen: false,

  setBanners: (banners) => set({ banners, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  openPricingModal: () => set({ pricingModalOpen: true }),
  closePricingModal: () => set({ pricingModalOpen: false }),

  addBanner: (banner) => {
    const { banners } = get();
    set({ banners: [banner, ...banners] });
  },

  updateBanner: (id, updated) => {
    const { banners } = get();
    set({
      banners: banners.map((b) => (b.id === id ? { ...b, ...updated } : b)),
    });
  },

  removeBanner: (id) => {
    const { banners } = get();
    set({ banners: banners.filter((b) => b.id !== id) });
  },
}));
