# Kopiness FE

Multi-role coffee shop management frontend built with **Next.js 15**, **Zustand**, and **Tailwind CSS v4**.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15.5 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + SCSS |
| State | Zustand |
| API | Axios |
| Auth | Cookie-based (httpOnly encrypted token) |
| Icons | Lucide React, Iconify |
| PDF | html-to-pdfmake + pdfmake |
| Animations | Framer Motion, Lenis |

## Features by Role

### SUPERADMIN
- Dashboard with revenue charts, top products, recent transactions
- User management — create STOREOWNER accounts (`POST /auth/storeowners`)
- Product CRUD (add/edit/delete)
- Order management (view, mark delivered)
- Payment/cashier management
- Profile settings

### STOREOWNER
- Dashboard (own store data)
- Product CRUD scoped to own store (`store_id` tied to auth)
- Order management with WA notification to customer
- Cashier (process payments)
- Profile settings

### CUSTOMER
- Browse stores by slug (`/manage/stores/[slug]`)
- View products per store
- Add to cart → checkout → transaction
- Track order history with status timeline
- Coffee playground (AI recipe generator)

## Role System

```
SUPERADMIN  → Full access, creates STOREOWNER accounts
STOREOWNER  → Manages own store products & orders
COURIER     → Delivers assigned orders
CUSTOMER    → Browse, cart, checkout, track orders
```

Registration from the web is only for **CUSTOMER**. SUPERADMIN creates STOREOWNER via the Kelola Pengguna page.

`access_token` is an httpOnly encrypted backend cookie. Client `is_logged_in`, `role`, and `store_id` cookies only guide navigation; backend authorizes every API request. On startup, client verifies session with `GET /auth/me` and clears cached UI auth state on an invalid session.

## Getting Started

```bash
# install
npm install

# dev server (http://localhost:3000)
npm run dev

# production build
npm run build

# start production
npm run start

# lint
npm run lint
```

The backend API runs on `http://localhost:7243/api` (NestJS). Swagger docs available at the root `/api`.

## Project Structure

```
app/
├── auth/                 # Registration page
├── forgot-password/
├── login/
├── manage/
│   ├── cashier/          # Payment processing
│   ├── coffee/           # AI recipe playground
│   ├── dashboard/        # SUPERADMIN/STOREOWNER dashboard
│   ├── history/          # Transaction history + [id]/details
│   ├── home/             # CUSTOMER landing
│   ├── order/            # Order management
│   ├── product/          # Product list + add/edit
│   ├── profile/          # User profile & settings
│   ├── stores/           # Store listing + [slug]/detail
│   ├── users/            # SUPERADMIN user management
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   └── layout.tsx        # Manage section layout + sidebar
├── Providers.tsx         # Apollo + Zustand providers
├── middleware.ts          # Role-based route protection
└── layout.tsx            # Root layout

components/
├── Base/                 # Foundational components
│   ├── Sidebar.tsx       # Responsive nav (mobile/desktop)
│   ├── Table.tsx         # Generic data table
│   ├── order/            # OrderManagement
│   └── ui/               # Modal, Card, Tooltip, etc.
├── cart/                 # Cart page
├── cashier/              # Cashier components
├── checkout/             # Checkout components
├── coffee/               # AI recipe playground
├── dashboard/            # StatsCard, RevenueChart, etc.
├── history/              # History table + TrackingModal
├── product/              # Product list + add/edit form
├── profile/              # Profile sections
├── stores/               # Store listing + StoreProducts
└── users/                # UserTable + CreateUserModal

lib/api/                  # API wrapper functions (per domain)
├── auth.ts               # login, register, adminCreateUser
├── cart.ts               # cart CRUD
├── cashier.ts            # transactions, payment
├── index.ts              # Axios instance + interceptors
├── order.ts              # getOrders, updateOrderStatus
├── productApi.ts         # CRUD products (PATCH for edit)
└── stores.ts             # getStores, getStoreBySlug

store/                    # Zustand stores
├── useAuthStore.ts       # Auth state + cookies
├── useCartStore.ts       # Cart (syncs with BE)
├── useCoffeeStore.ts     # AI recipe generator
├── useHistory.ts         # Transaction history
├── useOrderStore.ts      # Order management
├── useProductStore.ts    # Products CRUD
├── useStoresStore.ts     # Stores listing
├── useResponsiveStore.ts # Screen size detection
└── useUserManagementStore.ts

types/                    # TypeScript type definitions
```

## API Integration

All API calls are in `lib/api/` as standalone functions. Zustand stores call these functions and hold the state.

- **Dummy data fallback**: Every store provides dummy data when the API is unavailable, so the frontend stays functional offline.
- **401 interceptor**: `lib/api/index.ts` auto-redirects to `/login` on 401.
- **Cart sync**: Cart store keeps local state as source of truth but syncs optimistically to the backend.

### Key Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Verify current backend session and load client user state |
| POST | `/auth/register` | Register (CUSTOMER only) |
| POST | `/auth/storeowners` | SUPERADMIN creates STOREOWNER |
| GET | `/auth/users` | List users (SUPERADMIN) |
| GET | `/stores` | List stores |
| GET | `/stores/:slug` | Store detail by slug |
| GET | `/products` | List products |
| POST | `/products` | Create product |
| PATCH | `/products/:id` | Edit product (NOT PUT) |
| GET | `/cart` | Get cart items |
| POST | `/cart` | Add to cart |
| PATCH | `/cart/:id` | Update cart item |
| DELETE | `/cart/:id` | Remove from cart |
| POST | `/transactions` | Create transaction (checkout) |
| GET | `/transactions/store/orders` | Order list (STOREOWNER) |
| PATCH | `/transactions/:id/status` | Update order status |

### Transaction Statuses

`PENDING → PAID → IN_PROGRESS → DELIVERED | CANCELLED`

## Environment

Create `.env.local`:

```env
API_PROXY_TARGET=http://localhost:7243
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run prepare` | Husky git hooks setup |
