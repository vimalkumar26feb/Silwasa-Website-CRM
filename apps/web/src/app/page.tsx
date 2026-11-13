import React from 'react';
import type { Metadata } from 'next';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SectionRegistry } from '../components/sections/SectionRegistry';
import type { Page, PageSection } from '@silwasa/types';

export const metadata: Metadata = {
  title: 'Silwasa IT Solutions | Sustainable SEO & Enterprise Digital Engineering',
  description:
    'Silwasa IT Solutions engineers high-performance web platforms, custom enterprise software, AI solutions, and Generative Engine Optimization (GEO) to accelerate business growth.',
  alternates: {
    canonical: 'https://silwasa.com',
  },
};

const DEFAULT_HOMEPAGE_SECTIONS: PageSection[] = [
  {
    id: 'sec-home-hero',
    type: 'hero',
    version: 1,
    order: 0,
    isEnabled: true,
    settings: {
      badge: 'SOLUTIONS FOR CREATIVE PRODUCTS',
      heading: 'Sustainable SEO For Serious Brands',
      description:
        'Silwasa IT Solutions engineers high-performance web platforms, custom enterprise software, AI solutions, and Generative Engine Optimization (GEO) to accelerate business growth.',
      checklist: [
        'Crawlability & Indexing Fixing errors',
        'Identifying exact high-intent queries',
        'Strategically linking high-authority content',
        'Enterprise-grade security and Core Web Vitals',
      ],
      ctaText: 'Get In Touch',
      ctaUrl: '/contact',
      whatsappUrl: 'https://wa.me/917070717794',
      satisfiedCustomersCount: '200K+',
    },
  },
  {
    id: 'sec-home-services',
    type: 'services-grid',
    version: 1,
    order: 1,
    isEnabled: true,
    settings: {
      badge: 'OUR COMPREHENSIVE EXPERTISE',
      heading: 'Transformative Digital Services',
      subheading:
        'We engineer tailor-made digital platforms designed to outpace the competition and drive measurable business ROI.',
      viewAllUrl: '/services',
    },
  },
  {
    id: 'sec-home-industries',
    type: 'industries-grid',
    version: 1,
    order: 2,
    isEnabled: true,
    settings: {
      badge: 'SPECIALIZED SECTOR EXPERTISE',
      heading: 'Engineered For Industry-Specific Rigor',
      subheading:
        'We design and deploy compliant, mission-critical digital systems tailored to the exact regulatory and technical standards of each vertical.',
      viewAllUrl: '/industries',
    },
  },
  {
    id: 'sec-home-tech',
    type: 'technologies',
    version: 1,
    order: 3,
    isEnabled: true,
    settings: {
      badge: 'MODERN PRODUCTION STACK',
      heading: 'Built With World-Class Engineering Tools',
      subheading:
        'We reject fragile legacy stacks. Every system we build leverages battle-tested, high-concurrency technologies designed for 99.99% uptime.',
    },
  },
  {
    id: 'sec-home-process',
    type: 'development-process',
    version: 1,
    order: 4,
    isEnabled: true,
    settings: {
      badge: 'PROVEN AGILE METHODOLOGY',
      heading: 'From Concept to Flawless Production',
      subheading:
        'A disciplined, transparent delivery framework engineered to eliminate guesswork, mitigate risks, and ship on time.',
    },
  },
  {
    id: 'sec-home-about',
    type: 'about-intro',
    version: 1,
    order: 5,
    isEnabled: true,
    settings: {
      badge: 'ABOUT SILWASA IT SOLUTIONS',
      heading: 'Architecting Sustainable Digital Superiority',
      subheading:
        'We are a premier digital engineering agency dedicated to transforming ambitious companies into market leaders through cutting-edge technology and data-backed design.',
      ctaText: 'Learn More About Us',
      ctaUrl: '/about',
    },
  },
  {
    id: 'sec-home-cases',
    type: 'case-studies',
    version: 1,
    order: 6,
    isEnabled: true,
    settings: {
      badge: 'PROVEN IMPACT & METRICS',
      heading: 'Data-Driven Case Studies',
      subheading:
        'Explore how our custom engineering and GEO optimization transform complex business problems into multimillion-dollar growth engines.',
      viewAllUrl: '/case-studies',
    },
  },
  {
    id: 'sec-home-portfolio',
    type: 'featured-portfolio',
    version: 1,
    order: 7,
    isEnabled: true,
    settings: {
      badge: 'SELECTED WORK & CREATIVE IMPACT',
      heading: 'Engineered For Real-World Performance',
      subheading:
        'A selection of high-concurrency web applications, enterprise portals, and transformative platforms built for world-class clients.',
      viewAllUrl: '/portfolio',
    },
  },
  {
    id: 'sec-home-pricing',
    type: 'pricing-plans',
    version: 1,
    order: 8,
    isEnabled: true,
    settings: {
      badge: 'TRANSPARENT, VALUE-DRIVEN TIERS',
      heading: 'Flexible Investment For Serious Growth',
      subheading:
        'No hidden licensing fees, no vendor lock-in. You own 100% of the source code, database, and intellectual property.',
    },
  },
  {
    id: 'sec-home-faqs',
    type: 'faqs',
    version: 1,
    order: 9,
    isEnabled: true,
    settings: {
      badge: 'FREQUENTLY ASKED QUESTIONS',
      heading: 'Everything You Need To Know',
      subheading:
        'Clear, direct answers about our architecture, engineering standards, timelines, and deliverables.',
    },
  },
  {
    id: 'sec-home-cta',
    type: 'cta',
    version: 1,
    order: 10,
    isEnabled: true,
    settings: {
      badge: 'READY TO BUILD SOMETHING EXTRAORDINARY?',
      heading: 'Let’s Turn Your Vision Into Market Dominance',
      description:
        'Schedule a technical consultation with our engineering team today to review your architecture, scope out your roadmap, and receive a transparent milestone estimate.',
      primaryCtaText: 'Start Your Project Today',
      primaryCtaUrl: '/contact',
    },
  },
  {
    id: 'sec-home-contact',
    type: 'contact-form',
    version: 1,
    order: 11,
    isEnabled: true,
    settings: {
      badge: 'GET IN TOUCH WITH ENGINEERS',
      heading: 'Let’s Architect Your Next Breakthrough',
      subheading:
        'Have a project in mind or need technical guidance? Send us a message and our lead engineering architect will respond within 24 hours.',
    },
  },
];

async function getHomepageData(): Promise<PageSection[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    const res = await fetch(`${apiUrl}/pages/home`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.sections?.length > 0) {
        return data.data.sections;
      }
    }
  } catch {
    // Backend offline / not reachable during build, use default sections
  }

  return DEFAULT_HOMEPAGE_SECTIONS;
}

export default async function HomePage() {
  const sections = await getHomepageData();

  return (
    <div className="min-h-screen flex flex-col bg-[#151414] text-white">
      <Header />
      <main className="flex-1">
        <SectionRegistry sections={sections} />
      </main>
      <Footer />
    </div>
  );
}
