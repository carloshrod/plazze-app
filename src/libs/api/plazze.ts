import { mapPlazzeFromWP } from "@/helpers/plazze";
import { client } from "./client";
import { PlazzeWP, Plazze } from "@/types/plazze";
import Cookies from "js-cookie";

// Interfaz para los datos que se envían a la API de WordPress/Listeo
export interface CreateListingData {
  title: string;
  content: string;
  status?: "publish" | "draft" | "pending" | "private";

  // Campos de ubicación
  address?: string;
  friendly_address?: string;
  latitude?: string;
  longitude?: string;

  // Taxonomías
  listing_category?: number[];
  region?: number[];

  // Campos específicos de Listeo
  listing_type?: string;
  capacity?: number;

  // Precios
  price?: string;
  price_min?: string;
  price_max?: string;
  price_per_hour?: string;
  price_per_day?: string;
  currency?: string;
  price_type?: string;

  // Horarios de apertura (formato Listeo)
  monday_opening_hour?: string;
  monday_closing_hour?: string;
  tuesday_opening_hour?: string;
  tuesday_closing_hour?: string;
  wednesday_opening_hour?: string;
  wednesday_closing_hour?: string;
  thursday_opening_hour?: string;
  thursday_closing_hour?: string;
  friday_opening_hour?: string;
  friday_closing_hour?: string;
  saturday_opening_hour?: string;
  saturday_closing_hour?: string;
  sunday_opening_hour?: string;
  sunday_closing_hour?: string;

  // Estados de configuración
  opening_hours_status?: string;
  menu_status?: string;

  // Servicios reservables (formato Listeo menu)
  menu?: any[];

  // Galería de imágenes
  gallery?: number[] | any;
}

// Tipos simplificados para los filtros específicos
export interface PlazzeSearchParams {
  location?: string; // Búsqueda por ubicación (texto libre)
  people?: number; // Número mínimo de personas
  date?: string; // Fecha en formato YYYY-MM-DD
  time?: string; // Hora en formato HH:MM
  category?: string; // ID de categoría
  per_page?: number; // Paginación
  page?: number; // Página
  featured?: boolean; // Solo destacados
}

// Nuevos tipos para plazzes del usuario
export interface UserPlazzeFilters {
  status?:
    | "publish"
    | "pending"
    | "draft"
    | "private"
    | "publish,draft,pending,private";
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
          { params: apiParams },
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
        { params: apiParams },
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
          error.response.data.message || "Error al obtener los plazzes",
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
          error.response.data.message || "Error al obtener el plazze",
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
          error.response.data.message || "Error en la búsqueda con filtros",
        );
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  // 🏪 NUEVO: Obtener plazzes del usuario autenticado
  getUserPlazzes: async (
    filters: UserPlazzeFilters = {},
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
            "Error al obtener los plazzes del usuario",
        );
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  // 🔑 Admin: Obtener TODOS los plazzes sin filtro de autor
  getAllPlazzes: async (
    filters: UserPlazzeFilters = {},
  ): Promise<UserPlazzesResponse> => {
    try {
      const params = {
        per_page: filters.per_page || 10,
        page: filters.page || 1,
        orderby: "date",
        order: filters.order || "desc",
        _embed: true,
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
      };

      const response = await client.get(`/wp/v2/listing`, { params });
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
          error.response.data.message || "Error al obtener todos los plazzes",
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

  createListing: async (data: CreateListingData): Promise<PlazzeWP> => {
    try {
      // 1. Crear el listing usando la API estándar de WordPress
      const response = await client.post("/wp/v2/listing", data);

      const createdListingId = response.data.id;

      // 2. Obtener el listing completo usando nuestra API custom que procesa todos los campos
      try {
        const { data: completeListing } = await client.get(
          `/wp/v2/listing/${createdListingId}`,
        );

        return completeListing;
      } catch (fetchError) {
        console.warn(
          "⚠️ No se pudo obtener el listing completo, devolviendo datos básicos",
        );
        // Si no podemos obtener el listing completo, devolvemos lo que tenemos
        return response.data;
      }
    } catch (error: any) {
      console.error("❌ Error creando listing:", error);

      if (error.response?.status === 401) {
        throw new Error("No tienes permisos para crear listings");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Acceso denegado. Verifica que tu usuario tenga los permisos correctos.",
        );
      }

      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Datos inválidos";
        throw new Error(errorMessage);
      }

      throw new Error(
        error.response?.data?.message || "Error al crear el listing",
      );
    }
  },

  updateListingGallery: async (
    listingId: number,
    galleryIds: number[],
  ): Promise<void> => {
    try {
      // Intentar con endpoint personalizado directamente (más confiable)
      try {
        await client.post(`/plazze/v1/update-gallery/${listingId}`, {
          gallery_ids: galleryIds,
        });
      } catch (customError: any) {
        console.error(
          "❌ Endpoint personalizado falló:",
          customError.response?.data || customError.message,
        );
        console.error("❌ Status:", customError.response?.status);
        console.error("❌ Full error:", customError);

        // Si el endpoint personalizado falla, intentar con PUT estándar
        await client.put(`/wp/v2/listing/${listingId}`, {
          gallery: galleryIds,
        });
      }
    } catch (error: any) {
      console.error("❌ Error actualizando galería:", error);
      console.error("❌ Error response:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      throw new Error(
        error.response?.data?.message || "Error al actualizar la galería",
      );
    }
  },

  // NUEVO: Actualizar un listing existente
  updateListing: async (
    id: number,
    data: CreateListingData,
  ): Promise<PlazzeWP> => {
    try {
      // 1. Actualizar el listing usando la API estándar de WordPress
      const response = await client.put(`/wp/v2/listing/${id}`, data);

      // 2. Obtener el listing actualizado completo
      try {
        const { data: updatedListing } = await client.get(
          `/wp/v2/listing/${id}`,
          {
            params: {
              _embed: true,
            },
          },
        );

        return updatedListing;
      } catch (fetchError) {
        console.warn(
          "⚠️ No se pudo obtener el listing actualizado completo, devolviendo datos básicos",
        );
        // Si no podemos obtener el listing completo, devolvemos lo que tenemos
        return response.data;
      }
    } catch (error: any) {
      console.error(`❌ Error actualizando listing ${id}:`, error);

      if (error.response?.status === 401) {
        throw new Error("No tienes permisos para actualizar listings");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Acceso denegado. No tienes permisos para editar este plazze.",
        );
      }

      if (error.response?.status === 404) {
        throw new Error("El plazze no existe o ha sido eliminado");
      }

      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "Datos inválidos";
        throw new Error(errorMessage);
      }

      throw new Error(
        error.response?.data?.message || "Error al actualizar el listing",
      );
    }
  },

  deleteListing: async (id: number): Promise<void> => {
    try {
      await client.post(`/plazze/v1/listing/${id}/delete`);
    } catch (error: any) {
      console.error(`❌ Error eliminando listing ${id}:`, error);

      if (error.response?.status === 401) {
        throw new Error("No tienes permisos para eliminar listings");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Acceso denegado. No tienes permisos para eliminar este plazze.",
        );
      }

      if (error.response?.status === 404) {
        throw new Error("El plazze no existe o ya ha sido eliminado");
      }

      throw new Error(
        error.response?.data?.message || "Error al eliminar el listing",
      );
    }
  },

  // ⭐ Obtener listings destacados (público)
  getFeaturedPlazzes: async (): Promise<Plazze[]> => {
    try {
      const { data } = await client.get<PlazzeWP[]>(
        "/plazze/v1/featured-listings",
      );
      return data.map((listing) => mapPlazzeFromWP(listing));
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Error al obtener los plazzes destacados",
      );
    }
  },

  // ⭐ Alternar el estado "destacado" de un listing (solo admin)
  toggleFeatured: async (
    id: number,
  ): Promise<{ id: number; is_featured: boolean }> => {
    try {
      const { data } = await client.post(`/plazze/v1/toggle-featured/${id}`);
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          "Error al actualizar el estado destacado",
      );
    }
  },
};
