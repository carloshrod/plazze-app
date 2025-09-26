import Link from "next/link";
import { Button } from "antd";
import SearchBar from "@/components/common/ui/search-bar";

const HeroSection = () => {
  return (
    <section className="py-8 relative bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Busca, Encuentra y Reserva
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Espacios únicos para eventos, reuniones, talleres y experiencias
            inolvidables
          </p>

          <SearchBar />

          <Link href="/sitios">
            <Button type="primary" size="large" className="px-8">
              Explorar sitios
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
