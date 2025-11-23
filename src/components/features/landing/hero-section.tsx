"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import SearchBar from "@/components/common/ui/search-bar";
import { ROUTES } from "@/consts/routes";
import { usePlazzeService } from "@/services/plazze";
import { usePlazzeStore } from "@/stores/plazze";

const HeroSection = () => {
  const { trendingPlazzes } = usePlazzeStore();
  const { fetchTrendingPlazzes } = usePlazzeService();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchTrendingPlazzes();
  }, []);

  // Obtener imágenes de los plazzes
  const backgroundImages = trendingPlazzes
    .filter((plazze) => plazze.image)
    .map((plazze) => plazze.image);

  // Cambiar imagen cada 5 segundos
  useEffect(() => {
    if (backgroundImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === backgroundImages.length - 1 ? 0 : prev + 1
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="py-8 relative overflow-hidden">
      {/* Carousel de imágenes de fondo */}
      {backgroundImages.length > 0 && (
        <div className="absolute inset-0 w-full h-full">
          {backgroundImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay oscuro para mejorar legibilidad del texto */}
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>
      )}

      {/* Fallback si no hay imágenes */}
      {backgroundImages.length === 0 && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      )}

      {/* Contenido principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-24">
          <h1
            className={`text-4xl md:text-6xl font-bold mb-6 ${
              backgroundImages.length > 0 ? "text-white" : "text-gray-900"
            }`}
          >
            Busca, Encuentra y Reserva
          </h1>
          <p
            className={`text-xl mb-8 max-w-2xl mx-auto ${
              backgroundImages.length > 0 ? "text-white/90" : "text-gray-600"
            }`}
          >
            Espacios únicos para eventos, reuniones, talleres y experiencias
            inolvidables
          </p>

          {/* Barra de búsqueda */}
          <SearchBar />
        </div>

        <div>
          <Link
            href={ROUTES.PUBLIC.PLAZZES.LIST}
            className={`inline-flex justify-center text-2xl px-4 py-2 rounded-md font-semibold transition-colors group text-primary ${
              backgroundImages.length > 0
                ? "hover:bg-primary/20"
                : "hover:text-primary/80 hover:bg-primary/10"
            }`}
          >
            Explorar plazzes
            <LuArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Indicadores del carousel */}
      {backgroundImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
