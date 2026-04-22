"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge, Skeleton } from "antd";
import {
  LuBuilding2,
  LuCalendarDays,
  LuLayoutDashboard,
  LuMegaphone,
  LuUser,
  LuWallet,
} from "react-icons/lu";
import { useAuthStore } from "@/stores/auth";
import { usePromotionsStore } from "@/stores/promotions";
import { promotionsLib } from "@/libs/api/promotions";
import { cn } from "@/libs/cn";
import { ROUTES } from "@/consts/routes";

// Items para seller
const sellerMenuItems = [
  {
    title: "Dashboard",
    href: ROUTES.ADMIN.DASHBOARD,
    icon: <LuLayoutDashboard size={20} />,
  },
  {
    title: "Plazzes",
    href: ROUTES.ADMIN.PLAZZES,
    icon: <LuBuilding2 size={20} />,
  },
  {
    title: "Reservas",
    href: ROUTES.ADMIN.BOOKINGS,
    icon: <LuCalendarDays size={20} />,
  },
  {
    title: "Banners",
    href: ROUTES.ADMIN.BANNERS,
    icon: <LuMegaphone size={20} />,
  },
  {
    title: "Wallet",
    href: ROUTES.ADMIN.WALLET,
    icon: <LuWallet size={20} />,
  },
  {
    title: "Mi Perfil",
    href: ROUTES.ADMIN.PROFILE,
    icon: <LuUser size={20} />,
  },
];

// Admin tiene el mismo menú que seller (ambos usan banners)
const administratorMenuItems = sellerMenuItems;

// Items para guest
const guestMenuItems = [
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
  const { user, isLoadingAuth } = useAuthStore();
  const { pendingCounts, setPendingCounts } = usePromotionsStore();

  useEffect(() => {
    if (user?.role === "administrator") {
      promotionsLib
        .getPendingCounts()
        .then(setPendingCounts)
        .catch(() => {});
    }
  }, [user?.role, setPendingCounts]);

  // Seleccionar los items del menú según el rol del usuario
  const menuItems =
    user?.role === "administrator"
      ? administratorMenuItems
      : user?.role === "seller"
        ? sellerMenuItems
        : guestMenuItems;

  // Badge counts por ruta (solo admin)
  const badgeByHref: Record<string, number> = {
    [ROUTES.ADMIN.PLAZZES]: pendingCounts.feature_requests,
    [ROUTES.ADMIN.BANNERS]: pendingCounts.banner_requests,
    [ROUTES.ADMIN.WALLET]: pendingCounts.payout_requests,
  };

  return (
    <aside className="w-full md:w-48 bg-white border-b md:border-b-0 md:border-r border-gray-200 md:min-h-[calc(100vh-64px)]">
      <nav className="p-2 md:p-4">
        <ul className="flex md:flex-col gap-1 md:gap-2 overflow-x-auto md:overflow-x-visible">
          {isLoadingAuth
            ? // Skeleton loader mientras se cargan los datos
              [...Array(5)].map((_, index) => (
                <li key={index} className="flex-shrink-0 w-full">
                  <Skeleton.Input active block className="min-w-0 mb-1" />
                </li>
              ))
            : menuItems.map((item) => {
                const badgeCount = badgeByHref[item.href] ?? 0;
                return (
                  <li key={item.href} className="flex-shrink-0 w-full">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex md:flex-row flex-col items-center gap-1 md:gap-3 p-2 md:px-4 md:py-2 rounded-md text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors text-xs md:text-sm",
                        pathname === item.href &&
                          "text-primary bg-primary/5 font-medium",
                      )}
                    >
                      {item.icon}
                      <Badge count={badgeCount} size="small" offset={[6, 0]}>
                        <span className="text-center md:text-left">
                          {item.title}
                        </span>
                      </Badge>
                    </Link>
                  </li>
                );
              })}
        </ul>
      </nav>
    </aside>
  );
};
