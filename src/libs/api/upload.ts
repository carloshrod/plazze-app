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
      error.response?.data?.message || "Error al subir el archivo"
    );
  }
};

/**
 * Subir múltiples archivos
 */
export const uploadFiles = async (files: File[]): Promise<UploadResponse[]> => {
  const uploadPromises = files.map((file) => uploadFile(file));

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("❌ Error subiendo archivos:", error);
    throw error;
  }
};
