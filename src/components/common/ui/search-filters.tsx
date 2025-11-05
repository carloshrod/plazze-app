"use client";

import { Button, Tag } from "antd";
import { LuX } from "react-icons/lu";
import { useSearchStore } from "@/stores/search";
import { usePlazzeService } from "@/services/plazze";

const SearchFilters = () => {
  const {
    filters,
    appliedFilters,
    setFilters,
    clearSearchFilters,
    isSearching,
    hasSearched,
  } = useSearchStore();
  const { fetchPlazzes, searchWithFilters } = usePlazzeService();

  const hasActiveFilters =
    appliedFilters.location.trim() ||
    appliedFilters.date ||
    appliedFilters.time ||
    appliedFilters.people;

  // Solo mostrar filtros cuando se haya ejecutado una búsqueda y haya filtros activos
  const shouldShowFilters = hasSearched && !isSearching && hasActiveFilters;

  const clearAllFilters = async () => {
    clearSearchFilters();

    // Si hay una categoría aplicada, buscar con esa categoría
    if (appliedFilters.category) {
      await searchWithFilters({ category: appliedFilters.category });
    } else {
      // Si no hay categoría, recargar todos los plazzes
      await fetchPlazzes();
    }
  };

  const removeFilter = async (filterType: keyof typeof filters) => {
    // Remover el filtro del store
    setFilters({ [filterType]: filterType === "location" ? "" : null });

    // Ejecutar nueva búsqueda con los filtros restantes
    const updatedFilters = {
      ...filters,
      [filterType]: filterType === "location" ? "" : null,
    };

    const searchFilters = {
      location: updatedFilters.location || undefined,
      date: updatedFilters.date?.format("YYYY-MM-DD") || undefined,
      time: updatedFilters.time?.format("HH:mm") || undefined,
      people: updatedFilters.people || undefined,
    };

    // Si quedan filtros, buscar con ellos; si no, cargar todos
    if (
      updatedFilters.location.trim() ||
      updatedFilters.date ||
      updatedFilters.time ||
      updatedFilters.people
    ) {
      await searchWithFilters(searchFilters);
    } else {
      await fetchPlazzes();
    }
  };

  if (!shouldShowFilters) return null;

  return (
    <div className="max-w-4xl mx-auto mb-4">
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <span className="text-sm text-gray-600 font-medium">
          Filtros activos:
        </span>

        {appliedFilters.location.trim() && (
          <Tag
            closable
            onClose={() => removeFilter("location")}
            className="flex items-center gap-1"
          >
            📍 {appliedFilters.location}
          </Tag>
        )}

        {appliedFilters.date && (
          <Tag
            closable
            onClose={() => removeFilter("date")}
            className="flex items-center gap-1"
          >
            📅 {appliedFilters.date.format("DD/MM/YYYY")}
          </Tag>
        )}

        {appliedFilters.time && (
          <Tag
            closable
            onClose={() => removeFilter("time")}
            className="flex items-center gap-1"
          >
            🕐 {appliedFilters.time.format("h:mm a")}
          </Tag>
        )}

        {appliedFilters.people && (
          <Tag
            closable
            onClose={() => removeFilter("people")}
            className="flex items-center gap-1"
          >
            👥 {appliedFilters.people} persona
            {appliedFilters.people > 1 ? "s" : ""}
          </Tag>
        )}

        <Button
          type="text"
          size="small"
          icon={<LuX size={14} />}
          onClick={clearAllFilters}
          className="ml-2 text-gray-500 hover:text-red-500"
        >
          Limpiar todo
        </Button>
      </div>
    </div>
  );
};

export default SearchFilters;
