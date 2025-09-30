"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuBuilding2,
  LuCalendarDays,
  LuLayoutDashboard,
  LuUser,
} from "react-icons/lu";
import { cn } from "@/libs/cn";
import { ROUTES } from "@/consts/routes";

const menuItems = [
  {
    title: "Dashboard",
    href: ROUTES.ADMIN.DASHBOARD,
    icon: <LuLayoutDashboard size={20} />,
  },
  {
    title: "Mis Plazzes",
    href: ROUTES.ADMIN.PLAZZES,
    icon: <LuBuilding2 size={20} />,
  },
  {
    title: "Reservas",
    href: ROUTES.ADMIN.BOOKINGS,
    icon: <LuCalendarDays size={20} />,
  },

  {
    title: "Mi Perfil",
    href: ROUTES.ADMIN.PROFILE,
    icon: <LuUser size={20} />,
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-48 bg-white border-b md:border-b-0 md:border-r border-gray-200 md:min-h-[calc(100vh-64px)]">
      <nav className="p-2 md:p-4">
        <ul className="flex md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-x-visible">
          {menuItems.map((item) => (
            <li key={item.href} className="flex-shrink-0 w-full">
              <Link
                href={item.href}
                className={cn(
                  "flex md:flex-row flex-col items-center gap-1 md:gap-3 p-2 md:px-4 md:py-2 rounded-md text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors text-xs md:text-sm",
                  pathname === item.href &&
                    "text-primary bg-primary/5 font-medium"
                )}
              >
                {item.icon}
                <span className="text-center md:text-left">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
