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
