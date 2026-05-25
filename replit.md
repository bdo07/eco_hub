# Terres d'Art

A premium handmade Moroccan pottery eCommerce web app with WhatsApp-based ordering, admin dashboard, and artisan showcase.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite, Tailwind CSS v4, Framer Motion, shadcn/ui, Wouter
- API: Express 5, cookie-parser, pino logging
- DB: PostgreSQL + Drizzle ORM (tables: categories, products, orders)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec → React Query hooks + Zod schemas)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/pottery-store/` — React+Vite frontend (preview path `/`)
- `artifacts/api-server/` — Express API server (path `/api`)
- `lib/db/` — Drizzle ORM schema + client
- `lib/api-spec/` — OpenAPI YAML spec (source of truth for all endpoints)
- `lib/api-client-react/` — Generated React Query hooks (from Orval)
- `lib/api-zod/` — Generated Zod schemas (from Orval)
- `artifacts/api-server/src/routes/` — All API route handlers

## Architecture decisions

- Contract-first API: OpenAPI spec drives both frontend hooks and server Zod validation
- WhatsApp ordering: cart state lives in localStorage; checkout sends a formatted WhatsApp message + saves to DB
- Session auth: admin uses a simple httpOnly cookie (`admin_session=authenticated`); no JWT
- Price stored as `numeric` in DB, converted to `Number()` at route boundary
- Route order critical: `/products/featured` and `/orders/export/csv` registered before parameterized routes

## Product

- **Shop**: Browse all 8 seed products with category filters, price range, search, and stock toggle
- **Product detail**: Image gallery, color selector, quantity picker, "Add to Cart" + "Order on WhatsApp"
- **Cart**: Full cart management with quantity editing; WhatsApp checkout collects customer details
- **Wishlist**: Heart toggle on all product cards; persisted in localStorage
- **Admin dashboard**: Stats overview (orders, revenue, products, pending), top products, orders by status
- **Admin products**: CRUD table with create/edit dialog; image URL, colors, featured flag
- **Admin orders**: Status management per order, CSV export
- **Dark mode**: Full dark/light toggle; earthy terracotta palette in both modes

## User preferences

- Admin credentials: username `admin`, password `admin123`
- WhatsApp number: `1234567890` (update in `cart.tsx` and `product-detail.tsx`)

## Gotchas

- Seed data already inserted — re-running seed SQL will conflict on unique slugs (safe, uses `ON CONFLICT DO NOTHING`)
- Admin cookie requires `credentials: 'include'` — CORS is set to `origin: true, credentials: true`
- `framer-motion` is in `devDependencies` (Vite build) — correct for static artifact

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
