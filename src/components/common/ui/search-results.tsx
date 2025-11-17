"use client";

import { usePlazzeStore } from "@/stores/plazze";
import { useSearchStore } from "@/stores/search";

const SearchResults = () => {
  const { plazzes, loading } = usePlazzeStore();
  const { appliedFilters, hasSearched } = useSearchStore();

  const hasActiveSearch =
    appliedFilters.location.trim() ||
    appliedFilters.date ||
    appliedFilters.time ||
    appliedFilters.people ||
    appliedFilters.category;

  if (loading) return null;

  // Si hay filtros activos aplicados (incluyendo categoría), mostrar resultados de búsqueda
  if (hasActiveSearch) {
    const hasOtherFilters =
      appliedFilters.location.trim() ||
      appliedFilters.date ||
      appliedFilters.time ||
      appliedFilters.people;

    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {plazzes.length === 0
            ? "No se encontraron resultados"
            : `${plazzes.length} resultado${
                plazzes.length > 1 ? "s" : ""
              } encontrado${plazzes.length > 1 ? "s" : ""}`}
        </h2>
        {plazzes.length === 0 && (
          <p className="text-gray-600">
            {appliedFilters.category && !hasOtherFilters
              ? "No se encontraron plazzes en la categoría seleccionada"
              : "Intenta ajustar tus filtros de búsqueda para encontrar más opciones"}
          </p>
        )}
      </div>
    );
  }

  // Si no se ha ejecutado ninguna búsqueda, mostrar mensaje de todos los plazzes
  if (!hasSearched && plazzes.length === 0) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Todos los plazzes disponibles
        </h2>
        <p className="text-gray-600">
          Explora nuestra selección completa de espacios
        </p>
      </div>
    );
  }

  // Si se ha ejecutado una búsqueda (con o sin filtros), mostrar cantidad de resultados
  if (hasSearched) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {plazzes.length} plazze{plazzes.length !== 1 ? "s" : ""} encontrado
          {plazzes.length !== 1 ? "s" : ""}
        </h2>
      </div>
    );
  }

  // Estado inicial: no se ha ejecutado ninguna búsqueda
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900">
        {plazzes.length} plazze{plazzes.length !== 1 ? "s" : ""} disponible
        {plazzes.length !== 1 ? "s" : ""}
      </h2>
      <p className="text-gray-600">
        Encuentra el espacio perfecto para tu evento
      </p>
    </div>
  );
};

export default SearchResults;
