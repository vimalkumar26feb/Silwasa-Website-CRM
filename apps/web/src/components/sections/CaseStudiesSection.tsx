'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

export interface CaseStudyItem {
  id: string;
  client: string;
  title: string;
  slug: string;
  category: string;
  metrics: { value: string; label: string }[];
  challenge: string;
  solution: string;
  result: string;
  techStack?: string[];
  featuredImage?: string;
}

export interface CaseStudiesSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  caseStudies?: CaseStudyItem[];
  viewAllUrl?: string;
}

const DEFAULT_CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'cs-1',
    client: 'Apex Health Logistics',
    title: 'HIPAA-Compliant Telematics Platform with Sub-Second Latency',
    slug: 'apex-health-logistics',
    category: 'Healthcare & IoT',
    metrics: [
      { value: '0.72s', label: 'Average LCP Time' },
      { value: '+410%', label: 'Active Daily Teleconsults' },
      { value: '100%', label: 'HIPAA Audit Score' },
    ],
    challenge: 'Legacy EHR system suffered from frequent timeouts, failing Core Web Vitals, and zero automated compliance tracking.',
    solution: 'Engineered a Next.js 15 App Router platform with microservices, Redis caching, and end-to-end encrypted WebRTC streams.',
    result: 'Cut infrastructure costs by 48% while tripling concurrent patient appointments without a second of downtime.',
    techStack: ['Next.js 15', 'Node.js', 'PostgreSQL', 'WebSockets', 'AWS'],
  },
  {
    id: 'cs-2',
    client: 'Vanguard FinTech Capital',
    title: 'Generative Engine Optimization & Modern Web Architecture',
    slug: 'vanguard-fintech-capital',
    category: 'FinTech & GEO',
    metrics: [
      { value: '#1 Rank', label: 'Perplexity & ChatGPT Citations' },
      { value: '+280%', label: 'Organic Inbound Enquiries' },
      { value: '$12M+', label: 'Pipeline Generated' },
    ],
    challenge: 'Traditional SEO had plateaued. The brand was completely absent from AI search summaries and generative answers.',
    solution: 'Architected structured JSON-LD entity graphs, programmatic authority clusters, and a high-performance headless knowledge base.',
    result: 'Became the most cited wealth management authority across ChatGPT Search, Perplexity Pro, and Google AI Overviews.',
    techStack: ['React 19', 'Prisma ORM', 'Schema.org', 'Vector DB', 'Tailwind'],
  },
];

export function CaseStudiesSection({ settings }: { settings: CaseStudiesSectionSettings }) {
  const badge = settings.badge || 'PROVEN IMPACT & METRICS';
  const heading = settings.heading || 'Data-Driven Case Studies';
  const subheading = settings.subheading || 'Explore how our custom engineering and GEO optimization transform complex business problems into multimillion-dollar growth engines.';
  const caseStudies = settings.caseStudies && settings.caseStudies.length > 0 ? settings.caseStudies : DEFAULT_CASE_STUDIES;
  const viewAllUrl = settings.viewAllUrl || '/case-studies';

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
              <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                {badge}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {heading}
            </h2>
            <p className="text-white/70 text-base sm:text-lg">
              {subheading}
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <Link href={viewAllUrl}>
              <Button variant="secondary" className="rounded-full">
                View All Case Studies
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Case Studies List */}
        <div className="space-y-12">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className="p-8 sm:p-10 rounded-3xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Details (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#663399]/30 text-white border border-[#663399]/40">
                    {study.category}
                  </span>
                  <span className="text-xs font-semibold text-white/50">
                    Client: {study.client}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight hover:text-[#D9F45F] transition-colors">
                  <Link href={`/case-studies/${study.slug}`}>{study.title}</Link>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-y border-[#2A2B28]/60">
                  {study.metrics.map((m, mIdx) => (
                    <div key={mIdx}>
                      <div className="text-2xl sm:text-3xl font-extrabold text-[#D9F45F] font-mono">
                        {m.value}
                      </div>
                      <div className="text-xs font-semibold text-white/70 mt-1">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-white/70">
                  <p><strong className="text-white">Challenge:</strong> {study.challenge}</p>
                  <p><strong className="text-white">Solution:</strong> {study.solution}</p>
                </div>

                {study.techStack && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {study.techStack.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md bg-[#151414] border border-[#2A2B28] text-xs text-white/80 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#D9F45F] hover:underline"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Right Visual / Metric Card (5 cols) */}
              <div className="lg:col-span-5 rounded-2xl bg-[#151414] border border-[#2A2B28] p-6 sm:p-8 flex flex-col justify-between h-full min-h-[280px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#D9F45F]">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Verified Business Outcome</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-white leading-snug">
                    {study.result}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#2A2B28] flex items-center justify-between text-xs text-white/60">
                  <span>Architecture Audited</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
