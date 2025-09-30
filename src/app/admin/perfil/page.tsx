import EmailForm from "@/components/features/admin/email-form";
import PasswordForm from "@/components/features/admin/password-form";
import { Card } from "antd";
import { LuUser } from "react-icons/lu";

export default function ProfilePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600">Actualiza tu información personal</p>
      </div>

      <div className="max-w-5xl mx-auto">
        <Card className="shadow-sm lg:!px-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
              <LuUser size={40} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
              <p className="text-gray-600">john.doe@example.com</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-20">
            {/* Formulario de Email */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Correo electrónico
              </h3>

              <EmailForm />
            </div>

            {/* Formulario de Contraseña */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Cambiar contraseña
              </h3>
              <PasswordForm />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
