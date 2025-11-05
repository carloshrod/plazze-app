"use client";

import { Button, Form, Input } from "antd";
import { useAuthService } from "@/services/auth";

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PasswordForm = () => {
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const { updatePassword, loading } = useAuthService();

  const onPasswordFinish = async (values: PasswordFormValues) => {
    const res = await updatePassword(
      values.currentPassword,
      values.newPassword
    );

    if (res?.success) {
      passwordForm.resetFields();
    }
  };

  return (
    <Form
      form={passwordForm}
      layout="vertical"
      onFinish={onPasswordFinish}
      requiredMark={false}
    >
      <Form.Item
        label="Contraseña actual"
        name="currentPassword"
        rules={[
          {
            required: true,
            message: "Por favor ingresa tu contraseña actual",
          },
        ]}
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item
        label="Nueva contraseña"
        name="newPassword"
        rules={[
          {
            required: true,
            message: "Por favor ingresa tu nueva contraseña",
          },
          {
            min: 8,
            message: "La contraseña debe tener al menos 8 caracteres",
          },
        ]}
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item
        label="Confirmar contraseña"
        name="confirmPassword"
        dependencies={["newPassword"]}
        rules={[
          {
            required: true,
            message: "Por favor confirma tu nueva contraseña",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Las contraseñas no coinciden"));
            },
          }),
        ]}
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item className="mb-0 flex justify-end">
        <Button type="primary" htmlType="submit" size="large" loading={loading}>
          Actualizar contraseña
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PasswordForm;
