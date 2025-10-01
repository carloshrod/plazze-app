"use client";

import { useEffect } from "react";
import { Button, Form, Input, InputNumber, Select } from "antd";
import { type Plazze } from "@/types/plazze";

export default function PlazzeForm({
  initialValues,
}: {
  initialValues?: Partial<Plazze>;
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const onFinish = async (values: Partial<Plazze>) => {
    // TODO: Implementar la lógica para guardar o editar el plazze
    console.log(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="grid grid-cols-2 gap-4"
    >
      <div className="col-span-2 grid grid-cols-2 gap-4">
        <Form.Item
          label="Nombre"
          name="name"
          rules={[{ required: true, message: "El nombre es requerido" }]}
        >
          <Input placeholder="Ej: Terraza Verde" />
        </Form.Item>

        <Form.Item
          label="Categoría"
          name="category"
          rules={[{ required: true, message: "La categoría es requerida" }]}
        >
          <Select
            placeholder="Selecciona una categoría"
            options={[
              { label: "Terrazas", value: "terrazas" },
              { label: "Salones", value: "salones" },
              { label: "Estudios", value: "estudios" },
              { label: "Jardines", value: "jardines" },
            ]}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="Imagen"
        name="image"
        rules={[{ required: true, message: "La imagen es requerida" }]}
      >
        <Input placeholder="URL de la imagen" />
      </Form.Item>

      <Form.Item
        label="Ubicación"
        name="location"
        rules={[{ required: true, message: "La ubicación es requerida" }]}
      >
        <Input placeholder="Ej: Costa del Este, Ciudad de Panamá" />
      </Form.Item>

      <div className="col-span-2 grid grid-cols-3 gap-4">
        <Form.Item
          label="Capacidad"
          name="capacity"
          rules={[{ required: true, message: "La capacidad es requerida" }]}
        >
          <InputNumber min={1} placeholder="Ej: 100" className="!w-full" />
        </Form.Item>

        <Form.Item
          label="Precio"
          name="price"
          rules={[{ required: true, message: "El precio es requerido" }]}
        >
          <InputNumber
            min={0}
            placeholder="Ej: 150"
            className="!w-full"
            prefix="$"
          />
        </Form.Item>

        <Form.Item
          label="Horario"
          name="schedule"
          rules={[{ required: true, message: "El horario es requerido" }]}
        >
          <Input placeholder="Ej: 9:00 AM - 10:00 PM" />
        </Form.Item>
      </div>

      <Form.Item
        label="Descripción"
        name="description"
        rules={[{ required: true, message: "La descripción es requerida" }]}
        className="col-span-2"
      >
        <Input.TextArea
          placeholder="Ej: Hermosa terraza con vista panorámica..."
          rows={3}
        />
      </Form.Item>

      <Form.Item className="col-span-2 mb-0 text-end">
        <Button type="primary" size="large" htmlType="submit">
          {initialValues ? "Actualizar plazze" : "Guardar plazze"}
        </Button>
      </Form.Item>
    </Form>
  );
}
