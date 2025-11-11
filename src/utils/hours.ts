import { Plazze } from "@/types/plazze";
import dayjs from "dayjs";

// Función para convertir hora de 24h a 12h usando dayjs
export const formatTo12Hour = (time24: string): string => {
  if (!time24) return time24;

  // Crear un objeto dayjs con la hora (usando una fecha arbitraria)
  return dayjs(`2000-01-01 ${time24}`).format("h:mm a");
};

// Tipo para los horarios de un día
interface DayHours {
  open: string;
  close: string;
  is_closed?: boolean;
  is_24h?: boolean;
}

// Tipo para los horarios de la semana (compatible con el tipo existente)
interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

// Obtener el día actual en formato string
export const getCurrentDay = (): keyof OpeningHours => {
  const days: (keyof OpeningHours)[] = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = new Date().getDay();
  return days[today];
};

// Obtener horarios del día actual de forma segura
export const getTodayHours = (openingHours?: OpeningHours): string => {
  const currentDay = getCurrentDay();

  if (!openingHours) return "No especificado";

  const todayHours = openingHours[currentDay];
  if (!todayHours) return "Cerrado";

  // Si está marcado como cerrado, mostrar "Cerrado"
  if (todayHours.is_closed === true) return "Cerrado";

  // Si está marcado como 24h, mostrar "24 horas"
  if (todayHours.is_24h === true) return "24 horas";

  // Si tiene horarios de apertura y cierre, convertir a formato 12h
  if (todayHours.open && todayHours.close) {
    const openTime = formatTo12Hour(todayHours.open);
    const closeTime = formatTo12Hour(todayHours.close);
    return `${openTime} - ${closeTime}`;
  }

  return "No especificado";
};

// Obtener horarios de un día específico
export const getDayHours = (
  openingHours?: OpeningHours,
  day?: keyof OpeningHours
): string => {
  const targetDay = day || getCurrentDay();

  if (!openingHours) return "No especificado";

  const dayHours = openingHours[targetDay];
  if (!dayHours) return "Cerrado";

  // Si está marcado como cerrado, mostrar "Cerrado"
  if (dayHours.is_closed === true) return "Cerrado";

  // Si está marcado como 24h, mostrar "24 horas"
  if (dayHours.is_24h === true) return "24 horas";

  // Si tiene horarios de apertura y cierre, convertir a formato 12h
  if (dayHours.open && dayHours.close) {
    const openTime = formatTo12Hour(dayHours.open);
    const closeTime = formatTo12Hour(dayHours.close);
    return `${openTime} - ${closeTime}`;
  }

  return "No especificado";
};

// Verificar si está abierto actualmente
export const isCurrentlyOpen = (openingHours?: OpeningHours): boolean => {
  if (!openingHours) return false;

  const currentDay = getCurrentDay();
  const todayHours = openingHours[currentDay];

  if (!todayHours || todayHours.is_closed === true) return false;
  if (todayHours.is_24h === true) return true;

  if (!todayHours.open || !todayHours.close) return false;

  // Obtener hora actual
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  // Comparar horarios (simplificado - no maneja casos como cierre después de medianoche)
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

// Obtener todos los horarios de la semana formateados
export const getWeeklyHours = (
  openingHours?: OpeningHours
): Record<string, string> => {
  if (!openingHours) return {};

  const dayLabels = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  const weeklyHours: Record<string, string> = {};

  Object.entries(dayLabels).forEach(([key, label]) => {
    weeklyHours[label] = getDayHours(openingHours, key as keyof OpeningHours);
  });

  return weeklyHours;
};

// Función para obtener todos los horarios de la semana
export const getAllHours = (plazze: Plazze) => {
  const daysLabels = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  } as const;

  if (!plazze.opening_hours) {
    return Object.values(daysLabels).map((day) => ({
      day,
      hours: "No especificado",
    }));
  }

  return Object.entries(daysLabels).map(([key, label]) => {
    const dayHours =
      plazze.opening_hours?.[key as keyof typeof plazze.opening_hours];

    let hours = "No especificado";

    if (dayHours?.is_closed) {
      hours = "Cerrado";
    } else if (dayHours?.is_24h) {
      hours = "24 horas";
    } else if (dayHours?.open && dayHours?.close) {
      const openTime = formatTo12Hour(dayHours.open);
      const closeTime = formatTo12Hour(dayHours.close);
      hours = `${openTime} - ${closeTime}`;
    }

    return { day: label, hours };
  });
};

// Función para verificar disponibilidad en fecha y hora específicas
export const checkAvailability = (
  plazze: Plazze,
  date: dayjs.Dayjs | null,
  time: dayjs.Dayjs | null
): string | null => {
  if (!date || !time) {
    return null;
  }

  // Obtener el nombre del día en inglés usando dayjs
  const dayIndex = date.day(); // 0 = domingo, 1 = lunes, etc.
  const daysMapping = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const englishDay = daysMapping[dayIndex] as keyof NonNullable<
    typeof plazze.opening_hours
  >;

  const dayHours = plazze.opening_hours?.[englishDay];

  if (!dayHours) {
    return "No hay horarios establecidos para este día";
  }

  if (dayHours.is_closed) {
    return "El plazze está cerrado este día";
  }

  if (dayHours.is_24h) {
    return null; // Disponible 24h
  }

  if (!dayHours.open || !dayHours.close) {
    return "Horarios no especificados para este día";
  }

  const selectedTimeStr = time.format("HH:mm");
  const openTime = dayHours.open;
  const closeTime = dayHours.close;

  // Verificar si el horario cruza medianoche (ej: 18:00 - 03:00)
  const crossesMidnight = closeTime < openTime;

  let isOutsideHours = false;

  if (crossesMidnight) {
    // Si cruza medianoche, está cerrado si está entre closeTime y openTime
    isOutsideHours = selectedTimeStr > closeTime && selectedTimeStr < openTime;
  } else {
    // Horario normal, está cerrado si está fuera del rango
    isOutsideHours = selectedTimeStr < openTime || selectedTimeStr > closeTime;
  }

  if (isOutsideHours) {
    return `El plazze está cerrado a esta hora. Horario: ${formatTo12Hour(
      openTime
    )} - ${formatTo12Hour(closeTime)}`;
  }

  return null; // Disponible
};

// Función para deshabilitar horas pasadas cuando es el día actual
export const getDisabledTime = (selectedDate: dayjs.Dayjs | null) => {
  // Si no hay fecha seleccionada o no es el día actual, no deshabilitar nada
  if (!selectedDate || !selectedDate.isSame(dayjs(), "day")) {
    return {};
  }

  const now = dayjs();
  const currentHour = now.hour();
  const currentMinute = now.minute();

  return {
    disabledHours: () => {
      // Deshabilitar todas las horas anteriores a la actual
      const hours = [];
      for (let i = 0; i < currentHour; i++) {
        hours.push(i);
      }
      return hours;
    },
    disabledMinutes: (selectedHour: number) => {
      // Si es la hora actual, deshabilitar los minutos que ya pasaron
      if (selectedHour === currentHour) {
        const minutes = [];
        for (let i = 0; i <= currentMinute; i++) {
          minutes.push(i);
        }
        return minutes;
      }
      return [];
    },
  };
};
