export interface Booking {
  id: string;
  plazze: {
    name: string;
    image: string;
  };
  date: string;
  time: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}
