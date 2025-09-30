import { Tag } from "antd";
import { LuClock, LuTags, LuUsers } from "react-icons/lu";
import SitesMap from "../sites-map";
import { Site } from "@/types/site";

interface SiteInfoProps {
  site: Site;
}

export const SiteInfo = ({ site }: SiteInfoProps) => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Descripción
        </h2>
        <p className="text-gray-700">{site.description}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Detalles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <LuUsers className="text-gray-500" size={24} />
            <div>
              <p className="font-medium text-gray-900">Capacidad</p>
              <p className="text-gray-700">{site.capacity} personas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuClock className="text-gray-500" size={24} />
            <div>
              <p className="font-medium text-gray-900">Horario</p>
              <p className="text-gray-700">{site.schedule}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LuTags className="text-gray-500" size={24} />
            <div>
              <p className="font-medium text-gray-900">Categoría</p>
              <div className="mt-1">
                <Tag color="success" className="capitalize">
                  {site.category}
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Ubicación</h2>
        <div className="h-[300px]">
          <SitesMap
            sites={[site]}
            center={[site.coordinates.lat, site.coordinates.lng]}
            zoom={15}
          />
        </div>
      </div>
    </div>
  );
};
