'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Code2,
  Globe,
  Cpu,
  Smartphone,
  Search,
  Database,
  Layers,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Zap,
  BarChart,
  Server,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category?: string;
  customUrl?: string | null;
  shortDescription?: string;
  description?: string;
  features?: string[];
  deliverables?: string[];
  icon?: string;
  iconName?: string;
  featuredImageUrl?: string | null;
  badge?: string;
}

export interface ServicesSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  layout?: 'grid' | 'carousel';
  desktopColumns?: 1 | 2 | 3 | 4 | 5;
  mobileColumns?: 1 | 2;
  selectedCategory?: string;
  viewAllUrl?: string;
  services?: ServiceItem[];
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    title: 'Website Design & Development',
    slug: 'website-design-development',
    category: 'Web Development',
    description: 'High-converting, responsive enterprise websites optimized for speed, security, and sub-second Core Web Vitals.',
    deliverables: ['Custom Next.js 15 UI/UX', 'Mobile Responsive', 'CMS Integration', 'Core Web Vitals < 1s'],
    iconName: 'Globe',
    badge: 'Popular',
  },
  {
    id: 's2',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    category: 'Software Engineering',
    description: 'Bespoke enterprise applications, business portals, workflow automation, and scalable cloud systems.',
    deliverables: ['Microservices Arch', 'Role-Based Access', 'API Gateway', '99.99% Uptime SLA'],
    iconName: 'Code2',
    badge: 'Enterprise',
  },
  {
    id: 's3',
    title: 'AI Solutions & GEO Optimization',
    slug: 'ai-solutions-geo',
    category: 'AI & Automation',
    description: 'Generative Engine Optimization (Perplexity/ChatGPT), LLM fine-tuning, and autonomous AI agents.',
    deliverables: ['AI Search Citations', 'Vector Database RAG', 'Private Copilots', 'Autonomous Pipelines'],
    iconName: 'Sparkles',
    badge: 'Trending',
  },
  {
    id: 's4',
    title: 'E-commerce Platforms',
    slug: 'ecommerce-website-development',
    category: 'Web Development',
    description: 'High-volume omnichannel storefronts with multi-currency checkout, inventory sync, and CRM connectors.',
    deliverables: ['Payment Gateways', 'Headless Storefront', 'ERP Integration', 'Cart Optimization'],
    iconName: 'ShoppingCart',
  },
  {
    id: 's5',
    title: 'Search Engine Optimization (SEO)',
    slug: 'seo-services',
    category: 'Digital Marketing',
    description: 'Sustainable, white-hat technical SEO, programmatic content engines, and structured schema architectures.',
    deliverables: ['Technical SEO Audit', 'Keyword Matrix', 'Schema Architecture', 'Backlink Strategy'],
    iconName: 'Search',
  },
  {
    id: 's6',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    category: 'Mobile Apps',
    description: 'Cross-platform iOS and Android mobile applications using React Native and Flutter for maximum reach.',
    deliverables: ['Offline Data Sync', 'Push Notifications', 'App Store Publishing', 'Biometric Auth'],
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
  Zap,
  BarChart,
  Server,
  Monitor,
};

export function ServicesSection({ settings }: { settings: ServicesSectionSettings }) {
  const badge = settings?.badge || 'OUR COMPREHENSIVE EXPERTISE';
  const heading = settings?.heading || 'Transformative Digital Services';
  const subheading = settings?.subheading || 'We engineer tailor-made digital platforms designed to outpace the competition and drive measurable business ROI.';
  const layout = settings?.layout || 'grid';
  const desktopCols = Number(settings?.desktopColumns) || 3;
  const mobileCols = Number(settings?.mobileColumns) || 1;
  const selectedCat = settings?.selectedCategory || 'All';
  const viewAllUrl = settings?.viewAllUrl || '/services';

  const [servicesList, setServicesList] = useState<ServiceItem[]>(settings?.services || []);
  const [isLoading, setIsLoading] = useState(!settings?.services || settings.services.length === 0);
  const [activeCategory, setActiveCategory] = useState<string>(selectedCat);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (settings?.services && settings.services.length > 0) {
      setServicesList(settings.services);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    async function loadDynamicServices() {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/services`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
            const mapped: ServiceItem[] = data.data.map((item: any) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              category: item.category || 'General',
              customUrl: item.customUrl,
              description: item.shortDescription || item.fullDescription,
              deliverables: Array.isArray(item.features) ? item.features.slice(0, 4) : [],
              iconName: item.icon,
              featuredImageUrl: item.featuredImageUrl,
            }));
            setServicesList(mapped);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to default
      } finally {
        if (isMounted) setIsLoading(false);
      }
      if (isMounted && (!servicesList || servicesList.length === 0)) {
        setServicesList(DEFAULT_SERVICES);
      }
    }

    loadDynamicServices();
    return () => {
      isMounted = false;
    };
  }, [settings?.services]);

  const effectiveServices = servicesList && servicesList.length > 0 ? servicesList : DEFAULT_SERVICES;

  // Build unique categories list
  const uniqueCategories = ['All', ...Array.from(new Set(effectiveServices.map((s) => s.category || 'General').filter(Boolean)))];

  // Filtering by active category
  const filteredServices = (activeCategory === 'All' || selectedCat !== 'All' && activeCategory === selectedCat)
    ? (selectedCat !== 'All' ? effectiveServices.filter((s) => (s.category || 'General').toLowerCase() === selectedCat.toLowerCase()) : effectiveServices)
    : effectiveServices.filter((s) => (s.category || 'General').toLowerCase() === activeCategory.toLowerCase());

  // Carousel calculations with circular loop navigation
  const maxIndex = Math.max(1, filteredServices.length - (desktopCols > 1 ? desktopCols : 1));

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Grid column class mapping
  const getGridColsClass = () => {
    const mobileClass = mobileCols === 2 ? 'grid-cols-2' : 'grid-cols-1';
    let deskClass = 'lg:grid-cols-3';
    if (desktopCols === 1) deskClass = 'lg:grid-cols-1';
    else if (desktopCols === 2) deskClass = 'lg:grid-cols-2';
    else if (desktopCols === 3) deskClass = 'lg:grid-cols-3';
    else if (desktopCols === 4) deskClass = 'lg:grid-cols-4';
    else if (desktopCols === 5) deskClass = 'lg:grid-cols-5';
    return `grid ${mobileClass} ${deskClass} gap-6`;
  };

  // Carousel item width class
  const getCarouselItemWidthClass = () => {
    const mobileWidth = mobileCols === 2 ? 'w-1/2' : 'w-full';
    if (desktopCols === 1) return `${mobileWidth} lg:w-full shrink-0`;
    if (desktopCols === 2) return `${mobileWidth} lg:w-1/2 shrink-0`;
    if (desktopCols === 3) return `${mobileWidth} sm:w-1/2 lg:w-1/3 shrink-0`;
    if (desktopCols === 4) return `${mobileWidth} sm:w-1/2 lg:w-1/4 shrink-0`;
    if (desktopCols === 5) return `${mobileWidth} sm:w-1/3 lg:w-1/5 shrink-0`;
    return `${mobileWidth} sm:w-1/2 lg:w-1/3 shrink-0`;
  };

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#663399]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D9F45F]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

          <div className="mt-6 md:mt-0 flex items-center gap-3">
            {layout === 'carousel' && filteredServices.length > 1 && (
              <div className="flex items-center gap-2 mr-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-[#2A2B28] bg-[#1C1B1B] text-white flex items-center justify-center hover:border-[#D9F45F] hover:text-[#D9F45F] transition active:scale-95 shadow-md cursor-pointer"
                  title="Previous Services"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-[#2A2B28] bg-[#1C1B1B] text-white flex items-center justify-center hover:border-[#D9F45F] hover:text-[#D9F45F] transition active:scale-95 shadow-md cursor-pointer"
                  title="Next Services"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            <Link href={viewAllUrl}>
              <Button variant="secondary" className="rounded-full">
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Filter Tabs (if selectedCategory === 'All' and we have categories) */}
        {selectedCat === 'All' && uniqueCategories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCarouselIndex(0);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition shrink-0 ${
                  activeCategory === cat
                    ? 'bg-[#663399] text-white shadow-md shadow-[#663399]/20'
                    : 'bg-[#1C1B1B] text-white/70 hover:text-white border border-[#2A2B28]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Content Render: Loading Skeletons vs Grid vs Carousel */}
        {isLoading ? (
          <div className={getGridColsClass()}>
            {Array.from({ length: desktopCols || 3 }).map((_, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] animate-pulse space-y-5"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10" />
                <div className="h-6 w-1/2 bg-white/10 rounded-lg" />
                <div className="h-4 w-5/6 bg-white/5 rounded-lg" />
                <div className="h-4 w-3/4 bg-white/5 rounded-lg" />
                <div className="space-y-2 pt-4 border-t border-[#2A2B28]/60">
                  <div className="h-3 w-1/3 bg-white/5 rounded" />
                  <div className="h-3 w-1/2 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : layout === 'carousel' ? (
          <div className="relative overflow-hidden">
            <div
              ref={carouselTrackRef}
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${carouselIndex * (100 / (desktopCols || 3))}%)`,
              }}
            >
              {filteredServices.map((service) => (
                <div key={service.id} className={getCarouselItemWidthClass()}>
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>

            {/* Carousel Dot Indicators */}
            {maxIndex > 0 && (
              <div className="flex justify-center items-center gap-1.5 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      carouselIndex === i ? 'w-8 bg-[#D9F45F]' : 'w-2 bg-[#2A2B28] hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={getGridColsClass()}>
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: ServiceItem }) {
  const Icon = (service.iconName && ICON_MAP[service.iconName]) || (service.icon && ICON_MAP[service.icon]) || Globe;
  const targetUrl = service.customUrl?.trim() || `/services/${service.slug}`;
  const deliverables = service.deliverables || service.features || [];

  return (
    <div className="group relative h-full rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 hover:shadow-xl hover:shadow-[#663399]/15 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Optional Featured Image */}
      {service.featuredImageUrl ? (
        <div className="relative w-full h-44 overflow-hidden border-b border-[#2A2B28]/60 bg-[#151414]">
          <img
            src={service.featuredImageUrl}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B] via-transparent to-transparent opacity-80" />
          {service.category && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#151414]/90 text-[#D9F45F] border border-[#2A2B28]">
                {service.category}
              </span>
            </div>
          )}
        </div>
      ) : null}

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Top Row: Icon + Category Badge (if not image) */}
          <div className="flex items-center justify-between mb-5">
            <div className="w-12 h-12 rounded-xl bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F] group-hover:bg-[#663399] group-hover:text-white transition-colors duration-300">
              <Icon className="w-6 h-6" />
            </div>
            {service.category && !service.featuredImageUrl && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9F45F]/10 text-[#D9F45F] border border-[#D9F45F]/20">
                {service.category}
              </span>
            )}
            {service.badge && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#663399]/30 text-white border border-[#663399]/50">
                {service.badge}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D9F45F] transition-colors leading-snug">
            {service.title}
          </h3>

          <p className="text-sm text-white/70 leading-relaxed mb-6 line-clamp-3">
            {service.description || service.shortDescription}
          </p>

          {deliverables.length > 0 && (
            <div className="space-y-2 mb-6 pt-4 border-t border-[#2A2B28]/50">
              {deliverables.slice(0, 4).map((del, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9F45F] shrink-0" />
                  <span className="truncate">{del}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-2">
          <Link
            href={targetUrl}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#D9F45F] group-hover:translate-x-1.5 transition-transform"
          >
            <span>Explore Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
