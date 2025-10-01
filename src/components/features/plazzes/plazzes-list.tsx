import Image from "next/image";
import Link from "next/link";
import { Button } from "antd";
import { Plazze } from "@/types/plazze";
import { LuClock, LuMapPin, LuUsers } from "react-icons/lu";
import { ROUTES } from "@/consts/routes";

interface PlazzesListProps {
  plazzes: Plazze[];
}

const PlazzesList = ({ plazzes }: PlazzesListProps) => {
  return (
    <div className="grid gap-6">
      {plazzes.map((plazze) => (
        <Link
          key={plazze.id}
          href={ROUTES.PUBLIC.PLAZZES.DETAIL(plazze.id)}
          className="group relative block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Imagen */}
            <div className="relative w-full h-48 sm:w-[40%] sm:h-auto">
              <Image
                src={plazze.image}
                alt={plazze.name}
                className="rounded-t-lg sm:rounded-l-lg sm:rounded-t-none object-cover"
                fill
                sizes="(max-width: 640px) 100vw, 256px"
                priority={plazze.id === "1"}
              />
            </div>

            {/* Contenido */}
            <div className="p-4 flex-1">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {plazze.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                  <LuMapPin size={16} />
                  {plazze.location}
                </p>
              </div>

              {/* Overlay con botón */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button
                  type="primary"
                  size="large"
                  className="scale-90 group-hover:scale-100 transition-transform duration-300"
                >
                  Ver detalles
                </Button>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {plazze.description}
              </p>

              <div className="flex flex-wrap gap-4 mt-auto">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <LuUsers size={16} />
                  {plazze.capacity} personas
                </span>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <LuClock size={16} />
                  {plazze.schedule}
                </span>
                <span className="text-lg font-semibold text-primary">
                  ${plazze.price}/hora
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PlazzesList;
