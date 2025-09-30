import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import SearchBar from "@/components/common/ui/search-bar";
import { ROUTES } from "@/consts/routes";

const HeroSection = () => {
  return (
    <section className="py-8 relative bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-24">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Busca, Encuentra y Reserva
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Espacios únicos para eventos, reuniones, talleres y experiencias
            inolvidables
          </p>

          {/* Barra de búsqueda */}
          <SearchBar />
        </div>

        <div>
          <Link
            href={ROUTES.PUBLIC.PLAZZES.LIST}
            className="inline-flex justify-center text-2xl text-primary hover:text-primary/80 hover:bg-primary/10 px-4 py-2 rounded-md font-semibold transition-colors group"
          >
            Explorar plazzes
            <LuArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
