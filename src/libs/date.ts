import dayjs from "dayjs";
import "dayjs/locale/es";
import type { Dayjs } from "dayjs";

// Configurar dayjs para usar el locale español
dayjs.locale("es");

/**
 * Formatea una fecha al formato panameño
 * @param date - La fecha a formatear
 * @param includeTime - Si se debe incluir la hora
 * @returns String formateado (ej: 29 de septiembre de 2025, 14:30)
 */
export function formatDate(
  date: Date | Dayjs,
  includeTime: boolean = true
): string {
  const d = dayjs.isDayjs(date) ? date : dayjs(date);
  if (includeTime) {
    return d.format("DD [de] MMMM [de] YYYY, HH:mm");
  }
  return d.format("DD [de] MMMM [de] YYYY");
}

/**
 * Formatea una hora
 * @param date - La fecha de la cual extraer la hora
 * @returns String formateado (ej: 14:30)
 */
export function formatTime(date: Date | Dayjs): string {
  const d = dayjs.isDayjs(date) ? date : dayjs(date);
  return d.format("HH:mm");
}
