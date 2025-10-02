import Link from "next/link";
import { LogoIcon } from "@/components/common/ui/logos/logo-icon";
import RegisterTabs from "@/components/features/auth/register-tabs";
import { ROUTES } from "@/consts/routes";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <LogoIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Crea tu cuenta en Plazze
            </h1>
            <p className="text-gray-600 mt-2">
              ¿Ya tienes una cuenta?{" "}
              <Link
                href={ROUTES.PUBLIC.AUTH.LOGIN}
                className="text-primary hover:text-primary/90"
              >
                Inicia sesión
              </Link>
            </p>
          </div>

          {/* Tabs para seleccionar tipo de usuario */}
          <RegisterTabs />

          <p className="text-sm text-gray-500 mt-6 text-center">
            Al crear una cuenta, aceptas nuestros{" "}
            <Link href="#" className="text-primary hover:text-primary/90">
              Términos y condiciones
            </Link>{" "}
            y{" "}
            <Link href="#" className="text-primary hover:text-primary/90">
              Política de privacidad
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
