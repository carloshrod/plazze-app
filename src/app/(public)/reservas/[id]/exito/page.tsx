"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Result, Spin, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { ROUTES } from "@/consts/routes";

const { Paragraph, Text } = Typography;

interface BookingSuccessData {
  bookingId: number;
  listingName: string;
  dateStart: string;
  guests: number;
  totalPrice: number;
  services: Array<{
    name: string;
    price: number;
    is_byguest: boolean;
  }>;
}

export default function BookingSuccessPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<BookingSuccessData | null>(
    null
  );

  useEffect(() => {
    // Recuperar datos del sessionStorage
    const storedData = sessionStorage.getItem("bookingSuccess");

    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setBookingData(data);
        // Limpiar sessionStorage después de leer
        sessionStorage.removeItem("bookingSuccess");
      } catch (error) {
        console.error("Error al parsear datos de reserva:", error);
      }
    }

    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="py-8 bg-gray-50 px-6 md:px-12 min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 px-6 md:px-12 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Card>
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            title="¡Reserva confirmada!"
            subTitle={`Tu reserva #${params.id} ha sido creada exitosamente`}
            extra={[
              <Button
                type="primary"
                key="plazzes"
                onClick={() => router.push(ROUTES.PUBLIC.PLAZZES.LIST)}
              >
                Ver más plazzes
              </Button>,
              <Button
                key="profile"
                onClick={() => router.push(ROUTES.ADMIN.DASHBOARD)}
              >
                Mis reservas
              </Button>,
            ]}
          >
            {bookingData && (
              <div className="text-left bg-gray-50 p-6 rounded-lg mt-6">
                <Text strong className="text-lg mb-4 block">
                  Detalles de la reserva
                </Text>

                <div className="space-y-2">
                  <Paragraph className="mb-1">
                    <Text strong>Plazze:</Text> {bookingData.listingName}
                  </Paragraph>
                  <Paragraph className="mb-1">
                    <Text strong>Fecha:</Text> {bookingData.dateStart}
                  </Paragraph>
                  <Paragraph className="mb-1">
                    <Text strong>Invitados:</Text> {bookingData.guests}
                  </Paragraph>
                  <Paragraph className="mb-1">
                    <Text strong>Total:</Text> $
                    {bookingData.totalPrice.toLocaleString("es-CO")}
                  </Paragraph>

                  {bookingData.services.length > 0 && (
                    <div className="mt-4">
                      <Text strong>Servicios incluidos:</Text>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {bookingData.services.map((service, index) => (
                          <li key={index} className="text-gray-700">
                            {service.name} - $
                            {service.price.toLocaleString("es-CO")}
                            {service.is_byguest && " por persona"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Result>
        </Card>
      </div>
    </div>
  );
}
