/* eslint-disable no-unused-vars */
"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialCoordinates?: { lat: number; lng: number } | null;
  isVisible?: boolean; // Prop para indicar si el modal/componente es visible
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
  isVisible = true,
}: MapSelectorProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [key, setKey] = useState(0); // Key para forzar re-render del mapa

  // Coordenadas por defecto (Ciudad de Panamá)
  const defaultPosition: [number, number] = [
    initialCoordinates?.lat || 8.9824,
    initialCoordinates?.lng || -79.5199,
  ];

  // Invalidar el tamaño del mapa cuando se vuelve visible
  useEffect(() => {
    if (isVisible && mapRef.current) {
      // Usar un timeout para asegurar que el DOM esté listo
      const timeoutId = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isVisible]);

  // Regenerar el mapa cuando las coordenadas iniciales cambien
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [initialCoordinates?.lat, initialCoordinates?.lng]);

  if (!isVisible) {
    return (
      <div className="h-64 w-full border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">Mapa cargando...</span>
      </div>
    );
  }

  return (
    <div className="h-64 w-full border border-gray-300 rounded-lg overflow-hidden">
      <MapContainer
        key={key} // Forzar re-render cuando sea necesario
        center={defaultPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
        ref={mapRef}
        whenReady={() => {
          // Invalidar tamaño cuando el mapa esté listo
          setTimeout(() => {
            if (mapRef.current) {
              mapRef.current.invalidateSize();
            }
          }, 50);
        }}
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
