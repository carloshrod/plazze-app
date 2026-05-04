"use client";

import { useState, useCallback } from "react";
import { planLib } from "@/libs/api/plan";
import showMessage from "@/libs/message";
import type { SellerPlan, PlanDefinition } from "@/types/plan";

export const useSellerPlanService = () => {
  const [sellerPlan, setSellerPlan] = useState<SellerPlan | null>(null);
  const [availablePlans, setAvailablePlans] = useState<PlanDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSellerPlan = useCallback(async () => {
    setLoading(true);
    try {
      const data = await planLib.getSellerPlan();
      setSellerPlan(data);
      return data;
    } catch {
      showMessage.error("Error al obtener información del plan");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailablePlans = useCallback(async () => {
    try {
      const data = await planLib.getAvailablePlans();
      setAvailablePlans(data);
      return data;
    } catch {
      showMessage.error("Error al obtener los planes disponibles");
      return [];
    }
  }, []);

  const purchasePlan = useCallback(
    async (planSlug: string, simulate = false) => {
      setLoading(true);
      try {
        const result = await planLib.purchasePlan(planSlug, simulate);
        if (result.success) {
          showMessage.success(result.message || "Plan activado correctamente");
          if (result.plan) setSellerPlan(result.plan);
        } else {
          showMessage.error(result.message || "Error al activar el plan");
        }
        return result;
      } catch {
        showMessage.error("Error al procesar la compra del plan");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const toggleListingStatus = useCallback(async (listingId: number) => {
    try {
      const result = await planLib.toggleListingStatus(listingId);
      if (result.success) {
        showMessage.success(result.message);
      } else {
        showMessage.error(result.message);
      }
      return result;
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; code?: string } };
      };
      const code = axiosErr?.response?.data?.code;
      const message = axiosErr?.response?.data?.message;

      if (code === "quota_exceeded") {
        showMessage.error("No tienes cupo disponible para activar más plazzes");
      } else if (code === "plan_expired") {
        showMessage.error(
          "Tu plan ha vencido. Renueva tu plan para activar plazzes",
        );
      } else {
        showMessage.error(message || "Error al cambiar el estado del plazze");
      }
      return null;
    }
  }, []);

  return {
    sellerPlan,
    availablePlans,
    loading,
    fetchSellerPlan,
    fetchAvailablePlans,
    purchasePlan,
    toggleListingStatus,
  };
};
