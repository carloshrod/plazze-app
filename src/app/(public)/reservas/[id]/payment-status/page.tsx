"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Result, Spin, Button, Alert } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
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

  return (
    <div className="py-8 bg-gray-50 px-6 md:px-12 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Card>
          {isPaymentCompleted ? (
            <Result
              status="success"
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              title="¡Pago Confirmado!"
              subTitle={`Tu reserva #${bookingId} ha sido confirmada exitosamente`}
              extra={[
                <Button
                  type="primary"
                  key="success"
                  onClick={() =>
                    router.push(ROUTES.PUBLIC.BOOKINGS.SUCCESS(bookingId))
                  }
                >
                  Ver detalles de la reserva
                </Button>,
              ]}
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
              title="Esperando confirmación de pago"
              subTitle={`Reserva #${bookingId} - Estado: ${paymentStatus}`}
              extra={[
                <Button
                  type="primary"
                  key="refresh"
                  loading={checking}
                  onClick={checkPaymentStatus}
                >
                  Verificar pago
                </Button>,
                <Button
                  key="back"
                  onClick={() => router.push(ROUTES.PUBLIC.PLAZZES.LIST)}
                >
                  Volver a plazzes
                </Button>,
              ]}
            >
              <div className="space-y-4">
                <Alert
                  message="Proceso de pago"
                  description="Una vez que completes el pago, tu reserva será confirmada automáticamente."
                  type="info"
                  showIcon
                />

                {orderId && (
                  <div className="text-sm text-gray-500">
                    <p>
                      <strong>ID de la reserva:</strong> {bookingId}
                    </p>
                    <p>
                      <strong>ID de la orden:</strong> {orderId}
                    </p>
                    <p>
                      <strong>Estado actual:</strong> {paymentStatus}
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
