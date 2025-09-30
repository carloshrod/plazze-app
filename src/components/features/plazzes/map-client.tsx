"use client";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Site } from "@/types/site";

interface SitesMapProps {
  sites: Site[];
  center?: [number, number];
  zoom?: number;
  showPopup?: boolean;
  className?: string;
}

const MapClient = ({
  sites,
  center = [9.0746, -79.4455], // Panamá por defecto
  zoom = 12,
  showPopup = true,
  className = "h-[calc(100vh-200px)] w-full rounded-lg z-0",
}: SitesMapProps) => {
  return (
    <MapContainer center={center} zoom={zoom} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sites.map((site) => (
        <Marker
          key={site.id}
          position={[site.coordinates.lat, site.coordinates.lng]}
        >
          {showPopup && (
            <Popup>
              <div className="text-sm">
                <h3 className="font-semibold mb-1">{site.name}</h3>
                <p className="text-gray-600">{site.location}</p>
                <p className="text-primary font-semibold mt-1">
                  ${site.price}/hora
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
              {site.name}
            </Tooltip>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapClient;
