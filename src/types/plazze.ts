/* eslint-disable no-unused-vars */
export interface PlazzeWP {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  status: string;
  region?: number[];
  listing_category?: number[];
  listing_feature?: number[];
  address?: string;
  friendly_address?: string;
  latitude: string;
  longitude: string;
  listing_type: string;
  permalink?: string;

  // 💰 NUEVO: Campo consolidado de precios
  pricing?: {
    price_min: string;
    price_max: string;
    price: string;
    booking_fee: string;
    security_deposit: string;
    cleaning_fee: string;
    price_per_hour: string;
    price_per_day: string;
    price_per_week: string;
    price_per_month: string;
    price_type: string;
    currency: string;
    price_range: string;
    extra_guest_fee: string;
    discount_weekly: string;
    discount_monthly: string;
  };

  // 🛎️ NUEVO: Servicios reservables desde el menú de Listeo
  bookable_services?: {
    services: Array<{
      id: number;
      title: string;
      description: string;
      price: number;
      bookable_options: string;
      bookable_quantity_max: string;
      multiply_by_guests: boolean;
      one_time_fee: boolean;
    }>;
    source: string;
    total_services_found: number;
    listing_id: number;
  };

  // 📷 NUEVO: Imagen destacada estructurada
  featured_image?: {
    id: number;
    url: string;
    thumbnail: string;
    medium: string;
    alt: string;
  };

  // Campos existentes actualizados
  capacity?: number;
  features?: string[] | any[];
  gallery?: Array<{
    id: number;
    filename: string;
    url: string;
    thumbnail?: string;
    medium?: string;
    alt: string;
    width: number;
    height: number;
  }>;
  opening_hours?: {
    monday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    tuesday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    wednesday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    thursday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    friday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    saturday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    sunday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
  };

  // Campos legacy mantenidos por compatibilidad
  price_min?: string;
  price_max?: string;

  _embedded?: {
    [key: string]: any;
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
  };
}

export interface BookableService {
  id: string;
  title: string;
  description: string;
  price: number;
  bookable_options: "onetime" | "byguest";
  bookable_quantity_max: string;
  multiply_by_guests: boolean;
  one_time_fee: boolean;
}

export interface PlazzePricing {
  price_min: number;
  price_max: number;
  price: number;
  booking_fee: number;
  security_deposit: number;
  cleaning_fee: number;
  price_per_hour: number;
  price_per_day: number;
  price_per_week: number;
  price_per_month: number;
  price_type: string;
  currency: string;
  price_range: string;
  extra_guest_fee: number;
  discount_weekly: number;
  discount_monthly: number;
}

export interface PlazzeFormData {
  id: number;
  // Basic Information
  title: string;
  category: number[];

  // Location
  address: string;
  friendly_address?: string;
  region?: number | number[];
  latitude?: number;
  longitude?: number;

  // Gallery
  gallery: any[];

  // Details
  description: string;
  price_min?: number;
  price_max?: number;

  // Bookable Services
  bookable_services: Array<{
    title: string;
    description: string;
    price: number;
    bookable_options: "onetime" | "byguest";
  }>;

  // Schedule Groups (New Structure)
  schedule_groups: Array<{
    open_time: any; // dayjs object or string
    close_time: any; // dayjs object or string
    days: string[];
  }>;
}

export interface Plazze {
  id: string;
  name: string;
  description: string;
  image: string;
  region: string;
  categories: string[];
  address: string;
  friendly_address: string;
  latitude: string;
  longitude: string;
  listing_type: string;
  permalink?: string;

  // 💰 NUEVO: Precios estructurados
  pricing: PlazzePricing;

  // 🛎️ NUEVO: Servicios reservables
  bookable_services: BookableService[];

  // Campos actualizados
  capacity?: number;
  features?: string[];
  gallery?: Array<{
    id: number;
    filename: string;
    url: string;
    thumbnail?: string;
    medium?: string;
    alt: string;
    width: number;
    height: number;
  }>;
  opening_hours?: {
    monday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    tuesday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    wednesday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    thursday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    friday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    saturday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
    sunday?: {
      open: string;
      close: string;
      is_closed?: boolean;
      is_24h?: boolean;
    };
  };

  // Campos legacy mantenidos por compatibilidad
  price_min: number;
  price_max: number;
}

export interface PlazzeStore {
  plazzes: Plazze[];
  loading: boolean;
  error: string | null;
  setPlazzes: (plazzes: Plazze[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPlazzes: () => void;
}
