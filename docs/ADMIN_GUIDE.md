# Silwasa Custom CMS — Administrator & Content Manager Guide

Welcome to the administrative portal for **Silwasa IT Solutions** (`https://silwasa.com/admin`).

This guide details how non-technical administrators, content editors, and marketing managers can control the public website without writing code.

---

## 1. Accessing the Admin Portal

- **URL:** `https://silwasa.com/admin` (or `/admin/login`)
- **Default Credentials:** Seeded upon initial deployment. Contact the Super Administrator for account creation or credential resets.
- **Role Hierarchy:**
  - `SUPER_ADMIN`: Unrestricted system access, user management, environment settings, and audit logs.
  - `ADMIN`: Full content control, media management, lead assignment, and pricing updates.
  - `EDITOR`: Draft and publish blog posts, pages, testimonials, and FAQs.
  - `SEO_MANAGER`: Meta tags, Open Graph images, canonical links, and search indexing rules.

---

## 2. Dynamic Pages & Visual Modular Page Builder (`/admin/pages`)

The homepage and all marketing landing pages are assembled dynamically using validated modular sections.

### Creating a New Page
1. Navigate to **Pages** in the sidebar.
2. Click **Add New Page**.
3. Choose a template preset:
   - **Blank Canvas**: Start with an empty canvas.
   - **Standard Landing Page**: Pre-populates Hero, Services, Case Studies, and Contact sections.
4. Specify the **Page Title** and URL **Slug** (e.g. `enterprise-web-solutions`).
5. Click **Create Page**.

### Customizing Page Sections
In the Page Builder (`/admin/pages/[id]`):
- **Add Sections:** Click any section card in the left-hand drawer (Hero, Services, Industries, Process, Tech Stack, Case Studies, Testimonials, Pricing, FAQ, CTA, Contact, Rich Text).
- **Reorder:** Use the **Move Up** and **Move Down** arrows on any section card to change visual order.
- **Edit Settings:** Click a section to open the context-sensitive inspector. Customize headings, badge text, button labels, and URLs.
- **Preview & Revisions:** Open the **Revision History** modal to restore any historical snapshot.
- **Publish:** Toggle between **Draft** and **Published** mode.

---

## 3. Navigation & Mega Menu CMS (`/admin/navigation`)

Control desktop mega menus, footer links, and mobile navigation drawers.

### Editing Header Navigation
1. Navigate to **Navigation**.
2. Select **Main Header Navigation (Header)** from the menu switcher.
3. Add top-level links (e.g. `Services`, `Industries`, `Portfolio`, `Pricing`, `About Us`).
4. **Mega Menu Designer:**
   - Toggle **Enable Mega Menu Dropdown** on any top-level link.
   - Add multi-column categories with custom headings.
   - Add child links with title, destination URL, description, and pill badges (e.g. `Popular`, `New`).
   - Configure the **Featured Promo Box** (right-hand card with title, description, and CTA button).
5. Click **Save Navigation Menu**.

---

## 4. Blog Publishing & SEO Inspector (`/admin/blogs`)

Publish SEO-optimized engineering articles with automated reading time estimation.

### Writing an Article
1. Navigate to **Blog Posts** -> click **New Article**.
2. Enter the **Article Title** — the slug generates in real time.
3. Select an **Author**, **Category**, and add topic **Tags**.
4. Use the formatting toolbar for Headings, Bullet Lists, Blockquotes, and Code blocks.
5. Provide a high-resolution **Cover Image URL** with live preview.
6. Check the **Reading Time Counter** and **Word Count** in the top inspector.
7. **SEO Tab:** Configure custom Meta Title, Description, Canonical Tag, and Open Graph Social Share Image.
8. Click **Publish Article** or **Save Draft**.

---

## 5. Services & Dynamic Pricing Engine (`/admin/services` & `/admin/pricing`)

### Services Management
- Manage service offerings (`Website Design and Development`, `Custom Software`, `React.js Development`, etc.).
- Add verified deliverables, business ROI highlights, and process steps.
- Reorder services to control their position on the public website.

### Pricing Plans & Automated Discounts
- Create value-driven tiers (e.g., Growth Foundation, Scale & Performance, Enterprise).
- Configure monthly vs annual billing rates with automatic 20% savings tags.
- **Promotional Discounts:** Set percentage or fixed discounts with start and end dates. The pricing engine automatically verifies whether promotional periods are active.

---

## 6. Client Enquiries & Lead Inbox (`/admin/enquiries`)

Manage all project inquiries submitted through public forms.

- **Status Pipeline:** Filter leads by `NEW`, `CONTACTED`, `IN_PROGRESS`, `CONVERTED`, or `CLOSED`.
- **Instant Shortcuts:** Click the **WhatsApp** or **Email** icons to initiate contact with clients immediately.
- **Internal Notes:** Open any lead to view full project specifications and add internal team notes to track phone discussions and contract progress.

---

## 7. Email & Transactional Provider Routing (`/admin/email`)

Configure the email delivery engine:
- **Provider:** Choose between Brevo, Twilio SendGrid, Google Workspace, or Local Log.
- **Sender Routing:** Set the branded `From` address (`contact@silwasa.com`) and notification recipient.
- **Real-Time Verification:** Use the **Send Test Email** button to verify deliverability before going live.

---

## 8. Theme Customizer & Brand Identity (`/admin/theme` & `/admin/settings`)

- **Theme Palette:** Adjust primary (`#663399`), accent lime (`#D9F45F`), dark background (`#151414`), card background (`#1C1B1B`), and border colors with live visual preview.
- **One-Click Reset:** Use "Restore Default Palette" to return to the approved Silwasa brand identity.
- **General Settings:** Update business phone (`+91 7070717794`), WhatsApp number, physical office address, copyright text, and social links.

---

## 9. Media Library (`/admin/media`)

- Upload images (`JPEG`, `PNG`, `WebP`, `SVG`) and PDF documents up to 10 MB.
- Copy responsive CDN URLs with one click.
- **Safety Check:** The media library prevents accidental deletion of assets that are actively linked inside published pages or articles (`usageCount > 0`).
