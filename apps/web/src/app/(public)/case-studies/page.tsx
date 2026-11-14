import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { apiClient } from '../../../lib/api';
import type { PortfolioProject } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Enterprise Case Studies & Digital Transformations | Silwasa IT Solutions',
  description:
    'Explore real-world technical case studies where Silwasa engineered sub-second Next.js web applications, high-throughput portals, and AI systems.',
  alternates: {
    canonical: 'https://silwasa.com/case-studies',
  },
};

const SEEDED_CASE_STUDIES: PortfolioProject[] = [
  {
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
    technologies: ['Next.js 15', 'TypeScript', 'WebSockets', 'Redis', 'PostgreSQL'],
    challenges: 'Severe sub-second latency constraints across 10,000 parallel streams with zero downtime allowance under strict HIPAA guidelines.',
    solutions: 'Stateless edge API orchestration with Redis pub/sub, optimistic UI synchronization, and end-to-end encrypted WebSocket telemetry pipes.',
    results: '0.42s latency SLA, 99.99% uptime, 15,000 concurrent monitored beds.',
    isPublished: true,
    order: 0,
  },
  {
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
    technologies: ['React 19', 'Next.js 15', 'Tailwind CSS', 'Prisma ORM'],
    challenges: 'High asset storage costs and slow mobile rendering of interactive vector property boundary maps.',
    solutions: 'Client-side WebGL vector rendering with edge CDN caching for high-res property assets and instant WhatsApp routing.',
    results: '+320% qualified buyer tours booked, 68% decrease in media storage costs.',
    isPublished: true,
    order: 1,
  },
  {
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
    technologies: ['Next.js 15', 'Tailwind CSS', 'Stripe', 'Razorpay', 'Algolia'],
    challenges: 'Cart abandonment due to slow 3.5s page load speeds during high-traffic holiday sales.',
    solutions: 'Static generation with ISR, optimized image pipelines, and one-click checkout modal.',
    results: '0.78s LCP, +48% increase in checkout completions, $2.4M GMV processed in 30 days.',
    isPublished: true,
    order: 2,
  },
];

async function getCaseStudies(): Promise<PortfolioProject[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/portfolio`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.length > 0) {
        return data.data;
      }
    }
  } catch {
    // Fallback
  }
  return SEEDED_CASE_STUDIES;
}

export default async function CaseStudiesIndexPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className="py-16 lg:py-24 bg-[#151414] relative">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
            <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
              PROVEN RESULTS &amp; METRICS
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Client Case Studies &amp; Outcomes
          </h1>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            Examine how Silwasa solves complex technical challenges to engineer multimillion-dollar commercial results for enterprises and fast-growing founders.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="space-y-12">
          {caseStudies.map((cs, idx) => (
            <div
              key={cs.id}
              className="p-8 sm:p-10 lg:p-12 rounded-3xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 shadow-2xl transition duration-300 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Media */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-[#2A2B28] bg-[#151414]">
                    {cs.featuredImageUrl ? (
                      <img
                        src={cs.featuredImageUrl}
                        alt={cs.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <Layers className="w-12 h-12 text-[#663399]" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#151414]/90 backdrop-blur-md border border-[#2A2B28] text-[#D9F45F] text-[10px] font-bold uppercase tracking-wider">
                      {cs.industry}
                    </span>
                  </div>
                </div>

                {/* Right Details */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span className="font-semibold text-white/80">{cs.clientName}</span>
                    <span>•</span>
                    <span>{cs.category}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-[#D9F45F] transition-colors leading-tight">
                    <Link href={`/case-studies/${cs.slug}`}>
                      {cs.title}
                    </Link>
                  </h2>

                  <p className="text-sm text-white/70 leading-relaxed">
                    {cs.description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#151414] border border-[#2A2B28]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-red-400/80 mb-1">
                        Challenge
                      </div>
                      <div className="text-xs text-white/70 line-clamp-2">
                        {cs.challenges}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#151414] border border-[#2A2B28]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400/80 mb-1">
                        Architecture
                      </div>
                      <div className="text-xs text-white/70 line-clamp-2">
                        {cs.solutions}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#151414] border border-[#2A2B28]">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#D9F45F] mb-1">
                        Verified Impact
                      </div>
                      <div className="text-xs text-white/90 font-semibold line-clamp-2">
                        {cs.results}
                      </div>
                    </div>
                  </div>

                  {/* Tech stack & Action */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-[#2A2B28]/60">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {cs.technologies.slice(0, 4).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#151414] border border-[#2A2B28] text-white/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link href={`/case-studies/${cs.slug}`}>
                      <Button variant="outline" size="sm" className="rounded-full text-xs">
                        <span>Read Full Case Study</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#211b27] to-[#1C1B1B] border border-[#663399]/40 p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Engineer Similar Results For Your Business?
          </h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            Schedule a technical blueprint session with our team to map out architecture, sprint milestones, and deliverables.
          </p>
          <div className="pt-2">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-[#663399]/20">
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
