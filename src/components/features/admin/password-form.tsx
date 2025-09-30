"use client";

import { Button, Form, Input, message } from "antd";

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PasswordForm = () => {
  const [passwordForm] = Form.useForm<PasswordFormValues>();

  const onPasswordFinish = async (values: PasswordFormValues) => {
    try {
      if (values.newPassword !== values.confirmPassword) {
        message.error("Las contraseñas no coinciden");
        return;
      }

      // TODO: Implementar actualización de contraseña
      console.log(values);
      message.success("Contraseña actualizada correctamente");
    } catch (error) {
      message.error("Error al actualizar la contraseña");
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
        <Button type="primary" htmlType="submit" size="large">
          Actualizar contraseña
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PasswordForm;
