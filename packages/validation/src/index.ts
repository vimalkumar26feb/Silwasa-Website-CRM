import { z } from 'zod';
import { UserRole } from '@silwasa/types';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

export const UserRoleEnum = z.nativeEnum(UserRole);

export const CreateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: UserRoleEnum
});

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: UserRoleEnum.optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(8).optional()
});

export const SEOMetadataSchema = z.object({
  metaTitle: z.string().max(70, 'Meta title should be under 70 characters').optional().nullable(),
  metaDescription: z.string().max(160, 'Meta description should be under 160 characters').optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
  canonicalUrl: z.string().url('Invalid canonical URL').optional().or(z.literal('')).nullable(),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
  ogTitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImageUrl: z.string().url().optional().or(z.literal('')).nullable(),
  twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
  structuredDataJson: z.string().optional().nullable()
});

export const SectionTypeEnum = z.enum([
  'hero',
  'hero-carousel',
  'image-carousel',
  'video-carousel',
  'clients-partners',
  'about-intro',
  'services-grid',
  'featured-services',
  'statistics',
  'industries-grid',
  'development-process',
  'technologies',
  'featured-portfolio',
  'case-studies',
  'testimonials-carousel',
  'pricing-plans',
  'blog-carousel',
  'faqs',
  'cta',
  'contact-form',
  'rich-text',
]);

export const PageSectionSchema = z.object({
  id: z.string(),
  type: SectionTypeEnum,
  version: z.number().default(1),
  order: z.number(),
  isEnabled: z.boolean().default(true),
  settings: z.record(z.unknown()),
  customCss: z.string().optional()
});

export const CreatePageSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  content: z.string().optional().nullable(),
  sections: z.array(PageSectionSchema).default([]),
  isPublished: z.boolean().default(false),
  featuredImageId: z.string().optional().nullable(),
  featuredImageUrl: z.string().url().optional().or(z.literal('')).nullable(),
  parentPageId: z.string().optional().nullable(),
  seo: SEOMetadataSchema.optional().nullable()
});

export const UpdatePageSchema = CreatePageSchema.partial();

export const CreateBlogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  featuredImageUrl: z.string().url().optional().or(z.literal('')).nullable(),
  readingTimeMinutes: z.number().int().positive().default(5),
  isPublished: z.boolean().default(false),
  categoryIds: z.array(z.string()).default([]),
  tagNames: z.array(z.string()).default([]),
  seo: SEOMetadataSchema.optional().nullable()
});

export const UpdateBlogPostSchema = CreateBlogPostSchema.partial();

export const CreateCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().or(z.literal('')).nullable(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export const CreateTagSchema = z.object({
  name: z.string().min(2, 'Tag name must be at least 2 characters'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
});

export const UpdateTagSchema = CreateTagSchema.partial();

export const CreateServiceSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  shortDescription: z.string().min(10, 'Short description is required'),
  fullDescription: z.string().min(20, 'Full description is required'),
  icon: z.string().optional(),
  featuredImageUrl: z.string().url().optional().or(z.literal('')),
  features: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  process: z.array(z.object({
    step: z.number(),
    title: z.string(),
    description: z.string()
  })).default([]),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).default([]),
  isPublished: z.boolean().default(true),
  order: z.number().default(0),
  seo: SEOMetadataSchema.optional().nullable()
});

export const CreatePricingPackageSchema = z.object({
  name: z.string().min(2, 'Package name is required'),
  serviceId: z.string().optional().nullable(),
  shortDescription: z.string().min(5),
  regularPrice: z.number().positive('Regular price must be greater than 0'),
  discountedPrice: z.number().positive().optional().nullable(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).optional().nullable(),
  discountValue: z.number().optional().nullable(),
  discountStartDate: z.string().optional().nullable(),
  discountEndDate: z.string().optional().nullable(),
  currency: z.string().default('INR'),
  features: z.array(z.object({
    id: z.string(),
    text: z.string(),
    included: z.boolean().default(true)
  })).min(1, 'At least one feature is required'),
  isPopular: z.boolean().default(false),
  ctaLabel: z.string().default('Choose Plan'),
  ctaUrl: z.string().default('/contact'),
  order: z.number().default(0),
  isActive: z.boolean().default(true)
});

export const UpdateServiceSchema = CreateServiceSchema.partial();
export const UpdatePricingPackageSchema = CreatePricingPackageSchema.partial();

export const CreateEnquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  sourcePage: z.string().optional()
});

export const UpdateEnquiryStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'CONVERTED', 'CLOSED', 'SPAM']),
  note: z.string().optional(),
  assignedUserId: z.string().optional().nullable()
});

export const AddEnquiryNoteSchema = z.object({
  content: z.string().min(1, 'Note content cannot be empty'),
  authorName: z.string().min(1, 'Author name is required')
});

export const ThemeSettingsSchema = z.object({
  colors: z.object({
    primary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, 'Invalid hex color'),
    secondary: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, 'Invalid hex color'),
    accent: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, 'Invalid hex color'),
    background: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, 'Invalid hex color'),
    text: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, 'Invalid hex color'),
    cardBackground: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, 'Invalid hex color'),
    borderColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/, 'Invalid hex color')
  }),
  fontFamilyHeading: z.string().default('Inter, sans-serif'),
  fontFamilyBody: z.string().default('Inter, sans-serif'),
  borderRadius: z.string().default('8px')
});

export const GeneralSettingsSchema = z.object({
  siteName: z.string().min(1),
  siteTagline: z.string().optional(),
  siteUrl: z.string().url(),
  businessName: z.string().min(1),
  businessDescription: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  businessAddress: z.string().optional(),
  copyrightText: z.string().optional(),
  timezone: z.string().default('Asia/Kolkata'),
  defaultCurrency: z.string().default('INR'),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  socialLinks: z.array(z.object({
    platform: z.string(),
    url: z.string().url()
  })).default([])
});


export const MegaMenuLinkSchema = z.object({
  label: z.string().min(1, 'Link label is required'),
  url: z.string().min(1, 'URL is required'),
  description: z.string().optional(),
  icon: z.string().optional(),
  badge: z.string().optional(),
});

export const MegaMenuColumnSchema = z.object({
  heading: z.string().min(1, 'Heading is required'),
  links: z.array(MegaMenuLinkSchema).default([]),
  featuredItem: z.object({
    title: z.string(),
    description: z.string(),
    imageUrl: z.string().optional(),
    ctaLabel: z.string().optional(),
    ctaUrl: z.string().optional(),
  }).optional(),
});

export const MenuItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    label: z.string().min(1, 'Menu label is required'),
    url: z.string().min(1, 'Menu URL is required'),
    order: z.number().int().default(0),
    target: z.enum(['_self', '_blank']).default('_self'),
    icon: z.string().optional(),
    badge: z.string().optional(),
    description: z.string().optional(),
    isMegaMenu: z.boolean().default(false),
    megaMenuColumns: z.array(MegaMenuColumnSchema).optional(),
    children: z.array(MenuItemSchema).optional(),
    isEnabled: z.boolean().default(true),
  })
);

export const MenuLocationEnum = z.enum([
  'header',
  'footer-main',
  'footer-services',
  'footer-company',
  'footer-legal',
  'mobile',
]);

export const CreateMenuSchema = z.object({
  name: z.string().min(1, 'Menu name is required'),
  location: MenuLocationEnum,
  items: z.array(MenuItemSchema).default([]),
});

export const UpdateMenuSchema = z.object({
  name: z.string().min(1).optional(),
  location: MenuLocationEnum.optional(),
  items: z.array(MenuItemSchema).optional(),
});
