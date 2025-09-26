import Link from "next/link";
import { Utensils, Beer, Music } from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    {
      href: "/sitios?categoria=restaurantes",
      icon: <Utensils size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Restaurantes",
      description: "Descubre los mejores sabores de la ciudad",
    },
    {
      href: "/sitios?categoria=bares",
      icon: <Beer size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Bares",
      description: "Relájate con los mejores cócteles y ambiente",
    },
    {
      href: "/sitios?categoria=discotecas",
      icon: <Music size={32} className="text-primary" />,
      bgColor: "bg-primary/5",
      title: "Discotecas",
      description: "Baila toda la noche en los mejores lugares",
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.href} className="group">
              <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-all group">
                <div
                  className={`${category.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:bg-primary/10 mx-auto`}
                >
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
