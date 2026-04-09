"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, Skeleton } from "antd";
import { LuMenu as MenuIcon, LuX } from "react-icons/lu";
import { Logo } from "../../ui/logos/logo";
import { MainNav } from "./main-nav";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";
import { useAuthStore } from "@/stores/auth";
import { ROUTES } from "@/consts/routes";
import { cn } from "@/libs/cn";

const HERO_THRESHOLD = 500;

const Header = () => {
  const pathname = usePathname();
  const { isAuthenticated: isAuth, isLoadingAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const isHomepage = pathname === "/";
  const isTransparent =
    isHomepage && scrollY < HERO_THRESHOLD && !isMobileMenuOpen;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        isTransparent
          ? "bg-transparent border-transparent"
          : "bg-white border-b border-gray-200",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={ROUTES.PUBLIC.HOME} className="flex items-center">
              <Logo
                className={cn(
                  "h-6 w-auto",
                  isTransparent ? "text-white" : "text-black",
                )}
              />
            </Link>

            {isLoadingAuth ? (
              <div className="hidden lg:flex items-center ml-6">
                <Skeleton.Input active className="!w-64" />
              </div>
            ) : (
              <MainNav isAuth={isAuth} isTransparent={isTransparent} />
            )}
          </div>

          {isLoadingAuth ? (
            <div className="hidden lg:flex items-center">
              <Skeleton.Input active className="!w-64" />
            </div>
          ) : !isAuth ? (
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href={ROUTES.PUBLIC.AUTH.LOGIN}
                className={cn(
                  "py-2 px-4 rounded-md transition-colors",
                  isTransparent
                    ? "text-white hover:bg-white/20"
                    : "text-gray-700 hover:bg-primary/10",
                )}
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
            <UserMenu isTransparent={isTransparent} />
          )}

          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isTransparent ? "hover:bg-white/20" : "hover:bg-gray-100",
            )}
          >
            {isMobileMenuOpen ? (
              <LuX
                size={24}
                className={isTransparent ? "text-white" : "text-gray-600"}
              />
            ) : (
              <MenuIcon
                size={24}
                className={isTransparent ? "text-white" : "text-gray-600"}
              />
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
