import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthStore } from "@/stores/auth";
import { authLib } from "@/libs/api/auth";
import showMessage from "@/libs/message";
import { ROUTES } from "@/consts/routes";
import { LoginFormFields, RegisterData } from "@/types/auth";

export const useAuthService = () => {
  const { setAuth, clearAuth, setIsLoadingAuth } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const initAuth = async () => {
    setIsLoadingAuth(true);

    // Recuperar token y datos del usuario desde cookies
    const token = Cookies.get("token");
    const userDataCookie = Cookies.get("user");

    if (!token || !userDataCookie) {
      logout(false);
      return;
    }

    try {
      const res = await authLib.validateToken(token);

      if (!res?.data?.status || res.data.status !== 200) {
        throw new Error("Token inválido");
      }

      const userData = JSON.parse(decodeURIComponent(userDataCookie));
      setAuth(token, userData);
    } catch (error) {
      console.error("Error en initAuth:", error);
      logout();
    }
  };

  const login = async (
    loginData: LoginFormFields,
    redirect: boolean = true,
    redirectTo?: string | undefined
  ) => {
    try {
      setLoading(true);

      const data = await authLib.login(loginData?.email, loginData?.password);

      // Guardar token en cookies
      Cookies.set("token", data.token, {
        expires: 30, // 30 días
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      // Datos del usuario
      const userData = {
        email: data.user_email,
        username: data.user_nicename,
        displayName: data.user_display_name,
        role: data.role,
      };

      // Guardar datos del usuario en cookies
      Cookies.set("user", JSON.stringify(userData), {
        expires: 30,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      if (redirect) {
        if (redirectTo) {
          // Si hay una redirección específica en los parámetros, usarla
          router.push(redirectTo);
        } else {
          // Si no, redirigir según el rol
          const defaultRedirect =
            data?.role === "seller"
              ? ROUTES.ADMIN.DASHBOARD
              : ROUTES.ADMIN.BOOKINGS;
          router.push(defaultRedirect);
        }
      }

      setAuth(data?.token, userData);
      showMessage.success("Inicio de sesión exitoso");
    } catch (error) {
      console.error("Error durante el login:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error durante el login";
      showMessage.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      await authLib.register(data);
      showMessage.success("Registro exitoso");

      await login({ email: data.email, password: data.password });
    } catch (error) {
      console.error("Error durante el registro:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocurrió un error durante el registro";
      showMessage.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = (redirect: boolean = true) => {
    if (redirect) {
      router.push(ROUTES.PUBLIC.AUTH.LOGIN);
    }

    // Eliminar auth cookies
    Cookies.remove("token", { path: "/" });
    Cookies.remove("user", { path: "/" });

    clearAuth();
  };

  return {
    initAuth,
    login,
    register,
    logout,
    loading,
  };
};
