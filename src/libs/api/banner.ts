import Cookies from "js-cookie";
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
    // Usamos el proxy Next.js (/api/plazze/banner) para evitar bloqueos CORS
    // en el servidor de producción (WAF / Cloudflare). El browser habla con
    // la misma origen y Next.js reenvía server-to-server a WordPress.
    const token = Cookies.get("token");
    const response = await fetch("/api/plazze/banner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(bannerData),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw Object.assign(
        new Error(
          (data as { message?: string }).message || response.statusText,
        ),
        { status: response.status, data },
      );
    }
    return data as Banner;
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

  deleteBanner: async (id: number): Promise<Banner> => {
    const { data } = await client.post(`/plazze/v1/banner/${id}/delete`);
    return data;
  },

  restoreBanner: async (id: number): Promise<Banner> => {
    const { data } = await client.post(`/plazze/v1/banner/${id}/restore`);
    return data;
  },
};
