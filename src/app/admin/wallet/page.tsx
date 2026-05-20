"use client";

import { useState } from "react";
import { Alert, Button, Card, Divider, Modal, Skeleton, Spin } from "antd";
import { LuWallet } from "react-icons/lu";
import { useAuthStore } from "@/stores/auth";
import {
  useWalletSummary,
  useCreateWithdrawal,
  useBankData,
} from "@/services/wallet";
import WalletSummaryCards from "@/components/features/admin/wallet/wallet-summary-cards";
import BankDataForm from "@/components/features/admin/wallet/bank-data-form";
import PayoutRequestsTable from "@/components/features/admin/wallet/payout-requests-table";
import AdminPayoutRequestsTable from "@/components/features/admin/wallet/admin-payout-requests-table";
import { formatCurrency } from "@/utils/format";

// ─────────────────────────────────────────────────────────
// Vista Vendedor
// ─────────────────────────────────────────────────────────

function SellerWalletView() {
  const { isLoadingAuth } = useAuthStore();
  const { summary, loading, error, refetch } = useWalletSummary();
  const { loading: requesting, createWithdrawal } = useCreateWithdrawal();
  const { bankData, loading: bankLoading } = useBankData();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tableRefreshKey, setTableRefreshKey] = useState(0);

  const hasBankData = !!bankData?.ac_number;
  const meetsMinimum =
    (summary?.available_balance ?? 0) >= (summary?.withdraw_limit ?? 50);
  const canWithdraw = hasBankData && meetsMinimum;

  const handleRequestPayout = async () => {
    if (!summary) return;
    const ok = await createWithdrawal(summary.available_balance);
    if (ok) {
      setConfirmOpen(false);
      setTableRefreshKey((k) => k + 1);
      refetch();
    }
  };

  return (
    <div>
      <div className="mb-8">
        {isLoadingAuth ? (
          <div className="flex flex-col gap-2">
            <Skeleton.Input active size="large" className="!min-w-80" />
            <Skeleton.Input active className="!min-w-96" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-900">
              Mis Ingresos
            </h1>
            <p className="text-gray-600">
              Consulta tus ingresos, gestiona tus datos bancarios y solicita
              pagos
            </p>
          </>
        )}
      </div>

      {isLoadingAuth ? (
        <div className="h-[250px] flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
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
                    <p className="text-sm text-gray-500 mb-1">
                      Saldo disponible
                    </p>
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
                    disabled={loading || bankLoading || !canWithdraw}
                    onClick={() => setConfirmOpen(true)}
                  >
                    Solicitar pago
                  </Button>

                  {!loading && !bankLoading && !canWithdraw && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {!hasBankData
                        ? "Configura tus datos bancarios para poder solicitar un pago."
                        : `Necesitas al menos ${formatCurrency(summary?.withdraw_limit ?? 50)} para solicitar un pago.`}
                    </p>
                  )}

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
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Vista Admin
// ─────────────────────────────────────────────────────────

function AdminWalletView() {
  const { isLoadingAuth } = useAuthStore();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 md:px-4">
        <div>
          {isLoadingAuth ? (
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="large" className="!min-w-80" />
              <Skeleton.Input active className="!min-w-96" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900">
                Solicitudes de Pago
              </h1>
              <p className="text-gray-600">
                Supervisión de solicitudes de retiro de los vendedores
              </p>
            </>
          )}
        </div>
      </div>

      {isLoadingAuth ? (
        <div className="h-[250px] flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <AdminPayoutRequestsTable />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Página principal — adapta vista por rol
// ─────────────────────────────────────────────────────────

export default function WalletPage() {
  const { user, isLoadingAuth } = useAuthStore();

  if (!isLoadingAuth && !user) return null;

  if (user?.role === "administrator") {
    return <AdminWalletView />;
  } else {
    return <SellerWalletView />;
  }
}
