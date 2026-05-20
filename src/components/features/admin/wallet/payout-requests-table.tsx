"use client";

import { useEffect } from "react";
import { Alert, Spin, Table, Tag } from "antd";
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
    const date = new Date(dateStr.replace(" ", "T"));
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("es-PA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

interface PayoutRequestsTableProps {
  refreshKey?: number;
}

const PayoutRequestsTable = ({ refreshKey }: PayoutRequestsTableProps) => {
  const { requests, loading, error, refetch } = useWithdrawals({
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
    <Table<WithdrawRequest>
      dataSource={requests}
      columns={columns}
      rowKey="id"
      size="small"
    />
  );
};

export default PayoutRequestsTable;
