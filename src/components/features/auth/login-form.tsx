"use client";

import { Button, Form, Input } from "antd";
import Link from "next/link";

interface LoginFormFields {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: LoginFormFields) => {
    console.log("Success:", values);
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
        >
          Iniciar sesión
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
