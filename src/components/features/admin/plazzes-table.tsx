"use client";

import { Avatar, Button, Card, Table, Tag } from "antd";
import Link from "next/link";
import { LuPen, LuTrash2 } from "react-icons/lu";
import { capitalizeWords, formatCurrency } from "@/utils/format";
import { ROUTES } from "@/consts/routes";
import { mockPlazzes } from "@/mock/plazzes";

const statusColors = {
  active: "success",
  maintenance: "warning",
  inactive: "error",
} as const;

const statusLabels = {
  active: "Activo",
  maintenance: "En Mantenimiento",
  inactive: "Inactivo",
} as const;

export function PlazzesTable() {
  const columns = [
    {
      title: "Plazze",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: (typeof mockPlazzes)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.image} />
          <Link
            href={ROUTES.PUBLIC.PLAZZES.DETAIL(record.id)}
            className="text-primary hover:text-primary/80"
          >
            {text}
          </Link>
        </div>
      ),
      width: 300,
    },
    {
      title: "Categoría",
      dataIndex: "category",
      key: "category",
      render: (category: string) => capitalizeWords(category),
    },
    {
      title: "Precio/hora",
      dataIndex: "price",
      key: "price",
      render: (price: number) => formatCurrency(price),
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
      render: (_: unknown, record: (typeof mockPlazzes)[0]) => (
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<LuPen size={18} className="text-primary" />}
            href={`/dashboard/plazzes/${record.id}/edit`}
          />
          <Button
            type="text"
            icon={<LuTrash2 size={18} className="text-red-500" />}
            onClick={() => {
              // TODO: Implementar eliminación
              console.log("Eliminar", record.id);
            }}
          />
        </div>
      ),
      width: 100,
    },
  ];

  return (
    <Card>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <Table
          columns={columns}
          dataSource={mockPlazzes}
          rowKey="id"
          scroll={{ x: 820 }}
          className="min-w-[820px]"
        />
      </div>
    </Card>
  );
}
