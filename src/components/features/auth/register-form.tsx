"use client";

import { Button, Form, Input } from "antd";

interface RegisterFormFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: RegisterFormFields) => {
    console.log("Success:", values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
    >
      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="Nombre completo"
          name="name"
          rules={[
            {
              required: true,
              message: "Por favor ingresa tu nombre",
            },
          ]}
        >
          <Input size="large" placeholder="Juan Pérez" />
        </Form.Item>

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
              message: "Por favor ingresa una contraseña",
            },
            {
              min: 8,
              message: "La contraseña debe tener al menos 8 caracteres",
            },
          ]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>

        <Form.Item
          label="Confirmar contraseña"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Por favor confirma tu contraseña",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Las contraseñas no coinciden")
                );
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>
      </div>

      <div className="w-full text-end">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          className="h-11 mt-4 !w-[30%]"
        >
          Crear cuenta
        </Button>
      </div>
    </Form>
  );
};

export default RegisterForm;
