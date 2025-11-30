import Link from "next/link";
import { ROUTES } from "@/consts/routes";
import { LogoIcon } from "@/components/common/ui/logos/logo-icon";

const ForgotPasswordPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-900">
          <LogoIcon className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-semibold mb-4">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="mb-2">
            Por ahora, para restablecer tu contraseña por favor comunícate con
            el administrador:
          </p>
          <a
            href="mailto:admin@plazze.com"
            className="text-blue-600 font-medium underline"
          >
            admin@plazze.com
          </a>
          <p className="my-6 text-sm text-gray-500">
            Pronto habilitaremos el restablecimiento automático.
          </p>

          <div className="text-center">
            <Link
              href={ROUTES.PUBLIC.AUTH.LOGIN}
              className="text-sm text-primary hover:text-primary/90"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
