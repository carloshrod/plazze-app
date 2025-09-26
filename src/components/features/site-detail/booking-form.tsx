"use client";

import { DatePicker, InputNumber, Button } from "antd";
import { Site } from "@/types/site";
import { Clock, Users } from "lucide-react";

interface BookingFormProps {
  site: Site;
}

export const BookingForm = ({ site }: BookingFormProps) => {
  const disabledDate = (current: any) => {
    return current && current.isBefore(Date.now(), "day");
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
            showTime={{
              format: "HH:mm",
            }}
            format="DD/MM/YYYY HH:mm"
            placeholder="Fecha y hora"
            suffixIcon={<Clock size={20} className="text-gray-400" />}
            className="w-full"
            disabledDate={disabledDate}
          />

          <InputNumber
            size="large"
            placeholder="Personas"
            min={1}
            max={site.capacity}
            defaultValue={1}
            prefix={<Users size={20} className="text-gray-400" />}
            className="!w-full"
            controls={true}
          />

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
