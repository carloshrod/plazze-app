import Link from "next/link";
import { LogoIcon } from "@/components/common/ui/logos/logo-icon";
import LoginForm from "@/components/features/auth/login-form";
import { ROUTES } from "@/consts/routes";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <LogoIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900">
              Inicia sesión en Plazze
            </h1>
            <p className="text-gray-600 mt-2">
              ¿No tienes una cuenta?{" "}
              <Link
                href={ROUTES.PUBLIC.AUTH.REGISTER}
                className="text-primary hover:text-primary/90"
              >
                Regístrate
              </Link>
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
