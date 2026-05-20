"use client";

import { useState } from "react";
import { Alert, Avatar, Button, Spin, Table, Tag } from "antd";
import { LuExternalLink, LuUser } from "react-icons/lu";
import { useWithdrawals } from "@/services/wallet";
import { formatCurrency } from "@/utils/format";
import type { WithdrawRequest, WithdrawStatus } from "@/types/wallet";

const statusColors: Record<WithdrawStatus, string> = {
  pending: "warning",
  approved: "blue",
  cancelled: "error",
};

const statusLabels: Record<WithdrawStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  cancelled: "Cancelado",
};

function formatDate(dateStr: string): string {
  try {
    if (!dateStr) return "—";
    // MySQL datetime usa espacio como separador (ej: "2025-05-18 10:30:00").
    // Reemplazar con "T" para convertirlo a ISO 8601 válido en todos los navegadores.
    const date = new Date(dateStr.replace(" ", "T"));
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("es-PA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr || "—";
  }
}

const DOKAN_WITHDRAW_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/wp-json", "") +
  "/wp-admin/admin.php?page=dokan-dashboard#/withdraw";

const AdminPayoutRequestsTable = () => {
  const [statusFilter, setStatusFilter] = useState<WithdrawStatus | undefined>(
    undefined,
  );
  const { requests, loading, error } = useWithdrawals({
    status: statusFilter,
    per_page: 50,
  });

  const filterButtons: { label: string; value: WithdrawStatus | undefined }[] =
    [
      { label: "Todas", value: undefined },
      { label: "Pendientes", value: "pending" },
      { label: "Aprobadas", value: "approved" },
      { label: "Canceladas", value: "cancelled" },
    ];

  const columns = [
    {
      title: "Vendedor",
      key: "seller",
      render: (_: unknown, record: WithdrawRequest) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<LuUser size={16} />} size="small" />
          <div>
            <p className="font-medium text-sm leading-tight">
              {record.seller_name}
            </p>
            <p className="text-xs text-gray-500">{record.seller_email}</p>
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => (
        <span className="font-semibold text-gray-900">{formatCurrency(v)}</span>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: WithdrawStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Notas",
      dataIndex: "note",
      key: "note",
      render: (note: string) => (
        <span className="text-gray-500 text-sm">{note || "—"}</span>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      render: (v: string) => (
        <span className="text-xs text-gray-500">{formatDate(v)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <>
      <Alert
        type="info"
        showIcon
        message="Panel de supervisión"
        description={
          <span>
            Las solicitudes de retiro se gestionan desde el panel de Dokan en
            WordPress.{" "}
            <a
              href={DOKAN_WITHDRAW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline"
            >
              Abrir panel de Dokan <LuExternalLink size={13} />
            </a>
          </span>
        }
      />

      {/* Filtros de estado */}
      <div className="flex flex-wrap gap-2 mt-6 mb-4">
        {filterButtons.map((btn) => (
          <Button
            key={String(btn.value)}
            size="small"
            type={statusFilter === btn.value ? "primary" : "default"}
            onClick={() => setStatusFilter(btn.value)}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      <Table<WithdrawRequest>
        dataSource={requests}
        columns={columns}
        rowKey="id"
        locale={{ emptyText: "No hay solicitudes de retiro" }}
      />
    </>
  );
};

export default AdminPayoutRequestsTable;
