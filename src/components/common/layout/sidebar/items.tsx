import {
  LuBuilding2,
  LuCalendarDays,
  LuLayoutDashboard,
  LuMegaphone,
  LuUser,
  LuWallet,
} from "react-icons/lu";
import { ROUTES } from "@/consts/routes";

export const sellerMenuItems = [
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

export const administratorMenuItems = sellerMenuItems;

export const guestMenuItems = [
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
