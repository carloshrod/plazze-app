"use client";

import { BookingsTable } from "@/components/features/admin/bookings-table";
import { useAuthStore } from "@/stores/auth";

export default function ReservasPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "administrator";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isAdmin ? "Todas las Reservas" : "Mis Reservas"}
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? "Gestiona todas las reservas de la plataforma"
              : user?.role === "seller"
                ? "Gestiona las reservas de tus espacios"
                : "Consulta el historial de tus reservas"}
          </p>
        </div>
      </div>
      <BookingsTable />
    </div>
  );
}
