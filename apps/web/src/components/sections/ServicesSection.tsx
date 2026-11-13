'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Globe, Cpu, Smartphone, Search, Database, Layers, ShieldCheck, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  deliverables?: string[];
  iconName?: string;
  badge?: string;
}

export interface ServicesSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  services?: ServiceItem[];
  viewAllUrl?: string;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Website Design & Development',
    slug: 'website-design-development',
    category: 'Web',
    description: 'High-converting, responsive enterprise websites optimized for speed, security, and conversion.',
    deliverables: ['Custom UI/UX', 'Mobile Responsive', 'CMS Integration', 'Core Web Vitals < 1s'],
    iconName: 'Globe',
    badge: 'Popular',
  },
  {
    id: 's2',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    category: 'Software',
    description: 'Bespoke enterprise applications, business portals, workflow automation, and scalable cloud systems.',
    deliverables: ['Microservices Arch', 'Role-Based Access', 'API Gateway', '99.99% Uptime SLA'],
    iconName: 'Code2',
  },
  {
    id: 's3',
    title: 'AI Solutions & GEO Optimization',
    slug: 'ai-solutions-geo',
    category: 'AI & Data',
    description: 'Generative Engine Optimization (Perplexity/ChatGPT), LLM fine-tuning, and AI agents automation.',
    deliverables: ['AI Citations', 'Vector Database', 'Private LLM Copilots', 'RAG Pipelines'],
    iconName: 'Sparkles',
    badge: 'Trending',
  },
  {
    id: 's4',
    title: 'E-commerce Platforms',
    slug: 'ecommerce-website-development',
    category: 'Web',
    description: 'High-volume omnichannel storefronts with multi-currency checkout, inventory sync, and CRM connectors.',
    deliverables: ['Payment Gateways', 'Headless Storefront', 'ERP Integration', 'Cart Optimization'],
    iconName: 'ShoppingCart',
  },
  {
    id: 's5',
    title: 'Search Engine Optimization (SEO)',
    slug: 'seo-services',
    category: 'Marketing',
    description: 'Sustainable, white-hat technical SEO, programmatic content engines, and schema architectures.',
    deliverables: ['Technical SEO Audit', 'Keyword Matrix', 'Schema Architecture', 'Backlink Strategy'],
    iconName: 'Search',
  },
  {
    id: 's6',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    category: 'Mobile',
    description: 'Cross-platform iOS and Android mobile applications using React Native and Flutter for maximum reach.',
    deliverables: ['Offline Sync', 'Push Notifications', 'Store Publishing', 'Biometric Auth'],
    iconName: 'Smartphone',
  },
];

const ICON_MAP: Record<string, React.ElementType> = {
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
};

export function ServicesSection({ settings }: { settings: ServicesSectionSettings }) {
  const badge = settings.badge || 'OUR COMPREHENSIVE EXPERTISE';
  const heading = settings.heading || 'Transformative Digital Services';
  const subheading = settings.subheading || 'We engineer tailor-made digital platforms designed to outpace the competition and drive measurable business ROI.';
  const services = settings.services && settings.services.length > 0 ? settings.services : DEFAULT_SERVICES;
  const viewAllUrl = settings.viewAllUrl || '/services';

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter((s) => s.category === activeCategory);

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
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
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#663399] text-white shadow-md'
                    : 'bg-[#1C1B1B] text-white/70 hover:text-white border border-[#2A2B28]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = (service.iconName && ICON_MAP[service.iconName]) || Globe;

            return (
              <div
                key={service.id}
                className="group relative p-8 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 hover:shadow-xl hover:shadow-[#663399]/10 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F] group-hover:bg-[#663399] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    {service.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#D9F45F]/10 text-[#D9F45F] border border-[#D9F45F]/20">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D9F45F] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-white/70 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {service.deliverables && service.deliverables.length > 0 && (
                    <div className="space-y-2 mb-6 pt-4 border-t border-[#2A2B28]/50">
                      {service.deliverables.map((del, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D9F45F]" />
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#D9F45F] group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
