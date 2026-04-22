export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    PLAZZES: {
      LIST: "/plazzes",
      DETAIL: (id: string) => `/plazzes/${id}`,
      CONFIRM_BOOKING: (id: string) => `/plazzes/${id}/confirmar-booking`,
    },
    BOOKINGS: {
      SUCCESS: (id: string | number) => `/reservas/${id}/exito`,
    },
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/registro",
      FORGOT_PASSWORD: "/auth/restablecer-password",
    },
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    PLAZZES: "/admin/plazzes",
    BOOKINGS: "/admin/reservas",
    WALLET: "/admin/wallet",
    PROFILE: "/admin/perfil",
    BANNERS: "/admin/banners",
  },
} as const;
