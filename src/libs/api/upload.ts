import { client } from "./client";
import Cookies from "js-cookie";

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
 * El proxy sube cada archivo secuencialmente a /wp/v2/media desde el servidor,
 * evitando CORS, límites de post_max_size y errores 429.
 */
export const uploadFiles = async (
  files: File[],
): Promise<BatchUploadItem[]> => {
  const token = Cookies.get("token");

  const formData = new FormData();
  files.forEach((file) => formData.append("files[]", file));

  try {
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
        throw new Error("Los archivos son demasiado grandes");
      throw new Error(msg || "Error al subir los archivos");
    }

    const { uploaded, errors } = (await response.json()) as {
      uploaded: BatchUploadItem[];
      errors: string[];
    };

    if (errors && errors.length > 0) {
      console.warn("⚠️ Algunos archivos fallaron al subir:", errors);
    }

    return uploaded;
  } catch (error: unknown) {
    console.error("❌ Error subiendo archivos:", error);
    throw error instanceof Error
      ? error
      : new Error("Error al subir los archivos");
  }
};
