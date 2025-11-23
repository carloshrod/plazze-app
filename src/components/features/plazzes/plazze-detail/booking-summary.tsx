import { Divider } from "antd";
import { LuCalendarDays, LuClock, LuMapPin } from "react-icons/lu";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { formatCurrency } from "@/utils/format";
import { formatTo12Hour } from "@/utils/hours";
import Image from "next/image";
import { Plazze } from "@/types/plazze";

dayjs.locale("es");

interface BookingSummaryProps {
  booking: {
    plazzeName: string;
    address: string;
    date: string | dayjs.Dayjs;
    time: string;
    price: number;
    image?: string;
    serviceIds: string[];
    serviceQuantities: Record<string, number>;
  };
  plazze?: Plazze;
}

const BookingSummary = ({ booking, plazze }: BookingSummaryProps) => {
  const formattedDate = dayjs(booking.date)
    .locale("es")
    .format("dddd, D [de] MMMM [de] YYYY");

  // Obtener información de los servicios seleccionados
  const selectedServices =
    booking.serviceIds.length > 0 && plazze?.bookable_services
      ? plazze.bookable_services.filter((service) =>
          booking.serviceIds.includes(service.id)
        )
      : [];

  // Calcular precio total
  const calculateTotalPrice = () => {
    if (selectedServices.length > 0) {
      return selectedServices.reduce((total, service) => {
        const isOneTime = service.bookable_options === "onetime";
        const quantity = booking.serviceQuantities[service.id] || 1;
        return total + (isOneTime ? service.price : service.price * quantity);
      }, 0);
    }
    return booking.price || 0;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Detalles de la reserva</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {booking.image && (
              <Image
                src={booking.image}
                alt={booking.plazzeName}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <div>
              <p className="text-[16px] font-medium">{booking.plazzeName}</p>
              <div className="flex items-center gap-3">
                <LuMapPin size={20} className="text-gray-400" />
                <p className="text-gray-600">{booking.address}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LuCalendarDays size={20} className="text-gray-400" />
            <div>
              <p className="text-gray-600">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LuClock size={20} className="text-gray-400" />
            <div>
              <p className="text-gray-600">{formatTo12Hour(booking.time)}</p>
            </div>
          </div>

          {selectedServices.length > 0 && (
            <div className="space-y-2">
              {selectedServices.map((service) => {
                const isOneTime = service.bookable_options === "onetime";
                const quantity = booking.serviceQuantities[service.id] || 1;
                return (
                  <div
                    key={service.id}
                    className="bg-primary/5 p-3 rounded-lg border border-primary/30"
                  >
                    <p className="font-semibold">{service.title}</p>
                    <p className="text-sm">
                      {isOneTime
                        ? "Pago único"
                        : `${quantity} persona${quantity > 1 ? "s" : ""}`}
                    </p>
                    <p className="text-sm mt-1">
                      {formatCurrency(service.price)}
                      {!isOneTime && ` × ${quantity}`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Divider className="!my-4" />

      <div>
        <h2 className="text-lg font-semibold mb-4">Resumen de costos</h2>
        <div className="space-y-2">
          {selectedServices.length > 0 ? (
            selectedServices.map((service) => {
              const isOneTime = service.bookable_options === "onetime";
              const quantity = booking.serviceQuantities[service.id] || 1;
              const serviceTotal = isOneTime
                ? service.price
                : service.price * quantity;
              return (
                <div key={service.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {service.title}
                    {!isOneTime &&
                      ` (${formatCurrency(service.price)} × ${quantity})`}
                  </span>
                  <span className="text-gray-900">
                    {formatCurrency(serviceTotal)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex justify-between">
              <span className="text-gray-600">Pago único</span>
              <span className="text-gray-900">
                {formatCurrency(booking.price || 0)}
              </span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
