import { Button, DatePicker, Input, InputNumber } from "antd";
import { Clock, MapPin, Search, Users } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex-1">
          <Input
            size="large"
            placeholder="¿Dónde quieres ir?"
            prefix={<MapPin size={20} className="text-gray-400" />}
            className="w-full !min-w-[200px] border-0 shadow-none"
          />
        </div>
        <div className="flex-1">
          <DatePicker
            size="large"
            showTime={{
              format: "HH:mm",
              showNow: true,
            }}
            format="DD/MM/YYYY HH:mm"
            placeholder="Fecha y hora"
            suffixIcon={<Clock size={20} className="text-gray-400" />}
            className="w-full min-w-[180px]"
          />
        </div>
        <div className="flex-1">
          <InputNumber
            size="large"
            placeholder="Personas"
            min={1}
            max={99}
            prefix={<Users size={20} className="text-gray-400" />}
            className="!w-full !min-w-[120px] border-0 shadow-none"
            controls={false}
          />
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Search size={20} />}
          className="px-8"
        >
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
