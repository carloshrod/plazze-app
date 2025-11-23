"use client";

import {
  DatePicker,
  InputNumber,
  Button,
  TimePicker,
  Select,
  Alert,
} from "antd";
import { Plazze } from "@/types/plazze";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { LuCalendarDays, LuClock, LuPackage } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/consts/routes";
import { useState, useEffect } from "react";
import { checkAvailability, getDisabledTime } from "@/utils/hours";

dayjs.locale("es");

interface BookingFormProps {
  plazze: Plazze;
}

export const BookingForm = ({ plazze }: BookingFormProps) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<dayjs.Dayjs | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceQuantities, setServiceQuantities] = useState<
    Record<string, number>
  >({});
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );

  // Verificar disponibilidad cuando cambien fecha o hora
  useEffect(() => {
    const error = checkAvailability(plazze, selectedDate, selectedTime);
    setAvailabilityError(error);
  }, [selectedDate, selectedTime, plazze.opening_hours]);

  // Inicializar cantidades cuando se seleccionan servicios
  useEffect(() => {
    const services = getSelectedServicesList();
    const newQuantities: Record<string, number> = { ...serviceQuantities };

    // Agregar cantidades para nuevos servicios
    services.forEach((service) => {
      if (!(service.id in newQuantities)) {
        newQuantities[service.id] = 1;
      }
    });

    // Remover cantidades de servicios deseleccionados
    Object.keys(newQuantities).forEach((serviceId) => {
      if (!selectedServices.includes(serviceId)) {
        delete newQuantities[serviceId];
      }
    });

    setServiceQuantities(newQuantities);
  }, [selectedServices]);

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

    if (selectedServices.length > 0) {
      params.append("services", selectedServices.join(","));
      // Enviar cantidades por servicio
      params.append("serviceQuantities", JSON.stringify(serviceQuantities));
    }

    // Agregar el precio total calculado
    const totalPrice = calculateTotalPrice();
    params.append("totalPrice", totalPrice.toString());

    const confirmUrl = `${ROUTES.PUBLIC.PLAZZES.CONFIRM_BOOKING(
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

  // Función para obtener los servicios seleccionados
  const getSelectedServicesList = () => {
    if (
      selectedServices.length === 0 ||
      !plazze.bookable_services ||
      plazze.bookable_services.length === 0
    ) {
      return [];
    }

    return plazze.bookable_services.filter((service) =>
      selectedServices.includes(service.id)
    );
  };

  // Función para actualizar cantidad de un servicio específico
  const updateServiceQuantity = (serviceId: string, quantity: number) => {
    setServiceQuantities((prev) => ({
      ...prev,
      [serviceId]: quantity,
    }));
  };

  // Función para calcular el precio total de la reserva
  const calculateTotalPrice = () => {
    const services = getSelectedServicesList();

    if (services.length > 0) {
      // Calcular la suma de todos los servicios seleccionados
      let total = 0;
      services.forEach((service) => {
        const quantity = serviceQuantities[service.id] || 1;
        if (service.bookable_options === "onetime") {
          // Pago único: precio fijo independiente del número de personas
          total += service.price;
        } else {
          // Por persona: precio por la cantidad específica de ese servicio
          total += service.price * quantity;
        }
      });
      return total;
    } else {
      // Si no hay servicios seleccionados, usar precio base del plazze
      const basePrice = plazze.pricing?.price_min || plazze.price_min || 0;
      return basePrice;
    }
  };

  // Función para mostrar el precio actual en la UI
  const getCurrentPrice = () => {
    if (selectedServices.length > 0) {
      const totalPrice = calculateTotalPrice();
      return `$${totalPrice.toLocaleString()}`;
    }
    return getBasePrice();
  };

  // Función para obtener el desglose de precios
  const getPriceBreakdown = () => {
    const services = getSelectedServicesList();
    if (services.length === 0) return null;

    return services.map((service) => {
      const isOneTime = service.bookable_options === "onetime";
      const quantity = serviceQuantities[service.id] || 1;
      const price = isOneTime ? service.price : service.price * quantity;

      return {
        id: service.id,
        name: service.title,
        isOneTime,
        unitPrice: service.price,
        quantity: isOneTime ? 1 : quantity,
        total: price,
      };
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-2xl font-bold text-primary">
            {getCurrentPrice()}{" "}
            <span className="text-sm text-gray-500 font-normal">
              {plazze?.pricing?.currency ?? "USD"}
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
              mode="multiple"
              size="large"
              placeholder="Seleccionar servicio(s)"
              suffixIcon={<LuPackage size={20} className="text-gray-400" />}
              className="w-full"
              value={selectedServices}
              onChange={setSelectedServices}
              allowClear
              options={getServiceOptions()}
              maxTagCount="responsive"
            />
          )}

          {selectedServices.length > 0 && (
            <div className="text-sm text-gray-500 space-y-2 mt-2">
              {getPriceBreakdown()?.map((item) => (
                <div key={item.id}>
                  <div className="flex justify-between items-center">
                    <span className="flex-1">
                      {item.name} - ${item.unitPrice.toLocaleString()}
                      {item.isOneTime && " (pago único)"}
                    </span>
                    {!item.isOneTime && (
                      <InputNumber
                        size="small"
                        min={1}
                        max={plazze.capacity || 50}
                        value={item.quantity}
                        onChange={(value) =>
                          updateServiceQuantity(item.id, value || 1)
                        }
                        className="!w-10"
                      />
                    )}
                    <span className="font-medium w-20 text-right">
                      ${item.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              <div className="border-t pt-1 mt-1">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${calculateTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

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
            disabledTime={() => getDisabledTime(selectedDate)}
          />

          {availabilityError && (
            <Alert
              message="No disponible"
              description={availabilityError}
              type="warning"
              showIcon
              className="mb-2"
            />
          )}

          <Button
            type="primary"
            size="large"
            className="w-full"
            onClick={handleBooking}
            disabled={
              !!availabilityError ||
              !selectedDate ||
              !selectedTime ||
              selectedServices.length === 0
            }
          >
            Reservar ahora
          </Button>
        </div>
      </div>
    </div>
  );
};
