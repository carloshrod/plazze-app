import { Card } from "antd";
import Link from "next/link";
import {
  LuArrowDownRight,
  LuArrowUpRight,
  LuBuilding2,
  LuCalendar,
  LuDollarSign,
  LuUsers,
} from "react-icons/lu";
import { cn } from "@/libs/cn";
import { ROUTES } from "@/consts/routes";

const stats = [
  {
    title: "Total Plazzes",
    value: "12",
    trend: "+2",
    trendUp: true,
    icon: <LuBuilding2 className="text-primary" size={24} />,
    href: ROUTES.ADMIN.PLAZZES,
  },
  {
    title: "Reservas Activas",
    value: "28",
    trend: "+5",
    trendUp: true,
    icon: <LuCalendar className="text-primary" size={24} />,
    href: ROUTES.ADMIN.BOOKINGS,
  },
  {
    title: "Ingresos Totales",
    value: "$5,240,000",
    trend: "+12%",
    trendUp: true,
    icon: <LuDollarSign className="text-primary" size={24} />,
    href: "#",
  },
  {
    title: "Clientes Nuevos",
    value: "18",
    trend: "-2",
    trendUp: false,
    icon: <LuUsers className="text-primary" size={24} />,
    href: "#",
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bienvenido a tu panel de control</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <Card className="border border-gray-200 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/5 rounded-lg">{stat.icon}</div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  {stat.trendUp ? (
                    <LuArrowUpRight size={16} className="text-green-600" />
                  ) : (
                    <LuArrowDownRight size={16} className="text-red-600" />
                  )}
                  <span
                    className={cn(
                      stat.trendUp ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {stat.trend}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
