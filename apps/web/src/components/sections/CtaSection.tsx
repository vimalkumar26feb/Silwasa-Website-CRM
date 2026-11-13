'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, PhoneCall, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface CtaSectionSettings {
  badge?: string;
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  phoneText?: string;
  phoneNumber?: string;
  whatsappUrl?: string;
}

export function CtaSection({ settings }: { settings: CtaSectionSettings }) {
  const badge = settings.badge || 'READY TO BUILD SOMETHING EXTRAORDINARY?';
  const heading = settings.heading || 'Let’s Turn Your Vision Into Market Dominance';
  const description = settings.description || 'Schedule a technical consultation with our engineering team today to review your architecture, scope out your roadmap, and receive a transparent milestone estimate.';
  const primaryCtaText = settings.primaryCtaText || 'Start Your Project Today';
  const primaryCtaUrl = settings.primaryCtaUrl || '/contact';
  const phoneNumber = settings.phoneNumber || '+91 7070717794';
  const phoneText = settings.phoneText || '+91 7070717794';
  const whatsappUrl = settings.whatsappUrl || 'https://wa.me/917070717794';

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative overflow-hidden">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#211b27] to-[#1C1B1B] border border-[#663399]/40 p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#663399]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D9F45F]/10 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#151414] border border-[#2A2B28]">
              <Sparkles className="w-3.5 h-3.5 text-[#D9F45F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                {badge}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {heading}
            </h2>

            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={primaryCtaUrl}>
                <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-[#663399]/30">
                  {primaryCtaText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#2A2B28] hover:border-emerald-500 bg-[#151414] text-white text-sm font-semibold transition hover:bg-emerald-500/10 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat On WhatsApp</span>
              </a>

              <a
                href={`tel:${phoneNumber.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white/80 hover:text-white text-sm font-semibold transition"
              >
                <PhoneCall className="w-4 h-4 text-[#D9F45F]" />
                <span>{phoneText}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
