import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { PortfolioProject } from '@silwasa/types';
import { Button } from '../../../../components/ui/Button';
import { ContactSection } from '../../../../components/sections/ContactSection';
import {
  Sparkles,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SEEDED_CASE_STUDIES: Record<string, PortfolioProject> = {
  'healthflow-telemetry-portal': {
    id: 'port-1',
    title: 'HealthFlow Clinical Telemetry Portal',
    slug: 'healthflow-telemetry-portal',
    clientName: 'NovaCura Health System',
    industry: 'Healthcare',
    category: 'Web Application',
    projectUrl: 'https://healthflow-demo.silwasa.com',
    featuredImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    galleryImages: [],
    description: 'Real-time patient telemetry monitoring portal aggregating critical ICU telemetry with sub-second alert triggers.',
    technologies: ['Next.js 15', 'TypeScript', 'WebSockets', 'Redis', 'PostgreSQL', 'Tailwind CSS'],
    challenges: 'Severe sub-second latency constraints across 10,000 parallel streams with zero downtime allowance under strict HIPAA guidelines.',
    solutions: 'Stateless edge API orchestration with Redis pub/sub, optimistic UI synchronization, and end-to-end encrypted WebSocket telemetry pipes.',
    results: '0.42s average latency, 99.99% uptime SLA verified, 15,000 concurrent patient monitors supported.',
    isPublished: true,
    order: 0,
  },
  'apex-real-estate-crm': {
    id: 'port-2',
    title: 'Apex Real Estate & Brokerage CRM',
    slug: 'apex-real-estate-crm',
    clientName: 'Apex Prime Properties',
    industry: 'Real Estate',
    category: 'Custom Software',
    projectUrl: 'https://apex-demo.silwasa.com',
    featuredImageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
    galleryImages: [],
    description: 'High-volume luxury property portal with 3D virtual walkthroughs, automated agent lead routing, and escrow status tracking.',
    technologies: ['React 19', 'Next.js 15', 'Tailwind CSS', 'Prisma ORM', 'WebGL'],
    challenges: 'High asset storage costs and slow mobile rendering of interactive vector property boundary maps.',
    solutions: 'Client-side WebGL vector rendering with edge CDN caching for high-res property assets and instant WhatsApp routing.',
    results: '+320% qualified buyer tours booked, 68% decrease in media delivery overhead, 0.6s LCP.',
    isPublished: true,
    order: 1,
  },
  'luxor-ecommerce-storefront': {
    id: 'port-3',
    title: 'Luxor Headless Commerce Storefront',
    slug: 'luxor-ecommerce-storefront',
    clientName: 'Luxor Lifestyle Brands',
    industry: 'E-commerce',
    category: 'E-commerce',
    projectUrl: 'https://luxor-demo.silwasa.com',
    featuredImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    galleryImages: [],
    description: 'Sub-second luxury retail storefront with multi-currency checkout, dynamic inventory synchronization, and AI product recommendations.',
    technologies: ['Next.js 15', 'Tailwind CSS', 'Stripe', 'Razorpay', 'Algolia', 'Redis'],
    challenges: 'Cart abandonment due to slow 3.5s page load speeds during high-traffic holiday sales.',
    solutions: 'Static generation with ISR, optimized image pipelines, and one-click checkout modal.',
    results: '0.78s LCP worldwide, +48% increase in checkout completions, $2.4M GMV processed in 30 days.',
    isPublished: true,
    order: 2,
  },
};

async function getCaseStudy(slug: string): Promise<PortfolioProject | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/portfolio/${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) return data.data;
    }
  } catch {
    // Fallback
  }
  return SEEDED_CASE_STUDIES[slug] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) {
    return { title: 'Case Study Not Found | Silwasa IT Solutions' };
  }
  return {
    title: `${cs.title} | Case Study | Silwasa IT Solutions`,
    description: cs.description,
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);

  if (!cs) {
    notFound();
  }

  return (
    <div className="py-16 lg:py-24 bg-[#151414] relative">
      <div className="max-w-[1020px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back link */}
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-[#D9F45F] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Case Studies</span>
        </Link>

        {/* Header Block */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#663399]/30 text-white border border-[#663399]/40">
              {cs.industry}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1C1B1B] text-white/70 border border-[#2A2B28]">
              {cs.category}
            </span>
            <span className="text-xs text-white/50 font-mono">
              Client: {cs.clientName}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {cs.title}
          </h1>

          <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-3xl">
            {cs.description}
          </p>

          {cs.projectUrl && (
            <div className="pt-2">
              <a
                href={cs.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#D9F45F] text-xs font-bold text-white hover:text-[#D9F45F] transition"
              >
                <span>Visit Live Platform</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Hero Visual */}
        {cs.featuredImageUrl && (
          <div className="rounded-3xl overflow-hidden border border-[#2A2B28] aspect-[16/9] bg-[#1C1B1B] shadow-2xl">
            <img
              src={cs.featuredImageUrl}
              alt={cs.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Deep Dive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#1C1B1B] border border-red-950/40 space-y-3">
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
              <span>The Technical Challenge</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {cs.challenges}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1C1B1B] border border-sky-950/40 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <span>Architectural Solution</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {cs.solutions}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#1C1B1B] border border-[#D9F45F]/20 space-y-3">
            <div className="flex items-center gap-2 text-[#D9F45F] text-xs font-bold uppercase tracking-wider">
              <span>Verified Impact &amp; Metrics</span>
            </div>
            <p className="text-xs text-white/90 font-medium leading-relaxed">
              {cs.results}
            </p>
          </div>
        </div>

        {/* Production Stack */}
        <div className="p-8 rounded-3xl bg-[#1C1B1B] border border-[#2A2B28] space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#D9F45F]" />
            <span>Technologies &amp; Protocols Deployed</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {cs.technologies.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-mono bg-[#151414] border border-[#2A2B28] text-white/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#211b27] to-[#1C1B1B] border border-[#663399]/40 p-8 sm:p-12 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Have a Complex Engineering Requirement?
          </h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            Our lead engineers are ready to review your requirements, design technical specifications, and provide transparent deliverables.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-[#663399]/20">
                <span>Request Technical Consultation</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
