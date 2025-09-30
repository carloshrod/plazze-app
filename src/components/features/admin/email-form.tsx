"use client";

import { Button, Form, Input, message } from "antd";

type EmailFormValues = {
  email: string;
};

const EmailForm = () => {
  const [emailForm] = Form.useForm<EmailFormValues>();

  const onEmailFinish = async (values: EmailFormValues) => {
    try {
      // TODO: Implementar actualización de email
      console.log(values);
      message.success("Correo electrónico actualizado correctamente");
    } catch (error) {
      message.error("Error al actualizar el correo electrónico");
    }
  };

  return (
    <Form
      form={emailForm}
      layout="vertical"
      onFinish={onEmailFinish}
      requiredMark={false}
      initialValues={{
        email: "john.doe@example.com",
      }}
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
        <Button type="primary" htmlType="submit" size="large">
          Actualizar correo
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmailForm;
