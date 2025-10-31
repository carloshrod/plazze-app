"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, Spin, Empty } from "antd";
import { LuClock, LuMapPin } from "react-icons/lu";
import { ROUTES } from "@/consts/routes";
import { usePlazzeStore } from "@/stores/plazze";

const PlazzesList = () => {
  const { plazzes, loading, error } = usePlazzeStore();

  // Obtener el día actual
  const getCurrentDay = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ] as const;
    const today = new Date().getDay();
    return days[today];
  };

  // Obtener horarios del día actual de forma segura
  const getTodayHours = (plazze: (typeof plazzes)[0]) => {
    const currentDay = getCurrentDay();
    if (!plazze.opening_hours) return "No especificado";

    const todayHours = plazze.opening_hours[currentDay];
    return todayHours && todayHours.open && todayHours.close
      ? `${todayHours.open} - ${todayHours.close}`
      : "No especificado";
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <Empty description={error} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  if (!plazzes.length) {
    return (
      <div className="flex justify-center items-center py-12">
        <Empty
          description={
            <div className="text-center">
              <p className="text-gray-500 mb-2">No se encontraron plazzes</p>
            </div>
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {plazzes.map((plazze) => (
        <Link
          key={plazze.id}
          href={ROUTES.PUBLIC.PLAZZES.DETAIL(plazze.id)}
          className="group relative block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Imagen */}
            <div className="relative w-full h-48 sm:w-[40%] sm:h-auto">
              <Image
                src={
                  plazze.gallery?.[0]?.url ||
                  plazze.image ||
                  "https://images.unsplash.com/photo-1464808322410-1a934aab61e5?w=800"
                }
                alt={plazze.name}
                className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none object-cover"
                fill
                sizes="(max-width: 640px) 100vw, 256px"
                priority={plazze.id === "1"}
              />
            </div>

            {/* Contenido */}
            <div className="p-4 flex-1">
              <div className="mb-4">
                <h3
                  className="text-lg font-semibold text-gray-900 mb-1"
                  dangerouslySetInnerHTML={{
                    __html: plazze.name || "",
                  }}
                />
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <LuMapPin size={16} />
                  {plazze.region || "Ubicación no especificada"}
                </p>
              </div>

              {/* Overlay con botón */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  type="primary"
                  size="large"
                  className="scale-90 group-hover:scale-100 transition-transform duration-300"
                >
                  Ver detalles
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                <span
                  className="line-clamp-2"
                  dangerouslySetInnerHTML={{
                    __html: plazze.description || "",
                  }}
                />
              </p>

              <div className="flex flex-wrap gap-4 mt-auto">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <LuClock size={16} />
                  {getTodayHours(plazze)}
                </span>
                <span className="text-lg font-semibold text-primary">
                  ${plazze.pricing.price_min} - ${plazze.pricing.price_max}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PlazzesList;
