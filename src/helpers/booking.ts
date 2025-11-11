import dayjs from "dayjs";
import { CreateBookingParams } from "@/libs/api/booking";

interface PrepareBookingDataParams {
  listingId: number;
  userId: number;
  date: string | dayjs.Dayjs;
  startTime: string | dayjs.Dayjs;
  endTime: string | dayjs.Dayjs;
  guests: number;
  serviceId: string;
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
    guests,
    serviceId,
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
    guests,
    selected_services: [serviceId],
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
