import { client } from "./client";
import { PackagePricing } from "@/consts/packagePricing";

export const pricingLib = {
  getPackagePricing: async (): Promise<PackagePricing> => {
    try {
      const { data } = await client.get("/plazze/v1/package-pricing");
      return data.pricing;
    } catch (err) {
      // fallback a local si falla
      const { DEFAULT_PACKAGE_PRICING } =
        await import("@/consts/packagePricing");
      return DEFAULT_PACKAGE_PRICING;
    }
  },
  setPackagePricing: async (
    pricing: PackagePricing,
  ): Promise<PackagePricing> => {
    const { data } = await client.post("/plazze/v1/package-pricing", pricing);
    return data.pricing;
  },
};
