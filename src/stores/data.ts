/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { plazzeLib } from "@/libs/api/plazze";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Region {
  id: number;
  name: string;
  slug: string;
}

interface DataStore {
  // Estado
  categories: Category[];
  regions: Region[];
  loading: boolean;
  error: string | null;

  // Acciones
  loadData: () => Promise<void>;
  getCategoryName: (categoryId: number) => string;
}

export const useDataStore = create<DataStore>((set, get) => ({
  // Estado inicial
  categories: [],
  regions: [],
  loading: false,
  error: null,

  // Cargar datos
  loadData: async () => {
    const { categories, regions } = get();

    // Si ya tenemos datos, no recargar
    if (categories.length > 0 && regions.length > 0) {
      return;
    }

    try {
      set({ loading: true, error: null });

      // Cargar categorías y regiones en paralelo
      const [categoriesData, regionsData] = await Promise.all([
        plazzeLib.getCategories(),
        plazzeLib.getRegions(),
      ]);

      set({
        categories: categoriesData,
        regions: regionsData,
        loading: false,
      });
    } catch (err: any) {
      console.error("❌ Error loading data:", err);
      set({
        error: "Error al cargar datos",
        loading: false,
      });
    }
  },

  // Obtener nombre de categoría
  getCategoryName: (categoryId: number): string => {
    const { categories } = get();
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || `Categoría ${categoryId}`;
  },
}));
