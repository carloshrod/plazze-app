"use client";

import { Button, DatePicker, Input, InputNumber, TimePicker } from "antd";
import dayjs from "dayjs";
import {
  LuCalendarDays,
  LuClock,
  LuMapPin,
  LuSearch,
  LuUsers,
} from "react-icons/lu";

const SearchBar = () => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="sm:w-[40%]">
          <Input
            size="large"
            placeholder="¿Dónde quieres ir?"
            prefix={<LuMapPin size={20} className="text-gray-400" />}
            className="w-full border-0 shadow-none"
          />
        </div>
        <div className="sm:w-[20%]">
          <DatePicker
            size="large"
            format="DD/MM/YYYY"
            placeholder="Fecha"
            suffixIcon={<LuCalendarDays size={20} className="text-gray-400" />}
            className="w-full border-0 shadow-none"
            disabledDate={(current: dayjs.Dayjs) =>
              current && current.isBefore(dayjs(), "day")
            }
          />
        </div>
        <div className="sm:w-[15%]">
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
          />
        </div>
        <div className="sm:w-[15%]">
          <InputNumber
            size="large"
            placeholder="Personas"
            min={1}
            max={99}
            prefix={<LuUsers size={20} className="text-gray-400" />}
            className="!w-full lg:!min-w-[120px] border-0 shadow-none"
            controls={true}
          />
        </div>
        <Button
          type="primary"
          size="large"
          icon={<LuSearch size={20} />}
          className="px-8"
        >
          <span className="block sm:hidden lg:block">Buscar</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
