"use client";

import { DatePicker, InputNumber, Button, TimePicker, Select } from "antd";
import { Plazze } from "@/types/plazze";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LuCalendarDays, LuClock, LuUsers, LuPackage } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/consts/routes";
import { useState } from "react";

dayjs.locale("es");

interface BookingFormProps {
  plazze: Plazze;
}

export const BookingForm = ({ plazze }: BookingFormProps) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  const formatDate = (date: dayjs.Dayjs) => {
    if (!date) return "";
    const localDate = date.locale("es");
    const day = localDate.format("dddd");
    return localDate.format(
      `[${day.charAt(0).toUpperCase() + day.slice(1)}], D [de] MMMM [de] YYYY`
    );
  };

  const handleBooking = () => {
    const params = new URLSearchParams();

    if (selectedDate) {
      params.append("date", selectedDate.format("YYYY-MM-DD"));
    }

    if (selectedTime) {
      params.append("time", selectedTime.format("HH:mm"));
    }

    if (guestCount) {
      params.append("guests", guestCount.toString());
    }

    if (selectedService) {
      params.append("service", selectedService.toString());
    }

    const confirmUrl = `${ROUTES.PUBLIC.PLAZZES.CONFIRM(
      plazze.id
    )}?${params.toString()}`;
    router.push(confirmUrl);
  };

  // Función para obtener el precio base a mostrar
  const getBasePrice = () => {
    const priceMin = plazze.pricing?.price_min || plazze.price_min || 0;
    const priceMax = plazze.pricing?.price_max || plazze.price_max || 0;

    if (priceMin === priceMax) {
      return `$${priceMin.toLocaleString()}`;
    }
    return `$${priceMin.toLocaleString()} - $${priceMax.toLocaleString()}`;
  };

  // Función para obtener opciones de servicios
  const getServiceOptions = () => {
    if (!plazze.bookable_services || plazze.bookable_services.length === 0) {
      return [];
    }

    return plazze.bookable_services.map((service) => {
      const paymentType =
        service.bookable_options === "onetime" ? "pago único" : "por persona";

      return {
        label: `${
          service.title
        } - $${service.price.toLocaleString()} (${paymentType})`,
        value: service.id,
        service: service,
      };
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-2xl font-bold text-primary">
            {getBasePrice()}{" "}
            <span className="text-sm text-gray-500 font-normal">
              {plazze?.pricing?.currency}
            </span>
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
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            disabledDate={(current: dayjs.Dayjs) => {
              return current && current.isBefore(dayjs(), "day");
            }}
          />

          {plazze.bookable_services && plazze.bookable_services.length > 0 && (
            <Select
              size="large"
              placeholder="Seleccionar servicio"
              suffixIcon={<LuPackage size={20} className="text-gray-400" />}
              className="w-full"
              value={selectedService}
              onChange={setSelectedService}
              allowClear
              options={getServiceOptions()}
            />
          )}

          <div className="flex gap-4">
            <TimePicker
              size="large"
              use12Hours
              format="h:mm a"
              placeholder="Hora"
              suffixIcon={<LuClock size={20} className="text-gray-400" />}
              className="w-full border-0 shadow-none"
              minuteStep={30}
              showNow={false}
              needConfirm={false}
              value={selectedTime}
              onChange={(time) => setSelectedTime(time)}
            />

            <InputNumber
              size="large"
              placeholder="Personas"
              min={1}
              max={plazze.capacity || 50}
              prefix={<LuUsers size={20} className="text-gray-400" />}
              className="!w-full"
              controls={true}
              value={guestCount}
              onChange={(value) => setGuestCount(value || 1)}
            />
          </div>

          <Button
            type="primary"
            size="large"
            className="w-full"
            onClick={handleBooking}
          >
            Reservar ahora
          </Button>
        </div>
      </div>
    </div>
  );
};
