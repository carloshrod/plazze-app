import {
  Plazze,
  PlazzeWP,
  BookableService,
  PlazzePricing,
} from "@/types/plazze";

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
