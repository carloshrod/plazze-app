"use client";

import { Card, Skeleton } from "antd";
import { LuBanknote, LuDollarSign, LuPercent, LuWallet } from "react-icons/lu";
import { formatCurrency } from "@/utils/format";
import type { WalletSummary } from "@/types/wallet";

interface WalletSummaryCardsProps {
  summary: WalletSummary | null;
  loading: boolean;
}

const WalletSummaryCards = ({ summary, loading }: WalletSummaryCardsProps) => {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <Skeleton active />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total generado",
      value: formatCurrency(summary.total_earned),
      subtitle: `${summary.paid_bookings_count} reserva${summary.paid_bookings_count === 1 ? "" : "s"} pagada${summary.paid_bookings_count === 1 ? "" : "s"}`,
      icon: <LuDollarSign className="text-primary" size={24} />,
      highlight: false,
    },
    {
      title: "Comisión Plazze",
      value: formatCurrency(summary.commission_amount),
      subtitle: `Tasa actual: ${(summary.current_commission_rate * 100).toFixed(0)}%`,
      icon: <LuPercent className="text-orange-500" size={24} />,
      highlight: false,
    },
    {
      title: "Neto generado",
      value: formatCurrency(summary.net_earned),
      subtitle: "Total − comisión Plazze",
      icon: <LuBanknote className="text-blue-500" size={24} />,
      highlight: false,
    },
    {
      title: "Saldo disponible",
      value: formatCurrency(summary.available_balance),
      subtitle:
        summary.total_requested > 0
          ? `${formatCurrency(summary.total_requested)} en solicitud`
          : "Listo para retirar",
      icon: (
        <LuWallet
          size={24}
          className={
            summary.available_balance > 0 ? "text-green-600" : "text-gray-400"
          }
        />
      ),
      highlight: summary.available_balance > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`border transition-all ${
            card.highlight
              ? "border-green-200 bg-green-50/30"
              : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-lg ${
                card.highlight ? "bg-green-100" : "bg-primary/5"
              }`}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p
                className={`text-2xl font-semibold mt-1 ${
                  card.highlight ? "text-green-700" : "text-gray-900"
                }`}
              >
                {card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WalletSummaryCards;
