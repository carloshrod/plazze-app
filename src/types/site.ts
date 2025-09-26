export interface Site {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  capacity: number;
  schedule: string;
  price: number;
  category: string;
}
