import type {
  DokanBalance,
  DokanSettings,
  DokanWithdraw,
  WalletSummary,
  BankData,
  WithdrawRequest,
} from "@/types/wallet";

// Mapea la respuesta de /dokan/v1/withdraw/balance al tipo de UI
export const mapDokanToWalletSummary = (
  response: DokanBalance,
): WalletSummary => ({
  available_balance: response.current_balance,
  withdraw_limit: parseFloat(response.withdraw_limit) || 0,
});

// Extrae los datos bancarios desde DokanSettings (campo payment.bank)
export const mapDokanSettingsToBankData = (
  settings: DokanSettings,
): BankData | null => {
  const bank = settings?.payment?.bank;
  if (!bank) return null;
  return {
    ac_name: bank.ac_name || "",
    ac_number: bank.ac_number || "",
    bank_name: bank.bank_name || "",
    bank_addr: bank.bank_addr || "",
    routing_number: bank.routing_number || "",
    iban: bank.iban || "",
    swift: bank.swift || "",
  };
};

// Construye el payload para PUT /dokan/v1/settings a partir de BankData
export const mapBankDataToDokanPayment = (
  data: BankData,
): { payment: { bank: BankData } } => ({
  payment: { bank: data },
});

// Convierte un DokanWithdraw al tipo de UI WithdrawRequest
export const mapDokanWithdraw = (w: DokanWithdraw): WithdrawRequest => ({
  id: String(w.id),
  seller_name: w.user
    ? `${w.user.first_name} ${w.user.last_name}`.trim() || w.user.store_name
    : "—",
  seller_email: w.user?.email || "—",
  amount: w.amount,
  status: w.status,
  note: w.note || "",
  created_at: w.created || "",
});
