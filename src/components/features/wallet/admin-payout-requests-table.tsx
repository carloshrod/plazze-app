"use client";

import { useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Descriptions,
  Dropdown,
  Form,
  Input,
  Modal,
  Spin,
  Table,
  Tag,
  Tooltip,
} from "antd";
import { LuChevronDown, LuUser } from "react-icons/lu";
import { usePayoutRequests, useUpdatePayoutRequest } from "@/services/wallet";
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
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

interface ActionModalState {
  open: boolean;
  request: PayoutRequest | null;
  targetStatus: PayoutStatus | null;
}

export function AdminPayoutRequestsTable() {
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | undefined>(
    undefined,
  );
  const { requests, loading, error, refetch } = usePayoutRequests({
    status: statusFilter,
    per_page: 50,
  });
  const { loading: updating, updateRequest } = useUpdatePayoutRequest();

  const [modal, setModal] = useState<ActionModalState>({
    open: false,
    request: null,
    targetStatus: null,
  });
  const [notesForm] = Form.useForm<{ admin_notes: string }>();

  const openModal = (request: PayoutRequest, targetStatus: PayoutStatus) => {
    setModal({ open: true, request, targetStatus });
    notesForm.resetFields();
  };

  const closeModal = () => {
    setModal({ open: false, request: null, targetStatus: null });
    notesForm.resetFields();
  };

  const handleConfirm = async () => {
    if (!modal.request || !modal.targetStatus) return;
    const { admin_notes } = notesForm.getFieldsValue();
    const ok = await updateRequest(
      modal.request.id,
      modal.targetStatus,
      admin_notes,
    );
    if (ok) {
      closeModal();
      refetch();
    }
  };

  const getMenuItems = (record: PayoutRequest) => {
    const actionsByStatus: Record<
      PayoutStatus,
      { label: string; key: PayoutStatus; danger?: boolean }[]
    > = {
      pending: [
        { label: "Aprobar", key: "approved" },
        { label: "Rechazar", key: "rejected", danger: true },
      ],
      approved: [{ label: "Marcar como pagada", key: "paid" }],
      paid: [],
      rejected: [],
    };

    return (actionsByStatus[record.status] ?? []).map((a) => ({
      ...a,
      onClick: () => openModal(record, a.key),
    }));
  };

  const filterButtons: { label: string; value: PayoutStatus | undefined }[] = [
    { label: "Todas", value: undefined },
    { label: "Pendientes", value: "pending" },
    { label: "Aprobadas", value: "approved" },
    { label: "Pagadas", value: "paid" },
    { label: "Rechazadas", value: "rejected" },
  ];

  const columns = [
    {
      title: "Vendedor",
      key: "seller",
      render: (_: unknown, record: PayoutRequest) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<LuUser size={16} />} size="small" />
          <div>
            <p className="font-medium text-sm leading-tight">
              {record.seller_name || "—"}
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
      title: "Datos bancarios",
      key: "bank_data",
      render: (_: unknown, record: PayoutRequest) => {
        if (!record.bank_data)
          return <span className="text-gray-400 text-sm">Sin datos</span>;
        return (
          <Tooltip
            title={
              <div className="text-xs space-y-1">
                <p>
                  <strong>Titular:</strong> {record.bank_data.account_holder}
                </p>
                <p>
                  <strong>Banco:</strong> {record.bank_data.bank_name}
                </p>
                <p>
                  <strong>Cuenta:</strong> {record.bank_data.account_number}
                </p>
                <p>
                  <strong>Tipo:</strong>{" "}
                  {record.bank_data.account_type === "corriente"
                    ? "Corriente"
                    : "Ahorros"}
                </p>
                {record.bank_data.id_number && (
                  <p>
                    <strong>Cédula/RUC:</strong> {record.bank_data.id_number}
                  </p>
                )}
              </div>
            }
            placement="top"
          >
            <Button type="link" size="small" className="!p-0 !cursor-default">
              Ver datos
            </Button>
          </Tooltip>
        );
      },
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
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      render: (v: string) => (
        <span className="text-xs text-gray-500">{formatDate(v)}</span>
      ),
    },
    {
      title: "Acciones",
      key: "action",
      render: (_: unknown, record: PayoutRequest) => {
        const items = getMenuItems(record);
        if (!items.length) return null;
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button size="small" icon={<LuChevronDown size={14} />}>
              Gestionar
            </Button>
          </Dropdown>
        );
      },
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
      {/* Filtros de estado */}
      <div className="flex flex-wrap gap-2 mb-4">
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

      <Table<PayoutRequest>
        dataSource={requests}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        locale={{ emptyText: "No hay solicitudes de pago" }}
        expandable={{
          expandedRowRender: (record) =>
            record.bank_data ? (
              <Descriptions
                size="small"
                column={2}
                className="bg-gray-50 p-3 rounded"
              >
                <Descriptions.Item label="Titular">
                  {record.bank_data.account_holder}
                </Descriptions.Item>
                <Descriptions.Item label="Banco">
                  {record.bank_data.bank_name}
                </Descriptions.Item>
                <Descriptions.Item label="Número de cuenta">
                  {record.bank_data.account_number}
                </Descriptions.Item>
                <Descriptions.Item label="Tipo">
                  {record.bank_data.account_type === "corriente"
                    ? "Corriente"
                    : "Ahorros"}
                </Descriptions.Item>
                {record.bank_data.id_number && (
                  <Descriptions.Item label="Cédula/RUC">
                    {record.bank_data.id_number}
                  </Descriptions.Item>
                )}
              </Descriptions>
            ) : null,
          rowExpandable: (record) => !!record.bank_data,
        }}
      />

      {/* Modal de confirmación de acción */}
      <Modal
        title={
          modal.targetStatus
            ? `Confirmar: ${statusLabels[modal.targetStatus]}`
            : "Confirmar acción"
        }
        open={modal.open}
        onCancel={closeModal}
        onOk={handleConfirm}
        confirmLoading={updating}
        okText="Confirmar"
        cancelText="Cancelar"
        okButtonProps={{
          danger: modal.targetStatus === "rejected",
        }}
      >
        {modal.request && (
          <div className="mb-4 space-y-2">
            <p className="text-sm text-gray-600">
              Vendedor: <strong>{modal.request.seller_name}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Monto: <strong>{formatCurrency(modal.request.amount)}</strong>
            </p>
          </div>
        )}
        <Form form={notesForm} layout="vertical">
          <Form.Item
            label="Notas para el vendedor (opcional)"
            name="admin_notes"
          >
            <Input.TextArea
              rows={3}
              placeholder="Ej: Pago procesado el 20 de abril..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
