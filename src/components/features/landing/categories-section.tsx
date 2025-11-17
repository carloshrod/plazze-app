import { ROUTES } from "@/consts/routes";
import Link from "next/link";
import {
  LuBeer,
  LuPalette,
  LuHeartPulse,
  LuBriefcaseBusiness,
  LuPartyPopper,
  LuArrowUpRight,
} from "react-icons/lu";

const CategoriesSection = () => {
  const mainCategories = [
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=20`,
      icon: <LuBeer size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Bares & Discotecas",
      description:
        "Relájate con los mejores cócteles y baila toda la noche en los mejores lugares",
      categoryId: 20,
    },
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=41`,
      icon: <LuHeartPulse size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Bienestar & Fitness",
      description: "Encuentra espacios para cuidar tu cuerpo y mente",
      categoryId: 41,
    },
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=114`,
      icon: <LuBriefcaseBusiness size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Corporativo",
      description: "Espacios ideales para reuniones y eventos empresariales",
      categoryId: 114,
    },
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=124`,
      icon: <LuPalette size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Cultura & Artes",
      description: "Espacios perfectos para eventos culturales y artísticos",
      categoryId: 124,
    },
    {
      href: `${ROUTES.PUBLIC.PLAZZES.LIST}?category=35`,
      icon: <LuPartyPopper size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Eventos",
      description: "Encuentra lugares para tus eventos y celebraciones",
      categoryId: 35,
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
          {mainCategories.map((category, index) => (
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
          {mainCategories.length > 0 && (
            <div className="flex items-center justify-center md:aspect-[4/3]">
              <Link
                href={ROUTES.PUBLIC.PLAZZES.LIST}
                className="text-xl text-primary hover:text-primary/80 font-semibold transition-colors group flex items-center hover:bg-primary/10 px-4 py-2 rounded-md"
              >
                Ver todos los plazzes
                <LuArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
