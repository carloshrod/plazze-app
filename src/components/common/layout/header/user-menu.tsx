"use client";

import Link from "next/link";
import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { LuChevronDown, LuLogOut, LuUser } from "react-icons/lu";
import { ROUTES } from "@/consts/routes";

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
  },
];

export function UserMenu() {
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
          <span className="text-sm font-medium">John Doe</span>
          <LuChevronDown size={16} className="text-gray-600" />
        </div>
      </Dropdown>
    </div>
  );
}
