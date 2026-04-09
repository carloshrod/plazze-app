/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Switch,
  Upload,
  Image,
} from "antd";
import type { UploadFile } from "antd";
import { LuUpload } from "react-icons/lu";
import dayjs from "dayjs";
import { uploadFile } from "@/libs/api/upload";
import { usePackagePricing } from "@/services/package-pricing";
import type { Banner, BannerFormData } from "@/types/plazze";

interface BannerFormProps {
  initialValues?: Banner;
  onSuccess: (_data: BannerFormData) => Promise<void>;
  onCancel?: () => void;
  isSeller?: boolean;
}

interface FormValues {
  title: string;
  link_url: string;
  date_range: [dayjs.Dayjs, dayjs.Dayjs];
  is_active: boolean;
  position: "features" | "trending";
  package: "7" | "15" | "30";
}

const POSITION_LABELS: Record<string, string> = {
  features: "Debajo de Features (mayor visibilidad)",
  trending: "Debajo de Plazzes Tendencia",
};

const DURATIONS: Array<"7" | "15" | "30"> = ["7", "15", "30"];

const BannerForm = ({
  initialValues,
  onSuccess,
  onCancel,
  isSeller = false,
}: BannerFormProps) => {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<"7" | "15" | "30">(
    "7",
  );
  const [selectedPosition, setSelectedPosition] = useState<
    "features" | "trending"
  >(initialValues?.position ?? "features");
  const { pricing, fetchPricing } = usePackagePricing();

  // Cargar precios actualizados al montar el formulario
  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  const [imageId, setImageId] = useState<number>(initialValues?.image_id ?? 0);
  const [imageUrl, setImageUrl] = useState<string>(
    initialValues?.image_url ?? "",
  );
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [imageIdMobile, setImageIdMobile] = useState<number>(
    initialValues?.image_id_mobile ?? 0,
  );
  const [imageUrlMobile, setImageUrlMobile] = useState<string>(
    initialValues?.image_url_mobile ?? "",
  );
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [fileListMobile, setFileListMobile] = useState<UploadFile[]>([]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadFile(file);
      setImageId(result.id);
      setImageUrl(result.source_url);
    } catch (err: any) {
      console.error("Error al subir imagen:", err);
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleUploadMobile = async (file: File) => {
    setUploadingMobile(true);
    try {
      const result = await uploadFile(file);
      setImageIdMobile(result.id);
      setImageUrlMobile(result.source_url);
    } catch (err: any) {
      console.error("Error al subir imagen móvil:", err);
    } finally {
      setUploadingMobile(false);
    }
    return false;
  };

  const handleFinish = async (values: FormValues) => {
    if (!imageId) {
      form.setFields([
        { name: "title", errors: ["Por favor sube una imagen para el banner"] },
      ]);
      return;
    }

    setSubmitting(true);
    try {
      // Para sellers: no hay date_range en el form (se calcula al aprobar desde el paquete)
      // Para admin: date_range es obligatorio
      const startDate = isSeller
        ? dayjs().format("YYYY-MM-DD")
        : values.date_range[0].format("YYYY-MM-DD");
      const endDate = isSeller
        ? dayjs()
            .add(Number(values.package ?? "7"), "day")
            .format("YYYY-MM-DD")
        : values.date_range[1].format("YYYY-MM-DD");

      const formData: BannerFormData = {
        title: values.title,
        image_id: imageId,
        image_url: imageUrl,
        image_id_mobile: imageIdMobile || undefined,
        image_url_mobile: imageUrlMobile || undefined,
        link_url: values.link_url || "",
        start_date: startDate,
        end_date: endDate,
        is_active: isSeller ? false : (values.is_active ?? true),
        position: values.position ?? "features",
        package: values.package,
      };
      await onSuccess(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const initialDateRange =
    initialValues?.start_date && initialValues?.end_date
      ? ([dayjs(initialValues.start_date), dayjs(initialValues.end_date)] as [
          dayjs.Dayjs,
          dayjs.Dayjs,
        ])
      : undefined;

  // Manejar cambio de paquete y autocompletar fechas
  const handlePackageChange = (value: "7" | "15" | "30") => {
    setSelectedPackage(value);
    const start = dayjs();
    const end = start.add(Number(value), "day");
    form.setFieldsValue({ date_range: [start, end], package: value });
  };

  const handlePositionChange = (value: "features" | "trending") => {
    setSelectedPosition(value);
  };

  // Obtener precio del paquete según posición seleccionada
  const getPackagePrice = (duration: "7" | "15" | "30"): number => {
    return pricing?.banner?.[selectedPosition]?.[duration] ?? 0;
  };

  const selectedPrice = getPackagePrice(selectedPackage);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        title: initialValues?.title ?? "",
        link_url: initialValues?.link_url ?? "",
        date_range: initialDateRange,
        is_active: initialValues?.is_active ?? true,
        position: initialValues?.position ?? "features",
        package: "7",
      }}
    >
      {/* Posición — solo para seller, posicionado primero para que vea precios correctos */}
      {isSeller && (
        <Form.Item
          name="position"
          label="Posición en la landing"
          rules={[{ required: true, message: "Selecciona una posición" }]}
        >
          <Select
            options={Object.entries(POSITION_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
            onChange={handlePositionChange}
          />
        </Form.Item>
      )}

      {/* Paquete de duración con precios dinámicos — solo en creación, no en edición */}
      {isSeller && !initialValues && (
        <Form.Item
          name="package"
          label="Paquete de duración"
          rules={[{ required: true, message: "Selecciona un paquete" }]}
        >
          <Select
            options={DURATIONS.map((d) => ({
              value: d,
              label: `${d} días${pricing ? ` — $${getPackagePrice(d).toLocaleString()}` : ""}`,
            }))}
            onChange={handlePackageChange}
          />
        </Form.Item>
      )}

      {/* Preview de precio para seller — solo en creación */}
      {isSeller && !initialValues && selectedPrice > 0 && (
        <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Paquete seleccionado: <strong>{selectedPackage} días</strong> en{" "}
            <strong>
              {POSITION_LABELS[selectedPosition] ?? selectedPosition}
            </strong>
          </span>
          <span className="text-lg font-bold text-primary">
            ${selectedPrice.toLocaleString()}
          </span>
        </div>
      )}
      <Form.Item
        name="title"
        label="Título del banner"
        rules={[{ required: true, message: "El título es obligatorio" }]}
      >
        <Input placeholder="Ej: Oferta especial de verano" maxLength={200} />
      </Form.Item>

      {/* Imagen desktop */}
      <Form.Item label="Imagen desktop" required>
        <div className="flex flex-col gap-3">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Preview del banner"
              className="rounded-md object-cover"
              style={{ maxHeight: 160, width: "auto" }}
              preview={false}
            />
          )}
          <Upload
            accept="image/*"
            showUploadList={false}
            fileList={fileList}
            beforeUpload={(file) => {
              setFileList([file as unknown as UploadFile]);
              handleUpload(file);
              return false;
            }}
          >
            <Button icon={<LuUpload size={16} />} loading={uploading}>
              {imageUrl ? "Cambiar imagen" : "Subir imagen"}
            </Button>
          </Upload>
          {!imageUrl && (
            <span className="text-xs text-gray-500">
              Recomendado: 1200×400px, JPG o PNG
            </span>
          )}
        </div>
      </Form.Item>

      {/* Imagen móvil (opcional) */}
      <Form.Item
        label={
          <span>
            Imagen móvil{" "}
            <span className="text-gray-400 font-normal text-xs">
              (opcional — si no se sube, se usa la imagen desktop)
            </span>
          </span>
        }
      >
        <div className="flex flex-col gap-3">
          {imageUrlMobile && (
            <Image
              src={imageUrlMobile}
              alt="Preview móvil"
              className="rounded-md object-cover"
              style={{ maxHeight: 120, width: "auto" }}
              preview={false}
            />
          )}
          <div className="flex items-center gap-2">
            <Upload
              accept="image/*"
              showUploadList={false}
              fileList={fileListMobile}
              beforeUpload={(file) => {
                setFileListMobile([file as unknown as UploadFile]);
                handleUploadMobile(file);
                return false;
              }}
            >
              <Button icon={<LuUpload size={16} />} loading={uploadingMobile}>
                {imageUrlMobile ? "Cambiar imagen móvil" : "Subir imagen móvil"}
              </Button>
            </Upload>
            {imageUrlMobile && (
              <Button
                type="text"
                size="small"
                danger
                onClick={() => {
                  setImageIdMobile(0);
                  setImageUrlMobile("");
                  setFileListMobile([]);
                }}
              >
                Quitar
              </Button>
            )}
          </div>
          {!imageUrlMobile && (
            <span className="text-xs text-gray-500">
              Recomendado: 600×400px, formato vertical u horizontal compacto
            </span>
          )}
        </div>
      </Form.Item>

      <Form.Item name="link_url" label="URL de destino (opcional)">
        <Input placeholder="https://..." />
      </Form.Item>

      {/* Posición: solo para admin (seller ya lo ve arriba) */}
      {!isSeller && (
        <Form.Item
          name="position"
          label="Posición en la landing"
          rules={[{ required: true, message: "Selecciona una posición" }]}
        >
          <Select
            options={Object.entries(POSITION_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </Form.Item>
      )}

      {/* Fechas: solo para admin. Para seller se calculan al aprobar desde el paquete */}
      {!isSeller && (
        <Form.Item
          name="date_range"
          label="Período de vigencia"
          rules={[{ required: true, message: "Las fechas son obligatorias" }]}
        >
          <DatePicker.RangePicker
            format="DD/MM/YYYY"
            placeholder={["Fecha de inicio", "Fecha de fin"]}
            className="w-full"
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Form.Item>
      )}

      {!isSeller && (
        <Form.Item name="is_active" label="Activo" valuePropName="checked">
          <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
        </Form.Item>
      )}

      {isSeller && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4">
          Tu banner quedará en revisión hasta que el administrador lo apruebe.
        </p>
      )}

      <div className="flex justify-end gap-3 mt-2">
        {onCancel && (
          <Button onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          disabled={uploading || uploadingMobile}
        >
          {initialValues
            ? "Guardar cambios"
            : isSeller
              ? "Enviar solicitud"
              : "Crear banner"}
        </Button>
      </div>
    </Form>
  );
};

export default BannerForm;
