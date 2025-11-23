import { client } from "./client";

export interface CreateBookingParams {
  listing_id: number;
  date_start: string; // YYYY-MM-DD
  hour_start: string; // HH:mm:ss
  hour_end: string; // HH:mm:ss
  selected_services: string[]; // Array con el service_id, ej: ["service_0"]
  service_quantities: Record<string, number>; // Cantidad por cada servicio
  user_id: number;
  first_name: string;
  last_name?: string;
  email: string;
  user_phone?: string;
  message?: string;
}

export interface BookingService {
  name: string;
  price: number;
  total: number;
  guests: string;
  option: string; // "byguest" o "onetime"
}

export interface BookingCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface BookingOwner {
  id: number;
  name: string;
}

export interface Booking {
  id: number;
  listing_id: number;
  listing_title: string;
  listing_permalink: string;
  listing_image: string;
  date_start: string; // "2025-11-15 19:00:00"
  date_end: string; // "2025-11-15 21:00:00"
  status: "waiting" | "confirmed" | "cancelled" | "completed" | "paid";
  type: string;
  created: string;
  price: number;
  guests: number;
  customer: BookingCustomer;
  owner: BookingOwner;
  services: BookingService[];
  message: string;
  order_id: number | null;
}

export interface BookingsResponse {
  success: boolean;
  bookings: Booking[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface BookingResponse {
  success: boolean;
  booking_id: number;
  message: string;
  payment_url?: string;
  order_id?: number;
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

export interface GetBookingsParams {
  status?: "waiting" | "confirmed" | "cancelled" | "completed" | "paid";
  page?: number;
  per_page?: number;
}

export interface GetOwnerBookingsParams extends GetBookingsParams {
  listing_id?: number;
}

/**
 * Obtener reservas del usuario como COMPRADOR
 */
export const getMyBookings = async (
  params?: GetBookingsParams
): Promise<BookingsResponse> => {
  const response = await client.get<BookingsResponse>(
    "/plazze/v1/my-bookings",
    { params }
  );
  return response.data;
};

/**
 * Obtener reservas de los listings del usuario como VENDEDOR
 */
export const getMyListingsBookings = async (
  params?: GetOwnerBookingsParams
): Promise<BookingsResponse> => {
  const response = await client.get<BookingsResponse>(
    "/plazze/v1/my-listings-bookings",
    { params }
  );
  return response.data;
};

/**
 * Verificar estado de pago de un booking
 */
export const checkBookingPaymentStatus = async (
  bookingId: number
): Promise<{
  booking_id: number;
  status: string;
  order_id: number | null;
  payment_completed: boolean;
}> => {
  const response = await client.get(
    `/plazze/v1/booking/${bookingId}/payment-status`
  );
  return response.data;
};

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
