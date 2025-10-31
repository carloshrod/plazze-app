import { useState, useCallback } from "react";
import { usePlazzeStore } from "@/stores/plazze";
import { useSearchStore } from "@/stores/search";
import { plazzeLib, PlazzeSearchParams } from "@/libs/api/plazze";
import showMessage from "@/libs/message";
import { Plazze } from "@/types/plazze";
import dayjs from "dayjs";

export const usePlazzeService = () => {
  const { setPlazzes, setLoading, setError, clearPlazzes } = usePlazzeStore();
  const { setAppliedFilters } = useSearchStore();
  const [localLoading, setLocalLoading] = useState(false);

  const fetchPlazzes = useCallback(
    async (params?: PlazzeSearchParams) => {
      try {
        setLoading(true);
        setError(null);

        const data = await plazzeLib.getPlazzes(params);
        setPlazzes(data || []);

        // Si no se pasaron parámetros, limpiar los filtros aplicados
        if (!params || Object.keys(params).length === 0) {
          setAppliedFilters({
            location: "",
            date: null,
            time: null,
            people: null,
            category: null,
          });
        }

        return data;
      } catch (error) {
        console.error("Error al obtener plazzes:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocurrió un error al obtener los plazzes";

        setError(errorMessage);
        showMessage.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setPlazzes, setLoading, setError, setAppliedFilters]
  );

  const fetchPlazzeById = useCallback(
    async (id: number): Promise<Plazze | null> => {
      try {
        setLocalLoading(true);
        const data = await plazzeLib.getPlazzeById(id);
        return data;
      } catch (error) {
        console.error("Error al obtener plazze:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocurrió un error al obtener el plazze";

        showMessage.error(errorMessage);
        return null;
      } finally {
        setLocalLoading(false);
      }
    },
    []
  );

  const searchWithFilters = useCallback(
    async (filters: {
      location?: string;
      date?: string;
      time?: string;
      people?: number;
      category?: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        // 🔧 USAR los nuevos parámetros simplificados
        const searchParams: PlazzeSearchParams = {};

        if (filters.location?.trim()) {
          searchParams.location = filters.location.trim();
        }

        if (filters.people) {
          searchParams.people = filters.people;
        }

        if (filters.date) {
          searchParams.date = filters.date;
        }

        if (filters.time) {
          searchParams.time = filters.time;
        }

        if (filters.category) {
          searchParams.category = filters.category;
        }

        const data = await plazzeLib.searchWithFilters(searchParams);
        setPlazzes(data || []);

        // Guardar los filtros que realmente se aplicaron
        setAppliedFilters({
          location: filters.location?.trim() || "",
          date: filters.date ? dayjs(filters.date) : null,
          time: filters.time ? dayjs(filters.time, "HH:mm") : null,
          people: filters.people || null,
          category: filters.category || null,
        });

        return data;
      } catch (error) {
        console.error("Error en búsqueda con filtros:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocurrió un error en la búsqueda";

        setError(errorMessage);
        showMessage.error(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setPlazzes, setLoading, setError, setAppliedFilters]
  );

  const clearData = useCallback(() => {
    clearPlazzes();
  }, [clearPlazzes]);

  return {
    fetchPlazzes,
    fetchPlazzeById,
    searchWithFilters,
    clearData,
    loading: localLoading,
  };
};
