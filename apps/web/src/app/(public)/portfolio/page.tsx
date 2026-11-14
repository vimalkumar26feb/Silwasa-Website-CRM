import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { apiClient } from '../../../lib/api';
import type { PortfolioProject } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Client Work & Engineering Portfolio | Silwasa IT Solutions',
  description:
    'Showcasing production web applications, enterprise portals, headless e-commerce, and bespoke software platforms engineered by Silwasa.',
  alternates: {
    canonical: 'https://silwasa.com/portfolio',
  },
};

const SEEDED_PORTFOLIO: PortfolioProject[] = [
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

async function getPortfolio(): Promise<PortfolioProject[]> {
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
  return SEEDED_PORTFOLIO;
}

export default async function PortfolioIndexPage() {
  const projects = await getPortfolio();

  return (
    <div className="py-16 lg:py-24 bg-[#151414] relative">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
            <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
              PRODUCTION CLIENT WORK
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Engineered For Real-World Scale
          </h1>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            Browse our curated showcase of production platforms, enterprise portals, high-volume storefronts, and bespoke business systems.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 overflow-hidden shadow-2xl transition duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual */}
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden bg-[#151414] border-b border-[#2A2B28]"
                >
                  {project.featuredImageUrl ? (
                    <img
                      src={project.featuredImageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      <Layers className="w-10 h-10 text-[#663399]" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#151414]/90 backdrop-blur-md border border-[#2A2B28] text-white/90 text-[10px] font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                </Link>

                {/* Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span className="font-semibold text-white/80">{project.clientName}</span>
                    <span className="text-[#D9F45F] font-mono text-[11px]">{project.industry}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-[#D9F45F] transition-colors leading-snug">
                    <Link href={`/portfolio/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#151414] border border-[#2A2B28] text-white/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-[#2A2B28]/60 mt-4">
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="text-xs font-bold text-[#D9F45F] inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-white p-1"
                    title="Live Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#211b27] to-[#1C1B1B] border border-[#663399]/40 p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ready to Build Your Next High-Performance Platform?
          </h3>
          <p className="text-sm text-white/70 max-w-xl mx-auto">
            Book an architectural discovery consultation to explore technical requirements, timeline, and deliverables.
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
