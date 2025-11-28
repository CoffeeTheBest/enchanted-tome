# Enchanted Tome - Medieval Bookstore

## Overview

Enchanted Tome is a full-stack medieval-themed bookstore application that provides an immersive, Pride and Prejudice-era aesthetic combined with magical bookshop ambiance. The application allows users to browse a curated collection of classic literature presented with warm candlelit aesthetics, leather-bound tome styling, and parchment textures.

The system features a public-facing catalog for browsing books and an admin panel for managing inventory, built with a modern React frontend and Express backend, authenticated through Replit's OAuth system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server with HMR (Hot Module Replacement)
- **React Router** implied for SPA navigation (single-page application with fallback routing)

**UI Component Strategy**
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable components
- **Tailwind CSS** for utility-first styling with custom medieval theme configuration
- **Custom Design System** defined in `design_guidelines.md` featuring:
  - Light theme: Parchment ivory backgrounds with sepia tones
  - Dark theme: Walnut brown backgrounds with aged gold accents
  - Typography: Crimson Text (body), Playfair Display (headers), with medieval decorative fonts
  - Leather-bound book card aesthetics with 3D effects

**State Management**
- **TanStack Query (React Query)** for server state management, caching, and API synchronization
- Custom `queryClient` configuration with credentials-based authentication
- Optimistic updates and automatic refetching disabled for controlled data flow

**Authentication Flow**
- Custom `useAuth` hook consuming user session data from `/api/auth/user`
- Session-based authentication with credential inclusion in all API requests
- Unauthorized error handling utilities for graceful auth failure management

### Backend Architecture

**Server Framework**
- **Express.js** as the HTTP server framework
- **Node.js HTTP Server** wrapping Express for WebSocket capability support
- Custom logging middleware capturing request/response cycles with timestamps

**Development vs Production**
- **Development**: Vite dev server middleware integrated into Express for HMR
- **Production**: Static file serving from compiled `dist/public` directory
- Environment-aware build process using esbuild for server bundling

**Authentication System**
- **Replit Auth** via OpenID Connect (OIDC) using Passport.js strategy
- **Session Management**: PostgreSQL-backed sessions via `connect-pg-simple`
- **User Roles**: Admin flag in users table for permission-based access control
- Session stored in database with 7-day TTL (time-to-live)

**API Design**
- RESTful endpoint structure under `/api` prefix
- Public routes: `GET /api/books`, `GET /api/books/:id`
- Protected routes: `POST /api/books`, `PUT /api/books/:id`, `DELETE /api/books/:id` (admin-only)
- User route: `GET /api/auth/user` (authenticated users)

**Database Layer**
- **Drizzle ORM** for type-safe database queries and schema management
- Schema-first approach with Zod validation integration via `drizzle-zod`
- Storage abstraction class (`DatabaseStorage`) encapsulating all CRUD operations
- Automatic timestamp tracking (`createdAt`, `updatedAt`) on entities

### Data Storage Solutions

**Database Technology**
- **PostgreSQL** via Neon serverless driver (`@neondatabase/serverless`)
- WebSocket-based connections using `ws` library for Neon compatibility
- Connection pooling through `Pool` from Neon serverless

**Database Schema**

1. **Sessions Table**: Stores Express session data for authentication
   - Primary key: `sid` (session ID)
   - Fields: `sess` (JSONB), `expire` (timestamp)
   - Indexed on expiration for cleanup efficiency

2. **Users Table**: Authentication and profile data
   - Primary key: `id` (UUID, auto-generated)
   - Fields: email, firstName, lastName, profileImageUrl, isAdmin, timestamps
   - Unique constraint on email

3. **Books Table**: Product catalog
   - Primary key: `id` (auto-incrementing integer)
   - Fields: title, author, description, price, category, coverUrl, publishedYear, pages, inStock, timestamps
   - Default values: price (0), category ("Fiction"), inStock (true)

**Validation Strategy**
- Drizzle schema definitions serve as source of truth
- Zod schemas auto-generated via `createInsertSchema` for runtime validation
- Separate insert and update schemas for different mutation contexts

### External Dependencies

**Third-Party Services**
- **Replit OAuth**: Authentication provider via OIDC discovery endpoint
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket connections
- **Unsplash**: Image CDN for book cover URLs (inferred from seed data)

**Key NPM Packages**
- **UI Components**: All Radix UI primitives (@radix-ui/react-*)
- **Forms**: React Hook Form with Zod resolvers (@hookform/resolvers)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer, class-variance-authority
- **Date Handling**: date-fns for timestamp formatting
- **Utilities**: clsx, tailwind-merge for className composition
- **Development**: tsx for TypeScript execution, esbuild for bundling

**Build Pipeline**
- Vite builds client to `dist/public`
- esbuild bundles server to `dist/index.cjs` with selective dependency bundling
- Allowlist strategy for bundling specific server dependencies to reduce cold start syscalls
- Static file serving configuration for production deployments

**Session & Security**
- Session secret from environment variable
- HTTP-only, secure cookies with 7-day max age
- CSRF protection through session-based state management
- Admin-only middleware protecting sensitive mutations