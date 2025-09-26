import dynamic from "next/dynamic";
import { Site } from "@/types/site";

interface SitesMapProps {
  sites: Site[];
  center?: [number, number];
  zoom?: number;
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

const SitesMap = ({ sites, center, zoom = 12 }: SitesMapProps) => {
  const defaultCenter: [number, number] =
    sites.length > 0
      ? [sites[0].coordinates.lat, sites[0].coordinates.lng]
      : [9.0746, -79.4455];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 h-full">
      <div className="h-full rounded-lg overflow-hidden">
        <MapClient sites={sites} center={center || defaultCenter} zoom={zoom} />
      </div>
    </div>
  );
};

export default SitesMap;
