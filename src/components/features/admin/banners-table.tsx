"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Image,
  Popconfirm,
  Segmented,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { LuCheck, LuMegaphone, LuPen, LuTrash2, LuX } from "react-icons/lu";
import { useBannersService } from "@/services/banners";
import { useAuthStore } from "@/stores/auth";
import BannerModal from "./banner-modal";
import type { Banner } from "@/types/plazze";

type FilterKey = "all" | "active" | "pending" | "deleted";

const positionLabels: Record<string, string> = {
  features: "Features",
  trending: "Trending",
};

export const BannersTable = () => {
  const {
    banners,
    loading,
    error,
    refreshBanners,
    deleteBanner,
    approveBanner,
    rejectBanner,
    restoreBanner,
  } = useBannersService();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "administrator";
  const [filter, setFilter] = useState<FilterKey>("all");

  const filteredBanners = banners.filter((b: Banner) => {
    if (filter === "active") return b.is_active && !b.is_deleted;
    if (filter === "pending")
      return !b.is_active && !!b.seller_id && !b.is_rejected && !b.is_deleted;
    if (filter === "deleted") return !!b.is_deleted;
    return true;
  });

  const columns = [
    {
      title: "Imagen",
      dataIndex: "image_url",
      key: "image_url",
      width: 140,
      render: (url: string, record: Banner) =>
        url ? (
          <Image
            src={url}
            alt={record.title}
            width={120}
            height={40}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
        ) : (
          <span className="text-gray-400 text-xs">Sin imagen</span>
        ),
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Posición",
      dataIndex: "position",
      key: "position",
      width: 110,
      render: (position: string) => (
        <Tag color="blue">{positionLabels[position] ?? position}</Tag>
      ),
    },
    {
      title: "URL de destino",
      dataIndex: "link_url",
      key: "link_url",
      render: (url: string) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary truncate block max-w-[200px]"
          >
            {url}
          </a>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        ),
    },
    {
      title: "Vigencia",
      key: "dates",
      render: (_: unknown, record: Banner) => (
        <span className="text-sm text-gray-600">
          {record.start_date} → {record.end_date}
        </span>
      ),
    },
    ...(isAdmin
      ? [
          {
            title: "Solicitado por",
            dataIndex: "seller_name",
            key: "seller_name",
            width: 130,
            render: (name: string | undefined) =>
              name ? (
                <span className="text-sm text-gray-700">{name}</span>
              ) : (
                <span className="text-gray-400 text-xs">—</span>
              ),
          },
        ]
      : []),
    {
      title: "Estado",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (active: boolean, record: Banner) => {
        if (record.is_deleted)
          return (
            <Tooltip
              title={
                record.deleted_at
                  ? `Eliminado el ${record.deleted_at}${record.deleted_by ? ` por ${record.deleted_by}` : ""}`
                  : undefined
              }
            >
              <Tag color="default">Eliminado</Tag>
            </Tooltip>
          );
        if (record.is_rejected) return <Tag color="error">Rechazado</Tag>;
        if (!active && record.seller_id)
          return <Tag color="warning">Pendiente</Tag>;
        return (
          <Tag color={active ? "success" : "default"}>
            {active ? "Activo" : "Inactivo"}
          </Tag>
        );
      },
    },
    {
      title: "Acciones",
      key: "actions",
      width: 130,
      render: (_: unknown, record: Banner) => {
        // Restaurar si está eliminado
        if (record.is_deleted) {
          return isAdmin ? (
            <Button
              type="primary"
              size="middle"
              icon={<LuCheck size={18} />}
              onClick={async () => {
                await restoreBanner(record.id);
                refreshBanners();
              }}
            >
              Restaurar
            </Button>
          ) : null;
        }
        return (
          <div className="flex items-center gap-1">
            {isAdmin &&
              !record.is_active &&
              record.seller_id &&
              !record.is_rejected && (
                <>
                  <Tooltip title="Aprobar y publicar">
                    <Popconfirm
                      title="Aprobar banner"
                      description="¿Publicar este banner en la landing?"
                      onConfirm={() => approveBanner(record.id)}
                      okText="Aprobar"
                      cancelText="Cancelar"
                      placement="topRight"
                    >
                      <Button
                        type="text"
                        className="hover:!text-green-600"
                        icon={<LuCheck size={18} />}
                      />
                    </Popconfirm>
                  </Tooltip>
                  <Tooltip title="Rechazar solicitud">
                    <Popconfirm
                      title="Rechazar banner"
                      description="Se notificará al vendedor por email."
                      onConfirm={() => rejectBanner(record.id)}
                      okText="Rechazar"
                      cancelText="Cancelar"
                      okType="danger"
                      placement="topRight"
                    >
                      <Button
                        type="text"
                        className="hover:!text-red-500"
                        icon={<LuX size={18} />}
                      />
                    </Popconfirm>
                  </Tooltip>
                </>
              )}
            {(isAdmin || record.seller_id === user?.id) && (
              <BannerModal
                banner={record}
                isSeller={!isAdmin}
                trigger={
                  <Button
                    type="text"
                    className="hover:!text-primary"
                    icon={<LuPen size={18} />}
                  />
                }
              />
            )}
            {isAdmin && (
              <Popconfirm
                title="Eliminar banner"
                description={`¿Estás seguro de que quieres eliminar "${record.title}"?`}
                onConfirm={() => deleteBanner(record.id)}
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
            )}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center min-h-[200px]">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert
          message="No se pudieron cargar los banners"
          description="Hubo un problema al conectar con el servidor. Es posible que los cambios del plugin no estén desplegados aún."
          type="error"
          showIcon
          action={
            <Button size="small" onClick={refreshBanners}>
              Reintentar
            </Button>
          }
        />
      </Card>
    );
  }

  if (!isAdmin && banners.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <LuMegaphone size={40} className="mb-3 opacity-30" />
          <p className="text-sm">Aún no tienes banners</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {isAdmin && (
        <div className="mb-4">
          <Segmented<FilterKey>
            options={[
              { label: "Todos", value: "all" },
              {
                label: `Activos (${banners.filter((b: Banner) => b.is_active && !b.is_deleted).length})`,
                value: "active",
              },
              {
                label: `Pendientes (${banners.filter((b: Banner) => !b.is_active && !!b.seller_id && !b.is_rejected && !b.is_deleted).length})`,
                value: "pending",
              },
              {
                label: `Eliminados (${banners.filter((b: Banner) => !!b.is_deleted).length})`,
                value: "deleted",
              },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
      )}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <Table
          columns={columns}
          dataSource={filteredBanners}
          rowKey="id"
          scroll={{ x: 860 }}
          pagination={false}
        />
      </div>
    </Card>
  );
};
