"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/consts/routes";
import { cn } from "@/libs/cn";

interface MainNavProps {
  isAuth: boolean;
  isTransparent?: boolean;
}

const LANDING_SECTIONS = [
  { label: "Destacados", href: "#destacados", id: "destacados" },
  { label: "Populares", href: "#populares", id: "populares" },
  { label: "Categorías", href: "#categorias", id: "categorias" },
  { label: "Para Plazzers", href: "#plazzer", id: "plazzer" },
];

const OBSERVED_SECTION_IDS = [
  "hero",
  "destacados",
  "populares",
  "categorias",
  "plazzer",
];

export function MainNav({ isAuth, isTransparent = false }: MainNavProps) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (!isHomepage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-64px 0px 0px 0px" },
    );

    OBSERVED_SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isHomepage]);

  const isPlazzeDetail = /^\/plazzes\/\d+/.test(pathname);

  return (
    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 ml-6 xl:ml-16">
      {isHomepage ? (
        LANDING_SECTIONS.map(({ label, href, id }) => {
          const isActive = activeSection === id;
          return (
            <a
              key={href}
              href={href}
              className={cn(
                "transition-colors",
                isTransparent
                  ? isActive
                    ? "text-white font-semibold"
                    : "text-white/80 hover:text-white"
                  : isActive
                    ? "text-primary font-semibold"
                    : "text-gray-700 hover:text-primary",
              )}
            >
              {label}
            </a>
          );
        })
      ) : isPlazzeDetail ? (
        <Link
          href={ROUTES.PUBLIC.PLAZZES.LIST}
          className="text-gray-700 hover:text-primary transition-colors"
        >
          Explorar
        </Link>
      ) : null}
    </nav>
  );
}
