"use client";

import { Button, DatePicker, Input, InputNumber, TimePicker } from "antd";
import { Calendar, Clock, MapPin, Search, Users } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";

const SearchBar = () => {
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Generar opciones de hora cada 15 minutos
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 15, 30, 45]) {
      const time = dayjs().hour(hour).minute(minute);
      timeOptions.push({
        label: time.format("HH:mm"),
        value: time.format("HH:mm"),
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="sm:w-[40%]">
          <Input
            size="large"
            placeholder="¿Dónde quieres ir?"
            prefix={<MapPin size={20} className="text-gray-400" />}
            className="w-full border-0 shadow-none"
          />
        </div>
        <div className="sm:w-[20%]">
          <DatePicker
            size="large"
            format="DD/MM/YYYY"
            placeholder="Fecha"
            suffixIcon={<Calendar size={20} className="text-gray-400" />}
            className="w-full border-0 shadow-none"
            disabledDate={(current: any) =>
              current && current.isBefore(Date.now(), "day")
            }
          />
        </div>
        <div className="sm:w-[15%]">
          <TimePicker
            size="large"
            format="HH:mm"
            placeholder="Hora"
            suffixIcon={<Clock size={20} className="text-gray-400" />}
            className="w-full border-0 shadow-none"
            minuteStep={15}
            hideDisabledOptions
            showNow={false}
          />
        </div>
        <div className="sm:w-[15%]">
          <InputNumber
            size="large"
            placeholder="Personas"
            min={1}
            max={99}
            prefix={<Users size={20} className="text-gray-400" />}
            className="!w-full lg:!min-w-[120px] border-0 shadow-none"
            controls={true}
          />
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Search size={20} />}
          className="px-8"
        >
          <span className="block sm:hidden lg:block">Buscar</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
