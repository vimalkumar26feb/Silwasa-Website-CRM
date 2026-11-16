export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  SEO_MANAGER = 'SEO_MANAGER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  token?: string;
  expiresAt: string;
}

export type SectionType =
  | 'hero'
  | 'hero-carousel'
  | 'image-carousel'
  | 'video-carousel'
  | 'clients-partners'
  | 'about-intro'
  | 'services-grid'
  | 'featured-services'
  | 'statistics'
  | 'industries-grid'
  | 'development-process'
  | 'technologies'
  | 'featured-portfolio'
  | 'case-studies'
  | 'testimonials-carousel'
  | 'pricing-plans'
  | 'blog-carousel'
  | 'faqs'
  | 'cta'
  | 'contact-form'
  | 'rich-text';

export interface PageSection<T = Record<string, unknown>> {
  id: string;
  type: SectionType;
  version: number;
  order: number;
  isEnabled: boolean;
  settings: T;
  customCss?: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  sections: PageSection[];
  isPublished: boolean;
  publishedAt?: string | null;
  featuredImageId?: string | null;
  featuredImageUrl?: string | null;
  parentPageId?: string | null;
  seo?: SEOMetadata | null;
  createdAt: string;
  updatedAt: string;
}

export interface SEOMetadata {
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  keywords?: string[];
  canonicalUrl?: string | null;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  noIndex?: boolean;
  noFollow?: boolean;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredDataJson?: string | null;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  target?: '_self' | '_blank';
  icon?: string;
  badge?: string;
  description?: string;
  isMegaMenu?: boolean;
  megaMenuColumns?: MegaMenuColumn[];
  children?: MenuItem[];
  isEnabled: boolean;
}

export interface MegaMenuColumn {
  heading: string;
  links: {
    label: string;
    url: string;
    description?: string;
    icon?: string;
    badge?: string;
  }[];
  featuredItem?: {
    title: string;
    description: string;
    imageUrl?: string;
    ctaLabel?: string;
    ctaUrl?: string;
  };
}

export interface Menu {
  id: string;
  name: string;
  location: 'header' | 'footer-main' | 'footer-services' | 'footer-company' | 'footer-legal' | 'mobile';
  items: MenuItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl?: string | null;
  readingTimeMinutes: number;
  isPublished: boolean;
  publishedAt?: string | null;
  authorId?: string;
  authorName?: string;
  author?: { id: string; name: string; email?: string; avatarUrl?: string | null };
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  seo?: SEOMetadata | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  seo?: SEOMetadata | null;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon?: string;
  featuredImageUrl?: string;
  features: string[];
  benefits: string[];
  process: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  isPublished: boolean;
  order: number;
  pricingPackages?: PricingPackage[];
  seo?: SEOMetadata | null;
}

export interface PricingPackage {
  id: string;
  name: string;
  serviceId?: string | null;
  serviceName?: string | null;
  shortDescription: string;
  regularPrice: number;
  discountedPrice?: number | null;
  discountType?: 'PERCENTAGE' | 'FIXED' | null;
  discountValue?: number | null;
  discountStartDate?: string | null;
  discountEndDate?: string | null;
  currency: string;
  features: { id: string; text: string; included: boolean }[];
  isPopular: boolean;
  ctaLabel: string;
  ctaUrl: string;
  order: number;
  isActive: boolean;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  icon?: string;
  featuredImageUrl?: string;
  challenges: string[];
  solutions: string[];
  caseStudyIds?: string[];
  isPublished: boolean;
  order: number;
  pricingPackages?: PricingPackage[];
  seo?: SEOMetadata | null;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  industry: string;
  category: string;
  projectUrl?: string;
  featuredImageUrl: string;
  galleryImages: string[];
  description: string;
  technologies: string[];
  challenges: string;
  solutions: string;
  results: string;
  isPublished: boolean;
  order: number;
  pricingPackages?: PricingPackage[];
  seo?: SEOMetadata | null;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientAvatarUrl?: string;
  content: string;
  rating: number;
  isFeatured: boolean;
  order: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

export interface Enquiry {
  id: string;
  enquiryId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  service?: string;
  budget?: string;
  message: string;
  sourcePage?: string;
  status: 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CONVERTED' | 'CLOSED' | 'SPAM';
  assignedUserId?: string;
  notes?: EnquiryNote[];
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryNote {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  url: string;
  publicId?: string;
  altText?: string;
  title?: string;
  provider: 'local' | 'cloudinary' | 's3';
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  cardBackground: string;
  borderColor: string;
}

export interface ThemeSettings {
  colors: ThemeColors;
  fontFamilyHeading: string;
  fontFamilyBody: string;
  borderRadius: string;
}

export interface GeneralSettings {
  siteName: string;
  siteTagline?: string;
  siteUrl: string;
  businessName: string;
  businessDescription?: string;
  contactEmail: string;
  contactPhone?: string;
  whatsappNumber?: string;
  businessAddress?: string;
  copyrightText?: string;
  timezone: string;
  defaultCurrency: string;
  logoUrl?: string;
  faviconUrl?: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
