# 🍼 One Baby Shop

E-commerce de productos de bebé para el mercado mexicano.

**Estado: prototipo de frontend en construcción.** Este repositorio contiene la
aplicación web (Vue 3). El backend, la autenticación real y la integración de
pagos están en desarrollo — ver [Roadmap](#-roadmap).

## Qué funciona hoy

| Funcionalidad | Estado |
|---|---|
| Catálogo con filtros y búsqueda | ✅ Con 8 productos de demostración (`src/data/products.json`) |
| Carrito con persistencia local | ✅ `localStorage` (migración a store de Pinia en curso) |
| Toasts, error boundary, diseño responsive | ✅ |
| Registro / login | ⚠️ **Simulado** — sin backend, sin contraseñas reales |
| Checkout con Mercado Pago / PayPal | ❌ **No integrado** — el monto está hardcodeado |
| Panel admin | ⚠️ **Maqueta** — datos fijos, sin CRUD |
| Favoritos, historial de pedidos | ⚠️ Simulado con `localStorage` |

## Stack

- **Vue 3** (Composition API) + **Vite 7**
- **Pinia 3** para estado
- **vue-router 4** con guards de rutas
- **Tailwind CSS 3**
- **ESLint 9 + Prettier 3**
- CI con GitHub Actions (lint + build)

## Desarrollo

```bash
npm install
cp .env.example .env.local   # ajusta VITE_API_URL si es necesario
npm run dev                  # http://localhost:5173
```

Scripts disponibles:

```bash
npm run dev           # servidor de desarrollo
npm run build         # build de producción
npm run preview       # previsualizar el build
npm run lint          # ESLint
npm run lint:fix      # ESLint con autocorrección
npm run format        # Prettier (escribir)
npm run format:check  # Prettier (verificar)
```

Requiere Node `>= 20.19`.

## Variables de entorno

Copia `.env.example` a `.env.local`. Solo las variables con prefijo `VITE_`
llegan al cliente: **nunca pongas secretos ahí** (tokens, llaves privadas,
credenciales de BD). Los secretos del backend viven exclusivamente en el
entorno del servidor.

## Roadmap

| Fase | Alcance |
|---|---|
| F0 ✅ | Higiene del repo: tooling, CI, README honesto |
| F1 | Tokens de diseño + store de carrito real (Pinia) |
| F2 | Backend: Fastify + Prisma + PostgreSQL (monorepo) |
| F3 | Autenticación real (JWT + argon2) |
| F4 | Catálogo y carrito contra API |
| F5 | Pedidos con reserva de stock, checkout completo |
| F6 | Mercado Pago: preferencias server-side + webhooks |
| F7 | Panel admin real |
| F8 | Deploy (API + web) |
| F9 | Facturación CFDI |

Decisiones de producto: mercado **exclusivamente México**, moneda **MXN**,
pagos con **Mercado Pago** (tarjeta, MSI, OXXO, SPEI). Lanzamiento **sin
CFDI** — los campos fiscales existen en el esquema pero el checkout no los
exige hasta activarse (feature flag).

## Documentación

- [`docs/BACKEND_PLAN.md`](docs/BACKEND_PLAN.md) — plan del backend
- [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md) — diseño de BD (referencia; sufre correcciones en F2)
- [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) — contrato de API previsto

## Seguridad

- Las credenciales de admin visibles en el código actual son **de demostración
  y se eliminan en F3**. No uses este frontend en producción en su estado actual.
- Nunca commitees `.env*` (ya están en `.gitignore`).
- Reporta vulnerabilidades abriendo un issue privado.

## Licencia

MIT — ver [LICENSE](LICENSE).
