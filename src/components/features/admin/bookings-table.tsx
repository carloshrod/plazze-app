"use client";

import { Avatar, Card, Table, Tag, Alert, Spin } from "antd";
import { LuBuilding } from "react-icons/lu";
import { decodeHtmlEntities, formatCurrency } from "@/utils/format";
import { useBookings } from "@/hooks/useBookings";
import { formatBookingDate, formatBookingTimeRange } from "@/helpers/booking";
import type { Booking } from "@/libs/api/booking";

const statusColors = {
  waiting: "warning",
  confirmed: "blue",
  cancelled: "error",
  completed: "success",
  paid: "green",
} as const;

const statusLabels = {
  waiting: "En espera",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
  paid: "Pagada",
} as const;

export function BookingsTable() {
  const { bookings, loading, error } = useBookings({
    per_page: 20,
  });

  const columns = [
    {
      title: "Plazze",
      dataIndex: "listing_title",
      key: "listing_title",
      render: (_: string, record: Booking) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.listing_image} icon={<LuBuilding />} />
          <span>{decodeHtmlEntities(record.listing_title)}</span>
        </div>
      ),
      width: 300,
    },
    {
      title: "Fecha",
      dataIndex: "date_start",
      key: "date",
      render: (dateStart: string) => formatBookingDate(dateStart),
    },
    {
      title: "Horario",
      key: "time",
      render: (_: unknown, record: Booking) =>
        formatBookingTimeRange(record.date_start, record.date_end),
    },
    {
      title: "Servicios",
      dataIndex: "services",
      key: "services",
      render: (services: Booking["services"]) => (
        <div className="flex flex-col gap-1">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{service.name}</span>
                <span className="text-gray-500 ml-1">
                  ({formatCurrency(service.price)}
                  {service.option === "byguest" &&
                    `x ${service.guests} persona${
                      Number(service.guests) === 1 ? "" : "s"
                    }`}
                  )
                </span>
              </div>
            ))
          ) : (
            <span className="text-gray-400 text-sm">Sin servicios</span>
          )}
        </div>
      ),
      width: 250,
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

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center min-h-[300px]">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <Alert
          message="Error al cargar reservas"
          description={error}
          type="error"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          scroll={{ x: 1200 }}
          className="min-w-[1200px]"
        />
      </div>
    </Card>
  );
}
