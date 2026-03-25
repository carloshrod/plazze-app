"use client";

import { useState } from "react";
import { Button, Form, Input } from "antd";
import { useAuthService } from "@/services/auth";
import Link from "next/link";
import { ROUTES } from "@/consts/routes";

// ---- Paso 1: Solicitar email ----
type RequestResetFormProps = {
  // eslint-disable-next-line no-unused-vars
  onSent: (email: string) => void;
};

const RequestResetForm = ({ onSent }: RequestResetFormProps) => {
  const [form] = Form.useForm();
  const { requestPasswordReset, loading } = useAuthService();

  const onFinish = async ({ email }: { email: string }) => {
    const res = await requestPasswordReset(email);
    if (res?.success) {
      onSent(email);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        label="Correo electrónico"
        name="email"
        rules={[
          {
            required: true,
            message: "Por favor, ingresa tu correo electrónico",
          },
          { type: "email", message: "Ingresa un correo electrónico válido" },
        ]}
      >
        <Input size="large" placeholder="correo@ejemplo.com" />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        block
        loading={loading}
      >
        Enviar enlace
      </Button>

      <div className="text-center mt-4">
        <Link
          href={ROUTES.PUBLIC.AUTH.LOGIN}
          className="text-sm text-primary hover:text-primary/90"
        >
          Inicia sesión
        </Link>
      </div>
    </Form>
  );
};

// ---- Paso 2: Ingresar nueva contraseña con el key del email ----
const ConfirmResetForm = ({
  login,
  resetKey,
}: {
  login: string;
  resetKey: string;
}) => {
  const [form] = Form.useForm();
  const [done, setDone] = useState(false);
  const { confirmPasswordReset, loading } = useAuthService();

  const onFinish = async ({ new_password }: { new_password: string }) => {
    const res = await confirmPasswordReset(login, resetKey, new_password);
    if (res?.success) {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <p className="text-green-600 font-medium mb-4">
          ¡Contraseña restablecida exitosamente!
        </p>
        <Link
          href={ROUTES.PUBLIC.AUTH.LOGIN}
          className="text-sm text-primary hover:text-primary/90"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        label="Nueva contraseña"
        name="new_password"
        rules={[
          { required: true, message: "Por favor ingresa tu nueva contraseña" },
          { min: 8, message: "La contraseña debe tener al menos 8 caracteres" },
        ]}
      >
        <Input.Password size="large" placeholder="••••••••" />
      </Form.Item>

      <Form.Item
        label="Confirmar contraseña"
        name="confirm_password"
        dependencies={["new_password"]}
        rules={[
          { required: true, message: "Por favor confirma tu contraseña" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("new_password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Las contraseñas no coinciden"));
            },
          }),
        ]}
      >
        <Input.Password size="large" placeholder="••••••••" />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        block
        loading={loading}
        className="mt-4"
      >
        Restablecer contraseña
      </Button>
    </Form>
  );
};

// ---- Paso 1b: Email enviado ----
const EmailSentConfirmation = ({ email }: { email: string }) => (
  <div className="text-center">
    <p className="text-gray-700 mb-2">
      Si <span className="font-medium">{email}</span> está registrado, recibirás
      un correo con el enlace para restablecer tu contraseña.
    </p>
    <p className="text-sm text-gray-500 mb-6">
      Revisa también tu carpeta de spam.
    </p>
    <Link
      href={ROUTES.PUBLIC.AUTH.LOGIN}
      className="text-sm text-primary hover:text-primary/90"
    >
      Volver a iniciar sesión
    </Link>
  </div>
);

// ---- Componente principal ----
interface ForgotPasswordFormProps {
  // Cuando el usuario llega desde el link del email, pasan estos query params
  resetKey?: string;
  login?: string;
}

const ForgotPasswordForm = ({ resetKey, login }: ForgotPasswordFormProps) => {
  const [sentEmail, setSentEmail] = useState<string | null>(null);

  // Si hay key y login en la URL → mostrar formulario de nueva contraseña
  if (resetKey && login) {
    return (
      <>
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Crea tu nueva contraseña
        </h1>
        <ConfirmResetForm login={login} resetKey={resetKey} />
      </>
    );
  }

  // Si ya enviamos el email → confirmación
  if (sentEmail) {
    return (
      <>
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Revisa tu correo
        </h1>
        <EmailSentConfirmation email={sentEmail} />
      </>
    );
  }

  // Estado inicial → solicitar email
  return (
    <>
      <h1 className="text-2xl font-semibold mb-2 text-center">
        ¿Olvidaste tu contraseña?
      </h1>
      <p className="text-gray-500 text-sm text-center mb-6">
        Ingresa tu correo y te enviaremos un enlace para restablecerla.
      </p>
      <RequestResetForm onSent={setSentEmail} />
    </>
  );
};

export default ForgotPasswordForm;
