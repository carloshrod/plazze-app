/* eslint-disable no-unused-vars */

// Interfaces para taxonomías de WordPress
export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  [key: string]: any;
}

export interface WPRegion {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  [key: string]: any;
}

// Parámetros para búsqueda avanzada
export interface AdvancedSearchParams {
  search?: string;
  location_search?: string;
  min_capacity?: number;
  categories?: number[];
  regions?: number[];
  available_time?: string;
  price_min?: number;
  price_max?: number;
  per_page?: number;
  page?: number;
  _embed?: boolean;
}

// Parámetros básicos para fetchPlazzes
export interface FetchPlazzesParams {
  search?: string;
  location_search?: string;
  min_capacity?: number;
  available_time?: string;
  per_page?: number;
  page?: number;
  _embed?: boolean;
}

// Respuesta del API de WordPress con paginación
export interface WPAPIResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}
