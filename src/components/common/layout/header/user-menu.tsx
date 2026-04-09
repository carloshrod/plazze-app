"use client";

import Link from "next/link";
import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { LuChevronDown, LuLogOut, LuUser } from "react-icons/lu";
import { useAuthStore } from "@/stores/auth";
import { useAuthService } from "@/services/auth";
import { ROUTES } from "@/consts/routes";
import { cn } from "@/libs/cn";

interface UserMenuProps {
  isTransparent?: boolean;
}

export function UserMenu({ isTransparent = false }: UserMenuProps) {
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

  const linkClass = cn(
    "py-2 px-4 rounded-md transition-colors",
    isTransparent
      ? "text-white hover:bg-white/20"
      : "text-gray-700 hover:bg-primary/10",
  );

  const triggerClass = cn(
    "flex items-center gap-2 h-10 py-2 px-4 rounded-md transition-colors cursor-pointer",
    isTransparent
      ? "text-white hover:bg-white/20"
      : "text-gray-700 hover:bg-primary/10",
  );

  return (
    <div className="hidden lg:flex items-center gap-4">
      <Link href={ROUTES.ADMIN.DASHBOARD} className={linkClass}>
        Mi Panel
      </Link>
      <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
        <div className={triggerClass}>
          <Avatar size={32}>
            <LuUser
              size={40}
              className={isTransparent ? "text-white/80" : "text-gray-600"}
            />
          </Avatar>
          <span className="text-sm font-medium">{user?.displayName}</span>
          <LuChevronDown
            size={16}
            className={isTransparent ? "text-white/80" : "text-gray-600"}
          />
        </div>
      </Dropdown>
    </div>
  );
}
