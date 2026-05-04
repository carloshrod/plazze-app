"use client";

import { useEffect, useState, useCallback } from "react";
import { Modal, Badge, Button, Spin, Tag } from "antd";
import { LuBuilding2, LuCamera, LuCircleCheck, LuStar } from "react-icons/lu";
import { useSellerPlanService } from "@/services/plan";
import type { PlanDefinition, PlanSlug } from "@/types/plan";

interface PlanSelectionModalProps {
  open: boolean;
  onClose: () => void;
  /** Callback llamado después de elegir un plan (incluyendo básico) */
  afterSelect?: () => void;
}

const PLAN_COLORS: Record<PlanSlug, string> = {
  basic: "#6b7280",
  extended: "#3b82f6",
  pro: "#8b5cf6",
};

const PLAN_GRADIENTS: Record<PlanSlug, string> = {
  basic: "from-gray-50 to-gray-100",
  extended: "from-blue-50 to-blue-100",
  pro: "from-violet-50 to-violet-100",
};

const PLAN_FEATURES: Record<PlanSlug, string[]> = {
  basic: [
    "2 plazzes activos simultáneos",
    "Hasta 5 fotos por plazze",
    "Vigencia de 15 días por plazze",
  ],
  extended: [
    "4 plazzes activos simultáneos",
    "Hasta 9 fotos por plazze",
    "1 plazze destacado incluido",
  ],
  pro: [
    "10 plazzes activos simultáneos",
    "Hasta 9 fotos por plazze",
    "5 plazzes destacados incluidos",
  ],
};

const PLAN_ORDER: PlanSlug[] = ["basic", "extended", "pro"];

export const PlanSelectionModal = ({
  open,
  onClose,
  afterSelect,
}: PlanSelectionModalProps) => {
  const {
    sellerPlan,
    availablePlans,
    loading,
    fetchSellerPlan,
    fetchAvailablePlans,
    purchasePlan,
  } = useSellerPlanService();
  const [purchasingSlug, setPurchasingSlug] = useState<PlanSlug | null>(null);

  const load = useCallback(async () => {
    await Promise.all([fetchSellerPlan(), fetchAvailablePlans()]);
  }, [fetchSellerPlan, fetchAvailablePlans]);

  useEffect(() => {
    if (open) {
      load();
    }
  }, [open, load]);

  const handleSelectBasic = () => {
    onClose();
    afterSelect?.();
  };

  const handleSelectPaid = async (slug: PlanSlug) => {
    setPurchasingSlug(slug);
    try {
      const result = await purchasePlan(slug, true);
      if (result?.success) {
        onClose();
        afterSelect?.();
      }
    } finally {
      setPurchasingSlug(null);
    }
  };

  // Construir mapa para acceso rápido por slug
  const plansMap = availablePlans.reduce<Record<string, PlanDefinition>>(
    (acc, p) => ({ ...acc, [p.slug]: p }),
    {},
  );

  const currentPlanSlug = sellerPlan?.current_plan ?? "basic";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={860}
      title={
        <div className="pb-1">
          <p className="text-xl font-semibold text-gray-900">Elige tu plan</p>
          <p className="text-sm text-gray-500 font-normal mt-0.5">
            Selecciona el plan que mejor se adapte a tus necesidades. Puedes
            cambiar tu plan en cualquier momento.
          </p>
        </div>
      }
      destroyOnHidden
    >
      {loading && availablePlans.length === 0 ? (
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 pb-4">
          {PLAN_ORDER.map((slug) => {
            const plan = plansMap[slug];
            if (!plan) return null;

            const isCurrent = slug === currentPlanSlug;
            const isPaid = plan.price > 0;
            const color = PLAN_COLORS[slug];
            const gradient = PLAN_GRADIENTS[slug];
            const features = PLAN_FEATURES[slug];
            const isPurchasing = purchasingSlug === slug;
            const isAnyPurchasing = purchasingSlug !== null;

            return (
              <Badge.Ribbon
                key={slug}
                text="Plan actual"
                color={isCurrent ? color : "transparent"}
                style={{ display: isCurrent ? undefined : "none" }}
              >
                <div
                  className={`h-full flex flex-col rounded-xl border-2 bg-gradient-to-b ${gradient} p-5 transition-all ${
                    isCurrent
                      ? "shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ borderColor: isCurrent ? color : undefined }}
                >
                  {/* Header */}
                  <div className="mb-4">
                    <p className="text-base font-bold mb-1" style={{ color }}>
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-1">
                      {isPaid ? (
                        <>
                          <span className="text-3xl font-extrabold text-gray-900">
                            ${plan.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            / {plan.plan_days} días
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-extrabold text-gray-900">
                          Gratis
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Tag
                      icon={<LuBuilding2 size={11} />}
                      className="!flex items-center gap-1"
                    >
                      {plan.listings_quota} plazzes
                    </Tag>
                    <Tag
                      icon={<LuCamera size={11} />}
                      className="!flex items-center gap-1"
                    >
                      {plan.photo_limit} fotos
                    </Tag>
                    {plan.featured_quota > 0 && (
                      <Tag
                        color="gold"
                        icon={<LuStar size={11} />}
                        className="!flex items-center gap-1"
                      >
                        {plan.featured_quota} destacado
                        {plan.featured_quota > 1 ? "s" : ""}
                      </Tag>
                    )}
                    {/* <Tag
                      icon={<LuClock size={11} />}
                      className="!flex items-center gap-1"
                    >
                      {plan.duration_days}d/plazze
                    </Tag> */}
                  </div>

                  {/* Features list */}
                  <ul className="space-y-2 flex-1 mb-5">
                    {features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <LuCircleCheck
                          size={15}
                          className="mt-0.5 shrink-0"
                          style={{ color }}
                        />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {slug === "basic" ? (
                    <Button
                      block
                      onClick={handleSelectBasic}
                      disabled={isAnyPurchasing}
                    >
                      {isCurrent
                        ? "Continuar con plan básico"
                        : "Usar plan básico"}
                    </Button>
                  ) : (
                    <Button
                      block
                      type={isCurrent ? "default" : "primary"}
                      loading={isPurchasing}
                      disabled={isAnyPurchasing && !isPurchasing}
                      onClick={() => handleSelectPaid(slug)}
                      style={
                        !isCurrent
                          ? { backgroundColor: color, borderColor: color }
                          : undefined
                      }
                    >
                      {isCurrent ? "Renovar plan" : `Elegir ${plan.name}`}
                    </Button>
                  )}
                </div>
              </Badge.Ribbon>
            );
          })}
        </div>
      )}
    </Modal>
  );
};
