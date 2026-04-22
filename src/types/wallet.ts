export interface WalletSummary {
  total_earned: number;
  current_commission_rate: number;
  commission_amount: number;
  net_earned: number;
  total_requested: number;
  total_paid_out: number;
  available_balance: number;
  paid_bookings_count: number;
  confirmed_bookings: number;
}

export interface BankData {
  account_holder: string;
  account_number: string;
  account_type: "corriente" | "ahorros";
  bank_name: string;
  id_number: string;
}

export type PayoutStatus = "pending" | "approved" | "paid" | "rejected";

export interface PayoutRequest {
  id: number;
  seller_id: number;
  seller_name: string;
  seller_email: string;
  amount: number;
  status: PayoutStatus;
  bank_data: BankData | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface WalletSummaryResponse {
  success: boolean;
  data: WalletSummary;
}

export interface BankDataResponse {
  success: boolean;
  data: BankData | Record<string, never>;
}

export interface SaveBankDataResponse {
  success: boolean;
  message: string;
  data: BankData;
}

export interface CreatePayoutResponse {
  success: boolean;
  message: string;
  request_id: number;
  amount: number;
}

export interface PayoutRequestsResponse {
  success: boolean;
  requests: PayoutRequest[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface GetPayoutRequestsParams {
  status?: PayoutStatus;
  page?: number;
  per_page?: number;
}

export interface CommissionSettings {
  commission_rate: number;
  commission_percentage: number;
}

export interface CommissionSettingsResponse {
  success: boolean;
  data: CommissionSettings;
}

export interface UpdateCommissionResponse {
  success: boolean;
  message: string;
  data: CommissionSettings;
}
