import { notFound } from "next/navigation";
import { Button } from "antd";
import { LuBookmark, LuMapPin } from "react-icons/lu";
import { SiteImages } from "@/components/features/plazzes/plazze-detail/site-images";
import { BookingForm } from "@/components/features/plazzes/plazze-detail/booking-form";
import { SiteInfo } from "@/components/features/plazzes/plazze-detail/site-info";
import { ScrollToBookingButton } from "@/components/common/ui/scroll-to-booking-button";
import { mockSites } from "@/mock/sites";
import { Site } from "@/types/site";

interface PlazzeDetailPageProps {
  params: {
    id: string;
  };
}

export default function PlazzeDetailPage({ params }: PlazzeDetailPageProps) {
  const site = mockSites.find((site: Site) => site.id === params.id);

  // Simular autenticación
  const isAuthenticated = false;

  if (!site) {
    notFound();
  }

  // Simular múltiples imágenes (en producción vendrían de la API)
  const images = [site.image, site.image, site.image, site.image];

  return (
    <main className="min-h-screen bg-gray-50 px-6 md:px-12">
      {/* Header con título y ubicación */}
      <div className="pt-8 space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
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
            <span>{site.location}</span>
          </div>
        </div>

        <SiteImages images={images} />
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
              <BookingForm site={site} />
            </div>
          </div>

          {/* Información del sitio - Después del formulario en móvil, a la izquierda en desktop */}
          <div className="lg:col-span-2 lg:row-start-1">
            <SiteInfo site={site} />
          </div>
        </div>

        <ScrollToBookingButton />
      </div>
    </main>
  );
}
