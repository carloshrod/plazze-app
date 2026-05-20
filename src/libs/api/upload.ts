import { client } from "./client";
import Cookies from "js-cookie";

/**
 * Comprime una imagen usando Canvas API antes de subirla.
 * Reduce imágenes grandes a max 1600px de ancho con calidad 82%.
 * Si el resultado es mayor que el original, retorna el original.
 * Salta archivos ya pequeños (< 800KB) y GIFs.
 */
const compressImage = (
  file: File,
  maxWidthPx = 1600,
  quality = 0.82,
): Promise<File> => {
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/gif" ||
    file.size < 500 * 1024
  ) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement("canvas");
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      if (w > maxWidthPx) {
        h = Math.round((h * maxWidthPx) / w);
        w = maxWidthPx;
      }

      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, w, h);

      const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) return resolve(file);
          const ext = outputType === "image/png" ? ".png" : ".jpg";
          const name = file.name.replace(/\.[^.]+$/, ext);
          resolve(
            new File([blob], name, {
              type: outputType,
              lastModified: Date.now(),
            }),
          );
        },
        outputType,
        quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

export interface UploadResponse {
  id: number;
  title: { rendered: string };
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: {
      thumbnail: { source_url: string };
      medium: { source_url: string };
      large: { source_url: string };
    };
  };
}

/**
 * Subir un archivo a WordPress Media Library
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("Usuario no autenticado");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", file.name);
  formData.append("alt_text", file.name);

  try {
    const response = await client.post("/wp/v2/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ Error subiendo archivo:", error);

    if (error.response?.status === 401) {
      throw new Error("No tienes permisos para subir archivos");
    }

    if (error.response?.status === 413) {
      throw new Error("El archivo es demasiado grande");
    }

    throw new Error(
      error.response?.data?.message || "Error al subir el archivo",
    );
  }
};

export interface BatchUploadItem {
  id: number;
  url: string;
}

/**
 * Subir múltiples archivos a través del proxy Next.js (/api/plazze/upload).
 *
 * Envía UN archivo por request para evitar 413 en proxies con bajo
 * client_max_body_size (nginx por defecto: 1MB). La concurrencia de 3
 * se aplica en el cliente, agrupando los requests en lotes de BATCH_SIZE.
 */
export const uploadFiles = async (
  files: File[],
): Promise<BatchUploadItem[]> => {
  const token = Cookies.get("token");
  const BATCH_SIZE = 3;

  const uploadOne = async (file: File): Promise<BatchUploadItem> => {
    const compressed = await compressImage(file);
    const formData = new FormData();
    formData.append("files[]", compressed);

    const response = await fetch("/api/plazze/upload", {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const msg = (errData as { message?: string })?.message;
      if (response.status === 401)
        throw new Error("No tienes permisos para subir archivos");
      if (response.status === 413)
        throw new Error(`${file.name}: El archivo es demasiado grande`);
      throw new Error(msg ?? `Error al subir ${file.name}`);
    }

    const { uploaded } = (await response.json()) as {
      uploaded: BatchUploadItem[];
      errors: string[];
    };

    if (!uploaded?.[0]) throw new Error(`Error al subir ${file.name}`);
    return uploaded[0];
  };

  const uploaded: BatchUploadItem[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(uploadOne));
    results.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        uploaded.push(result.value);
      } else {
        const reason = result.reason;
        errors.push(
          reason instanceof Error
            ? reason.message
            : `Error al subir ${batch[idx].name}`,
        );
      }
    });
  }

  if (errors.length > 0) {
    console.warn("⚠️ Algunos archivos fallaron al subir:", errors);
  }

  return uploaded;
};
