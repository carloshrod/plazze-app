/* eslint-disable no-unused-vars */
"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialCoordinates?: { lat: number; lng: number } | null;
}

// Componente para manejar eventos del mapa
function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export default function MapSelector({
  onLocationSelect,
  initialCoordinates,
}: MapSelectorProps) {
  // Coordenadas por defecto (Ciudad de Panamá)
  const defaultPosition: [number, number] = [
    initialCoordinates?.lat || 8.9824,
    initialCoordinates?.lng || -79.5199,
  ];

  return (
    <div className="h-64 w-full border border-gray-300 rounded-lg overflow-hidden">
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador inicial si hay coordenadas */}
        {initialCoordinates && <Marker position={defaultPosition} />}

        {/* Componente para manejar clicks y agregar marcadores */}
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}
