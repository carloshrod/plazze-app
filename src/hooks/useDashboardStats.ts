import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "@/services/dashboard";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || "Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
