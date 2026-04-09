import { create } from "zustand";
import { FeatureRequest, PendingCounts } from "@/types/plazze";

interface PromotionsStore {
  featureRequests: FeatureRequest[];
  myFeatureRequests: FeatureRequest[];
  pendingCounts: PendingCounts;
  loading: boolean;
  error: string | null;
  setFeatureRequests: (requests: FeatureRequest[]) => void;
  setMyFeatureRequests: (requests: FeatureRequest[]) => void;
  updateFeatureRequest: (updated: FeatureRequest) => void;
  setPendingCounts: (counts: PendingCounts) => void;
  decrementFeatureRequests: () => void;
  decrementBannerRequests: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePromotionsStore = create<PromotionsStore>((set) => ({
  featureRequests: [],
  myFeatureRequests: [],
  pendingCounts: { feature_requests: 0, banner_requests: 0 },
  loading: false,
  error: null,
  setFeatureRequests: (requests) => set({ featureRequests: requests }),
  setMyFeatureRequests: (requests) => set({ myFeatureRequests: requests }),
  updateFeatureRequest: (updated) =>
    set((state) => ({
      featureRequests: state.featureRequests.map((r) =>
        r.id === updated.id ? updated : r,
      ),
    })),
  setPendingCounts: (counts) => set({ pendingCounts: counts }),
  decrementFeatureRequests: () =>
    set((state) => ({
      pendingCounts: {
        ...state.pendingCounts,
        feature_requests: Math.max(0, state.pendingCounts.feature_requests - 1),
      },
    })),
  decrementBannerRequests: () =>
    set((state) => ({
      pendingCounts: {
        ...state.pendingCounts,
        banner_requests: Math.max(0, state.pendingCounts.banner_requests - 1),
      },
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
