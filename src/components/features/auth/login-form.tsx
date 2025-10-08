"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Form, Input } from "antd";
import { FormProps } from "antd/lib";
import { useAuthService } from "@/service/auth";
import { LoginFormFields } from "@/types/auth";

interface Props {
  redirect?: boolean;
}

const LoginForm = ({ redirect = true }: Props) => {
  const [form] = Form.useForm();
  const { login, loading } = useAuthService();
  const searchParams = useSearchParams();

  const onFinish: FormProps<LoginFormFields>["onFinish"] = async (values) => {
    const redirectTo = searchParams.get("redirect_to") ?? undefined;
    await login(values, redirect, redirectTo);
  };

  return (
    <>
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
              message: "Por favor ingresa tu correo electrónico",
            },
            {
              type: "email",
              message: "Por favor ingresa un correo electrónico válido",
            },
          ]}
        >
          <Input size="large" placeholder="correo@ejemplo.com" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            {
              required: true,
              message: "Por favor ingresa tu contraseña",
            },
          ]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>

        <div className="flex justify-end mb-6">
          <Link href="#" className="text-sm text-primary hover:text-primary/90">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="text-end">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="h-11 !w-[45%]"
            loading={loading}
          >
            Iniciar sesión
          </Button>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
