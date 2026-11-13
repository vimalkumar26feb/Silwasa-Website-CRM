import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { apiClient } from '../../../../lib/api';
import type { Industry } from '@silwasa/types';
import { Button } from '../../../../components/ui/Button';
import { ContactSection } from '../../../../components/sections/ContactSection';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';

const SEEDED_INDUSTRIES: Record<string, Industry> = {
  'healthcare': {
    id: 'ind-1',
    name: 'Healthcare & Telemedicine',
    slug: 'healthcare',
    shortDescription: 'HIPAA-compliant patient portals, EHR telemetry, and doctor scheduling systems.',
    fullDescription: 'We architect enterprise healthcare platforms designed to safeguard patient privacy under HIPAA and NABH regulations while optimizing clinical throughput and EHR integrations.',
    icon: 'Stethoscope',
    challenges: ['Strict HIPAA & NABH Compliance Requirements', 'Legacy EHR Data Silos and Incompatible Formats', 'High-Latency Remote Telemedicine Telemetry'],
    solutions: ['End-to-End Encrypted FHIR Sockets and Audit Trails', 'Unified Telemetry Aggregation with Real-Time Push', 'Sub-second WebRTC Encrypted Video Consultations'],
    isPublished: true,
    order: 0,
  },
  'real-estate': {
    id: 'ind-2',
    name: 'Real Estate & PropTech',
    slug: 'real-estate',
    shortDescription: 'Interactive property showcases, CRM automation, and map telemetry.',
    fullDescription: 'Custom real estate portals featuring 3D virtual architectural walkthroughs, lead routing engines, automated commission tracking, and high-concurrency property listings.',
    icon: 'Building',
    challenges: ['Slow Map Rendering on Mobile Devices', 'Lead Leakage across Agent Networks', 'High Asset Storage Footprints from 4K Media'],
    solutions: ['Vector Tile Mapping via WebGL Hardware Acceleration', 'Automated Instant WhatsApp Lead Routing', 'Cloudflare Edge Image Optimization and Streaming CDN'],
    isPublished: true,
    order: 1,
  },
  'ecommerce-retail': {
    id: 'ind-3',
    name: 'E-commerce & Retail',
    slug: 'ecommerce-retail',
    shortDescription: 'Sub-second headless storefronts, multi-warehouse sync, and flash-sale resilience.',
    fullDescription: 'High-volume commerce platforms built on Next.js 15 App Router engineered to handle 50,000+ concurrent checkout requests without database locking.',
    icon: 'ShoppingCart',
    challenges: ['Cart Abandonment from Slow Largest Contentful Paint (LCP)', 'Inventory Race Conditions During High-Concurrency Flash Sales'],
    solutions: ['Edge-Rendered Catalogs with Sub-0.5s LCP Worldwide', 'Redis Atomic Stock Reservation Distributed Locks'],
    isPublished: true,
    order: 2,
  },
  'fintech-banking': {
    id: 'ind-4',
    name: 'FinTech & Banking',
    slug: 'fintech-banking',
    shortDescription: 'RBI/PCI-DSS compliant payments, ledger accounting, and KYC workflows.',
    fullDescription: 'Secure financial systems featuring end-to-end payload encryption, biometric authentication, fraud detection pipelines, and automated reconciliation.',
    icon: 'Landmark',
    challenges: ['PCI-DSS Level 1 Compliance & Regulatory Auditing', 'Sub-millisecond Transaction Verification under High Load'],
    solutions: ['Argon2id & AES-256 GCM Cryptography', 'Idempotent Webhook Processing Queues with Automatic Retry'],
    isPublished: true,
    order: 3,
  },
  'logistics-supply-chain': {
    id: 'ind-5',
    name: 'Logistics & Supply Chain',
    slug: 'logistics-supply-chain',
    shortDescription: 'Real-time vehicle GPS tracking, dispatch portals, and automated billing.',
    fullDescription: 'Custom enterprise supply chain software designed to track multi-hub freight movements, calculate automated toll tariffs, and deliver instant proof-of-delivery.',
    icon: 'Truck',
    challenges: ['Intermittent Fleet Cellular Connectivity', 'Complex Multi-tier Dispatch and Contractor Hierarchies'],
    solutions: ['Offline-First Progressive Web Apps with Background Sync', 'Role-Based Telematics Dashboards with Dynamic Routing'],
    isPublished: true,
    order: 4,
  },
  'education-edtech': {
    id: 'ind-6',
    name: 'Education & EdTech',
    slug: 'education-edtech',
    shortDescription: 'Scalable LMS portals, live video classrooms, and automated examination proctoring.',
    fullDescription: 'High-concurrency learning platforms with student analytics, video on demand, automated test grading, and payment gateway subscriptions.',
    icon: 'GraduationCap',
    challenges: ['Peak Examination Concurrency Spikes', 'Video Buffering on Low-Bandwidth Tier-2/3 Networks'],
    solutions: ['Adaptive HLS Bitrate Video Streaming', 'Serverless On-Demand Compute Scaling for Examination Peaks'],
    isPublished: true,
    order: 5,
  }
};

async function getIndustry(slug: string): Promise<Industry | null> {
  try {
    const res = await apiClient<any>(`/industries/${slug}`);
    if (res && res.data) return res.data;
  } catch {
    // Fallback
  }
  return SEEDED_INDUSTRIES[slug] || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustry(slug);

  if (!industry) {
    return { title: 'Industry Not Found | Silwasa IT Solutions' };
  }

  return {
    title: `${industry.name} Software Engineering Solutions | Silwasa`,
    description: industry.shortDescription,
    alternates: {
      canonical: `https://silwasa.com/industries/${industry.slug}`,
    },
    openGraph: {
      title: `${industry.name} Digital Solutions | Silwasa IT Solutions`,
      description: industry.shortDescription,
      url: `https://silwasa.com/industries/${industry.slug}`,
    },
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = await getIndustry(slug);

  if (!industry) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#151414] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden border-b border-[#2A2B28]/60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#663399]/20 to-[#D9F45F]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
              <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                INDUSTRY VERTICAL
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {industry.name}
            </h1>

            <p className="text-white/80 text-lg sm:text-xl font-normal leading-relaxed">
              {industry.fullDescription}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link href="#contact">
                <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-[#663399]/30">
                  <span>Schedule Technical Discovery</span>
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

      {/* Challenges & Engineered Solutions Grid */}
      <section className="py-20 lg:py-28 bg-[#151414] border-b border-[#2A2B28]/60">
        <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
              TECHNICAL PROBLEM-SOLVING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Challenges vs Silwasa Solutions
            </h2>
            <p className="text-white/70 text-base sm:text-lg">
              We replace fragmented legacy friction with resilient modern software architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Industry Challenge */}
            <div className="p-8 rounded-2xl bg-[#1C1B1B] border border-rose-500/20 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Common Industry Bottlenecks</h3>
                  <p className="text-xs text-zinc-400">What holds organizations back</p>
                </div>
              </div>
              <ul className="space-y-4">
                {industry.challenges?.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Silwasa Solution */}
            <div className="p-8 rounded-2xl bg-[#1C1B1B] border border-emerald-500/20 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Silwasa Engineered Solution</h3>
                  <p className="text-xs text-zinc-400">Our high-performance architecture</p>
                </div>
              </div>
              <ul className="space-y-4">
                {industry.solutions?.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-[#D9F45F] mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection
        settings={{
          badge: `CONSULT FOR ${industry.name.toUpperCase()}`,
          heading: `Ready to Modernize Your ${industry.name} Infrastructure?`,
          subheading:
            'Speak directly with our senior full-stack architects. Receive an enterprise milestone proposal within 24 hours.',
        }}
      />
    </div>
  );
}
