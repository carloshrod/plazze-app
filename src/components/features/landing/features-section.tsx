import { Search, Zap, Shield } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Search size={32} className="text-primary" />,
      title: "Búsqueda inteligente",
      description: "Encuentra el lugar perfecto con nuestros filtros avanzados",
    },
    {
      icon: <Zap size={32} className="text-primary" />,
      title: "Reserva instantánea",
      description:
        "Confirma tu reserva al instante sin esperas ni llamadas telefónicas",
    },
    {
      icon: <Shield size={32} className="text-primary" />,
      title: "Reservas seguras",
      description:
        "Todas tus reservas están protegidas con nuestra garantía de satisfacción",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir Plazze?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            La forma más fácil de reservar tu mesa o espacio perfecto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
