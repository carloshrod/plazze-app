import { useState, useEffect, useCallback } from "react";
import { walletLib } from "@/libs/api/wallet";
import showMessage from "@/libs/message";
import { usePromotionsStore } from "@/stores/promotions";
import type {
  WalletSummary,
  BankData,
  PayoutRequest,
  GetPayoutRequestsParams,
  CommissionSettings,
} from "@/types/wallet";

// ─────────────────────────────────────────────────────────
// useWalletSummary
// ─────────────────────────────────────────────────────────

export const useWalletSummary = (seller_id?: number) => {
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await walletLib.getSummary(seller_id);
      setSummary(res.data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al cargar el resumen";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [seller_id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
};

// ─────────────────────────────────────────────────────────
// useBankData
// ─────────────────────────────────────────────────────────

export const useBankData = () => {
  const [bankData, setBankData] = useState<BankData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBankData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await walletLib.getBankData();
      // Si el backend retorna {} vacío, dejamos null
      const data =
        res.data && Object.keys(res.data).length > 0
          ? (res.data as BankData)
          : null;
      setBankData(data);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al cargar datos bancarios";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBankData();
  }, [fetchBankData]);

  const saveBankData = async (data: BankData): Promise<boolean> => {
    try {
      setSaving(true);
      await walletLib.saveBankData(data);
      setBankData(data);
      showMessage.success("Datos bancarios guardados correctamente");
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al guardar datos bancarios";
      showMessage.error(msg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    bankData,
    loading,
    saving,
    error,
    saveBankData,
    refetch: fetchBankData,
  };
};

// ─────────────────────────────────────────────────────────
// usePayoutRequests
// ─────────────────────────────────────────────────────────

export const usePayoutRequests = (params?: GetPayoutRequestsParams) => {
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await walletLib.getPayoutRequests(params);
      setRequests(res.requests);
      setTotal(res.total);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al cargar solicitudes";
      setError(msg);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.status, params?.page, params?.per_page]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, total, loading, error, refetch: fetchRequests };
};

// ─────────────────────────────────────────────────────────
// useCreatePayoutRequest
// ─────────────────────────────────────────────────────────

export const useCreatePayoutRequest = () => {
  const [loading, setLoading] = useState(false);

  const createRequest = async (amount: number): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await walletLib.createPayoutRequest(amount);
      showMessage.success(
        res.message || "Solicitud de pago enviada correctamente",
      );
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al solicitar el pago";
      showMessage.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, createRequest };
};

// ─────────────────────────────────────────────────────────
// useUpdatePayoutRequest  (admin)
// ─────────────────────────────────────────────────────────

export const useUpdatePayoutRequest = () => {
  const [loading, setLoading] = useState(false);

  const updateRequest = async (
    id: number,
    status: string,
    admin_notes?: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await walletLib.updatePayoutRequest(id, status, admin_notes);
      showMessage.success(res.message || "Solicitud actualizada correctamente");
      if (status !== "pending") {
        usePromotionsStore.getState().decrementPayoutRequests();
      }
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al actualizar la solicitud";
      showMessage.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateRequest };
};

// ─────────────────────────────────────────────────────────
// useCommissionSettings
// ─────────────────────────────────────────────────────────

export const useCommissionSettings = () => {
  const [settings, setSettings] = useState<CommissionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await walletLib.getCommissionSettings();
      setSettings(res.data);
    } catch {
      showMessage.error("Error al cargar la configuración de comisión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (percentage: number): Promise<boolean> => {
    try {
      setSaving(true);
      const res = await walletLib.updateCommissionSettings(percentage);
      setSettings(res.data);
      showMessage.success(res.message || "Comisión actualizada correctamente");
      return true;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al actualizar la comisión";
      showMessage.error(msg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, saving, updateSettings, refetch: fetchSettings };
};
