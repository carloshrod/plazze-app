"use client";

import { useEffect, useState } from "react";
import { Button, Card, Modal, Popover, Skeleton, Alert } from "antd";
import { LuInfo, LuSettings2, LuSparkles, LuRefreshCw } from "react-icons/lu";
import PlazzeModal from "@/components/features/admin/plazzes/plazze-modal";
import PlazzesTable from "@/components/features/admin/plazzes/plazzes-table";
import { useAuthStore } from "@/stores/auth";
import { FeaturedPricingConfig } from "@/components/features/admin/plazzes/featured-pricing-config";
import { cn } from "@/libs/cn";
import { usePlazzeModalStore } from "@/stores/plazze-modal";
import { useSellerPlanService } from "@/services/plan";
import { PlanSelectionModal } from "@/components/features/admin/dashboard/PlanSelectionModal";

const featureConditions = (
  <ul className="max-w-xs space-y-1 text-sm text-gray-600 list-none">
    <li>• Tu plazze debe estar publicado y tener información completa.</li>
    <li>• Elige el paquete de duración (7, 15 o 30 días) al solicitar.</li>
    <li>• Serás redirigido al proceso de pago para confirmar la solicitud.</li>
    <li>• Solo puede haber una solicitud pendiente por plazze.</li>
    <li>• El destaque se activa automáticamente al confirmar el pago.</li>
    <li>• Recibirás una notificación cuando tu solicitud sea procesada.</li>
  </ul>
);

export default function PlazzesPage() {
  const { user, isLoadingAuth } = useAuthStore();
  const {
    pricingModalOpen,
    openPricingModal,
    closePricingModal,
    openCreateModal,
  } = usePlazzeModalStore();
  const isAdmin = user?.role === "administrator";
  const isSeller = user?.role === "seller";

  const { sellerPlan, fetchSellerPlan } = useSellerPlanService();
  const [planSelectionOpen, setPlanSelectionOpen] = useState(false);

  useEffect(() => {
    if (isSeller) {
      fetchSellerPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSeller]);

  const quotaExceeded =
    isSeller &&
    sellerPlan !== null &&
    sellerPlan.listings_used >= sellerPlan.listings_quota;
  const planExpired =
    isSeller && sellerPlan !== null && sellerPlan.is_plan_expired;
  const createBlocked = quotaExceeded || planExpired;

  const disabledReason = planExpired
    ? "Tu plan ha vencido. Renueva tu plan para crear nuevos plazzes."
    : quotaExceeded
      ? `Has alcanzado el límite de plazzes de tu plan (${sellerPlan?.listings_quota} máx).`
      : undefined;

  /**
   * Intercepta el clic en "Nuevo Plazze" para sellers:
   * - Primera vez (0 listings activos Y cuota no excedida): muestra selector de planes
   * - Si ya tiene listings: abre el formulario directamente
   */
  const handleNewPlazze = () => {
    if (
      isSeller &&
      sellerPlan !== null &&
      sellerPlan.listings_used === 0 &&
      !createBlocked
    ) {
      setPlanSelectionOpen(true);
    } else {
      openCreateModal();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 md:px-4">
        <div>
          {isLoadingAuth ? (
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="large" className="!min-w-80" />
              <Skeleton.Input active className="!min-w-96" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isAdmin ? "Plazzes" : "Mis Plazzes"}
              </h1>
              <p className="text-gray-600">
                {isAdmin
                  ? "Gestiona todos los espacios de la plataforma"
                  : "Gestiona tus espacios"}
              </p>
            </>
          )}
        </div>
        {!isLoadingAuth && (
          <div
            className={cn(
              "flex items-center justify-between gap-3",
              isAdmin && "w-full",
            )}
          >
            {isAdmin && (
              <Button
                type="link"
                icon={<LuSettings2 size={15} />}
                onClick={() => openPricingModal()}
                className="text-gray-500 hover:text-primary px-0"
              >
                Configurar precios de destacados
              </Button>
            )}

            <PlazzeModal
              disabled={createBlocked}
              disabledReason={disabledReason}
              onTriggerClick={isSeller ? handleNewPlazze : undefined}
              onAfterSuccess={isSeller ? fetchSellerPlan : undefined}
              photoLimit={isSeller ? (sellerPlan?.photo_limit ?? 4) : undefined}
            />
          </div>
        )}
      </div>

      {!isLoadingAuth && isSeller && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <LuSparkles size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-gray-900">
                ¿Quieres destacar tu plazze?
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                Puedes solicitar que tu plazze aparezca en la sección{" "}
                <strong>Recomendados</strong> eligiendo un paquete de duración.
                El destaque se activa tras confirmar el pago.{" "}
                <Popover
                  content={featureConditions}
                  title="Cómo funciona el destaque"
                  trigger="click"
                  placement="bottomLeft"
                >
                  <span className="inline-flex items-center gap-1 ms-3 text-primary cursor-pointer hover:underline">
                    <LuInfo size={14} />
                    Ver condiciones
                  </span>
                </Popover>
              </p>
            </div>
          </div>
        </Card>
      )}

      <PlazzesTable />

      {isSeller && createBlocked && (
        <Alert
          type={planExpired ? "error" : "warning"}
          showIcon
          message={planExpired ? "Plan vencido" : "Límite de plazzes alcanzado"}
          description={disabledReason}
          className="mb-2"
          action={
            <Button
              size="small"
              type="primary"
              icon={<LuRefreshCw size={13} />}
              onClick={() => setPlanSelectionOpen(true)}
            >
              Actualizar plan
            </Button>
          }
        />
      )}

      <Modal
        title="Configurar precios de paquetes de destacados"
        open={pricingModalOpen}
        onCancel={() => closePricingModal()}
        footer={null}
        width={480}
        destroyOnHidden
      >
        <FeaturedPricingConfig />
      </Modal>

      {isSeller && (
        <PlanSelectionModal
          open={planSelectionOpen}
          onClose={() => {
            setPlanSelectionOpen(false);
            fetchSellerPlan();
          }}
          afterSelect={() => openCreateModal()}
        />
      )}
    </div>
  );
}
