"use client";

import { Button } from "antd";
import {
  LuBeer,
  LuMusic,
  LuBuilding,
  LuTrees,
  LuUsers,
  LuPalette,
} from "react-icons/lu";
import { useSearchStore } from "@/stores/search";
import { usePlazzeService } from "@/services/plazze";

const CategoryFilters = () => {
  const { filters, setFilters, setHasSearched } = useSearchStore();
  const { searchWithFilters, fetchPlazzes } = usePlazzeService();

  const categories = [
    {
      id: "38",
      name: "Bares",
      icon: <LuBeer size={18} />,
    },
    {
      id: "42",
      name: "Discotecas",
      icon: <LuMusic size={18} />,
    },
    {
      id: "30",
      name: "Sala de Eventos",
      icon: <LuBuilding size={18} />,
    },
    {
      id: "119",
      name: "Outdoor",
      icon: <LuTrees size={18} />,
    },
    {
      id: "35",
      name: "Cultura y Artes",
      icon: <LuPalette size={18} />,
    },
    {
      id: "115",
      name: "Reuniones",
      icon: <LuUsers size={18} />,
    },
  ];

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
        {categories.map((category) => {
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
              {category.icon}
              <span className="font-medium">{category.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilters;
