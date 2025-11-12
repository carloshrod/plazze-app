import { Divider } from "antd";
import { LuCalendarDays, LuClock, LuMapPin, LuUsers } from "react-icons/lu";
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
    guests: string;
    price: number;
    image?: string;
    serviceId: string | null;
  };
  plazze?: Plazze;
}

const BookingSummary = ({ booking, plazze }: BookingSummaryProps) => {
  const formattedDate = dayjs(booking.date)
    .locale("es")
    .format("dddd, D [de] MMMM [de] YYYY");

  const guestCount = parseInt(booking.guests) || 1;

  // Obtener información del servicio seleccionado
  const selectedService =
    booking.serviceId && plazze?.bookable_services
      ? plazze.bookable_services.find(
          (service) => service.id === booking.serviceId
        )
      : null;

  const isOneTimePayment = selectedService?.bookable_options === "onetime";

  // Calcular precio del servicio
  const servicePrice = selectedService
    ? isOneTimePayment
      ? selectedService.price
      : selectedService.price * guestCount
    : booking.price || 0;

  // Calcular precio total
  const totalPrice = selectedService ? servicePrice : booking.price || 0;

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

          {!isOneTimePayment && (
            <div className="flex items-center gap-3">
              <LuUsers size={20} className="text-gray-400" />
              <div>
                <p className="text-gray-600">
                  {guestCount} persona{guestCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          )}

          {selectedService && (
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/30">
              <p className="font-semibold">{selectedService.title}</p>
              <p className="text-sm">
                {isOneTimePayment ? "Pago único" : "Por persona"}
              </p>
              <p className="text-sm mt-1 ">
                {formatCurrency(selectedService.price)}
              </p>
            </div>
          )}
        </div>
      </div>

      <Divider className="!my-4" />

      <div>
        <h2 className="text-lg font-semibold mb-4">Resumen de costos</h2>
        <div className="space-y-2">
          {selectedService ? (
            <div className="flex justify-between">
              <span className="text-gray-600">
                {selectedService.title}
                {!isOneTimePayment &&
                  ` (${formatCurrency(selectedService.price)} × ${guestCount})`}
              </span>
              <span className="text-gray-900">
                {formatCurrency(servicePrice)}
              </span>
            </div>
          ) : (
            <div className="flex justify-between">
              <span className="text-gray-600">
                {guestCount > 1
                  ? `Precio base (${formatCurrency(
                      (booking.price || 0) / guestCount
                    )} × ${guestCount} persona${guestCount > 1 ? "s" : ""})`
                  : "Pago único"}
              </span>
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
