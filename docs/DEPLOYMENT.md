# Silwasa Custom CMS & Website — Production Deployment Guide

This guide details the deployment architecture and step-by-step procedures to deploy the **Silwasa IT Solutions** custom CMS and website across production environments.

---

## Architecture Overview

```
                      ┌──────────────────────────────────────┐
                      │              Cloudflare              │
                      │  (DNS, Edge SSL, WAF, DDoS Shield)   │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │    Vercel / Edge Node     │                   │   Render / Railway / VPS  │
   │      Next.js 15 Web       │  /api-proxy/*     │     Node.js Express API   │
   │  (SSR, ISR, Static Edge)  ├──────────────────►│  (Port 5000 / REST API)   │
   └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                 │                                               │
                 │                                   ┌───────────┴───────────┐
                 │                                   │                       │
                 ▼                                   ▼                       ▼
   ┌───────────────────────────┐       ┌───────────────────────────┐ ┌───────────────┐
   │    Cloudinary / S3 CDN    │       │     PostgreSQL 16+        │ │ Brevo / Gmail │
   │   (Optimized Media Assets)│       │  (Neon / Supabase / VPS)  │ │ (Transactional│
   └───────────────────────────┘       └───────────────────────────┘ │    Email)     │
                                                                     └───────────────┘
```

---

## 1. Managed PostgreSQL Setup (Neon / Supabase / Managed VPS)

1. Provision a PostgreSQL 16+ database instance.
2. Ensure SSL mode is enabled (`sslmode=require`).
3. Note your connection string:
   ```env
   DATABASE_URL="postgresql://user:password@ep-host.region.neon.tech/silwasa_production?sslmode=require"
   ```
4. Run Prisma database migrations from your CI/CD pipeline or local deployment machine:
   ```bash
   pnpm --filter @silwasa/api prisma:generate
   pnpm --filter @silwasa/api prisma migrate deploy
   ```
5. Seed initial administrative users, menus, themes, and service defaults:
   ```bash
   pnpm --filter @silwasa/api prisma:seed
   ```

---

## 2. Express Backend Deployment (Render / Railway / Docker / VPS)

### Option A: Railway / Render (Containerized or Node.js)

1. Link your Git repository.
2. Set the **Root Directory** to `apps/api`.
3. Set the **Build Command**:
   ```bash
   pnpm install && pnpm build
   ```
4. Set the **Start Command**:
   ```bash
   node dist/server.js
   ```
5. Configure Production Environment Variables:
   ```env
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=postgresql://user:password@ep-host.neon.tech/silwasa_production?sslmode=require
   JWT_SECRET=generate-a-cryptographically-secure-random-64-character-hex-string
   SESSION_SECRET=generate-another-cryptographically-secure-random-64-character-hex-string
   CORS_ORIGINS=https://silwasa.com,https://www.silwasa.com,https://admin.silwasa.com
   STORAGE_PROVIDER=cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_PROVIDER=brevo
   BREVO_API_KEY=xkeysib-your-production-brevo-key
   EMAIL_FROM=contact@silwasa.com
   EMAIL_FROM_NAME=Silwasa IT Solutions
   ADMIN_NOTIFICATION_EMAIL=contact@silwasa.com
   ```

### Option B: Docker Container Deployment

A standard production `Dockerfile` for `apps/api`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @silwasa/api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm
COPY --from=builder /app ./
EXPOSE 5000
CMD ["node", "apps/api/dist/server.js"]
```

---

## 3. Next.js Frontend Deployment (Vercel)

1. Import the repository in [Vercel](https://vercel.com).
2. Set **Root Directory** to `apps/web`.
3. **Framework Preset**: Next.js.
4. Set **Build Command**: `next build` (or `pnpm --filter @silwasa/web build`).
5. Configure Frontend Environment Variables:
   ```env
   NEXT_PUBLIC_SITE_URL=https://silwasa.com
   NEXT_PUBLIC_API_URL=https://api.silwasa.com/api/v1
   ```
6. Assign Custom Domains:
   - `silwasa.com` (Main Website)
   - `www.silwasa.com` (Redirects to apex `silwasa.com`)
   - `admin.silwasa.com` (Optional dedicated admin subdomain pointing to `/admin`)

---

## 4. Cloudinary Media Storage Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com).
2. Navigate to **Dashboard** and copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Add these credentials to the Express API environment variables.
4. Antigravity's storage provider will automatically stream file uploads directly to Cloudinary and return responsive CDN URLs with automated format conversion (WebP/AVIF).

---

## 5. Email Notifications Setup (Brevo / SendGrid / Google Workspace)

### Recommended: Brevo Transactional API

1. Create a free account at [brevo.com](https://brevo.com).
2. Verify your sender domain (`silwasa.com`) with SPF and DKIM DNS TXT records.
3. Generate a transactional v3 API key under **SMTP & API**.
4. Set `EMAIL_PROVIDER=brevo` and `BREVO_API_KEY=xkeysib-...` in the API environment.

### Alternative: Google Workspace SMTP

1. Enable 2-Factor Authentication on the admin Google Workspace account.
2. Generate an **App Password** named "Silwasa Website CMS".
3. In `/admin/email`, select **Google Workspace** and provide the 16-character App Password.

---

## 6. Post-Deployment Verification Checklist

- [ ] Visit `https://silwasa.com/api/v1/health` and verify `{ "status": "healthy", "database": "connected" }`.
- [ ] Visit `https://silwasa.com/sitemap.xml` and verify all published pages and services are listed.
- [ ] Visit `https://silwasa.com/robots.txt` and confirm `/admin/` is protected from search crawlers.
- [ ] Log in to `https://silwasa.com/admin/login` using super admin credentials.
- [ ] Submit a test project inquiry on `https://silwasa.com#contact` and confirm:
  - Form shows instant confirmation with reference ID (`ENQ-...`).
  - Lead immediately appears in `/admin/enquiries`.
  - Notification email arrives in `contact@silwasa.com`.
  - Confirmation email arrives in the client's inbox.
