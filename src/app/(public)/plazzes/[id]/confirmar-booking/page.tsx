"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, Steps, Tabs, Spin } from "antd";
import { LuCreditCard, LuUser } from "react-icons/lu";
import { RiPaypalLine } from "react-icons/ri";
import LoginForm from "@/components/features/auth/login-form";
import RegisterForm from "@/components/features/auth/register-form";
import BookingSummary from "@/components/features/plazzes/plazze-detail/booking-summary";
import { useAuthStore } from "@/stores/auth";
import { usePlazzeService } from "@/services/plazze";
import { Plazze } from "@/types/plazze";
import dayjs from "dayjs";
import { decodeHtmlEntities } from "@/utils";

export default function ConfirmBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { fetchPlazzeById } = usePlazzeService();

  const [plazze, setPlazze] = useState<Plazze | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentStep = isAuthenticated ? 1 : 0;

  useEffect(() => {
    const loadPlazze = async () => {
      try {
        setLoading(true);

        const data = await fetchPlazzeById(parseInt(params.id));

        if (data) {
          setPlazze(data);
        } else {
          console.error(
            "❌ No se encontró plazze para booking con ID:",
            params.id
          );
          router.push("/plazzes");
          return;
        }
      } catch (error) {
        console.error("❌ Error al cargar plazze para booking:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
        router.push("/plazzes");
        return;
      } finally {
        setLoading(false);
      }
    };

    if (params.id && !isNaN(parseInt(params.id))) {
      loadPlazze();
    } else {
      console.error("❌ ID inválido para booking:", params.id);
      router.push("/plazzes");
      return;
    }
  }, [params.id, fetchPlazzeById, router]);

  if (loading) {
    return (
      <div className="py-8 bg-gray-50 px-6 md:px-12">
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error || !plazze) {
    return (
      <div className="py-8 bg-gray-50 px-6 md:px-12">
        <div className="max-w-3xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-4">
              {error || "No se pudo cargar el plazze"}
            </p>
            <Button onClick={() => router.push("/plazzes")}>
              Volver a plazzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const bookingData = {
    plazzeName: decodeHtmlEntities(plazze.name),
    address:
      plazze.region ||
      plazze.friendly_address ||
      plazze.address ||
      "Ubicación no especificada",
    date: searchParams.get("date") || dayjs().format("YYYY-MM-DD"),
    time: searchParams.get("time") || "19:00",
    guests: searchParams.get("guests") || "1",
    price: searchParams.get("totalPrice")
      ? parseInt(searchParams.get("totalPrice")!)
      : plazze.price_min || 0,
    image: plazze.image,
    serviceId: searchParams.get("service"),
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="py-8 bg-gray-50 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <div className="max-w-md mx-auto mb-4">
          <Steps
            current={currentStep}
            items={[
              {
                title: "Cuenta",
                icon: <LuUser size={20} />,
              },
              {
                title: "Pagar",
                icon: <LuCreditCard size={20} />,
              },
            ]}
          />
        </div>

        <div className="grid gap-6">
          <Card>
            <div className="flex flex-col gap-6">
              {!isAuthenticated ? (
                <>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Iniciar sesión o registrarse
                    </h1>
                    <p className="text-gray-600">
                      Para continuar con tu reserva, necesitas una cuenta
                    </p>
                  </div>

                  <Tabs
                    items={[
                      {
                        key: "login",
                        label: "Iniciar sesión",
                        children: (
                          <div className="px-24">
                            <LoginForm redirect={false} />
                          </div>
                        ),
                      },
                      {
                        key: "register",
                        label: "Registrarse",
                        children: (
                          <div>
                            <RegisterForm />
                            <p className="text-sm text-gray-500 mt-6 text-center">
                              Al crear una cuenta, aceptas nuestros{" "}
                              <Link
                                href="#"
                                className="text-primary hover:text-primary/90"
                              >
                                Términos y condiciones
                              </Link>{" "}
                              y{" "}
                              <Link
                                href="#"
                                className="text-primary hover:text-primary/90"
                              >
                                Política de privacidad
                              </Link>
                            </p>
                          </div>
                        ),
                      },
                    ]}
                    defaultActiveKey="login"
                  />
                </>
              ) : (
                <>
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Confirma tu reserva
                    </h1>
                    <p className="text-gray-600">
                      Revisa los detalles de tu reserva antes de proceder al
                      pago
                    </p>
                  </div>

                  <BookingSummary booking={bookingData} plazze={plazze} />

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-gray-500 text-center">
                        Al hacer clic en &ldquo;Pagar con PayPal&rdquo;, serás
                        redirigido a PayPal para completar tu pago de forma
                        segura.
                      </p>
                      <Button
                        type="primary"
                        size="large"
                        block
                        icon={<RiPaypalLine size={20} />}
                        className="flex items-center justify-center h-12 !bg-[#0070ba] hover:!bg-[#005ea6]"
                      >
                        Pagar con PayPal
                      </Button>
                    </div>
                    <Button
                      type="text"
                      size="large"
                      onClick={handleBack}
                      className="hover:!bg-primary/10"
                    >
                      Volver atrás
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
