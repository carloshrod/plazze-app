import { Card, Tag, Empty, Collapse } from "antd";
import { LuPackage, LuDollarSign, LuUsers, LuClock } from "react-icons/lu";
import { BookableService } from "@/types/plazze";

interface BookableServicesProps {
  services: BookableService[];
}

export const BookableServices = ({ services }: BookableServicesProps) => {
  if (!services || services.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No hay servicios disponibles"
        className="py-8"
      />
    );
  }

  const getServiceTypeIcon = (options: string) => {
    switch (options) {
      case "byguest":
        return <LuUsers className="text-blue-500" size={16} />;
      case "onetime":
        return <LuClock className="text-green-500" size={16} />;
      default:
        return <LuPackage className="text-gray-500" size={16} />;
    }
  };

  const getServiceTypeLabel = (options: string) => {
    switch (options) {
      case "byguest":
        return "Por persona";
      case "onetime":
        return "Tarifa única";
      default:
        return "Servicio";
    }
  };

  const getServiceTypeColor = (options: string) => {
    switch (options) {
      case "byguest":
        return "blue";
      case "onetime":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <Collapse
      items={[
        {
          key: "servicios",
          label: (
            <div className="flex items-center gap-2">
              <LuPackage className="text-gray-500" size={16} />
              <span className="text-base font-medium text-gray-700">
                Ver servicios disponibles
              </span>
              <Tag color="blue" className="ml-2">
                {services.length} servicio{services.length !== 1 ? "s" : ""}
              </Tag>
            </div>
          ),
          children: (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-md transition-shadow duration-300 border border-gray-200"
                  styles={{ body: { padding: "16px" } }}
                >
                  <div className="flex flex-col gap-3">
                    {/* Header del servicio */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getServiceTypeIcon(service.bookable_options)}
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                          {service.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <LuDollarSign size={20} />
                        <span className="text-xl">
                          {service.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Descripción */}
                    {service.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {service.description}
                      </p>
                    )}

                    {/* Tags informativos */}
                    <div className="flex flex-wrap gap-2">
                      <Tag
                        color={getServiceTypeColor(service.bookable_options)}
                        className="text-xs px-2 py-1 rounded-full border-0"
                      >
                        {getServiceTypeLabel(service.bookable_options)}
                      </Tag>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ),
        },
      ]}
      ghost
      expandIconPosition="end"
      className="!border-none"
    />
  );
};
