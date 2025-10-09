"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "antd";
import { LuLogOut, LuUser } from "react-icons/lu";
import { useAuthService } from "@/service/auth";
import { ROUTES } from "@/consts/routes";

interface MobileMenuProps {
  isOpen: boolean;
  isAuth: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, isAuth, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuthService();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (typeof document !== "undefined" && isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="md:hidden fixed inset-0 top-16 bg-black/20 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Menu */}
      <div
        ref={menuRef}
        className="md:hidden fixed inset-x-0 top-16 bg-white border-t border-gray-200 shadow-lg z-10"
      >
        <div className="max-w-7xl mx-auto">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href={ROUTES.PUBLIC.PLAZZES.LIST}
              className="text-gray-700 hover:text-primary transition-colors px-2 py-1"
              onClick={onClose}
            >
              Explorar
            </Link>
            {!isAuth ? (
              <>
                <Link
                  href={ROUTES.PUBLIC.AUTH.LOGIN}
                  className="text-gray-700 hover:text-primary transition-colors px-2 py-1"
                  onClick={onClose}
                >
                  Soy un Plazzer
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  <Link
                    href={ROUTES.PUBLIC.AUTH.LOGIN}
                    onClick={onClose}
                    className="text-center text-gray-700 hover:bg-primary/10 py-2 px-4 rounded-md transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                  <Link href={ROUTES.PUBLIC.AUTH.REGISTER} onClick={onClose}>
                    <Button type="primary" size="large" block>
                      Registrarse
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.ADMIN.DASHBOARD}
                  className="text-gray-700 hover:text-primary transition-colors px-2 py-1"
                  onClick={onClose}
                >
                  Mi Panel
                </Link>

                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                  <Link
                    href={ROUTES.ADMIN.PROFILE}
                    className="flex items-center justify-center space-x-2 text-gray-700 rounded-md hover:text-primary hover:bg-primary/10 transition-colors px-2 py-1"
                    onClick={onClose}
                  >
                    <LuUser size={20} />
                    <span>Mi Perfil</span>
                  </Link>
                  <button
                    className="flex items-center justify-center space-x-2 text-red-500 rounded-md hover:text-white hover:bg-red-500 transition-colors px-2 py-1"
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                  >
                    <LuLogOut size={20} />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
