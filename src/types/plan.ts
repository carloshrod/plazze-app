export type PlanSlug = "basic" | "extended" | "pro";

export interface SellerPlan {
  current_plan: PlanSlug;
  plan_name: string;
  plan_expiration: number | null; // Unix timestamp
  listings_quota: number;
  listings_used: number;
  featured_quota: number;
  photo_limit: number;
  duration_days: number;
  days_to_expire: number | null;
  is_plan_expired: boolean;
  plan_price: number;
}

export interface PlanDefinition {
  slug: PlanSlug;
  name: string;
  price: number;
  listings_quota: number;
  featured_quota: number;
  photo_limit: number;
  duration_days: number;
  plan_days: number;
}
