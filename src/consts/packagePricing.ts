// Configuración de precios de paquetes para banners y destacados
// Este archivo será reemplazado por la API, pero permite desarrollo local y fallback

export const DEFAULT_PACKAGE_PRICING = {
  banner: {
    features: { "7": 100, "15": 180, "30": 300 },
    trending: { "7": 70, "15": 120, "30": 200 },
  },
  featured: {
    default: { "7": 80, "15": 140, "30": 250 },
  },
};

export type BannerPosition = "features" | "trending";
export type PackageDuration = "7" | "15" | "30";

export type PackagePricing = typeof DEFAULT_PACKAGE_PRICING;
