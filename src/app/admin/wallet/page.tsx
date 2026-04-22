"use client";

import { useState } from "react";
import { Alert, Button, Card, Divider, Modal, Spin } from "antd";
import { LuWallet, LuSettings2 } from "react-icons/lu";
import { useAuthStore } from "@/stores/auth";
import { useWalletSummary, useCreatePayoutRequest } from "@/services/wallet";
import { WalletSummaryCards } from "@/components/features/wallet/wallet-summary-cards";
import { BankDataForm } from "@/components/features/wallet/bank-data-form";
import { PayoutRequestsTable } from "@/components/features/wallet/payout-requests-table";
import { AdminPayoutRequestsTable } from "@/components/features/wallet/admin-payout-requests-table";
import { CommissionConfig } from "@/components/features/admin/commission-config";
import { formatCurrency } from "@/utils/format";

// ─────────────────────────────────────────────────────────
// Vista Vendedor
// ─────────────────────────────────────────────────────────

function SellerWalletView() {
  const { summary, loading, error, refetch } = useWalletSummary();
  const { loading: requesting, createRequest } = useCreatePayoutRequest();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const handleRequestPayout = async () => {
    if (!summary) return;
    const ok = await createRequest(summary.available_balance);
    if (ok) {
      setConfirmOpen(false);
      setTableRefreshKey((k) => k + 1);
      refetch();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Mis Ingresos</h1>
        <p className="text-gray-600">
          Consulta tus ingresos, gestiona tus datos bancarios y solicita pagos
        </p>
      </div>

      {/* Resumen financiero */}
      {error ? (
        <Alert type="error" message={error} className="mb-6" />
      ) : (
        <WalletSummaryCards summary={summary} loading={loading} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Datos bancarios */}
        <Card
          title="Datos Bancarios"
          className="border border-gray-200 shadow-sm"
        >
          <p className="text-sm text-gray-500 mb-4">
            Estos datos se usarán para procesar tus pagos fuera de la
            plataforma.
          </p>
          <BankDataForm />
        </Card>

        {/* Solicitar pago */}
        <Card
          title="Solicitar Pago"
          className="border border-gray-200 shadow-sm"
        >
          {loading ? (
            <div className="flex justify-center py-8">
              <Spin />
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">Saldo disponible</p>
                <p
                  className={`text-4xl font-bold ${
                    (summary?.available_balance ?? 0) > 0
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {formatCurrency(summary?.available_balance ?? 0)}
                </p>
              </div>

              <Button
                type="primary"
                size="large"
                block
                icon={<LuWallet size={18} />}
                disabled={(summary?.available_balance ?? 0) <= 0}
                onClick={() => setConfirmOpen(true)}
              >
                Solicitar pago
              </Button>

              <div className="mt-4">
                <Alert
                  type="info"
                  message="Los pagos se procesan manualmente fuera de la plataforma. Recibirás confirmación una vez realizado el depósito."
                  showIcon
                />
              </div>

              <Divider className="my-4" />

              {/* Historial de solicitudes */}
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Historial de solicitudes
              </h3>
              <PayoutRequestsTable refreshKey={tableRefreshKey} />
            </>
          )}
        </Card>
      </div>

      {/* Modal de confirmación */}
      <Modal
        title="Confirmar solicitud de pago"
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onOk={handleRequestPayout}
        confirmLoading={requesting}
        okText="Solicitar pago"
        cancelText="Cancelar"
      >
        <p className="text-gray-600">
          Vas a solicitar el pago de{" "}
          <strong className="text-gray-900">
            {formatCurrency(summary?.available_balance ?? 0)}
          </strong>{" "}
          a tu cuenta bancaria registrada.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Los depósitos se realizan fuera de la plataforma. Recibirás
          confirmación por parte del equipo Plazze.
        </p>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Vista Admin
// ─────────────────────────────────────────────────────────

function AdminWalletView() {
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Solicitudes de Pago
          </h1>
          <p className="text-gray-600">
            Gestiona las solicitudes de pago de los vendedores
          </p>
        </div>
        <div className="w-full flex items-center justify-between gap-3">
          <Button
            type="link"
            icon={<LuSettings2 size={15} />}
            onClick={() => setCommissionModalOpen(true)}
            className="text-gray-500 hover:text-primary px-0"
          >
            Configurar comisión
          </Button>
        </div>
      </div>

      <AdminPayoutRequestsTable />

      <Modal
        title="Configurar comisión de la plataforma"
        open={commissionModalOpen}
        onCancel={() => setCommissionModalOpen(false)}
        footer={null}
        width={480}
        destroyOnHidden
      >
        <CommissionConfig onClose={() => setCommissionModalOpen(false)} />
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Página principal — adapta vista por rol
// ─────────────────────────────────────────────────────────

export default function WalletPage() {
  const { user } = useAuthStore();

  if (!user) return null;

  if (user.role === "administrator") {
    return <AdminWalletView />;
  }

  return <SellerWalletView />;
}
