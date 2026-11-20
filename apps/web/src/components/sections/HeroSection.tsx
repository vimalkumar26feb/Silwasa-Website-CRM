'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface HeroSlide {
  id?: string;
  desktopImage?: string;
  mobileImage?: string;
  desktopVideo?: string;
  mobileVideo?: string;
  videoPoster?: string;
  mobileVideoPoster?: string;
  linkUrl?: string;
  openInNewTab?: boolean;
  altText?: string;
  title?: string;
  badge?: string;
  description?: string;
}

export interface HeroSectionSettings {
  // Layout mode
  layout?: 'split-content' | 'fullwidth-banner' | 'fullwidth-video' | 'content-only';
  fullWidth?: boolean; // When true, edge-to-edge full viewport width without horizontal constraints
  overlay?: boolean; // Dark contrast overlay on banner/video (default true)

  // Split Content with Right Media
  mediaType?: 'image' | 'video' | 'badge-card' | 'none';
  rightImageUrl?: string;
  rightImageMobileUrl?: string;
  rightImageAlt?: string;
  rightImageLink?: string;

  // Single Banner Image (when isCarousel is false)
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  imageUrl?: string; // legacy fallback
  imageAlt?: string;
  bannerLinkUrl?: string;
  bannerLinkOpenInNewTab?: boolean;

  // Banner Image Carousel (when isCarousel is true)
  isCarousel?: boolean;
  imageSlides?: HeroSlide[];
  carouselAutoplay?: boolean;
  carouselInterval?: number; // In seconds (default 5)

  // Single Banner Video
  desktopVideoUrl?: string;
  mobileVideoUrl?: string;
  videoUrl?: string; // legacy fallback
  videoPoster?: string;
  mobileVideoPoster?: string;
  videoLinkUrl?: string;
  videoAutoplay?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;
  videoControls?: boolean;

  // Video Banner Carousel
  isVideoCarousel?: boolean;
  videoSlides?: HeroSlide[];

  // Text content & Headings
  badge?: string;
  heading?: string;
  description?: string;
  checklist?: string[]; // Dynamic bullet points

  // Call to action buttons
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  whatsappUrl?: string;

  // Social proof / Metrics
  satisfiedCustomersCount?: string;
  satisfiedCustomersLabel?: string;
  showSocialProof?: boolean;
}

export function HeroSection({ settings }: { settings: HeroSectionSettings }) {
  const layout = settings?.layout || 'split-content';
  const fullWidth = Boolean(settings?.fullWidth);
  const showOverlay = settings?.overlay !== false;

  const badge = settings?.badge || 'SOLUTIONS FOR CREATIVE PRODUCTS';
  const heading = settings?.heading || 'Sustainable SEO For Serious Brands';
  const description =
    settings?.description ||
    'Silwasa IT Solutions engineers high-performance web platforms, custom enterprise software, AI solutions, and Generative Engine Optimization (GEO) to accelerate business growth.';

  const checklist = Array.isArray(settings?.checklist)
    ? settings.checklist
    : [
        'Crawlability & Indexing Fixing errors',
        'Identifying exact high-intent queries',
        'Strategically linking high-authority content',
        'Enterprise-grade security and Core Web Vitals',
      ];

  const ctaText = settings?.ctaText || 'Get In Touch';
  const ctaUrl = settings?.ctaUrl || '/contact';
  const whatsappUrl = settings?.whatsappUrl;
  const secondaryCtaText = settings?.secondaryCtaText;
  const secondaryCtaUrl = settings?.secondaryCtaUrl;

  const customersCount = settings?.satisfiedCustomersCount || '200K+';
  const customersLabel = settings?.satisfiedCustomersLabel || 'Satisfied Customers';
  const showSocialProof = settings?.showSocialProof !== false && Boolean(customersCount);

  // -------------------------------------------------------------
  // Image Slides & Carousel Logic
  // -------------------------------------------------------------
  const isImageCarousel = Boolean(settings?.isCarousel);
  const rawImageSlides = Array.isArray(settings?.imageSlides) && settings.imageSlides.length > 0
    ? settings.imageSlides
    : [
        {
          id: 'slide-default-1',
          desktopImage: settings?.desktopImageUrl || settings?.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop',
          mobileImage: settings?.mobileImageUrl || '',
          linkUrl: settings?.bannerLinkUrl || '',
          openInNewTab: settings?.bannerLinkOpenInNewTab || false,
          altText: settings?.imageAlt || heading,
        },
      ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageIntervalSeconds = settings?.carouselInterval || 5;
  const imageAutoplay = settings?.carouselAutoplay !== false && isImageCarousel && rawImageSlides.length > 1;

  useEffect(() => {
    if (!imageAutoplay) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % rawImageSlides.length);
    }, imageIntervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [imageAutoplay, imageIntervalSeconds, rawImageSlides.length]);

  // -------------------------------------------------------------
  // Video Slides & Carousel Logic
  // -------------------------------------------------------------
  const isVideoCarousel = Boolean(settings?.isVideoCarousel);
  const rawVideoSlides = Array.isArray(settings?.videoSlides) && settings.videoSlides.length > 0
    ? settings.videoSlides
    : [
        {
          id: 'vid-slide-default-1',
          desktopVideo: settings?.desktopVideoUrl || settings?.videoUrl || '',
          mobileVideo: settings?.mobileVideoUrl || '',
          videoPoster: settings?.videoPoster || settings?.desktopImageUrl || settings?.imageUrl || '',
          mobileVideoPoster: settings?.mobileVideoPoster || '',
          linkUrl: settings?.videoLinkUrl || '',
        },
      ];

  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Video settings
  const videoAutoplay = settings?.videoAutoplay ?? true;
  const videoMuted = settings?.videoMuted ?? true;
  const videoLoop = settings?.videoLoop ?? true;
  const videoControls = settings?.videoControls ?? false;

  // -------------------------------------------------------------
  // 1. FULL-WIDTH IMAGE BANNER LAYOUT (Single or Carousel)
  // -------------------------------------------------------------
  if (layout === 'fullwidth-banner') {
    const currentSlide = rawImageSlides[activeImageIndex] || rawImageSlides[0];
    const desktopImg = currentSlide.desktopImage || settings?.desktopImageUrl || settings?.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop';
    const mobileImg = currentSlide.mobileImage || settings?.mobileImageUrl;
    const slideLink = currentSlide.linkUrl || settings?.bannerLinkUrl;
    const slideTarget = currentSlide.openInNewTab || settings?.bannerLinkOpenInNewTab ? '_blank' : undefined;

    return (
      <section className={`relative overflow-hidden bg-[#151414] ${fullWidth ? 'w-full' : 'py-8 sm:py-12 lg:py-16'}`}>
        <div className={`relative ${fullWidth ? 'w-full min-h-[520px] lg:min-h-[660px]' : 'max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8'}`}>
          <div className={`relative overflow-hidden ${fullWidth ? 'w-full min-h-[520px] lg:min-h-[660px]' : 'rounded-3xl border border-[#2A2B28] min-h-[500px] lg:min-h-[620px]'}`}>
            
            {/* Responsive Banner Image Display */}
            {/* If slide has a link, wrap media */}
            {slideLink ? (
              <a
                href={slideLink}
                target={slideTarget}
                rel={slideTarget ? 'noopener noreferrer' : undefined}
                className="absolute inset-0 block w-full h-full z-0 group"
              >
                <picture className="w-full h-full block">
                  {mobileImg && <source media="(max-width: 767px)" srcSet={mobileImg} />}
                  <img
                    src={desktopImg}
                    alt={currentSlide.altText || heading}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </picture>
              </a>
            ) : (
              <picture className="absolute inset-0 w-full h-full block z-0">
                {mobileImg && <source media="(max-width: 767px)" srcSet={mobileImg} />}
                <img
                  src={desktopImg}
                  alt={currentSlide.altText || heading}
                  className="w-full h-full object-cover"
                />
              </picture>
            )}

            {/* Contrast Overlay (Configurable) */}
            {showOverlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#151414] via-[#151414]/65 to-black/35 pointer-events-none z-10" />
            )}

            {/* Banner Text Overlay & CTAs */}
            <div className="relative z-20 flex flex-col justify-end p-6 sm:p-12 lg:p-16 min-h-[520px] lg:min-h-[660px] max-w-4xl space-y-5">
              {badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1B]/90 backdrop-blur-md border border-[#2A2B28] w-fit shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#D9F45F] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                    {badge}
                  </span>
                </div>
              )}

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                {heading}
              </h1>

              {description && (
                <p className="text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href={ctaUrl}>
                  <Button variant="primary" size="lg" className="rounded-full shadow-lg text-sm font-bold">
                    {ctaText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:border-emerald-400 bg-black/60 backdrop-blur-md text-white text-sm font-semibold transition hover:bg-emerald-500/20 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Carousel Controls (when isCarousel is enabled with multiple slides) */}
            {isImageCarousel && rawImageSlides.length > 1 && (
              <>
                {/* Prev / Next Arrows */}
                <div className="absolute top-1/2 -translate-y-1/2 inset-x-4 flex items-center justify-between pointer-events-none z-30">
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + rawImageSlides.length) % rawImageSlides.length)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center pointer-events-auto transition hover:scale-105"
                    aria-label="Previous Banner Slide"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % rawImageSlides.length)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center pointer-events-auto transition hover:scale-105"
                    aria-label="Next Banner Slide"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Dot Indicators */}
                <div className="absolute bottom-6 right-6 sm:right-12 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  {rawImageSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        activeImageIndex === idx ? 'w-6 bg-[#D9F45F]' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // 2. FULL-WIDTH VIDEO BANNER LAYOUT (Single or Carousel)
  // -------------------------------------------------------------
  if (layout === 'fullwidth-video') {
    const currentVideoSlide = rawVideoSlides[activeVideoIndex] || rawVideoSlides[0];
    const desktopVid = currentVideoSlide.desktopVideo || settings?.desktopVideoUrl || settings?.videoUrl;
    const mobileVid = currentVideoSlide.mobileVideo || settings?.mobileVideoUrl;
    const desktopPoster = currentVideoSlide.videoPoster || settings?.videoPoster || settings?.imageUrl || '';
    const mobilePoster = currentVideoSlide.mobileVideoPoster || settings?.mobileVideoPoster || desktopPoster;
    const vidLink = currentVideoSlide.linkUrl || settings?.videoLinkUrl;

    return (
      <section className={`relative overflow-hidden bg-[#151414] ${fullWidth ? 'w-full' : 'py-8 sm:py-12 lg:py-16'}`}>
        <div className={`relative ${fullWidth ? 'w-full min-h-[520px] lg:min-h-[680px]' : 'max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8'}`}>
          <div className={`relative overflow-hidden ${fullWidth ? 'w-full min-h-[520px] lg:min-h-[680px]' : 'rounded-3xl border border-[#2A2B28] min-h-[500px] lg:min-h-[640px]'}`}>
            
            {/* Cross-Browser Responsive Video Rendering */}
            {desktopVid ? (
              mobileVid ? (
                <>
                  {/* Desktop view (>= 768px): Only desktop video */}
                  <div className="hidden md:block absolute inset-0 w-full h-full z-0">
                    <video
                      src={desktopVid}
                      poster={desktopPoster}
                      autoPlay={videoAutoplay}
                      muted={videoMuted}
                      loop={videoLoop}
                      controls={videoControls}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Mobile view (< 768px): Mobile video */}
                  <div className="block md:hidden absolute inset-0 w-full h-full z-0">
                    <video
                      src={mobileVid}
                      poster={mobilePoster}
                      autoPlay={videoAutoplay}
                      muted={videoMuted}
                      loop={videoLoop}
                      controls={videoControls}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </>
              ) : (
                /* Fallback: If no mobile video provided, show desktop video on all viewports */
                <div className="absolute inset-0 w-full h-full z-0">
                  <video
                    src={desktopVid}
                    poster={desktopPoster}
                    autoPlay={videoAutoplay}
                    muted={videoMuted}
                    loop={videoLoop}
                    controls={videoControls}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )
            ) : (
              <img
                src={desktopPoster || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop'}
                alt={heading}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />
            )}

            {/* Contrast Overlay (Configurable) */}
            {showOverlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-[#151414] via-[#151414]/65 to-black/35 pointer-events-none z-10" />
            )}

            {/* Banner Content Overlay */}
            <div className="relative z-20 flex flex-col justify-end p-6 sm:p-12 lg:p-16 min-h-[520px] lg:min-h-[680px] max-w-4xl space-y-5">
              {badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1B]/90 backdrop-blur-md border border-[#2A2B28] w-fit shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#D9F45F] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                    {badge}
                  </span>
                </div>
              )}

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
                {heading}
              </h1>

              {description && (
                <p className="text-base sm:text-lg lg:text-xl text-white/85 max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link href={ctaUrl}>
                  <Button variant="primary" size="lg" className="rounded-full shadow-lg text-sm font-bold">
                    {ctaText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:border-emerald-400 bg-black/60 backdrop-blur-md text-white text-sm font-semibold transition hover:bg-emerald-500/20 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {vidLink && (
                  <a
                    href={vidLink}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:border-[#D9F45F] bg-black/60 backdrop-blur-md text-white text-sm font-semibold transition hover:bg-white/10"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4 text-[#D9F45F]" />
                  </a>
                )}
              </div>
            </div>

            {/* Video Carousel Controls (if multiple video slides) */}
            {isVideoCarousel && rawVideoSlides.length > 1 && (
              <div className="absolute bottom-6 right-6 sm:right-12 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                {rawVideoSlides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveVideoIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeVideoIndex === idx ? 'w-6 bg-[#D9F45F]' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to video slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // 3. SPLIT CONTENT WITH RIGHT MEDIA OR MINIMALIST CONTENT-ONLY
  // -------------------------------------------------------------
  const mediaType = settings?.mediaType || (settings?.rightImageUrl || settings?.imageUrl ? 'image' : settings?.videoUrl ? 'video' : 'badge-card');
  const rightImageDesktop = settings?.rightImageUrl || settings?.desktopImageUrl || settings?.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop';
  const rightImageMobile = settings?.rightImageMobileUrl || settings?.mobileImageUrl;
  const rightImageAlt = settings?.rightImageAlt || settings?.imageAlt || heading;
  const rightImageLink = settings?.rightImageLink || settings?.bannerLinkUrl;

  const rightVideoUrl = settings?.videoUrl || settings?.desktopVideoUrl;
  const rightVideoPoster = settings?.videoPoster || rightImageDesktop;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-[#151414]">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#663399]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#D9F45F]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 ${layout === 'content-only' ? 'max-w-4xl mx-auto text-center' : 'lg:grid-cols-12'} gap-12 lg:gap-8 items-center`}>
          
          {/* Left Column Content */}
          <div className={`${layout === 'content-only' ? 'space-y-6 flex flex-col items-center' : 'lg:col-span-7 space-y-6'}`}>
            {/* Pill Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1B] border border-[#2A2B28] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#D9F45F] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
                  {badge}
                </span>
              </div>
            )}

            {/* H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              {heading}
            </h1>

            {/* Subtext Description */}
            {description && (
              <p className="text-base sm:text-lg text-white/70 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}

            {/* Dynamic Checklist */}
            {checklist.length > 0 && (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] shadow-md max-w-xl text-left w-full">
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
            )}

            {/* CTA Buttons & Social Proof */}
            <div className={`pt-2 flex flex-col sm:flex-row sm:items-center gap-6 ${layout === 'content-only' ? 'justify-center' : ''}`}>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={ctaUrl}>
                  <Button variant="primary" size="lg" className="rounded-full text-sm font-bold">
                    {ctaText}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>

                {secondaryCtaText && secondaryCtaUrl ? (
                  <Link href={secondaryCtaUrl}>
                    <Button variant="secondary" size="lg" className="rounded-full text-sm font-semibold">
                      {secondaryCtaText}
                    </Button>
                  </Link>
                ) : whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#2A2B28] hover:border-emerald-500 bg-[#1C1B1B] text-white text-sm font-medium transition hover:bg-emerald-500/10 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                ) : null}
              </div>

              {/* Avatar Stack + Customer Counter */}
              {showSocialProof && (
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
                  <div className="text-left">
                    <div className="text-xl font-extrabold text-white leading-tight">
                      {customersCount}
                    </div>
                    <div className="text-[11px] text-white/50 uppercase tracking-wider font-medium">
                      {customersLabel}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Custom Showcase Media (Full Width within Column) */}
          {layout !== 'content-only' && (
            <div className="lg:col-span-5 relative w-full flex items-center justify-center">
              {mediaType === 'image' && rightImageDesktop ? (
                /* Custom Showcase Image (Full Width of Column) */
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-square rounded-3xl overflow-hidden border border-[#2A2B28] bg-[#1C1B1B] shadow-2xl group">
                  {rightImageLink ? (
                    <a href={rightImageLink} className="block w-full h-full">
                      <picture className="w-full h-full block">
                        {rightImageMobile && <source media="(max-width: 767px)" srcSet={rightImageMobile} />}
                        <img
                          src={rightImageDesktop}
                          alt={rightImageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </picture>
                    </a>
                  ) : (
                    <picture className="w-full h-full block">
                      {rightImageMobile && <source media="(max-width: 767px)" srcSet={rightImageMobile} />}
                      <img
                        src={rightImageDesktop}
                        alt={rightImageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </picture>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151414]/40 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : mediaType === 'video' && rightVideoUrl ? (
                /* Cross-Browser Responsive Video Player */
                <div className="relative w-full aspect-[16/10] sm:aspect-video rounded-3xl overflow-hidden border border-[#2A2B28] bg-black shadow-2xl group">
                  <video
                    src={rightVideoUrl}
                    poster={rightVideoPoster}
                    autoPlay={videoAutoplay}
                    muted={videoMuted}
                    loop={videoLoop}
                    controls={videoControls}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />
                </div>
              ) : (
                /* Signature Silwasa Engineering Badge Card */
                <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-b from-[#663399]/20 via-[#1C1B1B] to-[#151414] border border-[#2A2B28] p-4 flex items-center justify-center overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 bg-[radial-gradient(#663399_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                  <div className="text-center p-6 space-y-4 relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#663399] to-[#975dd1] mx-auto flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-[#663399]/50">
                      S
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-white">Silwasa IT Solutions</h4>
                      <p className="text-xs text-[#D9F45F] font-mono uppercase tracking-widest">
                        Enterprise Digital Engineering
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-[#2A2B28] text-xs text-white/70 max-w-xs mx-auto">
                      Architecting high-concurrency cloud systems, Next.js web applications, and GEO search engines.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
