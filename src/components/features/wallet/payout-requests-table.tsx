"use client";

import { useEffect } from "react";
import { Alert, Spin, Table, Tag } from "antd";
import { usePayoutRequests } from "@/services/wallet";
import { formatCurrency } from "@/utils/format";
import type { PayoutRequest, PayoutStatus } from "@/types/wallet";

const statusColors: Record<PayoutStatus, string> = {
  pending: "warning",
  approved: "blue",
  paid: "green",
  rejected: "error",
};

const statusLabels: Record<PayoutStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  paid: "Pagado",
  rejected: "Rechazado",
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("es-PA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface PayoutRequestsTableProps {
  refreshKey?: number;
}

export function PayoutRequestsTable({ refreshKey }: PayoutRequestsTableProps) {
  const { requests, loading, error, refetch } = usePayoutRequests({
    per_page: 20,
  });

  // Refetch cuando el padre solicita actualización (ej: después de crear una solicitud)
  useEffect(() => {
    if (refreshKey !== undefined) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const columns = [
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      render: (v: string) => formatDate(v),
    },
    {
      title: "Monto",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => (
        <span className="font-medium">{formatCurrency(v)}</span>
      ),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: PayoutStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Notas",
      dataIndex: "admin_notes",
      key: "admin_notes",
      render: (notes: string | null) => (
        <span className="text-gray-500 text-sm">{notes || "—"}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (requests.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-4">
        Aún no has realizado solicitudes de pago.
      </p>
    );
  }

  return (
    <Table<PayoutRequest>
      dataSource={requests}
      columns={columns}
      rowKey="id"
      pagination={false}
      size="small"
    />
  );
}
