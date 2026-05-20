// ─────────────────────────────────────────────────────────
// Tipos de respuesta nativa de la API de Dokan
// ─────────────────────────────────────────────────────────

export interface DokanBalance {
  current_balance: number;
  withdraw_limit: string;
  withdraw_threshold: number;
}

// ─────────────────────────────────────────────────────────
// Tipos de respuesta del endpoint custom /plazze/v1/wallet/summary
// ─────────────────────────────────────────────────────────

export interface PlazzeWalletSummaryData {
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

export interface PlazzeWalletSummaryResponse {
  success: boolean;
  data: PlazzeWalletSummaryData;
}

export interface DokanBankPayment {
  ac_name: string;
  ac_number: string;
  bank_name: string;
  bank_addr: string;
  routing_number: string;
  iban: string;
  swift: string;
}

export interface DokanSettings {
  store_name: string;
  payment: {
    bank?: DokanBankPayment;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export type DokanWithdrawStatus = "pending" | "approved" | "cancelled";

export interface DokanWithdraw {
  id: string;
  user: {
    id: number;
    store_name: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  amount: number;
  created: string;
  status: DokanWithdrawStatus;
  method: string;
  note: string;
  ip: string;
}

// ─────────────────────────────────────────────────────────
// Tipos de UI (mapeados desde las APIs para consumo en componentes)
// ─────────────────────────────────────────────────────────

export interface WalletSummary {
  available_balance: number;
  withdraw_limit: number;
}

/** Datos bancarios del vendor — formato Dokan (guardado en dokan_profile_settings) */
export type BankData = DokanBankPayment;

export type WithdrawStatus = DokanWithdrawStatus;

export interface WithdrawRequest {
  id: string;
  seller_name: string;
  seller_email: string;
  amount: number;
  status: WithdrawStatus;
  note: string;
  created_at: string;
}

export interface GetWithdrawsParams {
  status?: WithdrawStatus;
  page?: number;
  per_page?: number;
}

// ─────────────────────────────────────────────────────────
// Tipos del endpoint custom /plazze/v1/wallet/payout-requests
// ─────────────────────────────────────────────────────────

export interface PlazzePayoutRequest {
  id: number;
  seller_id: number;
  seller_name: string;
  seller_email: string;
  amount: number;
  status: WithdrawStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlazzePayoutRequestsResponse {
  success: boolean;
  data: PlazzePayoutRequest[];
  total: number;
  page: number;
  per_page: number;
}

// legacy alias — mantener para no romper imports durante transición
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
