import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Layers,
  TrendingUp,
  ShieldCheck,
  Check,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { ContactSection } from '../../../../components/sections/ContactSection';
import { FaqSection } from '../../../../components/sections/FaqSection';
import type { Service } from '@silwasa/types';
import { formatCurrency } from '@silwasa/shared';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SEEDED_SERVICES: Record<string, Service> = {
  'website-design-development': {
    id: 's-1',
    title: 'Website Design and Development',
    slug: 'website-design-development',
    shortDescription:
      'Custom, high-converting enterprise websites engineered with Next.js 15, React 19, and sub-second Core Web Vitals.',
    fullDescription:
      'Silwasa IT Solutions engineers high-performance web platforms built from the ground up to outperform generic templates. Every line of code is structured for sub-second Largest Contentful Paint, maximum search crawlability, and flawless user journeys across all device formats.',
    features: [
      'Custom Next.js 15 & React 19 Architecture',
      'Mobile-First Fluid Responsive Design',
      'Sub-Second LCP Performance Tuning',
      'Custom Role-Based CMS Integration',
      'Built-In Technical SEO & Schema Markup',
      'Automated Form Lead Routing & Webhooks',
    ],
    benefits: [
      'Accelerate Organic Inbound Traffic by up to 340%',
      'Double-Digit Conversion Funnel Improvements',
      'Zero Architectural Debt with Strict TypeScript Contracts',
      '100% Full Source Code and Intellectual Property Ownership',
    ],
    process: [
      { step: 1, title: 'Discovery & Blueprinting', description: 'Auditing competitors, defining requirements, and scoping milestones.' },
      { step: 2, title: 'Interactive Prototypes', description: 'Custom Figma design systems and mobile-tested responsive wireframes.' },
      { step: 3, title: 'Full-Stack Development', description: 'Sprint-based engineering with weekly staging releases.' },
      { step: 4, title: 'Zero-Downtime Launch & SLA', description: 'Production deployment with 24/7 uptime monitoring and maintenance.' },
    ],
    faqs: [
      { question: 'How long does a custom web platform take to ship?', answer: 'Most custom platforms ship within 2 to 4 weeks using our sprint-based agile delivery framework.' },
      { question: 'Do we own the source code and database upon completion?', answer: 'Yes, you receive 100% full, unencumbered ownership of all git repositories, database schemas, and Figma files upon final sign-off.' },
      { question: 'Will our marketing team be able to edit page content easily?', answer: 'Yes! Our custom visual admin dashboard allows your non-technical team members to manage menus, sections, and blogs with zero coding required.' },
    ],
    isPublished: true,
    order: 0,
    seo: {
      metaTitle: 'Website Design & Development | Silwasa IT Solutions',
      metaDescription: 'High-performance custom web platforms engineered for sub-second Core Web Vitals and enterprise scalability.',
      robotsIndex: true,
      robotsFollow: true,
    },
  },
  'custom-software-development': {
    id: 's-2',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    shortDescription:
      'Bespoke enterprise applications, business portals, workflow automation, and high-concurrency microservices.',
    fullDescription:
      'We architect, build, and deploy mission-critical software systems designed to solve complex business operations. From role-based customer portals to automated data processing pipelines, our software scales reliably with 99.99% uptime SLAs.',
    features: [
      'Microservices Architecture & API Gateways',
      'Zero-Trust Role-Based Access Control (RBAC)',
      'ACID-Compliant Relational Data Modeling',
      'Automated CI/CD Deployment Pipelines',
      'Third-Party ERP, CRM & Payment Connectors',
      'Bank-Grade Argon2id & AES-256 Encryption',
    ],
    benefits: [
      'Eliminate Manual Operational Bottlenecks',
      'Unify Fragmented Multi-Department Workflows',
      'Rock-Solid Security and Statutory Compliance',
      'Full Scalability Without Vendor Licensing Fees',
    ],
    process: [
      { step: 1, title: 'Architecture Blueprint', description: 'Database entity modeling, API specs, and security planning.' },
      { step: 2, title: 'Sprint Engineering', description: 'Modular backend services, TypeScript contracts, and automated tests.' },
      { step: 3, title: 'Quality Assurance & Pentests', description: 'Penetration testing, load benchmarking, and user acceptance testing.' },
      { step: 4, title: 'Deployment & SLA Retainer', description: 'Cloud infrastructure provisioning and 24/7 dedicated support.' },
    ],
    faqs: [
      { question: 'Can you integrate with our existing ERP or CRM software?', answer: 'Yes, we regularly integrate with Salesforce, SAP, HubSpot, custom REST/GraphQL endpoints, and proprietary legacy databases.' },
      { question: 'What SLA guarantees do you provide for enterprise systems?', answer: 'We offer customizable SLAs with guaranteed sub-hour response times, 99.99% uptime commitments, and dedicated lead engineers.' },
    ],
    isPublished: true,
    order: 1,
    seo: {
      metaTitle: 'Custom Software Development | Silwasa IT Solutions',
      metaDescription: 'Bespoke enterprise software, business portals, and scalable cloud architectures.',
      robotsIndex: true,
      robotsFollow: true,
    },
  },
  'ai-solutions-geo': {
    id: 's-3',
    title: 'AI Solutions & Generative Engine Optimization',
    slug: 'ai-solutions-geo',
    shortDescription:
      'Generative Engine Optimization (GEO), private RAG pipelines, LLM fine-tuning, and autonomous business agents.',
    fullDescription:
      'Position your enterprise as the definitive authority cited by ChatGPT Search, Perplexity AI, Claude, and Google AI Overviews. We combine advanced Schema.org entity graphs, semantic vector search, and private LLM copilots to unlock modern AI-driven dominance.',
    features: [
      'Generative Engine Optimization (GEO)',
      'Structured JSON-LD Entity Graph Architecture',
      'Private Retrieval-Augmented Generation (RAG)',
      'Autonomous Customer Support & Data Agents',
      'Vector Database Integration (Pinecone, pgvector)',
      'Continuous Citation & Sentiment Monitoring',
    ],
    benefits: [
      'Top Rank in AI-Powered Search Summaries',
      'Attract High-Intent Inbound Enterprise Buyers',
      'Automate Repetitive Support with 60%+ Resolution Rates',
      'Future-Proof Your Brand Against AI Search Disruptions',
    ],
    process: [
      { step: 1, title: 'Entity Audit', description: 'Benchmarking how LLMs currently cite your brand versus competitors.' },
      { step: 2, title: 'Schema & Authority Graphs', description: 'Publishing machine-readable semantic entity clusters.' },
      { step: 3, title: 'AI Agent Deployment', description: 'Integrating private LLM workflows with your business systems.' },
      { step: 4, title: 'Citation Tracking & Growth', description: 'Monthly monitoring of ChatGPT, Claude, and Perplexity citation share.' },
    ],
    faqs: [
      { question: 'How is GEO different from traditional SEO?', answer: 'While SEO focuses on ranking in blue keyword links, GEO focuses on training and positioning your brand entities so generative models synthesize and cite your solutions directly in AI answers.' },
      { question: 'Will this help us get cited in ChatGPT and Perplexity?', answer: 'Yes. Our structured entity graphs and high-density authority architectures are explicitly designed to maximize inclusion in AI retrieval caches.' },
    ],
    isPublished: true,
    order: 2,
    seo: {
      metaTitle: 'AI Solutions & Generative Engine Optimization (GEO) | Silwasa',
      metaDescription: 'Dominate AI search citations across ChatGPT, Perplexity, and Claude with custom GEO architecture.',
      robotsIndex: true,
      robotsFollow: true,
    },
  },
};

async function getService(slug: string): Promise<Service | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    const res = await fetch(`${apiUrl}/services/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch {
    // API offline, fallback
  }

  return SEEDED_SERVICES[slug] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return { title: 'Service Not Found | Silwasa IT Solutions' };
  }

  return {
    title: service.seo?.metaTitle || `${service.title} | Silwasa IT Solutions`,
    description: service.seo?.metaDescription || service.shortDescription,
    alternates: {
      canonical: service.seo?.canonicalUrl || `https://silwasa.com/services/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="bg-[#151414] text-white">
      {/* Hero Overview */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-[#2A2B28]/60">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#663399]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#D9F45F]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-[#D9F45F]">{service.title}</span>
          </div>

          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
              <span className="w-2 h-2 rounded-full bg-[#D9F45F] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                SPECIALIZED ENGINEERING EXPERTISE
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              {service.title}
            </h1>

            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              {service.fullDescription || service.shortDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="#contact">
                <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-[#663399]/30">
                  <span>Schedule Technical Consultation</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <a
                href="https://wa.me/917070717794"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#2A2B28] hover:border-emerald-500 bg-[#1C1B1B] text-white text-sm font-semibold transition hover:bg-emerald-500/10"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp (+91 7070717794)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables & Features Grid */}
      <section className="py-20 lg:py-28 bg-[#151414] border-b border-[#2A2B28]/60">
        <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
              CORE SPECIFICATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What We Deliver
            </h2>
            <p className="text-white/70 text-base sm:text-lg">
              Enterprise-grade deliverables engineered to eliminate performance bottlenecks and ensure longevity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 transition flex items-start gap-3.5 group"
              >
                <div className="w-8 h-8 rounded-lg bg-[#663399]/20 flex items-center justify-center text-[#D9F45F] group-hover:bg-[#663399] group-hover:text-white transition-colors shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-[#D9F45F] transition-colors">
                    {feat}
                  </h4>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed">
                    Engineered to the highest computer science and security specifications.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-20 lg:py-28 bg-[#151414] border-b border-[#2A2B28]/60">
          <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                  TANGIBLE ROI
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Why Ambitious Leaders Choose Silwasa
                </h2>
                <p className="text-white/70 text-base leading-relaxed">
                  We don&apos;t just write code—we partner with leadership teams to engineer platforms that multiply enterprise value.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.benefits.map((ben, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] flex items-start gap-3"
                  >
                    <TrendingUp className="w-5 h-5 text-[#D9F45F] shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold text-white/90 leading-snug">{ben}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      {service.process && service.process.length > 0 && (
        <section className="py-20 lg:py-28 bg-[#151414] border-b border-[#2A2B28]/60">
          <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                DISCIPLINED SPRINT EXECUTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Our Proven Delivery Blueprint
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((p, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] flex flex-col justify-between"
                >
                  <div>
                    <span className="text-2xl font-extrabold text-[#D9F45F] font-mono mb-3 block">
                      0{p.step}
                    </span>
                    <h4 className="text-lg font-bold text-white mb-2">{p.title}</h4>
                    <p className="text-xs text-white/60 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service-Specific FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <FaqSection
          settings={{
            badge: `${service.title.toUpperCase()} FAQ`,
            heading: 'Frequently Asked Questions',
            subheading: `Direct, honest answers about our ${service.title.toLowerCase()} methodology, contracts, and timelines.`,
            faqs: service.faqs,
          }}
        />
      )}

      {/* Contact Section */}
      <ContactSection
        settings={{
          badge: `CONSULT WITH AN ARCHITECT`,
          heading: `Ready to Architect Your ${service.title}?`,
          subheading:
            'Schedule a confidential consultation with our technical leadership. Receive a transparent milestone estimate within 24 hours.',
        }}
      />
    </div>
  );
}
