import { useState, useEffect } from "react";
import {
  plazzeLib,
  UserPlazzeFilters,
  UserPlazzesResponse,
} from "@/libs/api/plazze";
import { PlazzeWP } from "@/types/plazze";

export const useUserPlazzes = (filters: UserPlazzeFilters = {}) => {
  const [plazzes, setPlazzes] = useState<PlazzeWP[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalFound: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const loadPlazzes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: UserPlazzesResponse = await plazzeLib.getUserPlazzes(
        filters
      );

      setPlazzes(response.plazzes);
      setPagination({
        totalFound: response.totalFound,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar los plazzes";
      setError(errorMessage);
      console.error("Error loading user plazzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlazzes();
  }, [
    filters.status,
    filters.page,
    filters.per_page,
    filters.search,
    filters.order,
  ]);

  return {
    plazzes,
    loading,
    error,
    pagination,
    refetch: loadPlazzes,
  };
};
