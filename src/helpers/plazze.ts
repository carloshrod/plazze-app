import {
  Plazze,
  PlazzeWP,
  BookableService,
  PlazzePricing,
  PlazzeFormData,
} from "@/types/plazze";
import { CreateListingData } from "@/libs/api/plazze";
import {
  cleanHtmlContent as cleanHtml,
  convertWPGalleryToUploadFormat,
} from "@/utils/format";
import dayjs from "dayjs";

// Helper function para mapear PlazzeWP a Plazze
export const mapPlazzeFromWP = (listing: PlazzeWP): Plazze => {
  // Imagen destacada - priorizar gallery, fallback a featured_image y _embedded
  const image =
    listing.gallery?.[0]?.url ||
    listing.featured_image?.url ||
    listing._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "";

  // Extraer términos desde _embedded['wp:term']
  const terms = listing._embedded?.["wp:term"] || [];

  // Buscar dinámicamente los arrays de cada taxonomía
  const findTerms = (taxonomy: string) => {
    const idx = terms.findIndex(
      (arr: any) => Array.isArray(arr) && arr[0]?.taxonomy === taxonomy
    );
    return idx !== -1 && Array.isArray(terms[idx]) ? terms[idx] : [];
  };

  const categoryTerms = findTerms("listing_category");
  const regionTerms = findTerms("region");

  const categoryNames = categoryTerms.map((c: any) => c.name);
  const regionNames = regionTerms.map((r: any) => r.name);

  // 💰 Mapear pricing - priorizar nuevo campo pricing, fallback a legacy
  const pricing: PlazzePricing = {
    price_min: parseFloat(
      listing.pricing?.price_min || listing.price_min || "0"
    ),
    price_max: parseFloat(
      listing.pricing?.price_max || listing.price_max || "0"
    ),
    price: parseFloat(listing.pricing?.price || "0"),
    booking_fee: parseFloat(listing.pricing?.booking_fee || "0"),
    security_deposit: parseFloat(listing.pricing?.security_deposit || "0"),
    cleaning_fee: parseFloat(listing.pricing?.cleaning_fee || "0"),
    price_per_hour: parseFloat(listing.pricing?.price_per_hour || "0"),
    price_per_day: parseFloat(listing.pricing?.price_per_day || "0"),
    price_per_week: parseFloat(listing.pricing?.price_per_week || "0"),
    price_per_month: parseFloat(listing.pricing?.price_per_month || "0"),
    price_type: listing.pricing?.price_type || "",
    currency: listing.pricing?.currency || "USD",
    price_range: listing.pricing?.price_range || "",
    extra_guest_fee: parseFloat(listing.pricing?.extra_guest_fee || "0"),
    discount_weekly: parseFloat(listing.pricing?.discount_weekly || "0"),
    discount_monthly: parseFloat(listing.pricing?.discount_monthly || "0"),
  };

  // 🛎️ Mapear bookable services
  const bookableServices: BookableService[] =
    listing.bookable_services?.services?.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.description,
      price: service.price,
      bookable_options: service.bookable_options as "onetime" | "byguest",
      bookable_quantity_max: service.bookable_quantity_max,
      multiply_by_guests: service.multiply_by_guests,
      one_time_fee: service.one_time_fee,
    })) || [];

  return {
    id: String(listing.id),
    name: listing.title.rendered,
    description: listing.content.rendered,
    image,
    region: regionNames.join(", ") || "",
    categories: categoryNames,
    address: listing.address || "",
    friendly_address: listing.friendly_address || "",
    latitude: listing.latitude,
    longitude: listing.longitude,
    listing_type: listing.listing_type,
    permalink: listing.permalink,

    // 💰 Nuevos campos de precios
    pricing,

    // 🛎️ Nuevos servicios reservables
    bookable_services: bookableServices,

    // Campos actualizados
    opening_hours: listing.opening_hours,
    capacity: listing.capacity,
    features: Array.isArray(listing.features)
      ? listing.features.map((f) =>
          typeof f === "string" ? f : f.name || f.value || String(f)
        )
      : [],
    gallery: listing.gallery || [],

    // Campos legacy para compatibilidad
    price_min: pricing.price_min,
    price_max: pricing.price_max,
  };
};

/**
 * Helpers para formatear datos del formulario al formato que espera Listeo
 */

/**
 * Convierte los horarios del formulario al formato que espera Listeo
 */
export function convertScheduleToListeoFormat(
  scheduleGroups: any[]
): Record<string, string> {
  if (!scheduleGroups || scheduleGroups.length === 0) {
    return {};
  }

  const openingHours: Record<string, string> = {};

  // Inicializar todos los días como vacíos
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  days.forEach((day) => {
    openingHours[`${day}_opening_hour`] = "";
    openingHours[`${day}_closing_hour`] = "";
  });

  // Aplicar horarios de cada grupo
  scheduleGroups.forEach((group) => {
    const openTime =
      group.open_time?.format?.("HH:mm") || group.open_time || "";
    const closeTime =
      group.close_time?.format?.("HH:mm") || group.close_time || "";

    if (group.days && Array.isArray(group.days)) {
      group.days.forEach((day: string) => {
        openingHours[`${day}_opening_hour`] = openTime;
        openingHours[`${day}_closing_hour`] = closeTime;
      });
    }
  });

  return openingHours;
}

/**
 * Convierte los servicios reservables al formato de menú de Listeo
 */
export function convertServicesToListeoMenu(bookableServices: any[]): any[] {
  if (!bookableServices || bookableServices.length === 0) {
    return [];
  }

  // Formato del menú de Listeo
  const menuSection = {
    menu_section_name: "Servicios Adicionales",
    menu_section_description:
      "Servicios opcionales disponibles para tu reserva",
    menu_elements: bookableServices.map((service, index) => ({
      menu_element_title: service.title || "",
      menu_element_description: service.description || "",
      menu_element_price: parseFloat(service.price) || 0,
      menu_element_id: `service_${index}`,
      multiply_by_guests: service.bookable_options === "byguest",
      one_time_fee: service.bookable_options === "onetime",
      bookable_quantity_max: 1,
    })),
  };

  return [menuSection];
}

/**
 * Formatear datos del formulario para enviar a la API de WordPress/Listeo
 */
export function formatFormDataForListeo(
  formData: PlazzeFormData,
  coordinates?: { lat: number; lng: number } | null
): CreateListingData {
  // Datos básicos
  const listingData: CreateListingData = {
    // Campos básicos de WordPress
    title: formData.title,
    content: formData.description || "",
    status: "publish", // Cambiar a publish para que sea visible inmediatamente

    // Campos de ubicación (WordPress los guardará con prefijo _)
    address: formData.address,
    friendly_address: formData.friendly_address || "",
    latitude: (coordinates?.lat || formData.latitude)?.toString() || "",
    longitude: (coordinates?.lng || formData.longitude)?.toString() || "",

    // Taxonomías (IDs como arrays)
    listing_category: formData.category || [],
    region: Array.isArray(formData.region)
      ? formData.region
      : formData.region
      ? [formData.region]
      : [],

    // Información del venue
    listing_type: "service", // Usar 'service' que es lo que aparece en el debug
    capacity: 1, // Valor por defecto, ya que no está en PlazzeFormData

    // Precios - usar los nombres exactos que WordPress espera
    currency: "USD",
    price_type: "fixed",
  };

  // Agregar precios si están definidos
  if (formData.price_min) {
    listingData.price_min = formData.price_min.toString();
    listingData.price = formData.price_min.toString(); // Precio base
  }

  if (formData.price_max) {
    listingData.price_max = formData.price_max.toString();
  }

  // Convertir horarios al formato de Listeo (WordPress los guardará con prefijo _)
  if (formData.schedule_groups && formData.schedule_groups.length > 0) {
    const openingHours = convertScheduleToListeoFormat(
      formData.schedule_groups
    );
    Object.assign(listingData, openingHours);

    // También agregar el estado de opening_hours
    (listingData as any).opening_hours_status = "on";
  }

  // Convertir servicios reservables al formato de menú de Listeo
  if (formData.bookable_services && formData.bookable_services.length > 0) {
    listingData.menu = convertServicesToListeoMenu(formData.bookable_services);
    // También agregar el estado del menú
    (listingData as any).menu_status = "on";
  }

  // Agregar galería de imágenes si está presente
  if (formData.gallery && formData.gallery.length > 0) {
    // Para IDs directos (ya subidos a WordPress)
    const galleryIds = formData.gallery
      .filter((item: any) => typeof item === "number")
      .map((id: number) => id);

    if (galleryIds.length > 0) {
      listingData.gallery = galleryIds;
    }
  }

  return listingData;
}

/**
 * Validar datos antes de enviar
 */
export function validateFormData(formData: PlazzeFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validaciones básicas
  if (!formData.title?.trim()) {
    errors.push("El título es requerido");
  }

  if (!formData.description?.trim()) {
    errors.push("La descripción es requerida");
  }

  if (!formData.address?.trim()) {
    errors.push("La dirección es requerida");
  }

  if (!formData.category || formData.category.length === 0) {
    errors.push("Debe seleccionar al menos una categoría");
  }

  if (!formData.latitude || !formData.longitude) {
    errors.push("Las coordenadas son requeridas");
  }

  // Validar horarios si están presentes
  if (formData.schedule_groups && formData.schedule_groups.length > 0) {
    formData.schedule_groups.forEach((schedule, index) => {
      if (!schedule.open_time || !schedule.close_time) {
        errors.push(
          `Horario ${index + 1}: Debe especificar hora de apertura y cierre`
        );
      }

      if (!schedule.days || schedule.days.length === 0) {
        errors.push(`Horario ${index + 1}: Debe seleccionar al menos un día`);
      }
    });
  }

  // Validar servicios si están presentes
  if (formData.bookable_services && formData.bookable_services.length > 0) {
    formData.bookable_services.forEach((service, index) => {
      if (!service.title?.trim()) {
        errors.push(`Servicio ${index + 1}: El título es requerido`);
      }

      if (!service.description?.trim()) {
        errors.push(`Servicio ${index + 1}: La descripción es requerida`);
      }

      if (!service.price || service.price <= 0) {
        errors.push(`Servicio ${index + 1}: El precio debe ser mayor a 0`);
      }

      if (!service.bookable_options) {
        errors.push(
          `Servicio ${index + 1}: Debe seleccionar el tipo de reserva`
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Convertir datos de WordPress/Listeo al formato del formulario para edición
 */
export function convertWPToFormData(
  listing: PlazzeWP
): Partial<PlazzeFormData> {
  const formData: Partial<PlazzeFormData> = {
    title: cleanHtml(listing.title?.rendered || ""),
    description: cleanHtml(listing.content?.rendered || ""),
    address: listing.address || "",
    friendly_address: listing.friendly_address || "",
    latitude: parseFloat(listing.latitude) || 0,
    longitude: parseFloat(listing.longitude) || 0,
  };

  // Precios
  if (listing.pricing) {
    formData.price_min = parseFloat(listing.pricing.price_min) || 0;
    formData.price_max = parseFloat(listing.pricing.price_max) || 0;
  }

  // Categorías - extraer IDs desde _embedded
  if (listing._embedded?.["wp:term"]) {
    const terms = listing._embedded["wp:term"] || [];
    const categoryTerms = terms.find(
      (arr: any) =>
        Array.isArray(arr) && arr[0]?.taxonomy === "listing_category"
    );
    const regionTerms = terms.find(
      (arr: any) => Array.isArray(arr) && arr[0]?.taxonomy === "region"
    );

    if (categoryTerms && Array.isArray(categoryTerms)) {
      formData.category = categoryTerms.map((c: any) => c.id);
    }

    if (regionTerms && Array.isArray(regionTerms)) {
      formData.region = regionTerms.map((r: any) => r.id);
    }
  }

  // Galería - convertir a formato Ant Design Upload
  if (listing.gallery && listing.gallery.length > 0) {
    formData.gallery = convertWPGalleryToUploadFormat(listing.gallery);
  } else {
    formData.gallery = [];
  }

  // Horarios - convertir desde opening_hours
  if (listing.opening_hours) {
    const scheduleGroups: any[] = [];
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    // Agrupar días por horarios similares
    const scheduleMap = new Map<string, string[]>();

    days.forEach((dayName) => {
      const daySchedule =
        listing.opening_hours?.[dayName as keyof typeof listing.opening_hours];
      if (daySchedule && daySchedule.open && daySchedule.close) {
        const timeKey = `${daySchedule.open}-${daySchedule.close}`;
        if (!scheduleMap.has(timeKey)) {
          scheduleMap.set(timeKey, []);
        }
        scheduleMap.get(timeKey)!.push(dayName);
      }
    });

    // Convertir el mapa a grupos de horarios
    scheduleMap.forEach((groupDays, timeKey) => {
      const [openTime, closeTime] = timeKey.split("-");

      // Convertir strings de tiempo a objetos dayjs válidos
      const openDayjs = openTime ? dayjs(openTime, "HH:mm") : null;
      const closeDayjs = closeTime ? dayjs(closeTime, "HH:mm") : null;

      // Solo agregar si ambos horarios son válidos
      if (
        openDayjs &&
        openDayjs.isValid() &&
        closeDayjs &&
        closeDayjs.isValid()
      ) {
        scheduleGroups.push({
          days: groupDays,
          open_time: openDayjs,
          close_time: closeDayjs,
        });
      }
    });

    formData.schedule_groups = scheduleGroups;
  } else {
    formData.schedule_groups = [];
  }

  // Servicios reservables - convertir desde bookable_services
  if (
    listing.bookable_services?.services &&
    listing.bookable_services.services.length > 0
  ) {
    formData.bookable_services = listing.bookable_services.services.map(
      (service: any) => ({
        title: cleanHtml(service.title || service.name || ""),
        description: cleanHtml(service.description || ""),
        price: parseFloat(service.price) || 0,
        bookable_options: service.bookable_options || "onetime",
      })
    );
  } else {
    formData.bookable_services = [];
  }

  return formData;
}
