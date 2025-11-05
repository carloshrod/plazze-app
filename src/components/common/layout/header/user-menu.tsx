"use client";

import Link from "next/link";
import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { LuChevronDown, LuLogOut, LuUser } from "react-icons/lu";
import { useAuthStore } from "@/stores/auth";
import { useAuthService } from "@/services/auth";
import { ROUTES } from "@/consts/routes";

export function UserMenu() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuthService();

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <Link href={ROUTES.ADMIN.PROFILE}>Mi Perfil</Link>,
      icon: <LuUser size={16} />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Cerrar Sesión",
      icon: <LuLogOut size={16} />,
      danger: true,
      onClick: () => logout(),
    },
  ];

  return (
    <div className="hidden md:flex items-center gap-4">
      <Link
        href={ROUTES.ADMIN.DASHBOARD}
        className="text-gray-700 hover:bg-primary/10 py-2 px-4 rounded-md transition-colors"
      >
        Mi Panel
      </Link>
      <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
        <div className="flex items-center gap-2 h-10 text-gray-700 hover:bg-primary/10 py-2 px-4 rounded-md transition-colors cursor-pointer">
          <Avatar size={32}>
            <LuUser size={40} className="text-gray-600" />
          </Avatar>
          <span className="text-sm font-medium">{user?.displayName}</span>
          <LuChevronDown size={16} className="text-gray-600" />
        </div>
      </Dropdown>
    </div>
  );
}
