"use client";

import { Button, Form, Input } from "antd";
import { FormProps } from "antd/lib";
import { useAuthService } from "@/services/auth";
import { LoginFormFields } from "@/types/auth";

interface Props {
  redirect?: boolean;
  redirectTo?: string;
}

const LoginForm = ({ redirect = true, redirectTo = undefined }: Props) => {
  const [form] = Form.useForm();
  const { login, loading } = useAuthService();

  const onFinish: FormProps<LoginFormFields>["onFinish"] = async (values) => {
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

        <div className="text-end">
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="mt-4 sm:!w-[50%]"
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
