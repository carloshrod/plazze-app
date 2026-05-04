"use client";

import Link from "next/link";
import { Card, Skeleton } from "antd";
import { LuBuilding2, LuCalendar, LuDollarSign, LuUsers } from "react-icons/lu";
import { ROUTES } from "@/consts/routes";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useAuthStore } from "@/stores/auth";
import { PlanStatusCard } from "@/components/features/admin/dashboard/PlanStatusCard";

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();
  const { user } = useAuthStore();
  const isSeller = user?.role === "seller";

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar estadísticas: {error}</p>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bienvenido a tu panel de control</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <Skeleton active />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statsCards: Array<{
    title: string;
    value: string;
    icon: JSX.Element;
    href: string;
    subtitle?: string;
  }> = [
    {
      title: "Total Plazzes",
      value: stats.plazzes.total.toString(),
      icon: <LuBuilding2 className="text-primary" size={24} />,
      href: ROUTES.ADMIN.PLAZZES,
    },
    {
      title: "Reservas Activas",
      value: stats.bookings.active.toString(),
      icon: <LuCalendar className="text-primary" size={24} />,
      href: ROUTES.ADMIN.BOOKINGS,
    },
    {
      title: "Ingresos Totales",
      value: `$${stats.revenue.total.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}`,
      icon: <LuDollarSign className="text-primary" size={24} />,
      href: ROUTES.ADMIN.BOOKINGS,
    },
    {
      title: "Clientes Este Mes",
      value: stats.clients.new_this_month.toString(),
      subtitle: `Total: ${stats.clients.total}`,
      icon: <LuUsers className="text-primary" size={24} />,
      href: ROUTES.ADMIN.BOOKINGS,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido a tu panel de control</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {statsCards.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <Card className="border border-gray-200 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/5 rounded-lg">{stat.icon}</div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900 mt-2 ms-2">
                      {stat.value}
                    </p>
                    {stat.subtitle ? (
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.subtitle}
                      </p>
                    ) : (
                      <p className="invisible">placeholder</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {isSeller && <PlanStatusCard />}
    </div>
  );
}
