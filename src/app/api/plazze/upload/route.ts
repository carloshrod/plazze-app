import { NextRequest, NextResponse } from "next/server";
import axios, { type AxiosError } from "axios";

// El body parser de Next.js tiene un límite de 1MB por defecto.
// Las galerías de imágenes pueden superar ese límite fácilmente.
export const maxDuration = 60;
export const dynamic = "force-dynamic";

const WP_MEDIA_URL = `${process.env.NEXT_PUBLIC_API_URL}/wp/v2/media`;

/** Subidas simultáneas máximas por lote (evita 429 en WordPress). */
const BATCH_SIZE = 3;

/**
 * Sube un único archivo a la WordPress Media Library.
 * Extrae la lógica para poder usarla con Promise.allSettled en lotes.
 */
const uploadSingleFile = async (
  file: File,
  authHeader: string,
  origin: string,
  userAgent: string,
): Promise<{ id: number; url: string }> => {
  const buffer = await file.arrayBuffer();
  const blob = new Blob([buffer], { type: file.type });
  const wpFormData = new FormData();
  wpFormData.append("file", blob, file.name);
  wpFormData.append("title", file.name);

  const res = await axios.post<{ id: number; source_url: string }>(
    WP_MEDIA_URL,
    wpFormData,
    {
      headers: {
        Authorization: authHeader,
        "X-Requested-With": "XMLHttpRequest",
        ...(origin ? { Origin: origin } : {}),
        ...(userAgent ? { "User-Agent": userAgent } : {}),
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    },
  );

  return { id: res.data.id, url: res.data.source_url };
};

/**
 * Proxy para subida de múltiples imágenes a WordPress Media Library.
 *
 * Recibe los archivos como multipart/form-data con campo `files[]`,
 * los sube en lotes de BATCH_SIZE (concurrencia controlada) y retorna
 * { uploaded: [{id, url}], errors: [] }.
 *
 * Usa axios (HTTP/1.1) en lugar de fetch/undici para evitar problemas de
 * compatibilidad SSL/protocolo con el servidor WordPress.
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const origin = request.headers.get("origin") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";

  if (!authHeader) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { message: "Cuerpo de la petición inválido" },
      { status: 400 },
    );
  }

  const files = formData.getAll("files[]") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json(
      { message: "No se enviaron archivos" },
      { status: 400 },
    );
  }

  const uploaded: { id: number; url: string }[] = [];
  const errors: string[] = [];

  // Procesar en lotes de BATCH_SIZE para subir en paralelo controlado
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((file) =>
        uploadSingleFile(file, authHeader, origin, userAgent),
      ),
    );
    results.forEach((result, idx) => {
      const file = batch[idx];
      if (result.status === "fulfilled") {
        uploaded.push(result.value);
      } else {
        const axiosErr = result.reason as AxiosError<{ message?: string }>;
        const msg =
          axiosErr.response?.data?.message ??
          axiosErr.message ??
          "Error desconocido";
        errors.push(`${file.name}: ${msg}`);
      }
    });
  }

  if (uploaded.length === 0 && errors.length > 0) {
    return NextResponse.json({ message: errors.join("; ") }, { status: 500 });
  }

  return NextResponse.json({ uploaded, errors });
}
