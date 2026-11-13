# Silwasa Custom CMS & Website — Complete REST API Specification

**Base URL:** `/api/v1`  
**Authentication:** Signed HTTP-only cookie (`silwasa_token`) or `Authorization: Bearer <JWT_TOKEN>`  
**Response Format:** Standardized JSON Envelope

---

## 1. Response & Error Envelopes

### Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### Validation / Error Envelope
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "email": ["Please enter a valid email address"],
    "message": ["Message must be at least 10 characters"]
  }
}
```

---

## 2. Authentication & Sessions (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/login` | Public | Authenticates credentials with Argon2id; returns JWT & sets HTTP-only cookie. |
| `POST` | `/auth/logout` | Authenticated | Revokes session token in database and clears cookies. |
| `GET` | `/auth/me` | Authenticated | Returns current profile, role (`SUPER_ADMIN`, `ADMIN`, `EDITOR`), and email. |
| `POST` | `/auth/forgot-password` | Public | Generates secure password reset token. |
| `POST` | `/auth/reset-password` | Public | Updates user password using valid reset token. |

---

## 3. Public Website APIs

### Pages & Navigation
- `GET /pages`: Lists all published pages.
- `GET /pages/:slug`: Fetches page by slug with order-sorted section components and SEO metadata.
- `GET /menus/location/:location`: Retrieves navigation hierarchy (`header`, `footer-company`, `footer-services`, `mobile`) with multi-column mega menu definitions.

### Blog CMS
- `GET /blogs`: Paginated list of published articles. Supports `?category=`, `?tag=`, `?page=`, `?limit=`.
- `GET /blogs/:slug`: Single article detail with author attribution, computed reading time, tags, and SEO tags.
- `GET /blogs/categories`: All blog categories with post count metrics.
- `GET /blogs/tags`: All blog tags.

### Services & Pricing
- `GET /services`: Published services with deliverables, benefits, and process milestones.
- `GET /services/:slug`: Dynamic service detail view.
- `GET /pricing`: Returns pricing tiers with real-time automated discount calculations (`effectivePrice`).

### Industries & Portfolio
- `GET /industries`: Published industry verticals with challenges and engineering solutions.
- `GET /industries/:slug`: Industry detail view.
- `GET /portfolio`: Published case studies with category and tech stack filters.
- `GET /portfolio/:slug`: Case study detail with verified business results.

### Content Reviews & FAQs
- `GET /testimonials`: Client feedback and star ratings.
- `GET /faqs`: Published FAQ accordions grouped by category.
- `GET /settings/public`: Public site identity, palette variables, and contact info.

### Lead & Inquiry Submissions
- `POST /enquiries`: Public consultation inquiry submission.
  - **Payload:** `{ name, email, phone?, company?, service?, budget?, message, sourcePage? }`
  - **Behavior:** Persists directly to database, issues reference ID (`ENQ-YYMMDD-XXXX`), and triggers asynchronous email notifications to sales leadership and client.

---

## 4. Protected Admin CMS APIs (`/admin/*`)

Requires valid admin authentication and appropriate role permissions.

### Dashboard & Metrics
- `GET /admin/dashboard/metrics`: High-level counters (Total Pages, Published Blogs, Active Services, Total Leads, Storage Usage).
- `GET /admin/logs`: Immutable activity audit trail capturing user, action, module, timestamp, IP, and details.

### Modular Pages Builder
- `GET /admin/pages`: All pages (drafts and published).
- `POST /admin/pages`: Creates a page with template presets.
- `GET /admin/pages/:id`: Fetches page for editing.
- `PUT /admin/pages/:id`: Updates title, slug, and SEO metadata.
- `PUT /admin/pages/:id/sections`: Saves updated section layout, drag-and-drop order, and settings.
- `DELETE /admin/pages/:id`: Removes page.

### Navigation & Mega Menu Builder
- `GET /admin/menus`: Lists all navigation locations.
- `POST /admin/menus`: Creates navigation menu.
- `PUT /admin/menus/:id/items`: Updates navigation tree, links, pill badges, and multi-column mega menu structures.
- `DELETE /admin/menus/:id`: Deletes menu.

### Blog Management
- `GET /admin/blogs`: Index of all posts with draft status.
- `GET /admin/blogs/:id`: Post detail for editor.
- `POST /admin/blogs`: Creates post; automatically estimates reading time.
- `PUT /admin/blogs/:id`: Updates post.
- `DELETE /admin/blogs/:id`: Deletes post.

### Services & Pricing
- `GET /admin/services`: Lists all services.
- `POST /admin/services`: Creates new service offering.
- `PUT /admin/services/:id`: Updates service.
- `DELETE /admin/services/:id`: Deletes service.
- `GET /admin/pricing`: Lists pricing plans.
- `POST /admin/pricing`: Creates pricing tier.
- `PUT /admin/pricing/:id`: Updates tier and active discount windows.
- `DELETE /admin/pricing/:id`: Deletes pricing tier.

### Industries & Portfolio
- `GET /admin/industries`, `POST /admin/industries`, `PUT /admin/industries/:id`, `DELETE /admin/industries/:id`
- `GET /admin/portfolio`, `POST /admin/portfolio`, `PUT /admin/portfolio/:id`, `DELETE /admin/portfolio/:id`

### Client Reviews & FAQs
- `POST /admin/testimonials`, `PUT /admin/testimonials/:id`, `DELETE /admin/testimonials/:id`
- `GET /admin/faqs`, `POST /admin/faqs`, `PUT /admin/faqs/:id`, `DELETE /admin/faqs/:id`

### Lead Inbox & Notes
- `GET /admin/enquiries`: Paginated leads table with `?status=` and `?search=`.
- `GET /admin/enquiries/stats`: Lead counts grouped by status.
- `GET /admin/enquiries/:id`: Full lead details and chronological notes.
- `PUT /admin/enquiries/:id/status`: Updates status (`NEW`, `CONTACTED`, `IN_PROGRESS`, `CONVERTED`, `CLOSED`) and appends transition note.
- `POST /admin/enquiries/:id/notes`: Adds team internal note.
- `DELETE /admin/enquiries/:id`: Deletes enquiry.

### Configuration & Settings
- `GET /admin/settings/general` & `PUT /admin/settings/general`: General company identity.
- `GET /admin/settings/theme` & `PUT /admin/settings/theme`: Custom hex palette and typography.
- `GET /admin/settings/email` & `PUT /admin/settings/email`: Preferred email provider (Brevo, SendGrid, Gmail, Mock) and credentials.
- `POST /admin/media/upload`: Multipart asset upload with `multer` (up to 10 MB).
- `DELETE /admin/media/:id`: Asset deletion with usage guard (`usageCount === 0`).
- `GET /admin/users`, `POST /admin/users`, `PUT /admin/users/:id`, `DELETE /admin/users/:id`: Administrative user management.
