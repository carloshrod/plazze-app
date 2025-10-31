"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { usePlazzeStore } from "@/stores/plazze";
import { Plazze } from "@/types/plazze";

interface MapClientProps {
  center?: [number, number];
  zoom?: number;
  showPopup?: boolean;
  className?: string;
  singleMarker?: boolean; // Nueva prop para mostrar solo el centro como marker
  singlePlazze?: Plazze; // Plazze específico para mostrar en modo singleMarker
}

const MapClient = ({
  center = [9.0746, -79.4455], // Panamá por defecto
  zoom = 12,
  showPopup = true,
  className = "h-[calc(100vh-200px)] w-full rounded-lg z-0",
  singleMarker = false, // Nueva prop
  singlePlazze, // Plazze específico para modo singleMarker
}: MapClientProps) => {
  const { plazzes } = usePlazzeStore();

  // Función helper para validar y parsear coordenadas
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

  // Filtrar plazzes que tengan coordenadas válidas
  const validPlazzes = plazzes.filter((plazze) => {
    const coords = parseCoordinates(plazze.latitude, plazze.longitude);
    return coords !== null;
  });

  return (
    <MapContainer center={center} zoom={zoom} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Si singleMarker es true, solo mostrar el marker del centro */}
      {singleMarker ? (
        <Marker position={center}>
          {showPopup && singlePlazze && (
            <Popup>
              <div className="text-sm">
                <h3
                  className="font-semibold mb-1"
                  dangerouslySetInnerHTML={{ __html: singlePlazze.name || "" }}
                />
                <p className="text-gray-600">{singlePlazze.address}</p>
                <p className="text-primary font-semibold mt-1">
                  $
                  {singlePlazze.pricing?.price_min ||
                    singlePlazze.price_min ||
                    0}{" "}
                  - $
                  {singlePlazze.pricing?.price_max ||
                    singlePlazze.price_max ||
                    0}
                </p>
              </div>
            </Popup>
          )}
          {showPopup && singlePlazze && (
            <Tooltip
              direction="top"
              offset={[0, -8]}
              opacity={1}
              permanent
              className="bg-white px-2 py-1 rounded shadow-md border border-gray-200"
            >
              <span
                dangerouslySetInnerHTML={{ __html: singlePlazze.name || "" }}
              />
            </Tooltip>
          )}
        </Marker>
      ) : (
        /* Mostrar todos los plazzes del store */
        validPlazzes.map((plazze) => {
          const coordinates = parseCoordinates(
            plazze.latitude,
            plazze.longitude
          );

          // Esta verificación es redundante pero añade seguridad extra
          if (!coordinates) return null;

          return (
            <Marker key={plazze.id} position={coordinates}>
              {showPopup && (
                <Popup>
                  <div className="text-sm">
                    <h3
                      className="font-semibold mb-1"
                      dangerouslySetInnerHTML={{ __html: plazze.name || "" }}
                    />
                    <p className="text-gray-600">{plazze.address}</p>
                    <p className="text-primary font-semibold mt-1">
                      ${plazze.pricing?.price_min || plazze.price_min || 0} - $
                      {plazze.pricing?.price_max || plazze.price_max || 0}
                    </p>
                  </div>
                </Popup>
              )}
              {showPopup && (
                <Tooltip
                  direction="top"
                  offset={[0, -8]}
                  opacity={1}
                  permanent
                  className="bg-white px-2 py-1 rounded shadow-md border border-gray-200"
                >
                  <span
                    dangerouslySetInnerHTML={{ __html: plazze.name || "" }}
                  />
                </Tooltip>
              )}
            </Marker>
          );
        })
      )}
    </MapContainer>
  );
};

export default MapClient;
