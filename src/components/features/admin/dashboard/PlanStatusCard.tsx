"use client";

import { useEffect, useState } from "react";
import { Card, Progress, Tag, Button, Tooltip } from "antd";
import {
  LuPackage,
  LuStar,
  LuRefreshCw,
  LuTriangleAlert,
} from "react-icons/lu";
import { useSellerPlanService } from "@/services/plan";
import { PlanSelectionModal } from "./PlanSelectionModal";
import type { PlanSlug } from "@/types/plan";

const PLAN_COLORS: Record<PlanSlug, string> = {
  basic: "#6b7280",
  extended: "#3b82f6",
  pro: "#8b5cf6",
};

const PLAN_LABELS: Record<PlanSlug, string> = {
  basic: "Básico",
  extended: "Extendido",
  pro: "Pro",
};

export const PlanStatusCard = () => {
  const { sellerPlan, loading, fetchSellerPlan } = useSellerPlanService();
  const [planModalOpen, setPlanModalOpen] = useState(false);

  useEffect(() => {
    fetchSellerPlan();
  }, [fetchSellerPlan]);

  if (loading || !sellerPlan) {
    return null;
  }

  const planSlug = sellerPlan.current_plan;
  const planColor = PLAN_COLORS[planSlug] ?? "#6b7280";
  const planLabel = PLAN_LABELS[planSlug] ?? sellerPlan.plan_name;

  const quotaPercent =
    sellerPlan.listings_quota > 0
      ? Math.round((sellerPlan.listings_used / sellerPlan.listings_quota) * 100)
      : 0;

  const isNearExpiry =
    !sellerPlan.is_plan_expired &&
    sellerPlan.days_to_expire !== null &&
    sellerPlan.days_to_expire <= 3;

  const isNearQuota = quotaPercent >= 80;

  const showWarning = sellerPlan.is_plan_expired || isNearExpiry || isNearQuota;

  return (
    <>
      <Card className="border border-gray-200 hover:border-primary/20 hover:shadow-sm transition-all">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: planColor + "20" }}
              >
                <LuPackage size={22} style={{ color: planColor }} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Tu plan actual
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-semibold text-gray-900">
                    {planLabel}
                  </span>
                  {sellerPlan.is_plan_expired ? (
                    <Tag color="red">Vencido</Tag>
                  ) : isNearExpiry ? (
                    <Tag color="orange">Vence pronto</Tag>
                  ) : (
                    <Tag color="green">Activo</Tag>
                  )}
                </div>
              </div>
            </div>

            {planSlug !== "pro" && (
              <Button
                size="small"
                type="primary"
                icon={<LuRefreshCw size={13} />}
                onClick={() => setPlanModalOpen(true)}
                style={{ backgroundColor: planColor, borderColor: planColor }}
              >
                Actualizar plan
              </Button>
            )}
          </div>

          {/* Warning banner */}
          {showWarning && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800 text-sm">
              <LuTriangleAlert size={15} className="shrink-0" />
              <span>
                {sellerPlan.is_plan_expired
                  ? "Tu plan ha vencido. Renueva para poder publicar plazzes."
                  : isNearExpiry
                    ? `Tu plan vence en ${sellerPlan.days_to_expire} día${sellerPlan.days_to_expire === 1 ? "" : "s"}.`
                    : "Estás cerca de tu límite de plazzes publicados."}
              </span>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Cupo de plazzes */}
            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Plazzes publicados</p>
              <p className="text-base font-semibold text-gray-900">
                {sellerPlan.listings_used}{" "}
                <span className="text-gray-400 font-normal">
                  / {sellerPlan.listings_quota}
                </span>
              </p>
              <Progress
                percent={quotaPercent}
                size="small"
                showInfo={false}
                strokeColor={
                  quotaPercent >= 100
                    ? "#ef4444"
                    : isNearQuota
                      ? "#f59e0b"
                      : planColor
                }
                className="mt-1"
              />
            </div>

            {/* Destacados */}
            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                <LuStar size={11} /> Destacados incluidos
              </p>
              <p className="text-base font-semibold text-gray-900">
                {sellerPlan.featured_quota}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {sellerPlan.photo_limit} fotos por plazze
              </p>
            </div>

            {/* Vigencia */}
            {sellerPlan.days_to_expire !== null && (
              <div className="bg-white/60 rounded-lg p-3 col-span-full">
                <p className="text-xs text-gray-500 mb-1">Vigencia del plan</p>
                <Tooltip
                  title={
                    sellerPlan.plan_expiration
                      ? new Date(
                          sellerPlan.plan_expiration * 1000,
                        ).toLocaleDateString("es-CO")
                      : ""
                  }
                >
                  <span className="text-base font-semibold text-gray-900 cursor-default inline-block">
                    {sellerPlan.is_plan_expired
                      ? "Vencido"
                      : `${sellerPlan.days_to_expire} día${sellerPlan.days_to_expire === 1 ? "" : "s"} restantes`}
                  </span>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </Card>

      <PlanSelectionModal
        open={planModalOpen}
        onClose={() => {
          setPlanModalOpen(false);
          fetchSellerPlan();
        }}
      />
    </>
  );
};
