"use client";

import Link from "next/link";
import { Button } from "antd";
import { LuMenu as MenuIcon, LuX } from "react-icons/lu";
import { useState } from "react";
import { Logo } from "../../ui/logos/logo";
import { MainNav } from "./main-nav";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";
import { ROUTES } from "@/consts/routes";

const Header = () => {
  const isAuth = false;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={ROUTES.PUBLIC.HOME} className="flex items-center">
              <Logo className="h-6 w-auto text-black" />
            </Link>

            <MainNav isAuth={isAuth} />
          </div>

          {!isAuth ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href={ROUTES.PUBLIC.AUTH.LOGIN}
                className="text-gray-700 hover:bg-primary/10 py-2 px-4 rounded-md transition-colors"
              >
                Iniciar sesión
              </Link>

              <Link href={ROUTES.PUBLIC.AUTH.REGISTER}>
                <Button type="primary" size="large">
                  Registrarse
                </Button>
              </Link>
            </div>
          ) : (
            <UserMenu />
          )}

          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <LuX size={24} className="text-gray-600" />
            ) : (
              <MenuIcon size={24} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          isAuth={isAuth}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>
    </header>
  );
};

export default Header;
