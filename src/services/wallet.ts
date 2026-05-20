import { useState, useEffect, useCallback } from "react";
import { walletLib } from "@/libs/api/wallet";
import showMessage from "@/libs/message";
import {
  mapDokanToWalletSummary,
  mapDokanSettingsToBankData,
  mapDokanWithdraw,
} from "@/helpers/wallet";
import type {
  WalletSummary,
  BankData,
  WithdrawRequest,
  GetWithdrawsParams,
} from "@/types/wallet";

// ─────────────────────────────────────────────────────────
// useWalletSummary
// ─────────────────────────────────────────────────────────

export const useWalletSummary = () => {
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const balance = await walletLib.getBalance();
      setSummary(mapDokanToWalletSummary(balance));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al cargar el resumen";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

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
      const settings = await walletLib.getBankData();
      setBankData(mapDokanSettingsToBankData(settings));
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
      const updated = await walletLib.saveBankData(data);
      setBankData(mapDokanSettingsToBankData(updated));
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
// useWithdrawals
// ─────────────────────────────────────────────────────────

export const useWithdrawals = (params?: GetWithdrawsParams) => {
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await walletLib.getWithdraws(params);
      setRequests((res ?? []).map(mapDokanWithdraw));
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

  return { requests, loading, error, refetch: fetchRequests };
};

// ─────────────────────────────────────────────────────────
// useCreateWithdrawal
// ─────────────────────────────────────────────────────────

export const useCreateWithdrawal = () => {
  const [loading, setLoading] = useState(false);

  const createWithdrawal = async (amount: number): Promise<boolean> => {
    try {
      setLoading(true);
      await walletLib.createWithdraw(amount);
      showMessage.success("Solicitud de pago enviada correctamente");
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

  return { loading, createWithdrawal };
};
