"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Descriptions } from "antd";
import { LuCreditCard } from "react-icons/lu";
import showMessage from "@/libs/message";
import { ROUTES } from "@/consts/routes";

export default function PagoEjemploPage() {
  const router = useRouter();
  const params = useSearchParams();
  const tipo = params.get("tipo") || "banner";
  const id = params.get("id");
  const paquete = params.get("paquete");

  const tipoLabel = tipo === "banner" ? "Banner" : "Destaque de plazze";

  const handleSimularPago = () => {
    showMessage.success(
      tipo === "banner"
        ? "¡Pago simulado exitoso! Tu banner fue enviado para revisión del administrador."
        : "¡Pago simulado exitoso! Tu solicitud de destaque fue registrada.",
    );
    const redirectPath =
      tipo === "banner" ? ROUTES.ADMIN.BANNERS : ROUTES.ADMIN.PLAZZES;
    router.replace(redirectPath);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-primary/10 p-3">
            <LuCreditCard size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Checkout de pago
            </h2>
            <p className="text-sm text-gray-500">
              Simulación — será reemplazado por la pasarela real
            </p>
          </div>
        </div>

        <Descriptions bordered column={1} size="small" className="mb-6">
          <Descriptions.Item label="Servicio">{tipoLabel}</Descriptions.Item>
          <Descriptions.Item label="Duración">{paquete} días</Descriptions.Item>
          <Descriptions.Item label="Estado">
            <span className="text-amber-600 font-medium">
              Pendiente de pago
            </span>
          </Descriptions.Item>
        </Descriptions>

        <p className="text-xs text-gray-400 text-center mb-4">
          Aquí se integrará la pasarela de pago real (Click/WooCommerce). Por
          ahora, haz clic en el botón para simular el pago.
        </p>

        <Button
          type="primary"
          size="large"
          block
          icon={<LuCreditCard size={16} />}
          onClick={handleSimularPago}
        >
          Simular pago exitoso
        </Button>
      </Card>
    </div>
  );
}
