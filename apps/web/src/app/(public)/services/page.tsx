import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Globe,
  Code2,
  Sparkles,
  ShoppingCart,
  Search,
  Smartphone,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ContactSection } from '../../../components/sections/ContactSection';
import { FaqSection } from '../../../components/sections/FaqSection';
import { ServicesSection } from '../../../components/sections/ServicesSection';
import type { Service } from '@silwasa/types';

export const metadata: Metadata = {
  title: 'Enterprise Digital Services & Engineering Solutions | Silwasa IT Solutions',
  description:
    'Explore our comprehensive suite of digital engineering services: Next.js web platforms, custom software, AI solutions & GEO, headless e-commerce, and mobile app development.',
  alternates: {
    canonical: 'https://silwasa.com/services',
  },
};

export default async function ServicesListingPage() {
  return (
    <div className="bg-[#151414] text-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 border-b border-[#2A2B28]/60">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#663399]/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#D9F45F]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#D9F45F]">Services</span>
          </div>

          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
              <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                OUR CAPABILITIES & EXPERTISE
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Architecting Digital Superiority Through Custom Engineering
            </h1>

            <p className="text-white/70 text-lg sm:text-xl leading-relaxed">
              We engineer tailor-made digital platforms, bespoke software, and Generative Engine Optimization (GEO) pipelines designed to outpace the competition.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Services Section */}
      <ServicesSection
        settings={{
          badge: 'COMPLETE SOLUTION DIRECTORY',
          heading: 'Engineered For Measurable Business ROI',
          subheading: 'Browse our full spectrum of specialized software disciplines. Filter by category to find the exact architecture your enterprise requires.',
          layout: 'grid',
          desktopColumns: 3,
          mobileColumns: 1,
          selectedCategory: 'All',
        }}
      />

      {/* Global FAQ Section */}
      <FaqSection
        settings={{
          badge: 'FREQUENTLY ASKED QUESTIONS',
          heading: 'Common Questions About Our Services',
          subheading: 'Clear, direct answers regarding our engineering sprints, source code ownership, and SLAs.',
        }}
      />

      {/* Contact & Consultation Section */}
      <ContactSection
        settings={{
          badge: 'START YOUR PROJECT',
          heading: 'Schedule A Technical Architecture Consultation',
          subheading: 'Discuss your project scope directly with our lead software engineers and get an actionable delivery blueprint.',
        }}
      />
    </div>
  );
}
