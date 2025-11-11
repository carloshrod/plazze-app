import { client } from "./client";

export interface CreateBookingParams {
  listing_id: number;
  date_start: string; // YYYY-MM-DD
  hour_start: string; // HH:mm:ss
  hour_end: string; // HH:mm:ss
  guests: number;
  selected_services: string[]; // Array con el service_id, ej: ["service_0"]
  user_id: number;
  first_name: string;
  last_name?: string;
  email: string;
  user_phone?: string;
  message?: string;
}

export interface BookingResponse {
  success: boolean;
  booking_id: number;
  message: string;
  data: {
    listing_id: number;
    listing_name: string;
    date_start: string;
    date_end: string;
    guests: number;
    total_price: number;
    services: Array<{
      name: string;
      price: number;
      option: string;
      total: number;
    }>;
    client: {
      name: string;
      email: string;
      phone: string;
    };
    status: string;
    admin_url: string;
  };
}

/**
 * Crear una reserva directamente en Listeo
 */
export const createBooking = async (
  params: CreateBookingParams
): Promise<BookingResponse> => {
  const response = await client.post<BookingResponse>(
    "/plazze/v1/create-listeo-booking",
    params
  );
  return response.data;
};
