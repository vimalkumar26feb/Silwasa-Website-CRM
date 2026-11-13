'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export interface HeroSectionSettings {
  badge?: string;
  heading?: string;
  description?: string;
  checklist?: string[];
  ctaText?: string;
  ctaUrl?: string;
  whatsappUrl?: string;
  satisfiedCustomersCount?: string;
  imageUrl?: string;
}

export function HeroSection({ settings }: { settings: HeroSectionSettings }) {
  const badge = settings.badge || 'SOLUTIONS FOR CREATIVE PRODUCTS';
  const heading = settings.heading || 'Sustainable SEO For Serious Brands';
  const description =
    settings.description ||
    'Silwasa IT Solutions engineers high-performance web platforms, custom enterprise software, AI solutions, and Generative Engine Optimization (GEO) to accelerate business growth.';
  const checklist = settings.checklist || [
    'Crawlability & Indexing Fixing errors',
    'Identifying exact high-intent queries',
    'Strategically linking high-authority content',
    'Enterprise-grade security and Core Web Vitals',
  ];
  const ctaText = settings.ctaText || 'Get In Touch';
  const ctaUrl = settings.ctaUrl || '/contact';
  const whatsappUrl = settings.whatsappUrl || 'https://wa.me/917070717794';
  const customersCount = settings.satisfiedCustomersCount || '200K+';
  const imageUrl = settings.imageUrl || '/assets/men-DNe1EB5y.webp';

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[#151414]">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#663399]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#D9F45F]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1B] border border-[#2A2B28] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#D9F45F] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                {badge}
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              {heading}
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
              {description}
            </p>

            {/* Checklist Container */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] shadow-md max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D9F45F] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-white/90 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons & Social Proof Row */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <Link href={ctaUrl}>
                  <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-[#663399]/30">
                    {ctaText}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#2A2B28] hover:border-emerald-500 bg-[#1C1B1B] text-white text-sm font-medium transition hover:bg-emerald-500/10 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Avatar Stack + Customer Counter */}
              <div className="flex items-center gap-3.5 pl-0 sm:pl-4 sm:border-l border-[#2A2B28]">
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#151414] bg-gradient-to-tr from-purple-600 to-indigo-400 flex items-center justify-center text-xs font-bold text-white">
                    JD
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#151414] bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xs font-bold text-white">
                    AK
                  </div>
                  <div className="inline-block h-9 w-9 rounded-full ring-2 ring-[#151414] bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-xs font-bold text-white">
                    RS
                  </div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-white leading-tight">
                    {customersCount}
                  </div>
                  <div className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
                    Satisfied Customers
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Cutout (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-b from-[#663399]/20 via-[#1C1B1B] to-[#151414] border border-[#2A2B28] p-4 flex items-center justify-center overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(#663399_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              
              <div className="text-center p-6 space-y-4 relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#663399] to-[#975dd1] mx-auto flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-[#663399]/50">
                  S
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white">Silwasa IT Solutions</h4>
                  <p className="text-xs text-[#D9F45F] font-mono uppercase tracking-widest">
                    Next-Gen Architecture
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-[#2A2B28] text-xs text-white/70 max-w-xs mx-auto">
                  Engineering sub-second web applications, enterprise ERPs, and AI search dominance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
