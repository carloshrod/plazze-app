import dynamic from "next/dynamic";
import { Site } from "@/types/site";

interface SitesMapProps {
  sites: Site[];
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

const SitesMap = ({ sites }: SitesMapProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <MapClient sites={sites} />
    </div>
  );
};

export default SitesMap;
