'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Award, Users2, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../ui/Button';

export interface StatItem {
  value: string;
  label: string;
  description?: string;
}

export interface AboutSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  descriptionParagraphs?: string[];
  stats?: StatItem[];
  highlights?: string[];
  ctaText?: string;
  ctaUrl?: string;
}

const DEFAULT_STATS: StatItem[] = [
  { value: '250+', label: 'Digital Products Shipped', description: 'Across North America, Europe & India' },
  { value: '99.4%', label: 'On-Time Project Delivery', description: 'Rigorous sprint discipline & SLA adherence' },
  { value: '5+ Yrs', label: 'Engineering Excellence', description: 'Pioneering modern full-stack architectures' },
  { value: '24/7', label: 'Direct Technical Support', description: 'Dedicated engineers, no outsourced tickets' },
];

const DEFAULT_HIGHLIGHTS = [
  'Enterprise-Grade Security Architecture (OWASP, Argon2id, RBAC)',
  'Generative Engine Optimization (GEO) for ChatGPT & Perplexity Citations',
  'Strict Zero-Debt Engineering with TypeScript and Automated Testing',
  'Sub-Second Page Loads with Next.js App Router and Edge Caching',
];

export function AboutSection({ settings }: { settings: AboutSectionSettings }) {
  const badge = settings.badge || 'ABOUT SILWASA IT SOLUTIONS';
  const heading = settings.heading || 'Architecting Sustainable Digital Superiority';
  const subheading = settings.subheading || 'We are a premier digital engineering agency dedicated to transforming ambitious companies into market leaders through cutting-edge technology and data-backed design.';
  const paragraphs = settings.descriptionParagraphs || [
    'Founded on the principle of uncompromised engineering quality, Silwasa IT Solutions bridges the critical gap between visionary design and rock-solid software architecture. We do not build disposable websites or cookie-cutter templates—we build scalable digital assets.',
    'From dynamic custom CMS platforms and enterprise web applications to advanced Generative Engine Optimization (GEO) strategies, our multidisciplinary team partners with startups, scale-ups, and global enterprises to unlock sustainable, compounding digital growth.',
  ];
  const stats = settings.stats && settings.stats.length > 0 ? settings.stats : DEFAULT_STATS;
  const highlights = settings.highlights && settings.highlights.length > 0 ? settings.highlights : DEFAULT_HIGHLIGHTS;
  const ctaText = settings.ctaText || 'Learn More About Us';
  const ctaUrl = settings.ctaUrl || '/about';

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
              <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                {badge}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {heading}
            </h2>

            <p className="text-lg text-white/90 font-medium">
              {subheading}
            </p>

            <div className="space-y-4 text-white/70 text-base leading-relaxed">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Core Values / Highlights */}
            <div className="pt-2 space-y-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#D9F45F] shrink-0" />
                  <span className="text-sm font-semibold text-white/90">{h}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link href={ctaUrl}>
                <Button variant="primary" size="lg" className="rounded-full">
                  {ctaText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Key Metrics Grid (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#D9F45F] font-mono mb-2">
                    {stat.value}
                  </div>
                  <div className="text-base font-bold text-white mb-1">
                    {stat.label}
                  </div>
                </div>
                {stat.description && (
                  <p className="text-xs text-white/60 leading-relaxed mt-3 pt-3 border-t border-[#2A2B28]/60">
                    {stat.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
