import { useState, useEffect } from "react";
import { plazzeLib } from "@/libs/api/plazze";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await plazzeLib.getCategories();
        setCategories(categoriesData);

        // Crear un mapa para acceso rápido id -> nombre
        const map = categoriesData.reduce((acc, cat) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {} as Record<number, string>);
        setCategoryMap(map);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const getCategoryName = (categoryId: number): string => {
    return categoryMap[categoryId] || `Categoría ${categoryId}`;
  };

  return {
    categories,
    loading,
    categoryMap,
    getCategoryName,
  };
};
