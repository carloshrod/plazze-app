import { Plazze } from "@/types/plazze";

export const mockPlazzes: Plazze[] = [
  {
    id: "1",
    name: "Terraza Verde",
    description:
      "Hermosa terraza con vista panorámica, perfecta para eventos sociales y corporativos. Ambiente moderno y acogedor con áreas verdes.",
    image: "https://images.unsplash.com/photo-1525268771113-32d9e9021a97?w=800",
    location: "Costa del Este, Ciudad de Panamá",
    coordinates: {
      lat: 9.0112,
      lng: -79.4717,
    },
    capacity: 100,
    schedule: "9:00 AM - 10:00 PM",
    price: 150,
    category: "terrazas",
    status: "active",
  },
  {
    id: "2",
    name: "Salón Dorado",
    description:
      "Elegante salón de eventos con capacidad para grandes reuniones. Decoración clásica y moderna, perfecto para bodas y eventos corporativos.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
    location: "Calle 50, Ciudad de Panamá",
    coordinates: {
      lat: 8.9824,
      lng: -79.5197,
    },
    capacity: 200,
    schedule: "10:00 AM - 12:00 AM",
    price: 300,
    category: "salones",
    status: "maintenance",
  },
  {
    id: "3",
    name: "Rooftop Skyline",
    description:
      "Espectacular rooftop con vistas a la ciudad. Ideal para eventos sociales, fiestas privadas y sesiones fotográficas.",
    image: "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800",
    location: "San Francisco, Ciudad de Panamá",
    coordinates: {
      lat: 8.9943,
      lng: -79.5079,
    },
    capacity: 150,
    schedule: "4:00 PM - 2:00 AM",
    price: 250,
    category: "terrazas",
    status: "active",
  },
  {
    id: "4",
    name: "Studio Creative",
    description:
      "Espacio creativo y versátil, perfecto para workshops, reuniones y eventos corporativos. Ambiente industrial moderno.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    location: "Obarrio, Ciudad de Panamá",
    coordinates: {
      lat: 8.9879,
      lng: -79.5269,
    },
    capacity: 50,
    schedule: "8:00 AM - 8:00 PM",
    price: 100,
    category: "estudios",
    status: "inactive",
  },
  {
    id: "5",
    name: "Casa Garden",
    description:
      "Hermosa casa con jardín para eventos al aire libre. Ideal para bodas, cumpleaños y celebraciones familiares.",
    image: "https://images.unsplash.com/photo-1464808322410-1a934aab61e5?w=800",
    location: "Clayton, Ciudad de Panamá",
    coordinates: {
      lat: 9.0167,
      lng: -79.5833,
    },
    capacity: 120,
    schedule: "10:00 AM - 11:00 PM",
    price: 200,
    category: "jardines",
    status: "active",
  },
];
