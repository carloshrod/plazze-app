"use client";

import { useEffect, useState } from "react";
import { Button, Form, Input, Skeleton } from "antd";
import { useBankData } from "@/services/wallet";
import type { BankData } from "@/types/wallet";

const BankDataForm = () => {
  const [form] = Form.useForm<BankData>();
  const { bankData, loading, saving, saveBankData } = useBankData();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (bankData) {
      form.setFieldsValue(bankData);
    }
  }, [bankData, form]);

  const onFinish = async (values: BankData) => {
    await saveBankData(values);
    setIsEditing(false);
  };

  if (loading) {
    return <Skeleton active paragraph={{ rows: 5 }} />;
  }

  return (
    <div>
      <div className="flex justify-end mb-2">
        {!isEditing ? (
          <Button
            color="primary"
            variant="outlined"
            onClick={() => setIsEditing(true)}
          >
            Editar
          </Button>
        ) : (
          <Button
            color="danger"
            variant="outlined"
            onClick={() => setIsEditing(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
        )}
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        className="bank-data-form"
      >
        <Form.Item
          label="Titular de la cuenta"
          name="ac_name"
          rules={[{ required: true, message: "Ingresa el nombre del titular" }]}
        >
          <Input
            size="large"
            placeholder="Nombre completo del titular"
            readOnly={!isEditing}
          />
        </Form.Item>

        <Form.Item
          label="Nombre del banco"
          name="bank_name"
          rules={[{ required: true, message: "Ingresa el nombre del banco" }]}
        >
          <Input
            size="large"
            placeholder="Nombre de tu banco (opcional)"
            readOnly={!isEditing}
          />
        </Form.Item>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item
            label="Número de cuenta"
            name="ac_number"
            rules={[{ required: true, message: "Ingresa el número de cuenta" }]}
          >
            <Input
              size="large"
              placeholder="Número de cuenta bancaria"
              readOnly={!isEditing}
            />
          </Form.Item>

          <Form.Item label="Routing / ABA" name="routing_number">
            <Input
              size="large"
              placeholder="Número de routing (si aplica)"
              readOnly={!isEditing}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Form.Item label="IBAN" name="iban">
            <Input
              size="large"
              placeholder="IBAN (si aplica)"
              readOnly={!isEditing}
            />
          </Form.Item>

          <Form.Item label="SWIFT / BIC" name="swift">
            <Input
              size="large"
              placeholder="SWIFT/BIC (si aplica)"
              readOnly={!isEditing}
            />
          </Form.Item>
        </div>

        {isEditing && (
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
        )}
      </Form>
    </div>
  );
};

export default BankDataForm;
