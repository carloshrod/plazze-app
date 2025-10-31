"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSearchStore } from "@/stores/search";
import { ROUTES } from "@/consts/routes";

/**
 * Hook para sincronizar los filtros del store con la URL
 * Solo funciona en la página de plazzes
 */
export const useURLSync = () => {
  const { filters } = useSearchStore();
  const router = useRouter();
  const pathname = usePathname();
  const hasInitialized = useRef(false);

  const isOnPlazzesPage = pathname === ROUTES.PUBLIC.PLAZZES.LIST;

  useEffect(() => {
    // Solo sincronizar si estamos en la página de plazzes
    if (!isOnPlazzesPage) return;

    // Permitir que useInitialPlazzesLoad maneje la carga inicial
    if (!hasInitialized.current) {
      // Esperar un tick para que useInitialPlazzesLoad termine
      setTimeout(() => {
        hasInitialized.current = true;
      }, 100);
      return;
    }

    // Construir query parameters desde el store
    const queryParams = new URLSearchParams();

    if (filters.location.trim()) {
      queryParams.set("location", filters.location.trim());
    }

    if (filters.date) {
      queryParams.set("date", filters.date.format("YYYY-MM-DD"));
    }

    if (filters.time) {
      queryParams.set("time", filters.time.format("HH:mm"));
    }

    if (filters.people) {
      queryParams.set("people", filters.people.toString());
    }

    if (filters.category) {
      queryParams.set("category", filters.category);
    }

    // Actualizar URL sin recargar la página
    const queryString = queryParams.toString();
    const newUrl = queryString
      ? `${ROUTES.PUBLIC.PLAZZES.LIST}?${queryString}`
      : ROUTES.PUBLIC.PLAZZES.LIST;

    // Solo actualizar si la URL actual es diferente
    const currentUrl = `${pathname}${window.location.search}`;

    if (currentUrl !== newUrl) {
      router.replace(newUrl);
    }
  }, [filters, router, pathname, isOnPlazzesPage]);
};
