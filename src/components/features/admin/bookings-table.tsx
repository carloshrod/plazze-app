"use client";

import { Avatar, Card, Table, Tag } from "antd";
import { LuBuilding } from "react-icons/lu";
import { formatCurrency } from "@/utils/format";
import { mockBookings } from "@/mock/bookings";

const statusColors = {
  confirmed: "blue",
  pending: "warning",
  cancelled: "error",
  completed: "success",
} as const;

const statusLabels = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  cancelled: "Cancelada",
  completed: "Completada",
} as const;

export function BookingsTable() {
  const columns = [
    {
      title: "Plazze",
      dataIndex: ["plazze", "name"],
      key: "plazze",
      render: (name: string, record: (typeof mockBookings)[0]) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.plazze.image} icon={<LuBuilding />} />
          <span>{name}</span>
        </div>
      ),
      width: 300,
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Horario",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Precio",
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
  ];

  return (
    <Card className="p-6">
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <Table
          columns={columns}
          dataSource={mockBookings}
          rowKey="id"
          scroll={{ x: 940 }}
          className="min-w-[940px]"
        />
      </div>
    </Card>
  );
}
