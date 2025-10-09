import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "./consts/routes";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userDataCookie = request.cookies.get("user")?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  // Si es una ruta de admin y no hay token, redirige al login
  if (isAdminRoute && !token) {
    const loginUrl = new URL(ROUTES.PUBLIC.AUTH.LOGIN, request.url);
    // Guardamos la URL original para redirigir después del login
    if (request.nextUrl.pathname !== ROUTES.ADMIN.DASHBOARD) {
      // Validar si el request.nextUrl.pathname existe en las rutas definidas
      const allAdminRoutes = Object.values(ROUTES.ADMIN);
      const isValidRoute = allAdminRoutes.includes(
        request.nextUrl.pathname as any
      );

      if (isValidRoute) {
        loginUrl.searchParams.set("redirect_to", request.nextUrl.pathname);
      }
    }
    return NextResponse.redirect(loginUrl);
  }

  // Verificar acceso basado en rol
  if (isAdminRoute && userDataCookie) {
    try {
      const userData = JSON.parse(decodeURIComponent(userDataCookie));
      const userRole = userData.role ?? "unknown";

      // Para guests, definir rutas permitidas
      const guestAllowedRoutes = [ROUTES.ADMIN.BOOKINGS, ROUTES.ADMIN.PROFILE];
      const isAllowedRoute = guestAllowedRoutes.some(
        (route) => request.nextUrl.pathname === route
      );

      // Si es guest y trata de acceder a una ruta no permitida
      if (userRole === "guest" && !isAllowedRoute) {
        return NextResponse.redirect(
          new URL(ROUTES.ADMIN.BOOKINGS, request.url)
        );
      }

      // Si es seller, permitir acceso a todas las rutas de admin
      if (userRole === "seller") {
        return NextResponse.next();
      }
    } catch (error) {
      console.error("Error al verificar el rol del usuario:", error);
      // Si hay error al verificar el rol, redirigir al login
      const loginUrl = new URL(ROUTES.PUBLIC.AUTH.LOGIN, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Si hay token y está en la página de login o registro, redirige según el rol
  if (
    token &&
    (request.nextUrl.pathname === ROUTES.PUBLIC.AUTH.LOGIN ||
      request.nextUrl.pathname === ROUTES.PUBLIC.AUTH.REGISTER)
  ) {
    try {
      const userData = userDataCookie
        ? JSON.parse(decodeURIComponent(userDataCookie))
        : null;

      const redirectUrl =
        userData?.role === "seller"
          ? ROUTES.ADMIN.DASHBOARD
          : ROUTES.ADMIN.BOOKINGS;

      return NextResponse.redirect(new URL(redirectUrl, request.url));
    } catch (error) {
      console.error("Error al verificar el rol del usuario:", error);
      return NextResponse.redirect(new URL(ROUTES.ADMIN.BOOKINGS, request.url));
    }
  }

  return NextResponse.next();
}

// Configurar las rutas que serán manejadas por el middleware
export const config = {
  matcher: [
    // Rutas admin que requieren autenticación
    "/admin/:path*",
    // Rutas de autenticación para redirección si ya está autenticado
    "/auth/:path*",
  ],
};
