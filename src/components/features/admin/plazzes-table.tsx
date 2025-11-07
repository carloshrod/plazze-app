"use client";

import {
  Avatar,
  Button,
  Card,
  Table,
  Tag,
  Spin,
  Alert,
  Popconfirm,
} from "antd";
import Link from "next/link";
import { LuPen, LuTrash2 } from "react-icons/lu";
import { useMyPlazzes } from "@/hooks/useMyPlazzes";
import { useAppData } from "@/hooks/useAppData";
import { usePlazzeModalStore } from "@/stores/plazze-modal";
import { usePlazzeService } from "@/services/plazze";
import { convertWPToFormData } from "@/helpers/plazze";
import { decodeHtmlEntities } from "@/utils";
import { ROUTES } from "@/consts/routes";
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
  const { plazzes, loading, error } = useMyPlazzes();
  const { getCategoryName } = useAppData();
  const { openEditModal } = usePlazzeModalStore();
  const { deletePlazze } = usePlazzeService();

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
            <Link
              href={ROUTES.PUBLIC.PLAZZES.DETAIL(String(record.id)) || "#"}
              className="text-primary hover:text-primary/80"
              target="_blank"
            >
              {decodeHtmlEntities(title.rendered)}
            </Link>
          </div>
        );
      },
      width: 300,
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
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusColors) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Acciones",
      fixed: "right" as const,
      key: "actions",
      render: (_: unknown, record: PlazzeWP) => {
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
            <Popconfirm
              title="Eliminar plazze"
              description={`¿Estás seguro de que quieres eliminar "${decodeHtmlEntities(
                record.title.rendered
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
      width: 100,
    },
  ];

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center py-8">
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

  return (
    <Card>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <Table
          columns={columns}
          dataSource={plazzes}
          rowKey="id"
          scroll={{ x: 820 }}
          className="min-w-[820px]"
          pagination={false}
        />
      </div>
    </Card>
  );
}
