'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  priceMonthly: number;
  priceAnnual: number;
  currency: string;
  description: string;
  features: string[];
  ctaText?: string;
  ctaUrl?: string;
}

export interface PricingSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  plans?: PricingPlan[];
  annualDiscountPercent?: number;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Growth Foundation',
    badge: 'Fast Launch',
    priceMonthly: 1299,
    priceAnnual: 1099,
    currency: '$',
    description: 'Perfect for ambitious startups seeking a high-converting, custom-engineered digital presence.',
    features: [
      'Custom Next.js 15 Web Platform',
      'Up to 10 Dynamic Pages',
      'Full Custom CMS Integration',
      'Technical SEO & Core Web Vitals (< 1s)',
      'Contact Forms & Lead Notifications',
      'Google Analytics 4 & Tag Manager',
      '30-Day Post-Launch SLA Support',
    ],
    ctaText: 'Choose Growth Plan',
    ctaUrl: '/contact?plan=growth-foundation',
  },
  {
    id: 'scale',
    name: 'Scale & Performance',
    badge: 'Most Popular',
    popular: true,
    priceMonthly: 2499,
    priceAnnual: 1999,
    currency: '$',
    description: 'Full-stack enterprise solution with Generative Engine Optimization, dynamic portals, and multi-service workflows.',
    features: [
      'Everything in Growth Foundation',
      'Generative Engine Optimization (GEO)',
      'Custom Role-Based Admin Dashboard',
      'Blog & Resource Center CMS',
      'Lead Qualification & CRM Connectors',
      'Enterprise AWS / Cloudflare Edge CDN',
      'Automated DB Backups & 99.99% Uptime',
      '90-Day Priority Engineering SLA',
    ],
    ctaText: 'Get Scale Architecture',
    ctaUrl: '/contact?plan=scale-performance',
  },
  {
    id: 'enterprise',
    name: 'Custom Enterprise',
    badge: 'Custom Architecture',
    priceMonthly: 4999,
    priceAnnual: 4199,
    currency: '$',
    description: 'Bespoke software systems, microservices, AI copilot workflows, and dedicated senior engineering teams.',
    features: [
      'Everything in Scale & Performance',
      'Private AI Agent / RAG Pipeline',
      'Microservices Architecture & API Gateway',
      'SOC 2 / HIPAA Compliance Hardening',
      'Custom Third-Party Integrations',
      'Dedicated Tech Lead & Weekly Sprints',
      '24/7 Guaranteed Response SLA',
      'Continuous Penetration Testing',
    ],
    ctaText: 'Schedule Architecture Call',
    ctaUrl: '/contact?plan=custom-enterprise',
  },
];

export function PricingSection({ settings }: { settings: PricingSectionSettings }) {
  const badge = settings.badge || 'TRANSPARENT, VALUE-DRIVEN TIERS';
  const heading = settings.heading || 'Flexible Investment For Serious Growth';
  const subheading = settings.subheading || 'No hidden licensing fees, no vendor lock-in. You own 100% of the source code, database, and intellectual property.';
  const plans = settings.plans && settings.plans.length > 0 ? settings.plans : DEFAULT_PLANS;
  const discountPercent = settings.annualDiscountPercent || 20;

  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
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

          {/* Billing Toggle */}
          <div className="pt-6 flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-white' : 'text-white/60'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 rounded-full bg-[#1C1B1B] border border-[#2A2B28] p-1 flex items-center transition-colors relative"
              aria-label="Toggle annual or monthly pricing"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#D9F45F] transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${isAnnual ? 'text-white' : 'text-white/60'}`}>
                Annual Billing
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#D9F45F]/15 text-[#D9F45F] border border-[#D9F45F]/30">
                Save {discountPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={plan.id}
                className={`relative p-8 sm:p-10 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[#1C1B1B] border-2 border-[#D9F45F] shadow-2xl shadow-[#D9F45F]/10 lg:-translate-y-2'
                    : 'bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D9F45F] text-[#151414] text-xs font-extrabold uppercase tracking-wider shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    {plan.badge && !plan.popular && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#2A2B28] text-white/80">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-white/70 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-8 pb-8 border-b border-[#2A2B28]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
                        {plan.currency}{price.toLocaleString()}
                      </span>
                      <span className="text-sm font-semibold text-white/60">
                        / month
                      </span>
                    </div>
                    <span className="text-xs text-white/50 mt-1 block">
                      {isAnnual ? 'Billed annually' : 'Billed monthly'} • Zero setup fees
                    </span>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-3.5 mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/50 block">
                      What&apos;s Included:
                    </span>
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#D9F45F]/10 border border-[#D9F45F]/30 flex items-center justify-center text-[#D9F45F] shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs sm:text-sm text-white/90 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link href={plan.ctaUrl || '/contact'} className="block w-full">
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      size="lg"
                      className="w-full rounded-full"
                    >
                      {plan.ctaText || 'Get Started'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/50">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Includes 100% Code Ownership</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
