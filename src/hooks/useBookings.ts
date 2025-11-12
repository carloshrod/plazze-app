import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import {
  getMyBookings,
  getMyListingsBookings,
  Booking,
  GetBookingsParams,
} from "@/libs/api/booking";

interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener bookings según el rol del usuario
 * - guest: obtiene sus reservas como comprador
 * - seller/administrator: obtiene reservas de sus listings como vendedor
 */
export const useBookings = (params?: GetBookingsParams): UseBookingsReturn => {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params?.page || 1);
  const [perPage, setPerPage] = useState(params?.per_page || 10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;

      // Si es seller o admin, obtiene reservas de sus listings
      if (user.role === "seller" || user.role === "administrator") {
        response = await getMyListingsBookings(params);
      } else {
        // Si es guest, obtiene sus reservas como comprador
        response = await getMyBookings(params);
      }

      setBookings(response.bookings);
      setTotal(response.total);
      setPage(response.page);
      setPerPage(response.per_page);
      setTotalPages(response.total_pages);
    } catch (err) {
      console.error("Error al obtener bookings:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar las reservas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params?.status, params?.page, params?.per_page]);

  return {
    bookings,
    loading,
    error,
    total,
    page,
    perPage,
    totalPages,
    refetch: fetchBookings,
  };
};
