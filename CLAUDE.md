# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` or `yarn dev` - Start the development server
- `npm run build` or `yarn build` - Build the application for production
- `npm run start` or `yarn start` - Start the production server
- `npm run lint` or `yarn lint` - Run ESLint for linting
- `npm run prepare` - Sets up husky (git hooks)

## Code Structure

The application is built with Next.js 15.3.3, React 19, and TypeScript. Styling is done with Tailwind CSS (via `tailwindcss@4`). State management is handled by Zustand.

### Routing & Layouts
- Uses Next.js 13+ App Router (`app/` directory)
- Root layout: `app/layout.tsx` (includes HTML structure, metadata, and providers)
- Manage section layout: `app/manage/layout.tsx` (shared layout for admin/dashboard routes)
- Route examples:
  - Authentication: `app/login/page.tsx`, `app/auth/page.tsx`, `app/forgot-password/`
  - Dashboard: `app/manage/dashboard/page.tsx`
  - Product management: `app/manage/product/` (list, add, edit)
  - Order management: `app/manage/order/`
  - History tracking: `app/manage/history/` (list and detailed views)
  - Cashier: `app/manage/cashier/page.tsx`
  - Profile: `app/manage/profile/page.tsx`
  - Playground: `app/playground/page.tsx` (experimental/testing area)

### Key Directories
- `components/` - Reusable UI components
  - `components/Base/` - Foundational components (Navbar, Sidebar, Table)
  - `components/history/` - History-related components (index.tsx)
  - `components/product/` - Product-related components (index.tsx)
  - `components/Base/order/` - Order-specific components
- `store/` - Zustand stores (e.g., `store/useHistory.tsx`)
- `utils/` - Utility functions (e.g., `utils/general.ts`)
- `types/` - TypeScript type definitions (e.g., `types/history.ts`)
- `hooks/` - Custom React hooks (e.g., `hooks/useGeneratePdf.tsx`)
- `app/Providers.tsx` - Wraps application with context providers (Apollo client, Zustand stores, etc.)

## Important Dependencies
- `@apollo/client` & `graphql-request` - GraphQL data fetching
- `zustand` - State management
- `framer-motion` - Animations
- `@radix-ui/react-tooltip` & `@tippyjs/react` - Tooltips
- `html-to-pdfmake` & `pdfmake` - PDF generation (used in history/order features)
- `lucide-react` - Icons
- `clsx` - Class name utility
- `js-cookie` - Cookie handling
- `axios` - HTTP client
- `openai` - OpenAI API integration
- `@studio-freight/lenis` - Smooth scrolling
- `uuid` - Unique ID generation

## Development Practices
- ESLint configured with `eslint-config-next` and TypeScript rules (`lint-staged` runs `eslint --fix` on staged files)
- Husky pre-commit hooks via `prepare` script
- CSS via Tailwind CSS (configured in `tailwind.config.cjs` or similar, though not shown in status)
- TypeScript strict mode enabled (implied by `@typescript-eslint` plugin)