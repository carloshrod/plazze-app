import { mapPlazzeFromWP } from "@/helpers/plazze";
import { client } from "./client";
import { PlazzeWP, Plazze } from "@/types/plazze";
import Cookies from "js-cookie";

// Tipos simplificados para los filtros específicos
export interface PlazzeSearchParams {
  location?: string; // Búsqueda por ubicación (texto libre)
  people?: number; // Número mínimo de personas
  date?: string; // Fecha en formato YYYY-MM-DD
  time?: string; // Hora en formato HH:MM
  category?: string; // ID de categoría
  per_page?: number; // Paginación
  page?: number; // Página
}

// Nuevos tipos para plazzes del usuario
export interface UserPlazzeFilters {
  status?: "publish" | "pending" | "draft" | "private";
  page?: number;
  per_page?: number;
  search?: string;
  order?: "asc" | "desc";
}

export interface UserPlazzesResponse {
  plazzes: PlazzeWP[];
  totalFound: number;
  totalPages: number;
  currentPage: number;
}

export interface UserPlazzeStats {
  totalPlazzes: number;
  publishedPlazzes: number;
  pendingPlazzes: number;
  draftPlazzes: number;
}

export const plazzeLib = {
  getPlazzes: async (params?: PlazzeSearchParams) => {
    try {
      // Construir parámetros para la API de WordPress estándar
      const apiParams: any = {
        _embed: true, // Siempre incluir _embed para obtener imágenes
      };

      // Establecer per_page solo si no causa problemas
      if (params?.per_page) {
        apiParams.per_page = params.per_page;
        apiParams.page = params.page ?? 1;
      } else {
        // Intentar obtener más resultados, si falla WordPress usará su valor por defecto
        apiParams.per_page = 50;
        apiParams.page = 1;
      }

      // Si no hay parámetros, obtener todos los listings disponibles
      if (!params) {
        // Obtener los listings con configuración básica
        const { data: listings } = await client.get<PlazzeWP[]>(
          "/wp/v2/listing",
          { params: apiParams }
        );

        // Si no hay listings, retornar array vacío
        if (!listings || listings.length === 0) {
          return [];
        }

        // Mapear los listings básicos
        return listings.map((listing) => mapPlazzeFromWP(listing));
      }

      // Agregar parámetros básicos si existen
      if (params.location) apiParams.location = params.location;
      if (params.people) apiParams.people = params.people;
      if (params.date) apiParams.date = params.date;
      if (params.time) apiParams.time = params.time;
      if (params.category) apiParams.category = params.category;
      if (params.page) apiParams.page = params.page;

      // Obtener los listings con los parámetros construidos
      const { data: listings } = await client.get<PlazzeWP[]>(
        "/wp/v2/listing",
        { params: apiParams }
      );

      // Si no hay listings, retornar array vacío
      if (!listings || listings.length === 0) {
        return [];
      }

      // Mapear los listings con información simplificada
      return listings.map((listing) => mapPlazzeFromWP(listing));
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Error al obtener los plazzes"
        );
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  getPlazzeById: async (id: number): Promise<Plazze | null> => {
    try {
      const { data } = await client.get<PlazzeWP>(`/wp/v2/listing/${id}`, {
        params: {
          _embed: true,
        },
      });

      // Mapear el listing individual
      return mapPlazzeFromWP(data);
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Error al obtener el plazze"
        );
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  // 🔍 Búsqueda con filtros completos
  searchWithFilters: async (params: PlazzeSearchParams) => {
    try {
      const plazzes = await plazzeLib.getPlazzes(params);
      return plazzes;
    } catch (error: any) {
      console.error("❌ Error en búsqueda con filtros:", error);
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Error en la búsqueda con filtros"
        );
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  // 🏪 NUEVO: Obtener plazzes del usuario autenticado
  getUserPlazzes: async (
    filters: UserPlazzeFilters = {}
  ): Promise<UserPlazzesResponse> => {
    const token = Cookies.get("token");
    const userDataCookie = Cookies.get("user");

    if (!token || !userDataCookie) {
      throw new Error("Usuario no autenticado");
    }

    const userData = JSON.parse(decodeURIComponent(userDataCookie));
    const userId = userData.id;

    if (!userId) {
      throw new Error("ID de usuario no encontrado");
    }

    try {
      const params = {
        author: userId.toString(),
        per_page: filters.per_page || 10,
        page: filters.page || 1,
        orderby: "date",
        order: filters.order || "desc",
        _embed: true,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await client.get(`/wp/v2/listing`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const plazzes = response.data as PlazzeWP[];

      return {
        plazzes,
        totalFound: parseInt(response.headers["x-wp-total"] || "0"),
        totalPages: parseInt(response.headers["x-wp-totalpages"] || "1"),
        currentPage: filters.page || 1,
      };
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message ||
            "Error al obtener los plazzes del usuario"
        );
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  getCategories: async (): Promise<
    { id: number; name: string; slug: string }[]
  > => {
    try {
      const response = await client.get("/wp/v2/listing_category", {
        params: {
          per_page: 100, // Obtener todas las categorías
          orderby: "name",
          order: "asc",
        },
        timeout: 10000, // Timeout de 10 segundos
      });

      return response.data.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      }));
    } catch (error: any) {
      console.error("Error al obtener categorías:", error);

      // Si es rate limiting (429), retornar array vacío para usar fallback
      if (error?.response?.status === 429) {
        console.warn("Rate limit alcanzado para categorías");
        return [];
      }

      // Para otros errores, también retornar array vacío
      return [];
    }
  },

  getRegions: async (): Promise<
    { id: number; name: string; slug: string }[]
  > => {
    try {
      const response = await client.get("/wp/v2/region", {
        params: {
          per_page: 100, // Obtener todas las regiones
          orderby: "name",
          order: "asc",
        },
        timeout: 10000, // Timeout de 10 segundos
      });

      return response.data.map((region: any) => ({
        id: region.id,
        name: region.name,
        slug: region.slug,
      }));
    } catch (error: any) {
      console.error("Error al obtener regiones:", error);

      // Si es rate limiting (429), retornar array vacío para usar fallback
      if (error?.response?.status === 429) {
        console.warn("Rate limit alcanzado para regiones");
        return [];
      }

      // Para otros errores, también retornar array vacío
      return [];
    }
  },
};
