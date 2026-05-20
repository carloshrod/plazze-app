import { client } from "./client";
import type {
  DokanBalance,
  DokanSettings,
  DokanWithdraw,
  BankData,
  GetWithdrawsParams,
} from "@/types/wallet";

export const walletLib = {
  // Saldo disponible — balance nativo de Dokan
  getBalance: (): Promise<DokanBalance> =>
    client.get<DokanBalance>("/dokan/v1/withdraw/balance").then((r) => r.data),

  // Datos bancarios — Dokan settings
  getBankData: (): Promise<DokanSettings> =>
    client.get<DokanSettings>("/dokan/v1/settings").then((r) => r.data),

  // Guardar datos bancarios en Dokan settings
  saveBankData: (data: BankData): Promise<DokanSettings> =>
    client
      .put<DokanSettings>("/dokan/v1/settings", { payment: { bank: data } })
      .then((r) => r.data),

  // Listar solicitudes de retiro (Dokan)
  getWithdraws: (params?: GetWithdrawsParams): Promise<DokanWithdraw[]> =>
    client
      .get<DokanWithdraw[]>("/dokan/v1/withdraw/", { params })
      .then((r) => r.data),

  // Crear solicitud de retiro (Dokan)
  createWithdraw: (amount: number, notes?: string): Promise<DokanWithdraw> =>
    client
      .post<DokanWithdraw>("/dokan/v1/withdraw/", {
        amount: String(amount),
        notes: notes ?? "",
        method: "bank",
      })
      .then((r) => r.data),
};
