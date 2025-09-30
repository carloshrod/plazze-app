import { ROUTES } from "@/consts/routes";
import {
  LuFacebook,
  LuInstagram,
  LuMail,
  LuMapPin,
  LuPhone,
  LuTwitter,
} from "react-icons/lu";

export const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: LuFacebook,
  },
  {
    name: "Instagram",
    href: "#",
    icon: LuInstagram,
  },
  {
    name: "Twitter",
    href: "#",
    icon: LuTwitter,
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
