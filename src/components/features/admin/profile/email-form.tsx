"use client";

import { useEffect } from "react";
import { Button, Form, Input } from "antd";
import { useAuthStore } from "@/stores/auth";
import { useAuthService } from "@/services/auth";

type EmailFormValues = {
  email: string;
};

const EmailForm = () => {
  const [emailForm] = Form.useForm<EmailFormValues>();
  const { user } = useAuthStore();
  const { updateEmail, loading } = useAuthService();

  useEffect(() => {
    if (user?.email) {
      emailForm.setFieldsValue({ email: user.email });
    }
  }, [user]);

  const onEmailFinish = async (values: EmailFormValues) => {
    await updateEmail(values.email);
  };

  return (
    <Form
      form={emailForm}
      layout="vertical"
      onFinish={onEmailFinish}
      requiredMark={false}
    >
      <Form.Item
        label="Nuevo correo electrónico"
        name="email"
        rules={[
          { required: true, message: "Por favor ingresa tu correo" },
          { type: "email", message: "Ingresa un correo válido" },
        ]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item className="mb-0">
        <Button type="primary" htmlType="submit" size="large" loading={loading}>
          Actualizar correo
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmailForm;
