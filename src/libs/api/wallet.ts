import { client } from "./client";
import type {
  WalletSummaryResponse,
  BankDataResponse,
  BankData,
  SaveBankDataResponse,
  CreatePayoutResponse,
  PayoutRequestsResponse,
  GetPayoutRequestsParams,
  CommissionSettingsResponse,
  UpdateCommissionResponse,
} from "@/types/wallet";

export const walletLib = {
  getSummary: (seller_id?: number): Promise<WalletSummaryResponse> =>
    client
      .get<WalletSummaryResponse>("/plazze/v1/wallet/summary", {
        params: seller_id ? { seller_id } : undefined,
      })
      .then((r) => r.data),

  getBankData: (): Promise<BankDataResponse> =>
    client
      .get<BankDataResponse>("/plazze/v1/wallet/bank-data")
      .then((r) => r.data),

  saveBankData: (data: BankData): Promise<SaveBankDataResponse> =>
    client
      .post<SaveBankDataResponse>("/plazze/v1/wallet/bank-data", data)
      .then((r) => r.data),

  createPayoutRequest: (amount: number): Promise<CreatePayoutResponse> =>
    client
      .post<CreatePayoutResponse>("/plazze/v1/wallet/payout-request", {
        amount,
      })
      .then((r) => r.data),

  getPayoutRequests: (
    params?: GetPayoutRequestsParams,
  ): Promise<PayoutRequestsResponse> =>
    client
      .get<PayoutRequestsResponse>("/plazze/v1/wallet/payout-requests", {
        params,
      })
      .then((r) => r.data),

  updatePayoutRequest: (
    id: number,
    status: string,
    admin_notes?: string,
  ): Promise<{ success: boolean; message: string }> =>
    client
      .put<{
        success: boolean;
        message: string;
      }>(`/plazze/v1/wallet/payout-request/${id}`, { status, admin_notes })
      .then((r) => r.data),

  getCommissionSettings: (): Promise<CommissionSettingsResponse> =>
    client
      .get<CommissionSettingsResponse>("/plazze/v1/commission")
      .then((r) => r.data),

  updateCommissionSettings: (
    commission_percentage: number,
  ): Promise<UpdateCommissionResponse> =>
    client
      .put<UpdateCommissionResponse>("/plazze/v1/commission", {
        commission_percentage,
      })
      .then((r) => r.data),
};
