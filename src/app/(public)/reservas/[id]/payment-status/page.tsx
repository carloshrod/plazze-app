"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Result, Spin, Button, Alert } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { checkBookingPaymentStatus } from "@/libs/api/booking";
import { ROUTES } from "@/consts/routes";

export default function PaymentStatusPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [checking, setChecking] = useState(false);

  const bookingId = parseInt(params.id);
  const orderId = searchParams.get("order_id");

  const checkPaymentStatus = async () => {
    try {
      setChecking(true);
      const response = await checkBookingPaymentStatus(bookingId);
      setPaymentStatus(response.status);

      if (response.payment_completed) {
        // Pago completado, redirigir a página de éxito después de 3 segundos
        setTimeout(() => {
          router.push(ROUTES.PUBLIC.BOOKINGS.SUCCESS(bookingId));
        }, 3000);
      }
    } catch (error) {
      console.error("Error al verificar estado de pago:", error);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    const initialCheck = async () => {
      await checkPaymentStatus();
      setLoading(false);
    };

    initialCheck();

    // Verificar estado cada 30 segundos
    const interval = setInterval(checkPaymentStatus, 30000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  if (loading) {
    return (
      <div className="py-8 bg-gray-50 px-6 md:px-12 min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const isPaymentCompleted =
    paymentStatus === "confirmed" || paymentStatus === "paid";

  const paymentStatusMap: Record<string, string> = {
    waiting: "En espera",
    pending: "Pendiente",
    confirmed: "Confirmado",
    paid: "Pagado",
    failed: "Fallido",
    cancelled: "Cancelado",
    processing: "Procesando",
    refunded: "Reembolsado",
  };

  return (
    <div className="py-8 bg-gray-50 px-2 sm:px-6 md:px-12 min-h-screen">
      <div className="w-full md:max-w-2xl mx-auto">
        <Card styles={{ body: { padding: "16px 8px" } }}>
          {isPaymentCompleted ? (
            <Result
              status="success"
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              title={
                <span className="text-base md:text-lg">¡Pago Confirmado!</span>
              }
              subTitle={
                <span className="text-sm md:text-base">{`Tu reserva #${bookingId} ha sido confirmada exitosamente`}</span>
              }
              extra={[
                <Button
                  type="primary"
                  key="success"
                  onClick={() =>
                    router.push(ROUTES.PUBLIC.BOOKINGS.SUCCESS(bookingId))
                  }
                  className="w-full sm:w-auto"
                >
                  Ver detalles de la reserva
                </Button>,
              ]}
              style={{ padding: "8px 0" }}
            >
              <div className="text-center">
                <p className="text-gray-600">
                  Redirigiendo automáticamente en unos segundos...
                </p>
              </div>
            </Result>
          ) : (
            <Result
              status="info"
              icon={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
              title={
                <span className="text-base md:text-lg">
                  Esperando confirmación de pago
                </span>
              }
              subTitle={
                <span className="text-sm md:text-base">{`Reserva #${bookingId} - Estado: ${paymentStatusMap[paymentStatus]}`}</span>
              }
              extra={
                <div className="flex flex-col justify-center gap-2 w-full sm:flex-row sm:gap-3">
                  <Button
                    type="primary"
                    key="refresh"
                    loading={checking}
                    onClick={checkPaymentStatus}
                    className="w-full max-w-[200px] max-sm:m-auto sm:w-auto"
                  >
                    Verificar pago
                  </Button>
                  <Button
                    key="back"
                    onClick={() => router.push(ROUTES.PUBLIC.PLAZZES.LIST)}
                    className="w-full max-w-[200px] max-sm:m-auto sm:w-auto"
                  >
                    Volver a plazzes
                  </Button>
                </div>
              }
              style={{ padding: "8px 0" }}
            >
              <div className="space-y-4">
                <Alert
                  message={
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                      <InfoCircleOutlined className="!text-blue-500 !text-xl" />
                      <span>Proceso de pago</span>
                    </div>
                  }
                  description={
                    <div className="sm:px-8">
                      Una vez que completes el pago, tu reserva será confirmada
                    </div>
                  }
                  type="info"
                />

                {orderId && (
                  <div className="text-sm text-gray-500 text-center">
                    <p>
                      <strong>ID de la reserva:</strong> {bookingId}
                    </p>
                    <p>
                      <strong>ID de la orden:</strong> {orderId}
                    </p>
                    <p>
                      <strong>Estado actual:</strong>{" "}
                      {paymentStatusMap[paymentStatus]}
                    </p>
                  </div>
                )}
              </div>
            </Result>
          )}
        </Card>
      </div>
    </div>
  );
}
