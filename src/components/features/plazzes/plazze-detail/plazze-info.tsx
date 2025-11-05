import { Tag, Collapse } from "antd";
import { LuClock, LuTags, LuUsers, LuMapPin } from "react-icons/lu";
import PlazzesMap from "../plazzes-map";
import { Plazze } from "@/types/plazze";
import { BookableServices } from "./bookable-services";
import { getAllHours, getTodayHours } from "@/utils/hours";

interface PlazzeInfoProps {
  plazze: Plazze;
}

export const PlazzeInfo = ({ plazze }: PlazzeInfoProps) => {
  // Función helper para validar coordenadas
  const getValidCoordinates = (): [number, number] | null => {
    try {
      const lat = parseFloat(plazze.latitude);
      const lng = parseFloat(plazze.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        return null;
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return null;
      }

      return [lat, lng];
    } catch {
      return null;
    }
  };

  const coordinates = getValidCoordinates();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Descripción
        </h2>
        <div
          className="text-gray-700"
          dangerouslySetInnerHTML={{ __html: plazze.description || "" }}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Detalles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <LuMapPin className="text-gray-500" size={24} />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Ubicación</p>
              <p className="text-gray-600 text-sm">
                {plazze.address || "No especificada"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuClock className="text-gray-500" size={24} />
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                Horario de hoy
              </p>
              <p className="text-gray-600 text-sm">
                {getTodayHours(plazze?.opening_hours)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuTags className="text-gray-500" size={24} />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Categorías</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {plazze.categories.length > 0 ? (
                  plazze.categories.map((category, index) => (
                    <Tag key={index} color="success" className="capitalize">
                      {category}
                    </Tag>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">
                    No especificadas
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuUsers className="text-gray-500" size={24} />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Precio</p>
              <p className="text-gray-600 text-sm">
                ${plazze.pricing.price_min.toLocaleString()} - $
                {plazze.pricing.price_max.toLocaleString()}{" "}
                {plazze.pricing.currency}
              </p>
            </div>
          </div>
        </div>
      </div>

      {plazze.bookable_services && plazze.bookable_services.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Servicios Disponibles
          </h2>
          <BookableServices services={plazze.bookable_services} />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Horarios</h2>
        <Collapse
          items={[
            {
              key: "horarios",
              label: (
                <div className="flex items-center gap-2">
                  <LuClock className="text-gray-500" size={16} />
                  <span className="text-base font-medium text-gray-700">
                    Ver horarios completos
                  </span>
                </div>
              ),
              children: (
                <div className="space-y-3 pt-2">
                  {getAllHours(plazze).map((dayInfo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="font-semibold text-gray-900 min-w-[80px]">
                          {dayInfo.day}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          dayInfo.hours === "Cerrado"
                            ? "text-red-600 bg-red-50 px-2 py-1 rounded-full"
                            : dayInfo.hours === "No especificado"
                            ? "text-gray-500 italic"
                            : "text-gray-700"
                        }`}
                      >
                        {dayInfo.hours}
                      </span>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
          ghost
          expandIconPosition="end"
          className="!border-none"
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Ubicación</h2>
        <div className="h-[300px]">
          {coordinates ? (
            <PlazzesMap
              center={coordinates}
              zoom={15}
              singleMarker={true}
              singlePlazze={plazze}
            />
          ) : (
            <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center text-gray-500">
                <LuMapPin size={48} className="mx-auto mb-2" />
                <p className="font-medium">Ubicación no disponible</p>
                <p className="text-sm">Las coordenadas no son válidas</p>
                <p className="text-xs mt-2 text-gray-400">
                  Lat: {plazze.latitude} | Lng: {plazze.longitude}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
