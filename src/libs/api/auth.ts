import { client } from "./client";

interface LoginResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
  role: "guest" | "seller";
}

interface RegisterResponse {
  message: string;
  user_id: number;
}

type UserRole = "guest" | "seller";

interface RegisterData {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role?: UserRole;
  businessName?: string;
  phone?: string;
}

export const authLib = {
  login: async (email: string, password: string) => {
    try {
      const { data } = await client.post<LoginResponse>("/plazze/v1/login", {
        username: email,
        password,
      });

      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Error de autenticación"
        );
      }
      // Si es un error de red o desconocido
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  register: async ({
    name,
    lastName,
    username,
    email,
    password,
    role = "guest",
    businessName,
    phone,
  }: RegisterData) => {
    try {
      const { data } = await client.post<RegisterResponse>(
        "/plazze/v1/register",
        {
          username,
          email,
          password,
          first_name: name,
          last_name: lastName,
          role,
          meta:
            role === "seller"
              ? {
                  business_name: businessName,
                  phone,
                }
              : undefined,
        }
      );

      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Error durante el registro"
        );
      }
      // Si es un error de red o desconocido
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  validateToken: async (token: string) => {
    try {
      const { data } = await client.post("/jwt-auth/v1/token/validate", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Token inválido o expirado"
        );
      }
      // Si es un error de red o desconocido
      throw new Error("No se pudo validar el token");
    }
  },

  updateEmail: async (email: string) => {
    try {
      const { data } = await client.post("/plazze/v1/update-email", { email });

      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Error al actualizar el email"
        );
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const { data } = await client.post("/plazze/v1/update-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      return data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(
          error.response.data.message || "Error al actualizar la contraseña"
        );
      }
      throw new Error("No se pudo conectar con el servidor");
    }
  },
};
