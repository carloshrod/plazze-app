import { useEffect } from "react";
import { useDataStore } from "@/stores/data";

export function useInitializeData() {
  const loadData = useDataStore((state) => state.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);
}

export function useAppData() {
  const { categories, regions, loading, error, getCategoryName } =
    useDataStore();

  return {
    categories,
    regions,
    loading,
    error,
    getCategoryName,
  };
}
