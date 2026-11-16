'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon, Sparkles } from 'lucide-react';

export interface ImageSlideItem {
  imageUrl: string;
  posterUrl?: string;
  title?: string;
  caption?: string;
  linkUrl?: string;
  linkTarget?: '_self' | '_blank';
  altText?: string;
}

export interface ImageCarouselSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  slides?: ImageSlideItem[];
  autoplay?: boolean;
  autoplayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  pauseOnHover?: boolean;
  aspectRatio?: '16/9' | '21/9' | '4/3' | 'auto';
  loop?: boolean;
}

const DEFAULT_SLIDES: ImageSlideItem[] = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=20&w=400&auto=format&fit=crop',
    title: 'Enterprise Software & Cloud Platforms',
    caption: 'Architected with Next.js 15, microservices, and 99.99% uptime guarantees.',
    linkUrl: '/services/custom-software-development',
    altText: 'Enterprise software architecture',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=20&w=400&auto=format&fit=crop',
    title: 'AI Solutions & Generative Engine Optimization',
    caption: 'Position your enterprise authority directly inside ChatGPT, Claude, and Perplexity AI citations.',
    linkUrl: '/services/ai-solutions-geo',
    altText: 'AI and Generative Engine Optimization',
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop',
    posterUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=20&w=400&auto=format&fit=crop',
    title: 'High-Volume Headless E-commerce',
    caption: 'Sub-second page speeds and multi-currency checkout conversion architecture.',
    linkUrl: '/services/ecommerce-website-development',
    altText: 'Headless E-commerce development',
  },
];

export function ImageCarouselSection({ settings }: { settings: ImageCarouselSettings }) {
  const slides = settings.slides && settings.slides.length > 0 ? settings.slides : DEFAULT_SLIDES;
  const autoplay = settings.autoplay !== undefined ? settings.autoplay : true;
  const autoplayInterval = Number(settings.autoplayInterval) || 5000;
  const showArrows = settings.showArrows !== undefined ? settings.showArrows : true;
  const showDots = settings.showDots !== undefined ? settings.showDots : true;
  const pauseOnHover = settings.pauseOnHover !== undefined ? settings.pauseOnHover : true;
  const aspectRatio = settings.aspectRatio || '16/9';
  const loop = settings.loop !== undefined ? settings.loop : true;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= totalSlides - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [totalSlides, loop]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return loop ? totalSlides - 1 : prev;
      }
      return prev - 1;
    });
  }, [totalSlides, loop]);

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || totalSlides <= 1) return;
    if (pauseOnHover && isHovered) return;

    const timer = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [autoplay, autoplayInterval, isHovered, pauseOnHover, totalSlides, goToNext]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '21/9':
        return 'aspect-[21/9]';
      case '4/3':
        return 'aspect-[4/3]';
      case 'auto':
        return 'min-h-[350px] sm:min-h-[450px]';
      case '16/9':
      default:
        return 'aspect-[16/9]';
    }
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section className="relative py-16 lg:py-24 bg-[#151414] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#663399]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Optional Section Header */}
        {(settings.heading || settings.badge) && (
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            {settings.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1B] border border-[#2A2B28] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#D9F45F] animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-white/80">
                  {settings.badge}
                </span>
              </div>
            )}
            {settings.heading && (
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {settings.heading}
              </h2>
            )}
            {settings.subheading && (
              <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                {settings.subheading}
              </p>
            )}
          </div>
        )}

        {/* Carousel Viewport Container */}
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`relative w-full rounded-3xl overflow-hidden border border-[#2A2B28] bg-[#1C1B1B] shadow-2xl group focus:outline-none focus:ring-1 focus:ring-[#D9F45F]/50 ${getAspectClass()}`}
        >
          {/* Slides Container */}
          <div className="relative w-full h-full">
            {slides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              const SlideContent = (
                <div
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                    isActive
                      ? 'opacity-100 scale-100 z-10 pointer-events-auto'
                      : 'opacity-0 scale-105 pointer-events-none z-0'
                  }`}
                >
                  {/* Poster / Fallback placeholder if provided */}
                  {slide.posterUrl && !isActive && (
                    <img
                      src={slide.posterUrl}
                      alt="Poster placeholder"
                      className="absolute inset-0 w-full h-full object-cover filter blur-sm"
                    />
                  )}

                  {/* Main Slide Image */}
                  <img
                    src={slide.imageUrl}
                    alt={slide.altText || slide.title || `Carousel slide ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />

                  {/* Atmospheric Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

                  {/* Caption & Title Info */}
                  {(slide.title || slide.caption) && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12 z-20 max-w-3xl space-y-2">
                      {slide.title && (
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight group-hover:text-[#D9F45F] transition-colors flex items-center gap-2">
                            <span>{slide.title}</span>
                            {slide.linkUrl && (
                              <ExternalLink className="w-4 h-4 text-[#D9F45F] opacity-75 shrink-0" />
                            )}
                          </h3>
                        </div>
                      )}
                      {slide.caption && (
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl">
                          {slide.caption}
                        </p>
                      )}
                      {slide.linkUrl && (
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9F45F] group-hover:underline">
                            <span>Explore Page</span>
                            <span>→</span>
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );

              // Wrap in Link if slide has linkUrl
              if (slide.linkUrl) {
                const isExternal = slide.linkUrl.startsWith('http');
                if (isExternal) {
                  return (
                    <a
                      key={idx}
                      href={slide.linkUrl}
                      target={slide.linkTarget || '_blank'}
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      {SlideContent}
                    </a>
                  );
                }
                return (
                  <Link key={idx} href={slide.linkUrl} className="cursor-pointer">
                    {SlideContent}
                  </Link>
                );
              }

              return <React.Fragment key={idx}>{SlideContent}</React.Fragment>;
            })}
          </div>

          {/* Previous / Next Arrow Controls */}
          {showArrows && totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPrev();
                }}
                disabled={!loop && currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#663399]/90 backdrop-blur-md border border-[#2A2B28] flex items-center justify-center text-white transition disabled:opacity-30 disabled:pointer-events-none hover:scale-105 shadow-xl"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNext();
                }}
                disabled={!loop && currentIndex === totalSlides - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#663399]/90 backdrop-blur-md border border-[#2A2B28] flex items-center justify-center text-white transition disabled:opacity-30 disabled:pointer-events-none hover:scale-105 shadow-xl"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Indicator Dots */}
          {showDots && totalSlides > 1 && (
            <div className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#2A2B28]">
              {slides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(dotIdx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dotIdx === currentIndex
                      ? 'w-6 bg-[#D9F45F]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Jump to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
