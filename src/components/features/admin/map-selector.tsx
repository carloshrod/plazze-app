/* eslint-disable no-unused-vars */
"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in React-Leaflet
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

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

// Carga única del SDK de Google Maps
// Usamos window para sobrevivir recargas de HMR en desarrollo
type WindowWithGmaps = typeof window & { __gmapsOptionsSet?: boolean };
let googleMapsLoading: Promise<void> | null = null;

function getGoogleMapsLoader(): Promise<void> {
  if (googleMapsLoading) return googleMapsLoading;

  const win = window as WindowWithGmaps;
  if (!win.__gmapsOptionsSet) {
    setOptions({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      v: "weekly",
      language: "es",
      region: "PA",
    });
    win.__gmapsOptionsSet = true;
  }

  googleMapsLoading = Promise.all([
    importLibrary("maps"),
    importLibrary("places"),
  ]).then(() => {});

  return googleMapsLoading;
}

interface Suggestion {
  placeId: string;
  description: string;
}

export default function MapSelector({
  onLocationSelect,
  initialCoordinates,
  isVisible = true,
}: MapSelectorProps) {
  const mapRef = useRef<L.Map | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(isValidCoords(initialCoordinates) ? initialCoordinates : null);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const defaultCenter: [number, number] = isValidCoords(initialCoordinates)
    ? [initialCoordinates!.lat, initialCoordinates!.lng]
    : [8.9824, -79.5199];

  // Cargar Google Maps SDK una sola vez
  useEffect(() => {
    getGoogleMapsLoader()
      .then(() => {
        sessionTokenRef.current =
          new google.maps.places.AutocompleteSessionToken();
        setGoogleReady(true);
      })
      .catch((err) => {
        console.error("Error cargando Google Maps:", err);
      });
  }, []);

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

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Obtener sugerencias con la nueva API de Places
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!googleReady || !query.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      setIsSearching(true);
      try {
        const { suggestions: rawSuggestions } =
          await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            {
              input: query,
              sessionToken: sessionTokenRef.current ?? undefined,
              includedRegionCodes: ["pa"],
            },
          );
        const results: Suggestion[] = rawSuggestions
          .map((s) => s.placePrediction)
          .filter(Boolean)
          .map((p) => ({
            placeId: p!.placeId,
            description: p!.text.toString(),
          }));
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    },
    [googleReady],
  );

  // Selección de una sugerencia con la nueva API Place
  const handleSelectSuggestion = async (suggestion: Suggestion) => {
    setSearchValue(suggestion.description);
    setSuggestions([]);
    setShowDropdown(false);
    setActiveIndex(-1);
    try {
      const place = new google.maps.places.Place({ id: suggestion.placeId });
      await place.fetchFields({ fields: ["location", "formattedAddress"] });
      if (place.location) {
        const lat = place.location.lat();
        const lng = place.location.lng();
        setMarkerPosition({ lat, lng });
        onLocationSelect(
          lat,
          lng,
          place.formattedAddress || suggestion.description,
        );
        mapRef.current?.flyTo([lat, lng], 16, {
          animate: true,
          duration: 1.2,
          easeLinearity: 0.1,
        });
      }
      // Renovar session token después de una selección
      sessionTokenRef.current =
        new google.maps.places.AutocompleteSessionToken();
    } catch (err) {
      console.error("Error obteniendo detalles del lugar:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setActiveIndex(-1);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (value.trim()) {
      debounceTimer.current = setTimeout(() => fetchSuggestions(value), 300);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelectSuggestion(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
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
      {/* Buscador con autocompletado de Google Places */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
              placeholder="Buscar dirección o lugar..."
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {isSearching && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Dropdown de sugerencias */}
        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-[9999] left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((s, i) => (
              <button
                key={s.placeId}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectSuggestion(s);
                }}
                className={`w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                  i === activeIndex
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700"
                } ${i < suggestions.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <span className="mr-2 text-gray-400">📍</span>
                {s.description}
              </button>
            ))}
            <div className="px-3 py-1.5 border-t border-gray-100 flex justify-end">
              <Image
                src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3.png"
                alt="Powered by Google"
                width={0}
                height={0}
                style={{ width: "auto", height: "16px" }}
                unoptimized
              />
            </div>
          </div>
        )}
      </div>

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
          {/* Tile layer de Google Maps */}
          <TileLayer
            attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            maxZoom={20}
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
