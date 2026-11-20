'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, X, Zap, ArrowRight, ShieldCheck, Tag, Table as TableIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { calculateEffectivePrice, formatCurrency } from '@silwasa/shared';
import type { PricingPackage } from '@silwasa/types';

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  regularPriceMonthly: number;
  priceMonthly: number;
  regularPriceAnnual: number;
  priceAnnual: number;
  currency: string;
  description: string;
  features: { id?: string; text: string; included: boolean }[];
  tableFeatures?: { feature: string; spec: string; included: boolean }[];
  ctaText?: string;
  ctaUrl?: string;
}

export interface PricingSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  selectedServiceId?: string;
  serviceId?: string;
  plans?: PricingPlan[];
  annualDiscountPercent?: number;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Growth Foundation',
    badge: 'Fast Launch',
    regularPriceMonthly: 1499,
    priceMonthly: 1299,
    regularPriceAnnual: 17988,
    priceAnnual: 12468, // ~1039/mo
    currency: '$',
    description: 'Perfect for ambitious startups seeking a high-converting, custom-engineered digital presence.',
    features: [
      { text: 'Custom Next.js 15 Web Platform', included: true },
      { text: 'Up to 10 Dynamic Pages', included: true },
      { text: 'Full Custom CMS Integration', included: true },
      { text: 'Technical SEO & Core Web Vitals (< 1s)', included: true },
      { text: 'Contact Forms & Lead Notifications', included: true },
      { text: 'Google Analytics 4 & Tag Manager', included: true },
      { text: '30-Day Post-Launch SLA Support', included: true },
    ],
    ctaText: 'Choose Growth Plan',
    ctaUrl: '/contact?plan=growth-foundation',
  },
  {
    id: 'scale',
    name: 'Scale & Performance',
    badge: 'Most Popular',
    popular: true,
    regularPriceMonthly: 2999,
    priceMonthly: 2499,
    regularPriceAnnual: 35988,
    priceAnnual: 23988, // ~1999/mo
    currency: '$',
    description: 'Full-stack enterprise solution with Generative Engine Optimization, dynamic portals, and multi-service workflows.',
    features: [
      { text: 'Everything in Growth Foundation', included: true },
      { text: 'Generative Engine Optimization (GEO)', included: true },
      { text: 'Custom Role-Based Admin Dashboard', included: true },
      { text: 'Blog & Resource Center CMS', included: true },
      { text: 'Lead Qualification & CRM Connectors', included: true },
      { text: 'Enterprise AWS / Cloudflare Edge CDN', included: true },
      { text: 'Automated DB Backups & 99.99% Uptime', included: true },
      { text: '90-Day Priority Engineering SLA', included: true },
    ],
    ctaText: 'Get Scale Architecture',
    ctaUrl: '/contact?plan=scale-performance',
  },
  {
    id: 'enterprise',
    name: 'Custom Enterprise',
    badge: 'Custom Architecture',
    regularPriceMonthly: 5999,
    priceMonthly: 4999,
    regularPriceAnnual: 71988,
    priceAnnual: 47988, // ~3999/mo
    currency: '$',
    description: 'Bespoke software systems, microservices, AI copilot workflows, and dedicated senior engineering teams.',
    features: [
      { text: 'Everything in Scale & Performance', included: true },
      { text: 'Private AI Agent / RAG Pipeline', included: true },
      { text: 'Microservices Architecture & API Gateway', included: true },
      { text: 'SOC 2 / HIPAA Compliance Hardening', included: true },
      { text: 'Custom Third-Party Integrations', included: true },
      { text: 'Dedicated Tech Lead & Weekly Sprints', included: true },
      { text: '24/7 Guaranteed Response SLA', included: true },
      { text: 'Continuous Penetration Testing', included: true },
    ],
    ctaText: 'Schedule Architecture Call',
    ctaUrl: '/contact?plan=custom-enterprise',
  },
];

export function PricingSection({ settings }: { settings: PricingSectionSettings }) {
  const badge = settings?.badge || 'TRANSPARENT, VALUE-DRIVEN TIERS';
  const heading = settings?.heading || 'Flexible Investment For Serious Growth';
  const subheading = settings?.subheading || 'No hidden licensing fees, no vendor lock-in. You own 100% of the source code, database, and intellectual property.';
  const targetServiceId = settings?.selectedServiceId || settings?.serviceId;
  const discountPercent = settings?.annualDiscountPercent || 20;

  const [isAnnual, setIsAnnual] = useState(true);
  const [plansList, setPlansList] = useState<PricingPlan[]>(settings?.plans || []);
  const [isLoading, setIsLoading] = useState(!settings?.plans || settings.plans.length === 0);

  useEffect(() => {
    if (settings?.plans && settings.plans.length > 0) {
      setPlansList(settings.plans);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    async function fetchDynamicPricing() {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const queryParam = targetServiceId && targetServiceId !== 'all' ? `?serviceId=${targetServiceId}` : '';
        const res = await fetch(`${apiUrl}/pricing${queryParam}`);

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
            const mapped: PricingPlan[] = data.data.map((pkg: any) => {
              const regPrice = Number(pkg.regularPrice) || 0;
              const salePrice = pkg.salePrice ? Number(pkg.salePrice) : null;
              const effPrice = pkg.effectivePrice ? Number(pkg.effectivePrice) : (salePrice && salePrice > 0 ? salePrice : regPrice);

              // Monthly rates:
              const regularPriceMonthly = regPrice;
              const priceMonthly = effPrice;

              // Annual rates with discount:
              const annualMonthlyRate = Math.round(effPrice * (1 - discountPercent / 100));
              const regularPriceAnnual = Math.round(regPrice * 12);
              const priceAnnual = Math.round(annualMonthlyRate * 12);

              return {
                id: pkg.id,
                name: pkg.name,
                badge: pkg.isPopular ? 'Most Popular' : undefined,
                popular: pkg.isPopular,
                regularPriceMonthly,
                priceMonthly,
                regularPriceAnnual,
                priceAnnual,
                currency: pkg.currency === 'USD' ? '$' : pkg.currency === 'INR' ? '₹' : pkg.currency,
                description: pkg.shortDescription,
                features: Array.isArray(pkg.features)
                  ? pkg.features.map((f: any) => ({
                      text: typeof f === 'string' ? f : f.text,
                      included: typeof f === 'string' ? true : f.included !== false,
                    }))
                  : [],
                tableFeatures: pkg.tableFeatures,
                ctaText: pkg.ctaLabel || 'Choose Plan',
                ctaUrl: pkg.ctaUrl || '/contact',
              };
            });

            setPlansList(mapped);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to default
      } finally {
        if (isMounted) setIsLoading(false);
      }

      if (isMounted && (!plansList || plansList.length === 0)) {
        setPlansList(DEFAULT_PLANS);
      }
    }

    fetchDynamicPricing();
    return () => {
      isMounted = false;
    };
  }, [settings?.plans, targetServiceId, discountPercent]);

  const effectivePlans = plansList && plansList.length > 0 ? plansList : DEFAULT_PLANS;

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#663399]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

          {/* Billing Interval Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs sm:text-sm font-semibold transition ${!isAnnual ? 'text-white' : 'text-white/50'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 rounded-full bg-[#1C1B1B] border border-[#2A2B28] p-1 flex items-center transition relative"
            >
              <div
                className={`w-6 h-6 rounded-full bg-[#663399] transition-transform ${
                  isAnnual ? 'translate-x-6 bg-[#D9F45F]' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs sm:text-sm font-semibold transition ${isAnnual ? 'text-white' : 'text-white/50'}`}>
                Annual Commitment
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9F45F]/15 text-[#D9F45F] border border-[#D9F45F]/30">
                Save {discountPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid or Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-5 sm:p-6 lg:p-7 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] animate-pulse space-y-6"
              >
                <div className="h-6 w-1/3 bg-white/10 rounded-lg" />
                <div className="h-4 w-3/4 bg-white/5 rounded-lg" />
                <div className="h-12 w-1/2 bg-white/10 rounded-lg" />
                <div className="space-y-3 pt-4 border-t border-[#2A2B28]/60">
                  <div className="h-4 w-full bg-white/5 rounded-lg" />
                  <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
                  <div className="h-4 w-4/6 bg-white/5 rounded-lg" />
                  <div className="h-4 w-3/4 bg-white/5 rounded-lg" />
                </div>
                <div className="h-11 w-full bg-white/10 rounded-xl mt-6" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              effectivePlans.length === 1
                ? 'max-w-md mx-auto'
                : effectivePlans.length === 2
                ? 'md:grid-cols-2 max-w-3xl mx-auto'
                : effectivePlans.length === 3
                ? 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'
                : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            } gap-5 lg:gap-6`}
          >
            {effectivePlans.map((plan) => {
              // Rate calculations
              const currentMonthlyRate = isAnnual
                ? Math.round(plan.priceAnnual / 12)
                : plan.priceMonthly;
              const originalMonthlyRate = plan.regularPriceMonthly || plan.priceMonthly;
              const hasMonthlyDiscount = originalMonthlyRate > plan.priceMonthly;
              const hasAnnualDiscount = originalMonthlyRate > currentMonthlyRate;
              const isDiscounted = isAnnual ? hasAnnualDiscount : hasMonthlyDiscount;

              const savePercent = isAnnual
                ? Math.round(((originalMonthlyRate - currentMonthlyRate) / originalMonthlyRate) * 100)
                : Math.round(((originalMonthlyRate - plan.priceMonthly) / originalMonthlyRate) * 100);

              return (
                <div
                  key={plan.id}
                  className={`relative p-5 sm:p-6 lg:p-7 rounded-2xl flex flex-col justify-between transition-all duration-300 w-full min-w-0 ${
                    plan.popular
                      ? 'bg-[#1C1B1B] border-2 border-[#663399] shadow-2xl shadow-[#663399]/20 -translate-y-1.5'
                      : 'bg-[#1C1B1B] border border-[#2A2B28] hover:border-white/20'
                  }`}
                >
                  {/* Popular Ribbon */}
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#663399] text-white border border-[#D9F45F]/40 shadow-md">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div>
                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <p className="text-xs text-white/60 leading-relaxed min-h-[36px]">
                        {plan.description}
                      </p>
                    </div>

                    {/* Balanced Luxury Pricing Box */}
                    <div className="mb-5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#151414] border border-[#2A2B28] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shadow-inner">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl sm:text-2xl font-bold text-[#D9F45F]">{plan.currency}</span>
                          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                            {currentMonthlyRate.toLocaleString()}
                          </span>
                          <span className="text-xs text-white/50 ml-0.5 whitespace-nowrap">/ mo</span>
                        </div>
                        <div className="text-[11px] font-medium text-white/40 mt-1">
                          {isAnnual ? (
                            <span className="text-emerald-400">
                              Billed annually ({plan.currency}{plan.priceAnnual.toLocaleString()}/yr)
                            </span>
                          ) : (
                            'Flexible monthly subscription'
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {isDiscounted ? (
                          <div className="space-y-1">
                            <div className="text-xs text-white/40 line-through font-mono">
                              {plan.currency}{originalMonthlyRate.toLocaleString()}
                            </div>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                              Save {savePercent}%
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-white/5 text-white/50 border border-white/10 whitespace-nowrap">
                            STANDARD
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features List or Matrix Table */}
                    {plan.tableFeatures && plan.tableFeatures.length > 0 ? (
                      <div className="mb-6 space-y-2.5">
                        <div className="text-xs sm:text-[13px] font-bold text-white/70 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                          <TableIcon className="w-3.5 h-3.5 text-[#D9F45F]" /> Package Specifications
                        </div>
                        <div className="rounded-xl border border-[#2A2B28] divide-y divide-[#2A2B28]/60 overflow-hidden bg-[#151414]">
                          {plan.tableFeatures.map((tf, i) => (
                            <div key={i} className="p-3 flex items-center justify-between gap-2.5 text-sm sm:text-[14px]">
                              <span className="text-white/90 font-medium">{tf.feature}</span>
                              <div className="flex items-center gap-1.5 font-semibold shrink-0">
                                {tf.included ? (
                                  <span className="text-emerald-400 flex items-center gap-1 text-xs sm:text-[13px]">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{tf.spec}</span>
                                  </span>
                                ) : (
                                  <span className="text-zinc-500 flex items-center gap-1 text-xs sm:text-[13px]">
                                    <X className="w-3.5 h-3.5" />
                                    <span>{tf.spec || 'Excluded'}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 mb-6">
                        <div className="text-xs sm:text-[13px] font-bold text-white/70 uppercase tracking-wider mb-2.5">
                          Included Features
                        </div>
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-sm sm:text-[14.5px] leading-relaxed text-white/90">
                            {feat.included !== false ? (
                              <div className="w-4 h-4 rounded-full bg-[#D9F45F]/20 text-[#D9F45F] flex items-center justify-center shrink-0 mt-1">
                                <Check className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center shrink-0 mt-1">
                                <X className="w-3 h-3" />
                              </div>
                            )}
                            <span className={feat.included !== false ? 'text-white/90 font-normal' : 'text-zinc-500 line-through'}>
                              {feat.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                {/* CTA */}
                <div>
                  <Link href={plan.ctaUrl || '/contact'} className="block">
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      className={`w-full rounded-xl py-3 text-sm font-bold justify-center ${
                        plan.popular
                          ? 'bg-[#663399] hover:bg-[#52297A] text-white shadow-lg shadow-[#663399]/30'
                          : 'border-[#2A2B28] text-white hover:bg-white/5'
                      }`}
                    >
                      {plan.ctaText || 'Choose Plan'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

        {/* Enterprise Bottom SLA Note */}
        <div className="mt-16 p-6 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Need a Bespoke Retainer or Custom Enterprise Scope?</h4>
              <p className="text-xs text-white/60">
                We craft tailored milestone contracts, dedicated multi-engineer agile squads, and 24/7 mission-critical SLAs.
              </p>
            </div>
          </div>
          <Link href="/contact">
            <Button variant="secondary" size="sm" className="rounded-full text-xs shrink-0">
              Request Custom Proposal
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
