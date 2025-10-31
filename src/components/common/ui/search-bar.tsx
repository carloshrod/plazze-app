"use client";

import { Button, DatePicker, Input, InputNumber, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, usePathname } from "next/navigation";
import {
  LuCalendarDays,
  LuClock,
  LuMapPin,
  LuSearch,
  LuUsers,
} from "react-icons/lu";
import { useSearchStore } from "@/stores/search";
import { usePlazzeService } from "@/service/plazze";
import { ROUTES } from "@/consts/routes";
import { useState } from "react";

const SearchBar = () => {
  const { filters, setFilters, isSearching, setIsSearching, setHasSearched } =
    useSearchStore();
  const { fetchPlazzes, searchWithFilters } = usePlazzeService();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar si estamos en la página de plazzes
  const isOnPlazzesPage = pathname === ROUTES.PUBLIC.PLAZZES.LIST;

  const handleLocationChange = (value: string) => {
    setFilters({ location: value });
  };

  const handleDateChange = (date: Dayjs | null) => {
    setFilters({ date });
  };

  const handleTimeChange = (time: Dayjs | null) => {
    setFilters({ time });
  };

  const handlePeopleChange = (people: number | null) => {
    setFilters({ people });
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setIsSearching(true);
    setHasSearched(true); // Marcar que se ejecutó una búsqueda

    try {
      // Preparar filtros para la búsqueda (incluir categoría si existe)
      const searchFilters = {
        location: filters.location,
        date: filters.date?.format("YYYY-MM-DD"),
        time: filters.time?.format("HH:mm"),
        people: filters.people || undefined,
        category: filters.category || undefined, // Incluir categoría actual
      };

      // 🔄 Si estamos en el home, redirigir a plazzes con filtros
      if (!isOnPlazzesPage) {
        // Construir query parameters
        const queryParams = new URLSearchParams();

        if (filters.location.trim()) {
          queryParams.set("location", filters.location.trim());
        }

        if (filters.date) {
          queryParams.set("date", filters.date.format("YYYY-MM-DD"));
        }

        if (filters.time) {
          queryParams.set("time", filters.time.format("HH:mm"));
        }

        if (filters.people) {
          queryParams.set("people", filters.people.toString());
        }

        if (filters.category) {
          queryParams.set("category", filters.category);
        }

        // Redirigir a plazzes con query parameters
        const queryString = queryParams.toString();
        const targetUrl = queryString
          ? `${ROUTES.PUBLIC.PLAZZES.LIST}?${queryString}`
          : ROUTES.PUBLIC.PLAZZES.LIST;

        router.push(targetUrl);
        return;
      }

      // 🔍 Si ya estamos en plazzes, ejecutar búsqueda directamente
      if (
        filters.location.trim() ||
        filters.date ||
        filters.time ||
        filters.people ||
        filters.category
      ) {
        await searchWithFilters(searchFilters);
      } else {
        await fetchPlazzes();
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="sm:w-[40%]">
          <Input
            size="large"
            placeholder="¿Dónde quieres ir?"
            prefix={<LuMapPin size={20} className="text-gray-400" />}
            className="w-full border-0 shadow-none"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="sm:w-[20%]">
          <DatePicker
            size="large"
            format="DD/MM/YYYY"
            placeholder="Fecha"
            suffixIcon={<LuCalendarDays size={20} className="text-gray-400" />}
            className="w-full border-0 shadow-none"
            value={filters.date}
            onChange={handleDateChange}
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
            value={filters.time}
            onChange={handleTimeChange}
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
            value={filters.people}
            onChange={handlePeopleChange}
          />
        </div>
        <Button
          type="primary"
          size="large"
          icon={<LuSearch size={20} />}
          className="px-8"
          loading={isLoading || isSearching}
          onClick={handleSearch}
        >
          <span className="block sm:hidden lg:block">Buscar</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
