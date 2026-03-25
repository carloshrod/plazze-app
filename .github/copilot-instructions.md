# Plazze App - Instrucciones del Workspace

Plataforma de reserva de espacios para eventos construida con Next.js 14 (App Router), TypeScript, Ant Design y WordPress REST API.

## Stack Técnico

- **Framework**: Next.js 14.1.0 (App Router)
- **Lenguaje**: TypeScript 5
- **UI**: Ant Design 5.27.4 + Tailwind CSS 3
- **Estado**: Zustand 5.0.8
- **HTTP Client**: Axios 1.12.2
- **Mapas**: React Leaflet 4.2.1
- **Backend**: WordPress REST API (PHP custom plugin)

## Arquitectura

### Estructura de Carpetas

```
src/
├── app/                    # App Router pages
│   ├── (public)/          # Rutas públicas (landing, plazzes, auth)
│   └── admin/             # Panel administrativo (dashboard, perfil)
├── components/
│   ├── common/            # Componentes compartidos (header, footer, UI)
│   ├── features/          # Componentes por feature (auth, admin, plazzes)
│   └── providers/         # Providers de React (AuthProvider, etc.)
├── libs/api/              # Clientes API y endpoints
├── services/              # Lógica de negocio (hooks custom)
├── stores/                # Zustand stores
├── types/                 # Tipos TypeScript
├── helpers/               # Funciones de transformación de datos
└── utils/                 # Utilidades generales
```

## Reglas de Arquitectura

- Todas las llamadas HTTP deben hacerse desde `libs/api/`
- Toda la lógica de negocio debe estar en `services/`
- Los componentes deben ser lo más presentacionales posible
- Los datos del backend deben transformarse antes de usarse en UI
- No mezclar lógica de negocio dentro de componentes
- Centralizar rutas en `consts/routes.ts`

### Routing

- **Grupos de rutas**: `(public)` para landing y páginas públicas, `admin/` para panel administrativo
- **Middleware**: Autenticación JWT en cookies, redirecciones basadas en roles
- **Roles**: `guest` (cliente), `customer`, `seller` (proveedor de espacios), `administrator`

### Patrones de Código

**State Management**:

- Zustand stores en `stores/` para estado global
- Patrón: `useXStore` para stores, `useXService` para servicios con lógica de negocio
- Stores principales: `useAuthStore`, `usePlazzeStore`, `useSearchStore`, `useMyPlazzesStore`

**API Integration**:

- Cliente centralizado: `libs/api/client.ts` (Axios con interceptor de autenticación)
- Librerías por entidad: `libs/api/auth.ts`, `libs/api/plazze.ts`, `libs/api/booking.ts`
- Servicios con hooks custom: `services/auth.ts`, `services/plazze.ts`, `services/bookings.ts`

**Componentes**:

- Client components: Usar `"use client"` para interactividad
- Ant Design forms con `Form.useForm()` hook
- Estilos: Tailwind CSS + tema custom de Ant Design en `theme/themeConfig.ts`
- Helper `cn()` de `libs/cn.ts` para combinar clases de Tailwind

**Autenticación**:

- JWT token guardado en cookies (`js-cookie`)
- Validación de token en `AuthProvider` (componente)
- Middleware protege rutas `/admin` y redirige según rol
- Inicialización automática de auth con hook `useAuthService().initAuth()`

**Tipos y Transformaciones**:

- Interfaces en `types/`: `Plazze`, `PlazzeWP`, `Booking`, `User`, etc.
- Helpers en `helpers/`: `mapPlazzeFromWP()` transforma datos de WordPress a formato de la app
- Utils en `utils/`: `cleanHtmlEntities()`, `formatCurrency()`, etc.

## Convenciones

### Idioma

- **Rutas y UI**: Español (ej: `/auth/registro`, "Iniciar Sesión")
- **Código**: Inglés para nombres de variables, funciones y comentarios técnicos
- **Comentarios**: Español para explicaciones de lógica de negocio

### Naming

- Componentes de React: PascalCase (`LoginForm.tsx`)
- Hooks custom: `use` prefix (`useAuthService`, `usePlazzeService`)
- Stores: `use` prefix + `Store` suffix (`useAuthStore`)
- Tipos: PascalCase (`Plazze`, `User`, `Booking`)
- Constantes: UPPER_SNAKE_CASE o PascalCase para objetos (`ROUTES`, `API_URL`)

### Mensajes al Usuario

- Usar `showMessage` de `libs/message.tsx` para notificaciones (wrapper de `antd.message`)
- Ejemplo: `showMessage.success("Reserva creada exitosamente")`

### Rutas

- Constantes centralizadas en `consts/routes.ts` como objeto `ROUTES`
- Usar `ROUTES.ADMIN.DASHBOARD` en lugar de strings hardcodeados
- Funciones helper para rutas dinámicas: `ROUTES.PUBLIC.PLAZZES.DETAIL(id)`

## Do / Don't

### ✅ Do

- Usar Zustand para estado global
- Usar services para lógica de negocio
- Reutilizar helpers existentes
- Transformar datos antes de usarlos
- Usar constantes para rutas
- Usar arrow functions para componentes y hooks
- Manejar errores con try/catch

### ❌ Don't

- No hacer llamadas API en componentes
- No usar `any` en TypeScript
- No hardcodear endpoints o rutas
- No duplicar lógica existente
- No usar estado local para datos globales

## Build y Comandos

```bash
# Desarrollo
npm run dev           # http://localhost:3000

# Producción
npm run build
npm run start

# Linting
npm run lint
```

**Variables de entorno requeridas**:

- `NEXT_PUBLIC_API_URL`: URL base del WordPress REST API

## Backend Integration

**WordPress REST API**:

- Plugin PHP custom modular — punto de entrada: `plazze-custom-api.php` (solo carga módulos)
- Módulos en `plazze-api-modules/`:
  - `core/init.php` — capabilities, activation hook
  - `core/cors.php` — CORS headers
  - `core/database.php` — helpers de base de datos
  - `helpers/time.php` — funciones de horarios
  - `helpers/formatting.php` — funciones de formato
  - `helpers/pricing.php` — funciones de precios
  - `hooks/filters.php` — WP filters
  - `hooks/actions.php` — WP actions
  - `endpoints/auth.php` — login, registro, perfil
  - `endpoints/categories.php` — categorías y regiones
  - `endpoints/search.php` — búsqueda con filtros
  - `endpoints/listings.php` — campos REST de listings + endpoints individuales
  - `endpoints/bookings.php` — reservas
  - `endpoints/payments.php` — pagos y webhooks
- Endpoints custom en `/plazze/v1/` para auth, bookings, dashboard stats
- Endpoints WP estándar: `/wp/v2/listing` (CPT de Listeo), `/wp/v2/media`

**Autenticación**:

- Login: `POST /plazze/v1/login` → retorna token JWT
- Validar token: `POST /jwt-auth/v1/token/validate`
- Interceptor Axios añade `Authorization: Bearer <token>` automáticamente

**Plazzes (Listings)**:

- GET `/wp/v2/listing` - Listar espacios con filtros
- POST `/wp/v2/listing` - Crear espacio (sellers)
- PUT/DELETE `/wp/v2/listing/{id}` - Actualizar/eliminar

**Bookings**:

- POST `/plazze/v1/create-listeo-booking` - Crear reserva
- GET `/plazze/v1/my-bookings` - Reservas como cliente
- GET `/plazze/v1/my-listings-bookings` - Reservas de mis espacios (seller)

## Gotchas

1. **Client Components**: Muchos componentes necesitan `"use client"` por Ant Design y hooks
2. **WordPress Data**: Los datos de WordPress vienen en formato complejo (`PlazzeWP`), usar helpers de `helpers/plazze.ts` para transformar
3. **Roles y Permisos**: Verificar rol del usuario antes de mostrar UI de sellers/admin
4. **Cookies**: Auth usa cookies, asegurar `sameSite: "strict"` y `secure` en producción
5. **Gallery Images**: Las imágenes pueden venir en múltiples formatos, helper `mapPlazzeFromWP()` las normaliza
6. **Horarios**: Formato de WordPress es específico (`monday_opening_hour`, etc.), usar helpers de `utils/hours.ts`
7. **TypeScript**: Desactivar `suppressHydrationWarning` solo cuando sea necesario (layout principal lo usa por Ant Design)
8. **Plugin PHP modular**: Al agregar endpoints nuevos, crear el archivo en `plazze-api-modules/endpoints/` y añadir el `require_once` en `plazze-custom-api.php`. No editar los módulos existentes para agregar funcionalidades no relacionadas

## Referencias

- Ver `README.md` para instrucciones de setup
- Consultar `types/` para interfaces completas de datos
- Referirse a `src/consts/routes.ts` para todas las rutas de la app
