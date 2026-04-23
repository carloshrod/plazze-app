"use client";

import { Button, Card, Modal, Popover } from "antd";
import { LuInfo, LuSettings2, LuSparkles } from "react-icons/lu";
import PlazzeModal from "@/components/features/admin/plazzes/plazze-modal";
import PlazzesTable from "@/components/features/admin/plazzes/plazzes-table";
import { useAuthStore } from "@/stores/auth";
import { FeaturedPricingConfig } from "@/components/features/admin/plazzes/featured-pricing-config";
import { cn } from "@/libs/cn";
import { usePlazzeModalStore } from "@/stores/plazze-modal";

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
  const { user } = useAuthStore();
  const { pricingModalOpen, openPricingModal, closePricingModal } =
    usePlazzeModalStore();
  const isAdmin = user?.role === "administrator";
  const isSeller = user?.role === "seller";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 md:px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isAdmin ? "Todos los Plazzes" : "Mis Plazzes"}
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? "Gestiona todos los espacios de la plataforma"
              : "Gestiona tus espacios"}
          </p>
        </div>
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

          <PlazzeModal />
        </div>
      </div>

      {isSeller && (
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
    </div>
  );
}
