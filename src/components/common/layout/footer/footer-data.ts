import { ROUTES } from "@/consts/routes";
import { LuInstagram, LuMail, LuMapPin, LuPhone } from "react-icons/lu";

export const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/heyplazze?igsh=MW5naHF6cDdwZWZ1Yg%3D%3D&utm_source=qr",
    icon: LuInstagram,
  },
];

export const platformLinks = [
  {
    name: "Explorar plazzes",
    href: ROUTES.PUBLIC.PLAZZES.LIST,
  },
  {
    name: "Para propietarios",
    href: ROUTES.ADMIN.DASHBOARD,
  },
];

export const contactInfo = [
  {
    icon: LuMapPin,
    text: "Panamá, Costa del Este",
  },
  {
    icon: LuPhone,
    text: "(507) 233-3333",
  },
  {
    icon: LuMail,
    text: "admin@plazze.com",
  },
];
