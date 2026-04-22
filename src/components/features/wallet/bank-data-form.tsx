"use client";

import { useEffect } from "react";
import { Button, Form, Input, Select, Skeleton } from "antd";
import { useBankData } from "@/services/wallet";
import type { BankData } from "@/types/wallet";

export function BankDataForm() {
  const [form] = Form.useForm<BankData>();
  const { bankData, loading, saving, saveBankData } = useBankData();

  useEffect(() => {
    if (bankData) {
      form.setFieldsValue(bankData);
    }
  }, [bankData, form]);

  const onFinish = async (values: BankData) => {
    await saveBankData(values);
  };

  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
    >
      <Form.Item
        label="Titular de la cuenta"
        name="account_holder"
        rules={[{ required: true, message: "Ingresa el nombre del titular" }]}
      >
        <Input size="large" placeholder="Nombre completo del titular" />
      </Form.Item>

      <Form.Item
        label="Nombre del banco"
        name="bank_name"
        rules={[{ required: true, message: "Ingresa el nombre del banco" }]}
      >
        <Input size="large" placeholder="Ej: Banco General, BAC, etc." />
      </Form.Item>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <Form.Item
          label="Número de cuenta"
          name="account_number"
          rules={[{ required: true, message: "Ingresa el número de cuenta" }]}
        >
          <Input size="large" placeholder="Número de cuenta bancaria" />
        </Form.Item>

        <Form.Item
          label="Tipo de cuenta"
          name="account_type"
          rules={[{ required: true, message: "Selecciona el tipo de cuenta" }]}
        >
          <Select size="large" placeholder="Seleccionar">
            <Select.Option value="corriente">Corriente</Select.Option>
            <Select.Option value="ahorros">Ahorros</Select.Option>
          </Select>
        </Form.Item>
      </div>

      <Form.Item
        label="Número de identificación (cédula o RUC)"
        name="id_number"
        rules={[{ required: false }]}
      >
        <Input size="large" placeholder="Ej: 8-888-8888" />
      </Form.Item>

      <Form.Item className="mb-0">
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={saving}
          block
        >
          Guardar datos bancarios
        </Button>
      </Form.Item>
    </Form>
  );
}
