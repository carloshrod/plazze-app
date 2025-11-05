"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Button, Spin } from "antd";
import { LuBookmark, LuMapPin } from "react-icons/lu";
import { PlazzeImages } from "@/components/features/plazzes/plazze-detail/plazze-images";
import { BookingForm } from "@/components/features/plazzes/plazze-detail/booking-form";
import { PlazzeInfo } from "@/components/features/plazzes/plazze-detail/plazze-info";
import { ScrollToBookingButton } from "@/components/common/ui/scroll-to-booking-button";
import { usePlazzeService } from "@/services/plazze";
import { Plazze } from "@/types/plazze";
import { useAuthStore } from "@/stores/auth";

interface PlazzeDetailPageProps {
  params: {
    id: string;
  };
}

export default function PlazzeDetailPage({ params }: PlazzeDetailPageProps) {
  const [plazze, setPlazze] = useState<Plazze | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchPlazzeById } = usePlazzeService();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const loadPlazze = async () => {
      try {
        setLoading(true);

        const data = await fetchPlazzeById(parseInt(params.id));

        if (data) {
          setPlazze(data);
        } else {
          console.error("❌ No se encontró plazze con ID:", params.id);
          notFound();
        }
      } catch (error) {
        console.error("❌ Error al cargar plazze:", error);
        setError(error instanceof Error ? error.message : "Error desconocido");
        notFound();
      } finally {
        setLoading(false);
      }
    };

    if (params.id && !isNaN(parseInt(params.id))) {
      loadPlazze();
    } else {
      console.error("❌ ID inválido:", params.id);
      notFound();
    }
  }, [params.id, fetchPlazzeById]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!plazze) {
    notFound();
  }

  // Usar imágenes reales del plazze (galería completa)
  const images: string[] = [];

  // Agregar todas las imágenes de la galería si existen
  if (plazze.gallery && Array.isArray(plazze.gallery)) {
    const galleryUrls = plazze.gallery.map((img) =>
      typeof img === "string" ? img : img.url
    );
    images.push(...galleryUrls);
  }

  // Fallback a imagen principal si existe
  if (images.length === 0 && plazze.image) {
    images.push(plazze.image);
  }

  // Filtrar valores vacíos o undefined
  const finalImages = images.filter(Boolean);

  // Si no hay imágenes, usar una imagen por defecto
  if (finalImages.length === 0) {
    finalImages.push(
      "https://images.unsplash.com/photo-1464808322410-1a934aab61e5?w=800"
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 md:px-12">
      {/* Header con título y ubicación */}
      <div className="pt-8 space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <h1
              className="text-3xl font-bold text-gray-900"
              dangerouslySetInnerHTML={{ __html: plazze.name }}
            />
            {isAuthenticated ? (
              <Button
                type="text"
                icon={
                  <LuBookmark
                    size={20}
                    className="text-gray-500 group-hover:text-primary"
                  />
                }
                className="group flex items-center gap-2 px-3 !py-6 h-auto hover:bg-gray-100 hover:text-primary rounded-full"
              >
                <span className="text-sm text-gray-500 group-hover:text-primary transition-colors">
                  Guardar sitio
                </span>
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <LuBookmark size={20} />
                <span className="text-sm">Inicia sesión para guardar</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <LuMapPin size={20} />
            <span>{`${plazze?.address}${
              plazze?.friendly_address ? `, ${plazze.friendly_address}` : ""
            }`}</span>
          </div>
        </div>

        <PlazzeImages images={finalImages} />
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Formulario de reserva - Visible primero en móvil, a la derecha en desktop */}
          <div className="md:col-start-2 lg:col-start-3 md:row-start-1">
            <div id="booking-form" className="sticky top-20 bg-gray-50">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reservar este lugar
                </h2>
              </div>
              <BookingForm plazze={plazze} />
            </div>
          </div>

          {/* Información del sitio - Después del formulario en móvil, a la izquierda en desktop */}
          <div className="lg:col-span-2 lg:row-start-1">
            <PlazzeInfo plazze={plazze} />
          </div>
        </div>

        <ScrollToBookingButton />
      </div>
    </main>
  );
}
