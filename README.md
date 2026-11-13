# Silwasa IT Solutions — Production Custom CMS & Website

A high-performance, modular, database-driven business website and custom Content Management System (CMS) architected from scratch for **Silwasa IT Solutions** (`https://silwasa.com`), preserving and modernizing the dark aesthetic (`#151414`, `#663399`, `#D9F45F`) and multi-column mega menu hierarchy.

---

## Technical Highlights

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js REST API, TypeScript, Prisma ORM, PostgreSQL.
- **Authentication & Security:** Argon2id password hashing, HTTP-only signed session cookies, JWT verification, Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `SEO_MANAGER`), Helmet security headers, CORS origin whitelisting, Rate limiting.
- **Modular Page Builder:** Drag-and-drop section assembler with 13 custom reusable section components (`Hero`, `Services`, `Industries`, `Process`, `TechStack`, `About`, `CaseStudies`, `Portfolio`, `Pricing`, `FAQ`, `CTA`, `Contact`, `RichText`), revision history, and context-sensitive inspectors.
- **Dynamic Mega Menus:** Multi-column category designer with child link descriptions, pill badges (`Popular`, `New`), and right-hand promotional cards.
- **Blog CMS:** Rich-text editing, real-time automated reading time estimation, topic tags, categories, and dedicated SEO & Social Graph inspector.
- **Services & Dynamic Pricing Engine:** Deliverables lists, ROI benefits, multi-tier pricing, monthly/annual toggle, and automated promotional discount calculator.
- **Resilient Inquiry System:** Lead submissions persist directly to PostgreSQL with generated reference numbers (`ENQ-YYMMDD-XXXX`) and dispatch async email notifications to sales and clients.
- **Pluggable Email Integrations:** Brevo, Twilio SendGrid, Google Workspace / Gmail SMTP, and Mock/Dev logging.
- **Pluggable Storage Abstraction:** Local disk storage and Cloudinary with usage-count protected deletion.
- **Dynamic SEO Engine:** Auto-generated `sitemap.xml` and `robots.txt` indexing all dynamic pages, services, industries, portfolio projects, and blog articles.

---

## Monorepo Architecture

```
silwasa-cms/
├── apps/
│   ├── web/                     # Next.js 15 App Router Frontend & Admin Portal
│   │   ├── src/
│   │   │   ├── app/             # Public routes, /admin/*, /api-proxy/*, sitemap, robots
│   │   │   ├── components/      # Reusable UI library, modular sections, layout, admin
│   │   │   ├── lib/             # API client, utilities
│   │   │   └── context/         # AuthContext
│   │   └── package.json
│   │
│   └── api/                     # Express REST API Server
│       ├── src/
│       │   ├── controllers/     # Express controllers (Auth, Pages, Menus, Blogs, Services, etc.)
│       │   ├── repositories/    # Prisma database queries and mutations
│       │   ├── services/        # Business logic & calculation engines
│       │   ├── middleware/      # Auth, RBAC, Rate limiter, Error handler
│       │   ├── integrations/    # Storage (Local, Cloudinary) & Email (Brevo, SendGrid, Gmail)
│       │   ├── utils/           # JWT, Argon2id passwords
│       │   └── server.ts        # App bootstrap
│       ├── prisma/              # schema.prisma (22 relational models), migrations, seed
│       └── tests/               # 11 automated Vitest integration test suites
│
├── packages/
│   ├── shared/                  # Common utilities (slugify, reading time, pricing discount engine)
│   ├── validation/              # Zod validation schemas
│   └── types/                   # Shared TypeScript models and interfaces
│
├── docs/                        # Complete technical & user documentation
│   ├── ARCHITECTURE.md          # Monorepo architecture & component design
│   ├── DATABASE.md              # Relational schema diagrams & indexes
│   ├── API.md                   # Complete REST API specification
│   ├── DEPLOYMENT.md            # Production deployment guide (Vercel, Render, Neon, Cloudinary)
│   ├── ADMIN_GUIDE.md           # Non-technical administrator guide
│   └── PROGRESS.md              # Chronological phase verification logs
│
├── .env.example                 # Production & development environment template
├── package.json                 # Monorepo root scripts
└── pnpm-workspace.yaml          # Pnpm workspace definition
```

---

## Quick Start & Local Development

### 1. Prerequisites

- Node.js 20+
- pnpm 9+ or 10+ (`npm install -g pnpm`)
- PostgreSQL 16+ (or local Docker container)

### 2. Installation

```bash
# Clone the repository and navigate into it
cd silwasa-website-cms

# Install all monorepo dependencies
pnpm install

# Copy environment template
cp .env.example .env
```

### 3. Database Migration & Seeding

```bash
# Generate Prisma Client
pnpm --filter @silwasa/api prisma:generate

# Run migrations
pnpm --filter @silwasa/api prisma migrate dev

# Seed demo users, pages, navigation menus, and services
pnpm --filter @silwasa/api prisma:seed
```

### 4. Running the Applications

```bash
# Start both Next.js Web and Express API concurrently
pnpm dev

# Next.js Frontend: http://localhost:3000
# Admin Dashboard:   http://localhost:3000/admin
# Express API:       http://localhost:5000/api/v1
# Health Check:      http://localhost:5000/api/v1/health
```

---

## Testing & Quality Verification

```bash
# Run all unit and integration tests across all packages
pnpm test

# Run Next.js production build verification
pnpm --filter @silwasa/web build

# Run Express API production build verification
pnpm --filter @silwasa/api build
```

---

## Production Deployment Targets

- **Frontend:** Vercel (`https://silwasa.com`)
- **Backend API:** Render / Railway / Managed VPS (`https://api.silwasa.com`)
- **Database:** Neon / Supabase Managed PostgreSQL
- **Media CDN:** Cloudinary
- **Transactional Email:** Brevo or Google Workspace SMTP

See [DEPLOYMENT.md](file:///e:/silwasa-website-cms/docs/DEPLOYMENT.md) for full configuration steps.
