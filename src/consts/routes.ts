export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    PLAZZES: {
      LIST: "/plazzes",
      DETAIL: (id: string) => `/plazzes/${id}`,
    },
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/registro",
    },
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    PLAZZES: "/admin/plazzes",
    BOOKINGS: "/admin/reservas",
    PROFILE: "/admin/perfil",
  },
} as const;
