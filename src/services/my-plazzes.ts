import { useCallback, useEffect, useRef } from "react";
import { useMyPlazzesStore } from "@/stores/my-plazzes";
import { plazzeLib } from "@/libs/api/plazze";
import { useAuthStore } from "@/stores/auth";

export const useMyPlazzesService = () => {
  const {
    plazzes,
    loading,
    error,
    setPlazzes,
    setLoading,
    setError,
    clearPlazzes,
    addPlazze,
    removePlazze,
    updatePlazze,
  } = useMyPlazzesStore();
  const { user } = useAuthStore();

  const hasFetched = useRef(false);

  // Función para cargar los plazzes del usuario
  const fetchPlazzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const isAdmin = user?.role === "administrator";
      const fetchFn = isAdmin
        ? plazzeLib.getAllPlazzes
        : plazzeLib.getUserPlazzes;
      const response = await fetchFn({
        order: "desc",
        per_page: 100,
        ...(isAdmin && { status: "publish,draft,pending,private" }),
      });

      setPlazzes(response.plazzes);
    } catch (error: any) {
      console.error("❌ Error loading user plazzes:", error);
      setError("Error al cargar los plazzes del usuario");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setPlazzes, user?.role]);

  // Función para refrescar los plazzes
  const refreshPlazzes = useCallback(() => {
    fetchPlazzes();
  }, [fetchPlazzes]);

  // Cargar datos automáticamente solo una vez (espera a que el rol esté disponible)
  useEffect(() => {
    if (!hasFetched.current && user?.role) {
      hasFetched.current = true;
      fetchPlazzes();
    }
  }, [fetchPlazzes, user?.role]);

  return {
    // Estado
    plazzes,
    loading,
    error,

    // Acciones de estado
    addPlazze,
    removePlazze,
    updatePlazze,
    clearPlazzes,

    // Acciones de API
    fetchPlazzes,
    refreshPlazzes,
  };
};
