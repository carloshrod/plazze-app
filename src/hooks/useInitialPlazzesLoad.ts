"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import { usePlazzeService } from "@/services/plazze";
import { useSearchStore } from "@/stores/search";

export const useInitialPlazzesLoad = () => {
  const { fetchPlazzes, searchWithFilters } = usePlazzeService();
  const { setFilters, clearFilters } = useSearchStore();
  const searchParams = useSearchParams();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Solo ejecutar en la carga inicial, no en cambios posteriores
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    // Leer query parameters de la URL
    const location = searchParams.get("location");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const people = searchParams.get("people");
    const category = searchParams.get("category");

    // Si hay filtros en la URL, aplicarlos
    if (location || date || time || people || category) {
      // Actualizar el store con los filtros de la URL
      setFilters({
        location: location || "",
        date: date ? dayjs(date) : null,
        time: time ? dayjs(time, "HH:mm") : null,
        people: people ? parseInt(people) : null,
        category: category || null,
      });

      // Ejecutar búsqueda con filtros
      const searchFilters = {
        location: location || undefined,
        date: date || undefined,
        time: time || undefined,
        people: people ? parseInt(people) : undefined,
        category: category || undefined,
      };

      searchWithFilters(searchFilters);
    } else {
      // Si no hay filtros, limpiar el store y cargar todos
      clearFilters();
      fetchPlazzes();
    }
  }, [searchParams, fetchPlazzes, searchWithFilters, setFilters, clearFilters]);
};

export default useInitialPlazzesLoad;
