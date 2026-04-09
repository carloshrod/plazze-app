import { FeatureRequest, PendingCounts } from "@/types/plazze";
import { client } from "./client";

export const promotionsLib = {
  createFeatureRequest: async (
    plazzeId: number,
    packageDuration: "7" | "15" | "30",
  ): Promise<FeatureRequest> => {
    const { data } = await client.post<FeatureRequest>(
      "/plazze/v1/feature-request",
      { plazze_id: plazzeId, package: packageDuration },
    );
    return data;
  },

  getFeatureRequests: async (status?: string): Promise<FeatureRequest[]> => {
    const params = status ? { status } : {};
    const { data } = await client.get<FeatureRequest[]>(
      "/plazze/v1/feature-requests",
      { params },
    );
    return data;
  },

  getMyFeatureRequests: async (): Promise<FeatureRequest[]> => {
    const { data } = await client.get<FeatureRequest[]>(
      "/plazze/v1/my-feature-requests",
    );
    return data;
  },

  updateFeatureRequestStatus: async (
    id: number,
    status: "approved" | "rejected",
    adminNotes?: string,
  ): Promise<FeatureRequest> => {
    const { data } = await client.put<FeatureRequest>(
      `/plazze/v1/feature-request/${id}/status`,
      { status, admin_notes: adminNotes ?? "" },
    );
    return data;
  },

  getPendingCounts: async (): Promise<PendingCounts> => {
    const { data } = await client.get<PendingCounts>(
      "/plazze/v1/pending-counts",
    );
    return data;
  },
};
