"use client";

import Link from "next/link";
import { ROUTES } from "@/consts/routes";

interface MainNavProps {
  isAuth: boolean;
}

export function MainNav({ isAuth }: MainNavProps) {
  return (
    <nav className="hidden md:flex items-center space-x-8 ml-16">
      <Link
        href={ROUTES.PUBLIC.PLAZZES.LIST}
        className="text-gray-700 hover:text-primary transition-colors"
      >
        Explorar
      </Link>
      {!isAuth && (
        <Link
          href={ROUTES.PUBLIC.AUTH.LOGIN}
          className="text-gray-700 hover:text-primary transition-colors"
        >
          Soy un Plazzer
        </Link>
      )}
    </nav>
  );
}
