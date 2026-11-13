import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { apiClient } from '../../../../lib/api';
import type { PortfolioProject } from '@silwasa/types';
import { Button } from '../../../../components/ui/Button';
import { ContactSection } from '../../../../components/sections/ContactSection';
import {
  Sparkles,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Layers,
  TrendingUp,
  Cpu,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';

const SEEDED_PORTFOLIO: Record<string, PortfolioProject> = {
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
  }
};

async function getProject(slug: string): Promise<PortfolioProject | null> {
  try {
    const res = await apiClient<any>(`/portfolio/${slug}`);
    if (res && res.data) return res.data;
  } catch {
    // Fallback
  }
  return SEEDED_PORTFOLIO[slug] || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: 'Case Study Not Found | Silwasa IT Solutions' };
  }

  return {
    title: `${project.title} — Case Study | Silwasa IT Solutions`,
    description: project.description,
    alternates: {
      canonical: `https://silwasa.com/portfolio/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} — Case Study | Silwasa IT Solutions`,
      description: project.description,
      images: [project.featuredImageUrl],
      url: `https://silwasa.com/portfolio/${project.slug}`,
    },
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#151414] text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden border-b border-[#2A2B28]/60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#663399]/20 to-[#D9F45F]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28] text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                CASE STUDY
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28] text-xs text-zinc-300">
                {project.industry}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28] text-xs text-zinc-300">
                {project.category}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {project.title}
            </h1>

            <p className="text-white/80 text-lg sm:text-xl font-normal leading-relaxed">
              {project.description}
            </p>

            {/* Client & Outcome Pill */}
            <div className="p-4 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-zinc-400 font-medium">Enterprise Client</p>
                <p className="text-base font-bold text-white mt-0.5">{project.clientName}</p>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs text-zinc-400 font-medium">Verified Outcome</p>
                <p className="text-sm font-mono font-bold text-[#D9F45F] mt-0.5">{project.results}</p>
              </div>
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#663399] hover:bg-[#52297A] text-white text-xs font-semibold transition"
                >
                  <span>Live Project Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Deep Dive: Challenge, Solution, Result */}
      <section className="py-20 lg:py-28 bg-[#151414] border-b border-[#2A2B28]/60">
        <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">The Challenge</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.challenges}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#663399]/20 flex items-center justify-center text-[#D9F45F]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">The Architecture</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.solutions}
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#1C1B1B] border border-emerald-500/20 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">The Business Result</h3>
              <p className="text-sm text-[#D9F45F] font-mono leading-relaxed font-semibold">
                {project.results}
              </p>
            </div>
          </div>

          {/* Technology Stack Tags */}
          <div className="p-8 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#D9F45F]" />
              <h3 className="text-lg font-bold text-white">Engineering Technologies Deployed</h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-full bg-[#151414] border border-[#2A2B28] text-xs font-semibold text-zinc-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection
        settings={{
          badge: `ARCHITECT SIMILAR SOLUTIONS`,
          heading: `Ready to Achieve Similar Outcomes for Your Business?`,
          subheading:
            'Schedule a technical discovery session with our senior engineers. Receive a custom milestone architecture within 24 hours.',
        }}
      />
    </div>
  );
}
