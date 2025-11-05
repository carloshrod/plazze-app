"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  TimePicker,
  Space,
  Card,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { useAppData } from "@/hooks/useAppData";
import { usePlazzeService } from "@/services/plazze";
import { PlazzeFormData } from "@/types/plazze";

// Cargar el mapa dinámicamente para evitar errores de SSR
const MapSelector = dynamic(() => import("./map-selector"), { ssr: false });

const { TextArea } = Input;
const { Option } = Select;

export default function PlazzeForm({
  initialValues,
  onSuccess,
}: {
  initialValues?: Partial<PlazzeFormData>;
  onSuccess?: () => void;
}) {
  const [form] = Form.useForm();
  const { categories, regions } = useAppData();
  const { createPlazze, loading } = usePlazzeService();
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Observar cambios en schedule_groups para actualizar días disponibles
  const scheduleGroups = Form.useWatch("schedule_groups", form) || [];

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      if (initialValues.latitude && initialValues.longitude) {
        setCoordinates({
          lat: initialValues.latitude,
          lng: initialValues.longitude,
        });
      }
    }
  }, [initialValues, form]);

  const onFinish = async (values: PlazzeFormData) => {
    try {
      await createPlazze(values, coordinates);

      // Limpiar el formulario después del éxito
      form.resetFields();
      setCoordinates(null);

      // Llamar a la función onSuccess si existe (para cerrar modal y actualizar lista)
      if (onSuccess) {
        onSuccess();
      }

      // TODO: Redirigir a la página de listings o mostrar el listing creado
    } catch (error) {
      console.error("Error en onFinish:", error);
    }
  };

  // Función para obtener días ya seleccionados en otros horarios
  const getSelectedDays = (currentFieldIndex: number) => {
    const selectedDays: string[] = [];

    scheduleGroups.forEach((group: any, index: number) => {
      // Comparar con el índice real del array, no con el name del field
      if (
        index !== currentFieldIndex &&
        group?.days &&
        Array.isArray(group.days)
      ) {
        selectedDays.push(...group.days);
      }
    });

    return selectedDays;
  };

  // Función para obtener el título del horario
  const getScheduleTitle = (fieldIndex: number, fieldsLength: number) => {
    // Si solo hay un horario, no mostrar número
    if (fieldsLength === 1) {
      return "Horario";
    }
    // Mostrar número consecutivo basado en la posición actual
    return `Horario ${fieldIndex + 1}`;
  };

  // Función para manejar la selección de ubicación en el mapa
  const handleMapLocationSelect = (
    lat: number,
    lng: number,
    address?: string
  ) => {
    setCoordinates({ lat, lng });
    form.setFieldsValue({
      latitude: lat,
      longitude: lng,
      ...(address && { address }),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="space-y-6"
      initialValues={{
        gallery: [], // Inicializar galería como array vacío
        bookable_services: [
          {
            title: "",
            description: "",
            price: "",
            bookable_options: "onetime",
          },
        ],
        schedule_groups: [
          {
            open_time: dayjs("09:00 am", "h:mm a"),
            close_time: dayjs("10:00 pm", "h:mm a"),
            days: ["monday", "tuesday", "wednesday", "thursday"],
          },
          {
            open_time: dayjs("12:00 pm", "h:mm a"),
            close_time: dayjs("08:00 pm", "h:mm a"),
            days: ["friday", "saturday", "sunday"],
          },
        ],
      }}
    >
      {/* Basic Information */}
      <Card title="Información Básica" className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Título del Listing"
              name="title"
              rules={[{ required: true, message: "El título es requerido" }]}
            >
              <Input placeholder="Ej: Terraza Verde con Vista Panorámica" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Categoría"
              name="category"
              rules={[{ required: true, message: "La categoría es requerida" }]}
            >
              <Select
                mode="multiple"
                placeholder="Selecciona categorías"
                options={categories.map((cat) => ({
                  label: cat.name.replace(/&amp;/g, "&"),
                  value: cat.id,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Location */}
      <Card title="Ubicación" className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Dirección"
              name="address"
              rules={[{ required: true, message: "La dirección es requerida" }]}
            >
              <Input placeholder="Ej: Calle 50, Obarrio, Ciudad de Panamá" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Dirección Amigable (Opcional)"
              name="friendly_address"
            >
              <Input placeholder="Ej: Centro Comercial Obarrio" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Región" name="region">
              <Select
                placeholder="Selecciona región"
                options={regions.map((region) => ({
                  label: region.name,
                  value: region.id,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Latitud"
              name="latitude"
              rules={[{ required: true, message: "La latitud es requerida" }]}
            >
              <InputNumber
                className="!w-full"
                placeholder="8.9824"
                step={0.000001}
                precision={6}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Longitud"
              name="longitude"
              rules={[{ required: true, message: "La longitud es requerida" }]}
            >
              <InputNumber
                className="!w-full"
                placeholder="-79.5199"
                step={0.000001}
                precision={6}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Mapa para seleccionar ubicación */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Seleccionar ubicación en el mapa
          </label>
          <MapSelector
            onLocationSelect={handleMapLocationSelect}
            initialCoordinates={coordinates}
          />
        </div>
      </Card>

      {/* Gallery */}
      <Card title="Galería" className="mb-4">
        <Form.Item
          label="Imágenes (Máximo 4)"
          name="gallery"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            console.log("🖼️ Upload event:", e);
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList || [];
          }}
        >
          <Upload
            listType="picture-card"
            maxCount={4}
            multiple
            beforeUpload={() => false} // Prevenir upload automático
            showUploadList={{
              showPreviewIcon: true,
              showRemoveIcon: true,
            }}
            accept="image/*"
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Subir</div>
            </div>
          </Upload>
        </Form.Item>
      </Card>

      {/* Details */}
      <Card title="Detalles" className="mb-4">
        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: "La descripción es requerida" }]}
        >
          <TextArea
            placeholder="Describe tu plazze, sus características, amenidades, etc."
            rows={4}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Precio Mínimo (Opcional)" name="price_min">
              <InputNumber
                className="!w-full"
                prefix="$"
                placeholder="100"
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Precio Máximo (Opcional)" name="price_max">
              <InputNumber
                className="!w-full"
                prefix="$"
                placeholder="500"
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Bookable Services */}
      <Card title="Servicios Reservables" className="mb-4">
        <Form.List name="bookable_services">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  className="!mb-4"
                  extra={
                    fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    )
                  }
                >
                  <Row gutter={16}>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        label="Título del Servicio"
                        rules={[
                          { required: true, message: "Título requerido" },
                        ]}
                      >
                        <Input placeholder="Ej: Servicio de Catering" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        label="Descripción"
                        rules={[
                          { required: true, message: "Descripción requerida" },
                        ]}
                      >
                        <Input placeholder="Describe el servicio..." />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        label="Precio"
                        rules={[
                          { required: true, message: "Precio requerido" },
                        ]}
                      >
                        <InputNumber className="!w-full" prefix="$" min={0} />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "bookable_options"]}
                        label="Opciones de Reserva"
                        rules={[
                          { required: true, message: "Opción requerida" },
                        ]}
                      >
                        <Select placeholder="Selecciona una opción">
                          <Option value="onetime">Una sola vez</Option>
                          <Option value="byguest">Por huésped</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              ))}

              <Form.Item className="text-end !mt-4">
                <Button
                  type="dashed"
                  size="large"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Agregar Servicio
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      {/* Opening Hours */}
      <Card title="Horarios de Apertura" className="mb-4">
        <Form.List name="schedule_groups">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, fieldIndex) => {
                const selectedDays = getSelectedDays(fieldIndex);
                const scheduleTitle = getScheduleTitle(
                  fieldIndex,
                  fields.length
                );

                return (
                  <Card
                    key={key}
                    size="small"
                    className="!mb-4"
                    title={scheduleTitle}
                    extra={
                      fields.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(name)}
                          size="small"
                        />
                      )
                    }
                  >
                    <Row gutter={16}>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          label="Hora de Apertura"
                          name={[name, "open_time"]}
                          rules={[
                            {
                              required: true,
                              message: "Hora de apertura requerida",
                            },
                          ]}
                        >
                          <TimePicker
                            placeholder="09:00 am"
                            className="!w-full"
                            format="h:mm a"
                            showNow={false}
                            needConfirm={false}
                            minuteStep={15}
                            use12Hours
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          label="Hora de Cierre"
                          name={[name, "close_time"]}
                          rules={[
                            {
                              required: true,
                              message: "Hora de cierre requerida",
                            },
                          ]}
                        >
                          <TimePicker
                            placeholder="11:00 pm"
                            className="!w-full"
                            format="h:mm a"
                            showNow={false}
                            needConfirm={false}
                            minuteStep={15}
                            use12Hours
                          />
                        </Form.Item>
                      </Col>
                      <Col span={16}>
                        <Form.Item
                          {...restField}
                          label="Días de la Semana"
                          name={[name, "days"]}
                          rules={[
                            {
                              required: true,
                              message: "Selecciona al menos un día",
                            },
                          ]}
                        >
                          <Select
                            mode="multiple"
                            placeholder="Selecciona días"
                            className="!w-full"
                            key={`schedule-${fieldIndex}-${JSON.stringify(
                              selectedDays
                            )}`}
                            options={[
                              {
                                label: "Lunes",
                                value: "monday",
                                disabled: selectedDays.includes("monday"),
                              },
                              {
                                label: "Martes",
                                value: "tuesday",
                                disabled: selectedDays.includes("tuesday"),
                              },
                              {
                                label: "Miércoles",
                                value: "wednesday",
                                disabled: selectedDays.includes("wednesday"),
                              },
                              {
                                label: "Jueves",
                                value: "thursday",
                                disabled: selectedDays.includes("thursday"),
                              },
                              {
                                label: "Viernes",
                                value: "friday",
                                disabled: selectedDays.includes("friday"),
                              },
                              {
                                label: "Sábado",
                                value: "saturday",
                                disabled: selectedDays.includes("saturday"),
                              },
                              {
                                label: "Domingo",
                                value: "sunday",
                                disabled: selectedDays.includes("sunday"),
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              })}

              <Form.Item className="text-end !mt-4">
                <Button
                  type="dashed"
                  size="large"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Agregar Horario
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      {/* Submit Button */}
      <Form.Item>
        <Space className="w-full flex justify-between">
          <Button size="large" disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
          >
            {loading
              ? "Creando..."
              : initialValues
              ? "Actualizar Plazze"
              : "Crear Plazze"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
