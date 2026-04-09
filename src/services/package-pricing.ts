import { useState, useEffect, useCallback } from "react";
import { pricingLib } from "@/libs/api/pricing";
import { PackagePricing } from "@/consts/packagePricing";

export const usePackagePricing = () => {
  const [pricing, setPricing] = useState<PackagePricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pricingLib.getPackagePricing();
      setPricing(data);
    } catch {
      setError("Error al cargar precios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  const savePricing = async (newPricing: PackagePricing) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await pricingLib.setPackagePricing(newPricing);
      setPricing(updated);
      return true;
    } catch (err) {
      setError("Error al guardar precios");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { pricing, loading, error, savePricing, fetchPricing };
};
