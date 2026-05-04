import { client } from "./client";
import type { SellerPlan, PlanDefinition } from "@/types/plan";

export const planLib = {
  getSellerPlan: (): Promise<SellerPlan> =>
    client.get<SellerPlan>("/plazze/v1/seller-plan").then((r) => r.data),

  getAvailablePlans: (): Promise<PlanDefinition[]> =>
    client.get<PlanDefinition[]>("/plazze/v1/plans").then((r) => r.data),

  purchasePlan: (
    plan_slug: string,
    simulate = false,
  ): Promise<{ success: boolean; message: string; plan?: SellerPlan }> =>
    client
      .post("/plazze/v1/purchase-plan", { plan_slug, simulate })
      .then((r) => r.data),

  assignPlanAdmin: (
    user_id: number,
    plan_slug: string,
    duration_days?: number,
  ): Promise<{ success: boolean; message: string }> =>
    client
      .post("/plazze/v1/seller-plan", { user_id, plan_slug, duration_days })
      .then((r) => r.data),

  toggleListingStatus: (
    listing_id: number,
  ): Promise<{ success: boolean; new_status: string; message: string }> =>
    client
      .post(`/plazze/v1/listing/${listing_id}/toggle-status`)
      .then((r) => r.data),
};
