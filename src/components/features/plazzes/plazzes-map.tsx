"use client";

import dynamic from "next/dynamic";
import { usePlazzeStore } from "@/stores/plazze";
import { Plazze } from "@/types/plazze";

interface PlazzesMapProps {
  center?: [number, number];
  zoom?: number;
  singleMarker?: boolean;
  singlePlazze?: Plazze;
}

const MapClient = dynamic(() => import("./map-client"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="h-[calc(100vh-200px)] w-full rounded-lg z-0 flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Cargando mapa...</div>
      </div>
    </div>
  ),
});

const PlazzesMap = ({
  center,
  zoom = 10,
  singleMarker = false,
  singlePlazze,
}: PlazzesMapProps) => {
  const { plazzes } = usePlazzeStore();

  // Función helper para validar y parsear coordenadas de forma segura
  const parseCoordinates = (
    lat: string,
    lng: string
  ): [number, number] | null => {
    try {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

      // Validar que son números válidos
      if (isNaN(latitude) || isNaN(longitude)) {
        return null;
      }

      // Validar rangos válidos de coordenadas
      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return null;
      }

      return [latitude, longitude];
    } catch {
      return null;
    }
  };

  const defaultCenter: [number, number] = (() => {
    // Si hay un centro especificado, usarlo
    if (center) {
      return center;
    }

    // Buscar el primer plazze con coordenadas válidas
    for (const plazze of plazzes) {
      const coords = parseCoordinates(plazze.latitude, plazze.longitude);
      if (coords) {
        return coords;
      }
    }

    // Fallback a coordenadas de Panamá si no hay plazzes válidos
    return [9.0746, -79.4455];
  })();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 h-full">
      <div className="h-full rounded-lg overflow-hidden">
        <MapClient
          center={defaultCenter}
          zoom={zoom}
          singleMarker={singleMarker}
          singlePlazze={singlePlazze}
        />
      </div>
    </div>
  );
};

export default PlazzesMap;
