import { Divider } from "antd";
import { LuCalendarDays, LuClock, LuMapPin, LuUsers } from "react-icons/lu";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";

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
  };
}

const BookingSummary = ({ booking }: BookingSummaryProps) => {
  const formattedDate = dayjs(booking.date)
    .locale("es")
    .format("dddd, D [de] MMMM [de] YYYY");

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
                className="object-cover rounded-lg"
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
              <p className="text-gray-600">{booking.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LuUsers size={20} className="text-gray-400" />
            <div>
              <p className="text-gray-600">{booking.guests} personas</p>
            </div>
          </div>
        </div>
      </div>

      <Divider className="!my-4" />

      <div>
        <h2 className="text-lg font-semibold mb-4">Resumen de costos</h2>
        <div className="space-y-2">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(booking.price)}</span>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Políticas de cancelación</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Cancelación gratuita hasta 48 horas antes del evento</li>
          <li>• 50% de reembolso hasta 24 horas antes del evento</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingSummary;
