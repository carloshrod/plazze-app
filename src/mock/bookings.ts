import { Booking } from "@/types/booking";

export const mockBookings: Booking[] = [
  {
    id: "1",
    plazze: {
      name: "Sala de Eventos Principal",
      image: "https://i.pravatar.cc/150?img=1",
    },
    date: "2025-10-01",
    time: "09:00 - 13:00",
    price: 150,
    status: "confirmed",
  },
  {
    id: "2",
    plazze: {
      name: "Estudio Fotográfico",
      image: "https://i.pravatar.cc/150?img=2",
    },
    date: "2025-10-02",
    time: "14:00 - 18:00",
    price: 80,
    status: "pending",
  },
  {
    id: "3",
    plazze: {
      name: "Sala de Reuniones A",
      image: "https://i.pravatar.cc/150?img=3",
    },
    date: "2025-10-02",
    time: "14:00 - 18:00",
    price: 60,
    status: "completed",
  },
];
