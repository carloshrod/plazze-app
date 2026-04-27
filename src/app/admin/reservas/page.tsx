"use client";

import { Skeleton } from "antd";
import { BookingsTable } from "@/components/features/admin/bookings/bookings-table";
import { useAuthStore } from "@/stores/auth";

export default function ReservasPage() {
  const { user, isLoadingAuth } = useAuthStore();
  const isAdmin = user?.role === "administrator";

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:px-4">
        <div>
          {isLoadingAuth ? (
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="large" className="!min-w-80" />
              <Skeleton.Input active className="!min-w-96" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isAdmin ? "Reservas" : "Mis Reservas"}
              </h1>
              <p className="text-gray-600">
                {isAdmin
                  ? "Gestiona todas las reservas de la plataforma"
                  : user?.role === "seller"
                    ? "Gestiona las reservas de tus espacios"
                    : "Consulta el historial de tus reservas"}
              </p>
            </>
          )}
        </div>
      </div>
      <BookingsTable />
    </div>
  );
}
