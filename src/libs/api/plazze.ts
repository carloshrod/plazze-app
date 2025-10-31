import { mapPlazzeFromWP } from "@/helpers/plazze";
import { client } from "./client";
import { PlazzeWP, Plazze } from "@/types/plazze";

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
};
