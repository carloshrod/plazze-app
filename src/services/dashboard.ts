import { client } from "@/libs/api";

export interface DashboardStats {
  plazzes: {
    total: number;
    trend: string;
    trend_up: boolean;
  };
  bookings: {
    active: number;
    trend: string;
    trend_up: boolean;
  };
  revenue: {
    total: number;
    this_month: number;
    trend: string;
    trend_up: boolean;
  };
  clients: {
    total: number;
    new_this_month: number;
    trend: string;
    trend_up: boolean;
  };
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await client.get<DashboardStats>(
    "/plazze/v1/dashboard/stats"
  );
  return response.data;
};
