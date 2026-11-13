# Silwasa Custom CMS & Website — System Architecture

## 1. High-Level Overview

Silwasa Custom CMS & Website is built as a high-performance, modular monorepo containing:
- **`apps/web`**: Next.js 15 App Router application delivering both the dynamic public website and the SaaS-grade admin dashboard.
- **`apps/api`**: Express.js REST API application handling authentication, business logic, content management, media processing, background email dispatching, and audit logging.
- **`packages/types`**: Type definitions shared across frontend and backend.
- **`packages/validation`**: Zod validation schemas enforcing data integrity on client and server.
- **`packages/shared`**: Shared utilities, constants, discount calculation engine, and formatting helpers.

```
                    ┌────────────────────────────────────────────────────────┐
                    │                   Next.js 15 (Web)                     │
                    │   ┌─────────────────────┐    ┌─────────────────────┐   │
                    │   │   (public) Website   │    │   Admin Dashboard   │   │
                    │   └──────────┬──────────┘    └──────────┬──────────┘   │
                    └──────────────┼──────────────────────────┼──────────────┘
                                   │ SSR / Client API Calls   │
                                   ▼                          ▼
                    ┌────────────────────────────────────────────────────────┐
                    │               Express.js REST API (apps/api)           │
                    │  Controllers ➔ Services ➔ Repositories ➔ Integrations  │
                    └──────────────────────────┬─────────────────────────────┘
                                               │ Prisma ORM
                                               ▼
                    ┌────────────────────────────────────────────────────────┐
                    │                 PostgreSQL Database                    │
                    └────────────────────────────────────────────────────────┘
```

## 2. Brand Identity & Visual Language

- **Primary Brand Color:** `#663399` (Deep Rebecca Purple)
- **Accent Color:** `#D9F45F` (Vibrant Neon Lime)
- **Background:** `#151414` (Deep Charcoal Black)
- **Card Background:** `#1C1B1B`
- **Border Color:** `#2A2B28`
- **Text Color:** `#FFFFFF99` (Muted White) / `#FFFFFF` (Heading White)
- **Primary Typography:** Plus Jakarta Sans / Inter

## 3. Database Architecture

The data layer uses Prisma ORM with PostgreSQL.
Core entities:
- `User`, `Session`, `ActivityLog`
- `Page`, `PageRevision`, `SEOMetadata`
- `Menu`, `SiteSetting`
- `BlogPost`, `BlogCategory`, `BlogTag`, `PostCategory`, `PostTag`
- `Service`, `PricingPackage`
- `Industry`, `PortfolioProject`, `Testimonial`, `FAQItem`
- `Enquiry`, `EnquiryNote`
- `MediaItem`, `EmailProviderSetting`, `EmailDeliveryLog`
