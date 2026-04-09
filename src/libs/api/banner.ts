import { Banner, BannerFormData } from "@/types/plazze";
import { client } from "./client";

export const bannerLib = {
  getActiveBanners: async (
    position?: "features" | "trending",
  ): Promise<Banner[]> => {
    const params = position ? { position } : {};
    const { data } = await client.get<Banner[]>("/plazze/v1/banners", {
      params,
    });
    return data;
  },

  getAllBanners: async (): Promise<Banner[]> => {
    const { data } = await client.get<Banner[]>("/plazze/v1/banners/all");
    return data;
  },

  createBanner: async (bannerData: BannerFormData): Promise<Banner> => {
    const { data } = await client.post<Banner>("/plazze/v1/banner", bannerData);
    return data;
  },

  updateBanner: async (
    id: number,
    bannerData: Partial<BannerFormData>,
  ): Promise<Banner> => {
    const { data } = await client.put<Banner>(
      `/plazze/v1/banner/${id}`,
      bannerData,
    );
    return data;
  },

  approveBanner: async (id: number): Promise<Banner> => {
    const { data } = await client.post<Banner>(
      `/plazze/v1/banner/${id}/approve`,
    );
    return data;
  },

  rejectBanner: async (id: number): Promise<Banner> => {
    const { data } = await client.post<Banner>(
      `/plazze/v1/banner/${id}/reject`,
    );
    return data;
  },

  deleteBanner: async (id: number): Promise<void> => {
    await client.post(`/plazze/v1/banner/${id}/delete`);
  },
};
