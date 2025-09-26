import { notFound } from "next/navigation";
import { mockSites } from "@/mock/sites";
import { BookingForm } from "@/components/features/site-detail/booking-form";
import { SiteImages } from "@/components/features/site-detail/site-images";
import { SiteInfo } from "@/components/features/site-detail/site-info";
import { Site } from "@/types/site";
import { Bookmark, MapPin } from "lucide-react";
import { Button } from "antd";

interface SiteDetailPageProps {
  params: {
    id: string;
  };
}

export default function SiteDetailPage({ params }: SiteDetailPageProps) {
  const site = mockSites.find((site: Site) => site.id === params.id);

  // Simular autenticación
  const isAuthenticated = false;

  if (!site) {
    notFound();
  }

  // Simular múltiples imágenes (en producción vendrían de la API)
  const images = [site.image, site.image, site.image, site.image];

  return (
    <main className="min-h-screen bg-gray-50 px-12">
      {/* Header con título y ubicación */}
      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
            {isAuthenticated ? (
              <Button
                type="text"
                icon={
                  <Bookmark
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
                <Bookmark size={20} />
                <span className="text-sm">Inicia sesión para guardar</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={20} />
            <span>{site.location}</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SiteImages images={images} />
            <div className="mt-8">
              <SiteInfo site={site} />
            </div>
          </div>
          <div className="relative">
            <div className="sticky top-20 bg-gray-50 pt-8 -mt-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reservar este lugar
                </h2>
              </div>
              <BookingForm site={site} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
