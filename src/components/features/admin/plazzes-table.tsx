"use client";

import { useEffect, useState } from "react";
import { Select } from "antd";
import { useRouter } from "next/navigation";
import { usePackagePricing } from "@/services/package-pricing";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Modal,
  Popconfirm,
  Spin,
  Switch,
  Table,
  Tag,
  Tooltip,
} from "antd";
import Link from "next/link";
import { LuPen, LuSparkles, LuStar, LuTrash2 } from "react-icons/lu";
import dayjs from "dayjs";
import "dayjs/locale/es";
import showMessage from "@/libs/message";
import { useMyPlazzesService } from "@/services/my-plazzes";
import {
  useMyFeatureRequestsService,
  useFeatureRequestsService,
} from "@/services/promotions";
import { useAppData } from "@/hooks/useAppData";
import { usePlazzeModalStore } from "@/stores/plazze-modal";
import { usePlazzeService } from "@/services/plazze";
import { useAuthStore } from "@/stores/auth";
import { convertWPToFormData } from "@/helpers/plazze";
import { decodeHtmlEntities } from "@/utils";
import { ROUTES } from "@/consts/routes";
import { plazzeLib } from "@/libs/api/plazze";
import { type PlazzeWP } from "@/types/plazze";

const statusColors = {
  publish: "success",
  pending: "warning",
  draft: "default",
  private: "error",
} as const;

const statusLabels = {
  publish: "Publicado",
  pending: "Pendiente",
  draft: "Borrador",
  private: "Privado",
} as const;

export function PlazzesTable() {
  const { plazzes, loading, error, updatePlazze } = useMyPlazzesService();
  const { getCategoryName } = useAppData();
  const { openEditModal } = usePlazzeModalStore();
  const { deletePlazze } = usePlazzeService();
  const { user } = useAuthStore();
  const { myFeatureRequests, loadMyFeatureRequests, createFeatureRequest } =
    useMyFeatureRequestsService();
  const { featureRequests, loadFeatureRequests, approveFeatureRequest } =
    useFeatureRequestsService();
  const [featReqModal, setFeatReqModal] = useState<{
    open: boolean;
    plazzeId: number;
    plazzeName: string;
    paquete?: "7" | "15" | "30";
  } | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<"7" | "15" | "30">(
    "7",
  );
  const router = useRouter();
  const [featureLoading, setFeatureLoading] = useState(false);
  const { pricing, fetchPricing } = usePackagePricing();

  const getFeaturedPrice = (duration: "7" | "15" | "30"): number =>
    pricing?.featured?.default?.[duration] ?? 0;

  // Refrescar precios al abrir el modal de solicitud de destaque
  useEffect(() => {
    if (featReqModal?.open) {
      fetchPricing();
    }
  }, [featReqModal?.open, fetchPricing]);

  useEffect(() => {
    if (user?.role === "seller") {
      loadMyFeatureRequests();
    }
    if (user?.role === "administrator") {
      loadFeatureRequests(); // sin filtro de status para tener también aprobadas
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const columns = [
    {
      title: "Plazze",
      dataIndex: "title",
      key: "title",
      render: (title: { rendered: string }, record: PlazzeWP) => {
        // Obtener imagen: featured_image o primera imagen de galería o placeholder
        const getImageSrc = () => {
          if (record.featured_image?.thumbnail) {
            return record.featured_image.thumbnail;
          }

          // Si no hay featured_image, intentar obtener de la galería
          if (record.gallery && record.gallery.length > 0) {
            const firstImage = record.gallery[0];
            if (typeof firstImage === "object" && firstImage.thumbnail) {
              return firstImage.thumbnail;
            }
            if (typeof firstImage === "string") {
              return firstImage;
            }
          }

          // Si no hay imágenes, usar placeholder
          return undefined;
        };

        return (
          <div className="flex items-center gap-3">
            <Avatar src={getImageSrc()} style={{ backgroundColor: "#f5f5f5" }}>
              {!getImageSrc() && title.rendered.charAt(0).toUpperCase()}
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <Link
                href={ROUTES.PUBLIC.PLAZZES.DETAIL(String(record.id)) || "#"}
                className="text-primary hover:text-primary/80"
                target="_blank"
              >
                {decodeHtmlEntities(title.rendered)}
              </Link>
              {record.is_featured && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 w-fit">
                  <LuStar size={11} className="fill-amber-400 text-amber-400" />
                  Recomendado
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Dirección",
      dataIndex: "address",
      key: "address",
      render: (address: string) => address || "Sin dirección",
    },
    {
      title: "Categoría",
      dataIndex: "listing_category",
      key: "listing_category",
      render: (categories: number[] | undefined) => {
        if (!categories || categories.length === 0) {
          return <Tag color="default">Sin categoría</Tag>;
        }
        // Mostrar todas las categorías como Tags
        return (
          <div className="flex flex-wrap gap-1">
            {categories.map((categoryId) => (
              <Tag key={categoryId} color="blue">
                {getCategoryName(categoryId)}
              </Tag>
            ))}
          </div>
        );
      },
      width: 200,
    },
    {
      title: <LuStar size={16} className="mx-auto text-amber-500" />,
      dataIndex: "is_featured",
      key: "is_featured",
      align: "center" as const,
      width: 90,
      render: (isFeatured: boolean | undefined, record: PlazzeWP) => {
        const pendingReq = featureRequests.find(
          (r) => r.plazze_id === record.id && r.status === "pending",
        );
        const approvedReq = featureRequests.find(
          (r) => r.plazze_id === record.id && r.status === "approved",
        );
        const expiryDate =
          isFeatured && approvedReq?.package
            ? dayjs(approvedReq.approved_at ?? approvedReq.created_at)
                .add(parseInt(approvedReq.package), "day")
                .locale("es")
                .format("D MMM YYYY")
            : null;
        return (
          <div className="flex flex-col items-center gap-1">
            <Popconfirm
              title={
                isFeatured ? "Quitar del destacado" : "Marcar como destacado"
              }
              description={
                pendingReq
                  ? `${pendingReq.seller_name} solicitó destacar este plazze.`
                  : isFeatured
                    ? "¿Quitarás este plazze de la sección destacados?"
                    : "¿Confirmas destacar este plazze en la plataforma?"
              }
              onConfirm={async () => {
                try {
                  const result = await plazzeLib.toggleFeatured(record.id);
                  updatePlazze(record.id, { is_featured: result.is_featured });
                  if (result.is_featured && pendingReq) {
                    // approveFeatureRequest ya muestra su propio mensaje de éxito
                    await approveFeatureRequest(pendingReq.id);
                  } else {
                    showMessage.success(
                      result.is_featured
                        ? "Marcado como destacado"
                        : "Quitado de destacados",
                    );
                  }
                } catch (err) {
                  console.error("Error al actualizar destacado:", err);
                  showMessage.error("Error al actualizar destacado");
                }
              }}
              okText="Confirmar"
              cancelText="Cancelar"
              placement="topRight"
            >
              <Tooltip title={expiryDate ? `Hasta ${expiryDate}` : undefined}>
                <Switch size="small" checked={!!isFeatured} />
              </Tooltip>
            </Popconfirm>
            {pendingReq && (
              <Tooltip title={`Solicitado por: ${pendingReq.seller_name}`}>
                <Tag
                  color="orange"
                  className="text-xs leading-none px-1 py-0 cursor-default"
                >
                  Pendiente
                </Tag>
              </Tooltip>
            )}{" "}
          </div>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
      width: 110,
    },
    {
      title: "Acciones",
      fixed: "right" as const,
      key: "actions",
      render: (_: unknown, record: PlazzeWP) => {
        const hasPending = myFeatureRequests.some(
          (r) => r.plazze_id === record.id && r.status === "pending",
        );
        const isFeaturedForSeller = !!record.is_featured;
        const approvedReq = myFeatureRequests.find(
          (r) => r.plazze_id === record.id && r.status === "approved",
        );
        const featuredUntil =
          approvedReq && approvedReq.package
            ? (() => {
                const baseDate =
                  approvedReq.approved_at ?? approvedReq.created_at;
                return dayjs(baseDate)
                  .add(parseInt(approvedReq.package), "day")
                  .locale("es")
                  .format("D [de] MMMM [de] YYYY");
              })()
            : null;
        return (
          <div className="flex items-center gap-2">
            <Button
              type="text"
              className="hover:!text-primary"
              icon={<LuPen size={18} />}
              onClick={() => {
                const formData = convertWPToFormData(record);
                openEditModal(record, formData);
              }}
            />
            {user?.role === "seller" && (
              <Tooltip
                title={
                  isFeaturedForSeller
                    ? featuredUntil
                      ? `Destacado hasta el ${featuredUntil}`
                      : "Tu plazze está destacado"
                    : hasPending
                      ? "Ya tienes una solicitud pendiente para este plazze"
                      : "Solicitar destaque"
                }
              >
                <Button
                  type="text"
                  className={
                    isFeaturedForSeller
                      ? "!text-amber-400"
                      : hasPending
                        ? "!text-amber-400"
                        : "hover:!text-amber-500"
                  }
                  icon={<LuSparkles size={18} />}
                  disabled={isFeaturedForSeller || hasPending}
                  onClick={() => {
                    setFeatReqModal({
                      open: true,
                      plazzeId: record.id,
                      plazzeName: decodeHtmlEntities(record.title.rendered),
                    });
                  }}
                />
              </Tooltip>
            )}
            <Popconfirm
              title="Eliminar plazze"
              description={`¿Estás seguro de que quieres eliminar "${decodeHtmlEntities(
                record.title.rendered,
              )}"?`}
              onConfirm={() => deletePlazze(record.id)}
              okText="Sí, eliminar"
              cancelText="Cancelar"
              okType="danger"
              placement="topRight"
            >
              <Button
                type="text"
                className="hover:!text-red-500"
                icon={<LuTrash2 size={18} />}
              />
            </Popconfirm>
          </div>
        );
      },
      width: 130,
    },
  ];

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert message="Error" description={error} type="error" showIcon />
      </Card>
    );
  }

  const columnsToShow =
    user?.role === "administrator"
      ? columns
      : columns.filter((col) => col.key !== "is_featured");

  return (
    <>
      <Card>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <Table
            columns={columnsToShow}
            dataSource={plazzes}
            rowKey="id"
            scroll={{ x: 820 }}
            className="min-w-[820px]"
            pagination={false}
          />
        </div>
      </Card>
      {featReqModal && (
        <Modal
          title="Solicitar destaque"
          open={featReqModal.open}
          onCancel={() => setFeatReqModal(null)}
          confirmLoading={featureLoading}
          onOk={async () => {
            setFeatureLoading(true);
            try {
              // Guardar el paquete seleccionado en el mensaje (puedes mejorar esto con un campo dedicado en el backend)
              const created = await createFeatureRequest(
                featReqModal.plazzeId,
                selectedPackage,
              );
              setFeatReqModal(null);
              // Redirigir a la página de pago simulado (intermedia)
              router.replace(
                `/pago-ejemplo?tipo=destacado&id=${created.id}&paquete=${selectedPackage}`,
              );
            } finally {
              setFeatureLoading(false);
            }
          }}
          okText="Ir a pagar"
          cancelText="Cancelar"
        >
          <div className="py-2 space-y-3">
            <p className="text-sm text-gray-700">
              Estás solicitando destacar{" "}
              <strong>{featReqModal.plazzeName}</strong> en la plataforma.
            </p>
            <div className="mb-3">
              <label className="block text-xs font-semibold mb-1">
                Selecciona un paquete
              </label>
              <Select
                value={selectedPackage}
                onChange={(v) => setSelectedPackage(v)}
                style={{ width: 220 }}
                options={[
                  {
                    value: "7",
                    label: `7 días${pricing ? ` — $${getFeaturedPrice("7").toLocaleString()}` : ""}`,
                  },
                  {
                    value: "15",
                    label: `15 días${pricing ? ` — $${getFeaturedPrice("15").toLocaleString()}` : ""}`,
                  },
                  {
                    value: "30",
                    label: `30 días${pricing ? ` — $${getFeaturedPrice("30").toLocaleString()}` : ""}`,
                  },
                ]}
              />
            </div>
            {pricing && getFeaturedPrice(selectedPackage) > 0 && (
              <div className="rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Total a pagar:</span>
                <span className="text-lg font-bold text-primary">
                  ${getFeaturedPrice(selectedPackage).toLocaleString()}
                </span>
              </div>
            )}
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-semibold text-amber-700 mb-2">
                Condiciones
              </p>
              <ul className="text-xs text-amber-800 space-y-1">
                <li>
                  • El administrador revisará tu solicitud en 1-3 días hábiles.
                </li>
                <li>• Solo puedes tener una solicitud pendiente por plazze.</li>
                <li>
                  • El destaque se activará tras el pago y tendrá la duración
                  seleccionada.
                </li>
                <li>• Serás notificado cuando tu solicitud sea revisada.</li>
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
