"use client";

import { DatePicker, InputNumber, Button, TimePicker } from "antd";
import { Site } from "@/types/site";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LuCalendarDays, LuClock, LuUsers } from "react-icons/lu";

dayjs.locale("es");

interface BookingFormProps {
  site: Site;
}

export const BookingForm = ({ site }: BookingFormProps) => {
  const formatDate = (date: dayjs.Dayjs) => {
    if (!date) return "";
    const localDate = date.locale("es");
    const day = localDate.format("dddd");
    return localDate.format(
      `[${day.charAt(0).toUpperCase() + day.slice(1)}], D [de] MMMM [de] YYYY`
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-2xl font-bold text-primary">
            ${site.price.toLocaleString()}{" "}
            <span className="text-sm text-gray-500 font-normal">por día</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <DatePicker
            size="large"
            showNow={false}
            format={formatDate}
            placeholder="Fecha"
            suffixIcon={<LuCalendarDays size={20} className="text-gray-400" />}
            className="w-full"
            disabledDate={(current: dayjs.Dayjs) => {
              return current && current.isBefore(dayjs(), "day");
            }}
          />

          <div className="flex gap-4">
            <TimePicker
              size="large"
              format="HH:mm"
              placeholder="Hora"
              suffixIcon={<LuClock size={20} className="text-gray-400" />}
              className="w-full border-0 shadow-none"
              minuteStep={15}
              showNow={false}
              needConfirm={false}
            />

            <InputNumber
              size="large"
              placeholder="Personas"
              min={1}
              max={site.capacity}
              prefix={<LuUsers size={20} className="text-gray-400" />}
              className="!w-full"
              controls={true}
            />
          </div>

          <Button type="primary" size="large" className="w-full">
            Reservar ahora
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>• Cancelación gratuita hasta 48 horas antes</p>
          <p>• Capacidad máxima: {site.capacity} personas</p>
        </div>
      </div>
    </div>
  );
};
