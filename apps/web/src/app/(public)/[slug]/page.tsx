import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Page, PageSection } from '@silwasa/types';
import { SectionRegistry } from '../../../components/sections/SectionRegistry';
import { Button } from '../../../components/ui/Button';
import { ArrowLeft, Home, FileQuestion } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-seeded fallback data for standard pages
const PRESEEDED_PAGES: Record<string, Page> = {
  about: {
    id: 'page-about',
    title: 'About Us | Silwasa IT Solutions',
    slug: 'about',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'About Silwasa IT Solutions | Enterprise Engineering & AI',
      metaDescription: 'Learn how Silwasa IT Solutions architects scalable web applications, enterprise software, and AI solutions.',
      robotsIndex: true,
      robotsFollow: true,
    },
    sections: [
      {
        id: 'sec-about-hero',
        type: 'hero',
        version: 1,
        order: 0,
        isEnabled: true,
        settings: {
          badge: 'ABOUT OUR AGENCY',
          heading: 'Engineering Digital Dominance for Ambitious Brands',
          description: 'We combine rock-solid computer science fundamentals, modern full-stack architectures, and AI innovations to deliver enterprise-grade digital products.',
          ctaText: 'Explore Our Work',
          ctaUrl: '/portfolio',
        },
      },
      {
        id: 'sec-about-intro',
        type: 'about-intro',
        version: 1,
        order: 1,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-about-tech',
        type: 'technologies',
        version: 1,
        order: 2,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-about-process',
        type: 'development-process',
        version: 1,
        order: 3,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-about-cta',
        type: 'cta',
        version: 1,
        order: 4,
        isEnabled: true,
        settings: {},
      },
    ],
  },
  services: {
    id: 'page-services',
    title: 'Comprehensive Digital Services | Silwasa IT Solutions',
    slug: 'services',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'Services | Custom Web, Mobile & Enterprise Software',
      metaDescription: 'Explore our full spectrum of digital services from full-stack Next.js platforms to AI solutions and GEO optimization.',
      robotsIndex: true,
      robotsFollow: true,
    },
    sections: [
      {
        id: 'sec-serv-hero',
        type: 'hero',
        version: 1,
        order: 0,
        isEnabled: true,
        settings: {
          badge: 'FULL-SPECTRUM ENGINEERING',
          heading: 'High-Performance Web, AI & Cloud Architecture',
          description: 'We design, engineer, and deploy mission-critical digital systems built for speed, conversion, and longevity.',
          ctaText: 'Discuss Your Requirements',
          ctaUrl: '/contact',
        },
      },
      {
        id: 'sec-serv-grid',
        type: 'services-grid',
        version: 1,
        order: 1,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-serv-process',
        type: 'development-process',
        version: 1,
        order: 2,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-serv-cta',
        type: 'cta',
        version: 1,
        order: 3,
        isEnabled: true,
        settings: {},
      },
    ],
  },
  industries: {
    id: 'page-industries',
    title: 'Industries & Verticals | Silwasa IT Solutions',
    slug: 'industries',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'Industries We Serve | Healthcare, FinTech, Logistics, Real Estate',
      metaDescription: 'Specialized enterprise software engineered to meet strict compliance and performance standards across high-growth verticals.',
      robotsIndex: true,
      robotsFollow: true,
    },
    sections: [
      {
        id: 'sec-ind-hero',
        type: 'hero',
        version: 1,
        order: 0,
        isEnabled: true,
        settings: {
          badge: 'VERTICAL-SPECIFIC COMPLIANCE',
          heading: 'Tailor-Made Platforms For High-Stakes Industries',
          description: 'From HIPAA-compliant healthcare portals to high-frequency fintech systems and real-time logistics telematics.',
          ctaText: 'Request Industry Case Study',
          ctaUrl: '/contact',
        },
      },
      {
        id: 'sec-ind-grid',
        type: 'industries-grid',
        version: 1,
        order: 1,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-ind-cta',
        type: 'cta',
        version: 1,
        order: 2,
        isEnabled: true,
        settings: {},
      },
    ],
  },
  portfolio: {
    id: 'page-portfolio',
    title: 'Portfolio & Case Studies | Silwasa IT Solutions',
    slug: 'portfolio',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-port-grid',
        type: 'featured-portfolio',
        version: 1,
        order: 0,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-port-cases',
        type: 'case-studies',
        version: 1,
        order: 1,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-port-cta',
        type: 'cta',
        version: 1,
        order: 2,
        isEnabled: true,
        settings: {},
      },
    ],
  },
  pricing: {
    id: 'page-pricing',
    title: 'Pricing & Engagement Packages | Silwasa IT Solutions',
    slug: 'pricing',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-price-plans',
        type: 'pricing-plans',
        version: 1,
        order: 0,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-price-faqs',
        type: 'faqs',
        version: 1,
        order: 1,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-price-cta',
        type: 'cta',
        version: 1,
        order: 2,
        isEnabled: true,
        settings: {},
      },
    ],
  },
  contact: {
    id: 'page-contact',
    title: 'Contact Us | Silwasa IT Solutions',
    slug: 'contact',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-cont-form',
        type: 'contact-form',
        version: 1,
        order: 0,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-cont-faqs',
        type: 'faqs',
        version: 1,
        order: 1,
        isEnabled: true,
        settings: {},
      },
    ],
  },
  faq: {
    id: 'page-faq',
    title: 'Frequently Asked Questions | Silwasa IT Solutions',
    slug: 'faq',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-faq-block',
        type: 'faqs',
        version: 1,
        order: 0,
        isEnabled: true,
        settings: {},
      },
      {
        id: 'sec-faq-cta',
        type: 'cta',
        version: 1,
        order: 1,
        isEnabled: true,
        settings: {},
      },
    ],
  },
  'privacy-policy': {
    id: 'page-privacy',
    title: 'Privacy Policy | Silwasa IT Solutions',
    slug: 'privacy-policy',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-priv-text',
        type: 'rich-text',
        version: 1,
        order: 0,
        isEnabled: true,
        settings: {
          badge: 'LEGAL NOTICE',
          heading: 'Privacy Policy',
          subheading: 'Last updated: November 2026. How Silwasa IT Solutions protects and handles client and visitor data.',
          contentHtml: `
            <h3>1. Overview</h3>
            <p>At Silwasa IT Solutions, we respect your privacy and are committed to protecting any personal and business data you share with us. This Privacy Policy details our practices concerning data collection, transmission, and retention.</p>
            <h3>2. Information We Collect</h3>
            <p>We collect information you directly submit via our project brief forms, contact inquiries, and email correspondences, including your name, corporate email address, phone number, and project scope requirements.</p>
            <h3>3. Use of Information</h3>
            <p>Data gathered is exclusively used to evaluate project requirements, formulate technical estimates, provide contractual communications, and adhere to statutory compliance.</p>
            <h3>4. Data Security</h3>
            <p>We deploy modern encryption protocols including SSL/TLS in transit and Argon2id / AES-256 at rest. We never sell, rent, or trade your data with third-party advertisers.</p>
          `,
        },
      },
    ],
  },
  'terms-and-conditions': {
    id: 'page-terms',
    title: 'Terms and Conditions | Silwasa IT Solutions',
    slug: 'terms-and-conditions',
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: [
      {
        id: 'sec-terms-text',
        type: 'rich-text',
        version: 1,
        order: 0,
        isEnabled: true,
        settings: {
          badge: 'TERMS OF SERVICE',
          heading: 'Terms and Conditions',
          subheading: 'Governing terms for technical consulting, custom development, and digital services delivered by Silwasa IT Solutions.',
          contentHtml: `
            <h3>1. Engagement & Milestones</h3>
            <p>All software development projects undertaken by Silwasa IT Solutions are governed by individual Statements of Work (SOW) specifying milestones, acceptance criteria, and SLA guarantees.</p>
            <h3>2. Intellectual Property Ownership</h3>
            <p>Upon receipt of full and final milestone payment, the client receives 100% complete and unencumbered ownership of all custom source code, documentation, and digital deliverables created specifically for the project.</p>
            <h3>3. Confidentiality & Non-Disclosure</h3>
            <p>Both parties agree to treat all proprietary business logic, client data, and software architecture designs as strictly confidential under mutual NDA provisions.</p>
          `,
        },
      },
    ],
  },
};

async function getPageBySlug(slug: string): Promise<Page | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    const res = await fetch(`${apiUrl}/pages/${slug}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch {
    // API not reachable or offline, fallback to pre-seeded content
  }

  return PRESEEDED_PAGES[slug] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Page Not Found | Silwasa IT Solutions',
    };
  }

  return {
    title: page.seo?.metaTitle || `${page.title} | Silwasa IT Solutions`,
    description:
      page.seo?.metaDescription ||
      'Silwasa IT Solutions engineers high-performance web platforms, custom enterprise software, and AI solutions.',
    alternates: {
      canonical: page.seo?.canonicalUrl || `https://silwasa.com/${page.slug}`,
    },
    robots: {
      index: page.seo?.robotsIndex !== false,
      follow: page.seo?.robotsFollow !== false,
    },
  };
}

export default async function DynamicPublicPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#151414]">
        <div className="w-16 h-16 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] flex items-center justify-center text-[#D9F45F] mb-6 shadow-xl">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-white/60 text-base max-w-md mb-8 leading-relaxed">
          The requested page <code className="text-[#D9F45F] font-mono font-bold">/{slug}</code> does not exist or has been relocated by the administrator.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="primary" className="rounded-full">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="rounded-full">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SectionRegistry sections={page.sections} />
    </div>
  );
}
