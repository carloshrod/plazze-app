"use client";

import { useState } from "react";
import { Button, Card, Modal, Popover } from "antd";
import { LuInfo, LuMegaphone, LuSettings2 } from "react-icons/lu";
import { BannersTable } from "@/components/features/admin/banners-table";
import BannerModal from "@/components/features/admin/banner-modal";
import { useAuthStore } from "@/stores/auth";
import { useBannersStore } from "@/stores/banners";
import { BannerPricingConfig } from "@/components/features/admin/banner-pricing-config";

const bannerConditions = (
  <ul className="max-w-xs space-y-1 text-sm text-gray-600 list-none">
    <li>• Elige la posición y el paquete de duración (7, 15 o 30 días).</li>
    <li>• El precio varía según la posición y la duración elegida.</li>
    <li>• Serás redirigido al proceso de pago para confirmar la solicitud.</li>
    <li>
      • El administrador revisará y aprobará tu banner antes de publicarlo.
    </li>
    <li>• La vigencia comienza desde la fecha de aprobación del admin.</li>
    <li>• Recibirás una notificación cuando tu banner sea aprobado.</li>
  </ul>
);

export default function BannersPage() {
  const { user } = useAuthStore();
  const { banners, loading, error } = useBannersStore();
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "administrator";
  const showSellerCta = isSeller && !loading && !error && banners.length === 0;
  const showSellerButton = isSeller && !loading && banners.length > 0;
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {isSeller ? (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
            <p className="text-gray-500 mt-1">
              Solicita un banner para promocionar tu espacio en la landing page
            </p>
          </div>
          {showSellerButton && (
            <BannerModal
              isSeller
              trigger={
                <Button
                  type="primary"
                  size="large"
                  icon={<LuMegaphone size={16} />}
                >
                  Solicitar banner
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 md:px-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
            <p className="text-gray-500 mt-1">
              Gestiona los banners que se muestran en la landing page
            </p>
          </div>
          <div className="w-full flex items-center justify-between gap-3">
            {isAdmin && (
              <Button
                type="link"
                icon={<LuSettings2 size={15} />}
                onClick={() => setPricingModalOpen(true)}
                className="text-gray-500 hover:text-primary px-0"
              >
                Configurar precios de banners
              </Button>
            )}
            <BannerModal />
          </div>
        </div>
      )}

      {showSellerCta && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <LuMegaphone size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-gray-900">
                ¿Quieres un banner en la landing?
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                Promociona tu espacio con un banner en la página principal.
                Elige el paquete, realiza el pago y el administrador lo aprobará
                antes de publicarse.{" "}
                <Popover
                  content={bannerConditions}
                  title="Cómo funciona el banner"
                  trigger="click"
                  placement="bottomLeft"
                >
                  <span className="inline-flex items-center gap-1 ms-3 text-primary cursor-pointer hover:underline">
                    <LuInfo size={14} />
                    Ver condiciones
                  </span>
                </Popover>
              </p>

              <BannerModal
                isSeller
                trigger={
                  <Button type="primary" icon={<LuMegaphone size={16} />}>
                    Solicitar banner
                  </Button>
                }
              />
            </div>
          </div>
        </Card>
      )}

      <BannersTable />

      <Modal
        title="Configurar precios de paquetes de banners"
        open={pricingModalOpen}
        onCancel={() => setPricingModalOpen(false)}
        footer={null}
        width={560}
        destroyOnHidden
      >
        <BannerPricingConfig />
      </Modal>
    </div>
  );
}
