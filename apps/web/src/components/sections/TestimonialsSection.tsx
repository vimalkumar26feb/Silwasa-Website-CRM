'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle, User } from 'lucide-react';
import type { Testimonial } from '@silwasa/types';

export interface TestimonialsSectionSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  layout?: 'carousel' | 'grid';
  desktopColumns?: 1 | 2 | 3;
  featuredOnly?: boolean;
  testimonials?: Testimonial[];
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Dr. Vikram Malhotra',
    clientRole: 'Chief Technology Officer',
    clientCompany: 'NovaCura Healthcare',
    clientAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    content: 'Silwasa delivered our complete clinical telemetry platform with zero downtime and sub-second WebSocket telemetry. Their architectural discipline exceeded our international expectations.',
    rating: 5,
    isFeatured: true,
    order: 0,
  },
  {
    id: 'test-2',
    clientName: 'Marcus Vance',
    clientRole: 'VP of Engineering',
    clientCompany: 'Vance Autonomous Systems (USA)',
    clientAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    content: 'Silwasa’s React 19 and Next.js architects refactored our flagship SaaS portal in record time. Core Web Vitals improved by 74%, directly lowering customer churn and increasing inbound pipeline.',
    rating: 5,
    isFeatured: true,
    order: 1,
  },
  {
    id: 'test-3',
    clientName: 'Sunita Mehra',
    clientRole: 'Managing Director',
    clientCompany: 'Luxor Lifestyle E-commerce',
    clientAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    content: 'Our conversion rates jumped by 48% within 3 weeks of launching our new custom headless storefront built by Silwasa. Highly professional, responsive, and truly innovative.',
    rating: 5,
    isFeatured: true,
    order: 2,
  },
  {
    id: 'test-4',
    clientName: 'Arjun Singhania',
    clientRole: 'Head of Product',
    clientCompany: 'Apex Fintech Solutions',
    clientAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    content: 'Their Generative Engine Optimization (GEO) work positioned our platform in top AI citation answers across Perplexity and ChatGPT. Inbound enterprise demos spiked significantly.',
    rating: 5,
    isFeatured: true,
    order: 3,
  },
];

export function TestimonialsSection({ settings }: { settings: TestimonialsSectionSettings }) {
  const badge = settings?.badge || 'CLIENT SUCCESS STORIES';
  const heading = settings?.heading || 'Proven Impact Across Enterprise Clients';
  const subheading = settings?.subheading || 'Read how our custom software engineering, Next.js architecture, and AI integrations have driven multi-million dollar growth.';
  const layout = settings?.layout || 'carousel';
  const desktopCols = Number(settings?.desktopColumns) || 3;
  const featuredOnly = settings?.featuredOnly === true;

  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(settings?.testimonials || []);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (settings?.testimonials && settings.testimonials.length > 0) {
      setTestimonialsList(settings.testimonials);
      return;
    }

    let isMounted = true;
    async function loadTestimonials() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const queryParam = featuredOnly ? '?featured=true' : '';
        const res = await fetch(`${apiUrl}/testimonials${queryParam}`);

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.data) && data.data.length > 0) {
            setTestimonialsList(data.data);
            return;
          }
        }
      } catch {
        // Fallback
      }

      if (isMounted && (!testimonialsList || testimonialsList.length === 0)) {
        setTestimonialsList(DEFAULT_TESTIMONIALS);
      }
    }

    loadTestimonials();
    return () => {
      isMounted = false;
    };
  }, [settings?.testimonials, featuredOnly]);

  const effectiveTestimonials = testimonialsList && testimonialsList.length > 0 ? testimonialsList : DEFAULT_TESTIMONIALS;
  const displayed = featuredOnly ? effectiveTestimonials.filter((t) => t.isFeatured) : effectiveTestimonials;
  const safeItems = displayed.length > 0 ? displayed : effectiveTestimonials;

  // Carousel calculations
  const itemsPerView = desktopCols;
  const maxIndex = Math.max(0, safeItems.length - itemsPerView);

  const handlePrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const getItemWidthClass = () => {
    if (desktopCols === 1) return 'w-full shrink-0';
    if (desktopCols === 2) return 'w-full md:w-1/2 shrink-0';
    return 'w-full md:w-1/2 lg:w-1/3 shrink-0';
  };

  return (
    <section className="py-20 lg:py-28 bg-[#151414] relative border-t border-[#2A2B28]/60 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#663399]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D9F45F]/5 rounded-full blur-[140px] pointer-events-none" />

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

          {/* Carousel Arrows */}
          {layout === 'carousel' && safeItems.length > itemsPerView && (
            <div className="mt-6 md:mt-0 flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={carouselIndex === 0}
                className="w-10 h-10 rounded-full border border-[#2A2B28] bg-[#1C1B1B] text-white flex items-center justify-center hover:border-[#D9F45F] hover:text-[#D9F45F] transition disabled:opacity-30"
                title="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={carouselIndex >= maxIndex}
                className="w-10 h-10 rounded-full border border-[#2A2B28] bg-[#1C1B1B] text-white flex items-center justify-center hover:border-[#D9F45F] hover:text-[#D9F45F] transition disabled:opacity-30"
                title="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Content Render: Carousel vs Grid */}
        {layout === 'carousel' ? (
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(-${carouselIndex * (100 / (desktopCols || 3))}%)`,
              }}
            >
              {safeItems.map((item) => (
                <div key={item.id} className={getItemWidthClass()}>
                  <TestimonialCard item={item} />
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
          <div className={`grid grid-cols-1 ${desktopCols === 1 ? 'lg:grid-cols-1 max-w-2xl mx-auto' : desktopCols === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {safeItems.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const rating = item.rating || 5;

  return (
    <div className="h-full p-8 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 hover:shadow-xl hover:shadow-[#663399]/15 transition-all duration-300 flex flex-col justify-between relative group">
      {/* Decorative Quote Icon in background */}
      <div className="absolute top-6 right-6 text-white/[0.04] group-hover:text-[#663399]/20 transition-colors pointer-events-none">
        <Quote className="w-16 h-16" />
      </div>

      <div className="relative z-10">
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating
                  ? 'text-[#D9F45F] fill-[#D9F45F]'
                  : 'text-zinc-700'
              }`}
            />
          ))}
          {item.isFeatured && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#663399]/20 text-[#D9F45F] border border-[#663399]/40">
              Verified Review
            </span>
          )}
        </div>

        {/* Content */}
        <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 italic">
          &ldquo;{item.content}&rdquo;
        </p>
      </div>

      {/* Author Footer */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-[#2A2B28]/60 relative z-10">
        {item.clientAvatarUrl ? (
          <img
            src={item.clientAvatarUrl}
            alt={item.clientName}
            className="w-11 h-11 rounded-full object-cover border border-[#2A2B28] shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#663399]/20 border border-[#663399]/40 text-[#D9F45F] flex items-center justify-center font-bold text-sm shrink-0">
            {item.clientName.charAt(0)}
          </div>
        )}

        <div>
          <div className="font-bold text-white text-sm flex items-center gap-1.5">
            <span>{item.clientName}</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
          <div className="text-xs text-white/50">
            {item.clientRole} • <span className="text-[#D9F45F]/90 font-medium">{item.clientCompany}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
