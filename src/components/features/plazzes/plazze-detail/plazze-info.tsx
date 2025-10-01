import { Tag } from "antd";
import { LuClock, LuTags, LuUsers } from "react-icons/lu";
import PlazzesMap from "../plazzes-map";
import { Plazze } from "@/types/plazze";

interface PlazzeInfoProps {
  plazze: Plazze;
}

export const PlazzeInfo = ({ plazze }: PlazzeInfoProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Descripción
        </h2>
        <p className="text-gray-700">{plazze.description}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Detalles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <LuUsers className="text-gray-500" size={24} />
            <div>
              <p className="font-medium text-gray-900">Capacidad</p>
              <p className="text-gray-700">{plazze.capacity} personas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuClock className="text-gray-500" size={24} />
            <div>
              <p className="font-medium text-gray-900">Horario</p>
              <p className="text-gray-700">{plazze.schedule}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuTags className="text-gray-500" size={24} />
            <div>
              <p className="font-medium text-gray-900">Categoría</p>
              <div className="mt-1">
                <Tag color="success" className="capitalize">
                  {plazze.category}
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Ubicación</h2>
        <div className="h-[300px]">
          <PlazzesMap
            plazzes={[plazze]}
            center={[plazze.coordinates.lat, plazze.coordinates.lng]}
            zoom={15}
          />
        </div>
      </div>
    </div>
  );
};
