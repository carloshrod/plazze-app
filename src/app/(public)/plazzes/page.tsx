import SearchBar from "@/components/common/ui/search-bar";
import PlazzesList from "@/components/features/plazzes/plazzes-list";
import PlazzesMap from "@/components/features/plazzes/plazzes-map";
import { mockPlazzes } from "@/mock/plazzes";

export default function PlazzesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero con barra de búsqueda */}
      <div className="pt-20 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-8 text-center">
            Encuentra tu espacio ideal
          </h1>
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Grid de sitios */}
          <div className="order-2 lg:order-1">
            <PlazzesList plazzes={mockPlazzes} />
          </div>

          {/* Mapa */}
          <div className="order-1 lg:order-2">
            <div className="sticky top-28">
              <PlazzesMap plazzes={mockPlazzes} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
