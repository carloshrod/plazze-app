/* eslint-disable no-unused-vars */
"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Input } from "antd";

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialCoordinates?: { lat: number; lng: number } | null;
  isVisible?: boolean;
}

function isValidCoords(
  coords: { lat: number; lng: number } | null | undefined,
): coords is { lat: number; lng: number } {
  return (
    coords != null &&
    isFinite(coords.lat) &&
    isFinite(coords.lng) &&
    (coords.lat !== 0 || coords.lng !== 0)
  );
}

// Maneja clicks en el mapa
function ClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapSelector({
  onLocationSelect,
  initialCoordinates,
  isVisible = true,
}: MapSelectorProps) {
  const mapRef = useRef<L.Map | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(isValidCoords(initialCoordinates) ? initialCoordinates : null);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const defaultCenter: [number, number] = isValidCoords(initialCoordinates)
    ? [initialCoordinates!.lat, initialCoordinates!.lng]
    : [8.9824, -79.5199];

  // Sincronizar con coordenadas iniciales (ej: al abrir en modo edición)
  useEffect(() => {
    if (isValidCoords(initialCoordinates)) {
      setMarkerPosition(initialCoordinates!);
    } else {
      setMarkerPosition(null);
    }
  }, [initialCoordinates?.lat, initialCoordinates?.lng]);

  // Invalidar tamaño del mapa cuando se vuelve visible
  useEffect(() => {
    if (isVisible && mapRef.current) {
      const id = setTimeout(() => mapRef.current?.invalidateSize(), 100);
      return () => clearTimeout(id);
    }
  }, [isVisible]);

  // Bounding box de Panamá: west, south, east, north
  const PANAMA_VIEWBOX = "-83.0517,7.1979,-77.1537,9.6437";

  const geocodeAndMove = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const baseUrl = "https://nominatim.openstreetmap.org/search";
      const headers = { "Accept-Language": "es" };

      // Primera búsqueda: restringida a Panamá
      let res = await fetch(
        `${baseUrl}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=pa&viewbox=${PANAMA_VIEWBOX}&bounded=1`,
        { headers },
      );
      let data = await res.json();

      // Fallback: búsqueda global si no hay resultados en Panamá
      if (!data[0]) {
        res = await fetch(
          `${baseUrl}?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=pa`,
          { headers },
        );
        data = await res.json();
      }

      if (data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        if (isFinite(lat) && isFinite(lng)) {
          setMarkerPosition({ lat, lng });
          onLocationSelect(lat, lng, data[0].display_name);
          mapRef.current?.flyTo([lat, lng], 15, {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.1,
          });
        }
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce al escribir (700 ms)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (value.trim()) {
      debounceTimer.current = setTimeout(() => geocodeAndMove(value), 700);
    }
  };

  // Búsqueda inmediata al presionar Enter o el botón
  const handleSearchSubmit = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    geocodeAndMove(searchValue);
  };

  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition({ lat, lng });
    onLocationSelect(lat, lng);
  };

  const handleMarkerDragEnd = (e: L.LeafletEvent) => {
    const { lat, lng } = (e.target as L.Marker).getLatLng();
    setMarkerPosition({ lat, lng });
    onLocationSelect(lat, lng);
  };

  if (!isVisible) {
    return (
      <div className="h-64 w-full border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">Mapa cargando...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Buscador de dirección con debounce */}
      <Input.Search
        placeholder="Buscar dirección o lugar..."
        value={searchValue}
        onChange={handleSearchChange}
        onSearch={handleSearchSubmit}
        loading={isSearching}
        allowClear
        onClear={() => setSearchValue("")}
        enterButton
      />

      <div className="h-64 w-full border border-gray-300 rounded-lg overflow-hidden">
        <MapContainer
          center={defaultCenter}
          zoom={markerPosition ? 15 : 10}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          ref={mapRef}
          whenReady={() => {
            setTimeout(() => mapRef.current?.invalidateSize(), 50);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Escucha clicks en el mapa */}
          <ClickHandler onClick={handleMapClick} />

          {/* Marcador único y draggable */}
          {markerPosition && (
            <Marker
              position={[markerPosition.lat, markerPosition.lng]}
              draggable
              eventHandlers={{ dragend: handleMarkerDragEnd }}
            />
          )}
        </MapContainer>
      </div>

      {markerPosition && (
        <p className="text-xs text-gray-400">
          {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)} —
          Arrastra el pin para ajustar la posición exacta
        </p>
      )}
    </div>
  );
}
