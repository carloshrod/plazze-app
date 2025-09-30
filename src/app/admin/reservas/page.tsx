"use client";

import { BookingsTable } from "@/components/features/admin/bookings-table";

export default function ReservasPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:px-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-600">Gestiona las reservas de tus espacios</p>
        </div>
      </div>
      <BookingsTable />
    </div>
  );
}
