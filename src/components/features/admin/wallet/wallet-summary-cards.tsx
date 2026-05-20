"use client";

import { Card, Skeleton } from "antd";
import { LuBanknote, LuWallet } from "react-icons/lu";
import { formatCurrency } from "@/utils/format";
import type { WalletSummary } from "@/types/wallet";

interface WalletSummaryCardsProps {
  summary: WalletSummary | null;
  loading: boolean;
}

const WalletSummaryCards = ({ summary, loading }: WalletSummaryCardsProps) => {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <Skeleton active />
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Saldo disponible",
      value: formatCurrency(summary.available_balance),
      subtitle: "Listo para retirar",
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
    {
      title: "Mínimo de retiro",
      value: formatCurrency(summary.withdraw_limit),
      subtitle: "Monto mínimo para solicitar pago",
      icon: <LuBanknote className="text-blue-500" size={24} />,
      highlight: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
