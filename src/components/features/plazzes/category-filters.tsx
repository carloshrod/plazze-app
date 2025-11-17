"use client";

import { useState } from "react";
import { Button } from "antd";
import { useSearchStore } from "@/stores/search";
import { usePlazzeService } from "@/services/plazze";
import { plazzeLib } from "@/libs/api/plazze";

const CategoryFilters = () => {
  const { filters, setFilters, setHasSearched } = useSearchStore();
  const { searchWithFilters, fetchPlazzes } = usePlazzeService();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [allCategories, setAllCategories] = useState<
    Array<{ id: number; name: string; slug: string }>
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const mainCategories = [
    {
      id: "20",
      name: "Bares & Discotecas",
    },
    {
      id: "41",
      name: "Bienestar & Fitness",
    },
    {
      id: "114",
      name: "Corporativo",
    },
    {
      id: "124",
      name: "Cultura & Artes",
    },
    {
      id: "35",
      name: "Eventos",
    },
  ];

  const loadAllCategories = async () => {
    if (allCategories.length > 0) {
      setShowAllCategories(true);
      return;
    }

    try {
      setLoadingCategories(true);
      const categories = await plazzeLib.getCategories();
      setAllCategories(categories);
      setShowAllCategories(true);
    } catch (error) {
      console.error("Error al cargar categorías:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const displayedCategories = showAllCategories
    ? allCategories.map((cat) => ({ id: String(cat.id), name: cat.name }))
    : mainCategories;

  const handleCategoryClick = async (categoryId: string) => {
    // Si ya está seleccionada la misma categoría, deseleccionar
    if (filters.category === categoryId) {
      setFilters({ category: null });
      setHasSearched(true); // Marcar que se ejecutó una búsqueda

      // Ejecutar búsqueda sin categoría pero con otros filtros si los hay
      const hasOtherFilters =
        filters.location.trim() ||
        filters.date ||
        filters.time ||
        filters.people;
      if (hasOtherFilters) {
        await searchWithFilters({
          location: filters.location || undefined,
          date: filters.date?.format("YYYY-MM-DD") || undefined,
          time: filters.time?.format("HH:mm") || undefined,
          people: filters.people || undefined,
        });
      } else {
        await fetchPlazzes();
      }
    } else {
      // Seleccionar nueva categoría
      setFilters({ category: categoryId });
      setHasSearched(true); // Marcar que se ejecutó una búsqueda

      // Ejecutar búsqueda automáticamente con la nueva categoría
      await searchWithFilters({
        location: filters.location || undefined,
        date: filters.date?.format("YYYY-MM-DD") || undefined,
        time: filters.time?.format("HH:mm") || undefined,
        people: filters.people || undefined,
        category: categoryId,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-center flex-wrap gap-2">
        {displayedCategories.map((category) => {
          const isActive = filters.category === category.id;

          return (
            <Button
              key={category.id}
              type={isActive ? "primary" : "default"}
              className={`flex items-center gap-2 h-10 px-4 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="font-medium">{category.name}</span>
            </Button>
          );
        })}

        {/* Botón para mostrar todas las categorías */}
        {!showAllCategories && (
          <Button
            type="dashed"
            loading={loadingCategories}
            className="flex items-center gap-2 h-10 px-4 rounded-full border-2 border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/5 transition-all duration-200"
            onClick={loadAllCategories}
          >
            <span className="font-semibold">Todas las categorías</span>
          </Button>
        )}

        {/* Botón para volver a las categorías principales */}
        {showAllCategories && (
          <Button
            type="dashed"
            className="flex items-center gap-2 h-10 px-4 rounded-full border-2 border-dashed border-gray-400 text-gray-600 hover:border-gray-600 hover:bg-gray-50 transition-all duration-200"
            onClick={() => setShowAllCategories(false)}
          >
            <span className="font-semibold">Menos categorías</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CategoryFilters;
