/**
 * Formatea un valor numérico a dólares estadounidenses (USD)
 * @param value - El valor a formatear
 * @returns String formateado (ej: $1,234.56)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-PA", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol",
  }).format(value);
}

/**
 * Capitaliza la primera letra de cada palabra en un texto
 * @param text - El texto a formatear
 * @returns El texto con la primera letra de cada palabra en mayúscula
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Decodificar entidades HTML
 * @param str - String con entidades HTML
 * @returns String decodificado
 */
export function decodeHtmlEntities(str: string): string {
  if (typeof window !== "undefined") {
    // En el cliente, usar el DOM
    const textarea = document.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  } else {
    // En el servidor, usar reemplazos básicos
    return str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  }
}

/**
 * Limpiar contenido HTML y decodificar entidades
 * @param htmlContent - Contenido HTML a limpiar
 * @returns Texto limpio sin HTML ni entidades
 */
export function cleanHtmlContent(htmlContent: string): string {
  if (!htmlContent) return "";

  // Primero decodificar entidades HTML
  let cleaned = decodeHtmlEntities(htmlContent);

  // Remover etiquetas HTML básicas
  cleaned = cleaned.replace(/<[^>]*>/g, "");

  // Limpiar espacios extras
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  return cleaned;
}

/**
 * Procesar galería para edición: separar imágenes existentes de nuevas
 * @param galleryItems - Items de galería del formulario Ant Design
 * @returns Objeto con imágenes existentes e IDs de nuevas imágenes subidas
 */
export function processGalleryForEdit(galleryItems: any[]): {
  existingImageIds: number[];
  newFiles: File[];
  hasChanges: boolean;
} {
  if (!galleryItems || galleryItems.length === 0) {
    return {
      existingImageIds: [],
      newFiles: [],
      hasChanges: false,
    };
  }

  const existingImageIds: number[] = [];
  const newFiles: File[] = [];
  let hasChanges = false;

  galleryItems.forEach((item: any) => {
    if (item.originFileObj instanceof File) {
      // Nueva imagen que necesita ser subida
      newFiles.push(item.originFileObj);
      hasChanges = true;
    } else if (item.uid && item.status === "done" && !item.originFileObj) {
      // Imagen existente - extraer ID
      const imageId = parseInt(item.uid);
      if (!isNaN(imageId) && imageId > 0) {
        existingImageIds.push(imageId);
      }
    }
  });

  return {
    existingImageIds,
    newFiles,
    hasChanges,
  };
}

/**
 * Convertir galería de WordPress al formato Ant Design Upload
 * @param wpGallery - Galería desde WordPress API
 * @returns Array de items para Ant Design Upload component
 */
export function convertWPGalleryToUploadFormat(wpGallery: any[]): any[] {
  if (!wpGallery || wpGallery.length === 0) {
    return [];
  }

  return wpGallery.map((img, index) => ({
    uid: img.id?.toString() || index.toString(),
    name: img.alt || `imagen-${index}`,
    status: "done" as const,
    url: img.url,
    thumbUrl: img.thumbnail || img.url,
    response: {
      id: img.id,
      url: img.url,
    },
  }));
}
