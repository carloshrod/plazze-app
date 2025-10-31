import { ROUTES } from "@/consts/routes";
import Link from "next/link";
import {
  LuBeer,
  LuMusic,
  LuBuilding,
  LuUsers,
  LuTrees,
  LuPalette,
} from "react-icons/lu";

const CategoriesSection = () => {
  const categories = [
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=38`,
      icon: <LuBeer size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Bares",
      description: "Relájate con los mejores cócteles y ambiente",
      categoryId: 38,
    },
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=42`,
      icon: <LuMusic size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Discotecas",
      description: "Baila toda la noche en los mejores lugares",
      categoryId: 42,
    },
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=30`,
      icon: <LuBuilding size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Sala de Eventos",
      description: "Salones elegantes para tus ocasiones especiales",
      categoryId: 30,
    },
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=119`,
      icon: <LuTrees size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Outdoor",
      description: "Disfruta de la naturaleza en espacios abiertos",
      categoryId: 119,
    },
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=35`,
      icon: <LuPalette size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Cultura y Artes",
      description: "Espacios perfectos para eventos culturales y artísticos",
      categoryId: 35,
    },
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=115`,
      icon: <LuUsers size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Reuniones",
      description: "Espacios profesionales para tu equipo",
      categoryId: 115,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explora por categoría
          </h2>
          <p className="text-xl text-gray-600">
            Encuentra exactamente lo que buscas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.href} className="group h-full">
              <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-all group h-full flex flex-col">
                <div
                  className={`${category.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/10 mx-auto flex-shrink-0`}
                >
                  {category.icon}
                </div>
                <div className="flex-grow flex flex-col justify-center text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
