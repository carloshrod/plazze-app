import dayjs from "dayjs";
import "dayjs/locale/es";
import { CreateBookingParams } from "@/libs/api/booking";

dayjs.locale("es");

interface PrepareBookingDataParams {
  listingId: number;
  userId: number;
  date: string | dayjs.Dayjs;
  startTime: string | dayjs.Dayjs;
  endTime: string | dayjs.Dayjs;
  serviceIds: string[];
  serviceQuantities: Record<string, number>;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  message?: string;
}

/**
 * Prepara los datos de la reserva para enviar al backend
 */
export const prepareBookingData = (
  params: PrepareBookingDataParams
): CreateBookingParams => {
  const {
    listingId,
    userId,
    date,
    startTime,
    endTime,
    serviceIds,
    serviceQuantities,
    firstName,
    lastName,
    email,
    phone,
    message,
  } = params;

  // Convertir fecha a formato YYYY-MM-DD
  const dateStr = dayjs(date).format("YYYY-MM-DD");

  // Convertir horas a formato HH:mm:ss
  const startTimeStr = dayjs(startTime).format("HH:mm:ss");
  const endTimeStr = dayjs(endTime).format("HH:mm:ss");

  return {
    listing_id: listingId,
    user_id: userId,
    date_start: dateStr,
    hour_start: startTimeStr,
    hour_end: endTimeStr,
    selected_services: serviceIds,
    service_quantities: serviceQuantities,
    first_name: firstName,
    last_name: lastName,
    email,
    user_phone: phone,
    message,
  };
};

/**
 * Calcula la hora de fin sumando 2 horas a la hora de inicio
 */
export const calculateEndTime = (startTime: dayjs.Dayjs): dayjs.Dayjs => {
  return startTime.add(2, "hour");
};

/**
 * Formatea la fecha de un booking para mostrar en UI
 * De "2025-11-15 19:00:00" a "15 Nov 2025"
 */
export const formatBookingDate = (dateString: string): string => {
  return dayjs(dateString).format("DD MMM YYYY");
};

/**
 * Formatea la hora de un booking para mostrar en UI
 * De "2025-11-15 19:00:00" a "19:00"
 */
export const formatBookingTime = (dateString: string): string => {
  return dayjs(dateString).format("HH:mm");
};

/**
 * Formatea el rango de tiempo de un booking
 * De date_start y date_end a "19:00 - 21:00"
 */
export const formatBookingTimeRange = (
  dateStart: string,
  dateEnd: string
): string => {
  const start = formatBookingTime(dateStart);
  const end = formatBookingTime(dateEnd);
  return `${start} - ${end}`;
};
