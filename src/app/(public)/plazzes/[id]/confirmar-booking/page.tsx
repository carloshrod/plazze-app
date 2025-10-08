"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button, Card, Steps, Tabs } from "antd";
import { LuCreditCard, LuUser } from "react-icons/lu";
import { RiPaypalLine } from "react-icons/ri";
import LoginForm from "@/components/features/auth/login-form";
import RegisterForm from "@/components/features/auth/register-form";
import BookingSummary from "@/components/features/plazzes/plazze-detail/booking-summary";
import { useAuthStore } from "@/stores/auth";
import { mockPlazzes } from "@/mock/plazzes";
import dayjs from "dayjs";

export default function ConfirmBookingPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const currentStep = isAuthenticated ? 1 : 0;

  const plazze = mockPlazzes.find((p) => p.id === params.id);

  if (!plazze) {
    router.push("/plazzes");
    return null;
  }

  const bookingData = {
    plazzeName: plazze.name,
    address: plazze.location,
    date: searchParams.get("date") || dayjs(),
    time: searchParams.get("time") || "19:00",
    guests: searchParams.get("guests") || "5",
    price: plazze.price || 0,
    image: plazze.image,
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

                  <BookingSummary booking={bookingData} />

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
