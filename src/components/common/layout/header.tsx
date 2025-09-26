"use client";

import Link from "next/link";
import { Button } from "antd";
import { User, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "../ui/logos/logo";

const Header = () => {
  const isAuth = false;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Logo className="h-6 w-auto text-black" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/sitios"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Explorar
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Soy un Plazzer
            </Link>
          </nav>

          {!isAuth && (
            <Link href="/auth/registro" className="hidden md:flex">
              <Button type="primary">Registrarse</Button>
            </Link>
          )}

          <div className="hidden md:flex items-center space-x-4">
            {isAuth ? (
              <Link href="#">
                <Button
                  type="text"
                  icon={<User size={20} />}
                  className="text-gray-700 hover:text-green-600"
                />
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="text" color="primary">
                  Iniciar sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Botón de menú móvil */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-gray-600" />
            ) : (
              <MenuIcon size={24} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        <div
          className={`md:hidden ${
            isMobileMenuOpen ? "block" : "hidden"
          } py-4 border-t border-gray-200`}
        >
          <nav className="flex flex-col space-y-4">
            <Link
              href="/sitios"
              className="text-gray-700 hover:text-primary transition-colors px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explorar
            </Link>
            <Link
              href="/como-funciona"
              className="text-gray-700 hover:text-primary transition-colors px-2 py-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Soy un Plazzer
            </Link>

            {!isAuth ? (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                <Link
                  href="/registro"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button type="primary" block>
                    Registrarse
                  </Button>
                </Link>

                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="text" color="primary" block>
                    Iniciar sesión
                  </Button>
                </Link>
              </div>
            ) : (
              <Link
                href="/cuenta"
                className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={20} />
                <span>Mi cuenta</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
