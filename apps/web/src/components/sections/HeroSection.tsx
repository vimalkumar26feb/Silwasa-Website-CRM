'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, ArrowRight, Play, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/Button';

export interface HeroSectionSettings {
  // Layout mode
  layout?: 'split-content' | 'fullwidth-banner' | 'fullwidth-video' | 'content-only';
  fullWidth?: boolean; // When true, edge-to-edge full viewport width without horizontal constraints
  aspectRatio?: string; // '16/9', '21/9', '4/3', etc.

  // Text content
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

  // Media options (Image or Video)
  mediaType?: 'image' | 'video' | 'badge-card' | 'none';
  imageUrl?: string;
  imageAlt?: string;

  // Cross-browser video configuration
  videoUrl?: string;
  videoPoster?: string;
  videoAutoplay?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;
  videoControls?: boolean;
}

export function HeroSection({ settings }: { settings: HeroSectionSettings }) {
  const layout = settings?.layout || 'split-content';
  const fullWidth = Boolean(settings?.fullWidth);

  const badge = settings?.badge || 'SOLUTIONS FOR CREATIVE PRODUCTS';
  const heading = settings?.heading || 'Sustainable SEO For Serious Brands';
  const description =
    settings?.description ||
    'Silwasa IT Solutions engineers high-performance web platforms, custom enterprise software, AI solutions, and Generative Engine Optimization (GEO) to accelerate business growth.';

  const checklist = Array.isArray(settings?.checklist) ? settings.checklist : [
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

  const mediaType = settings?.mediaType || (settings?.videoUrl ? 'video' : settings?.imageUrl ? 'image' : 'badge-card');
  const imageUrl = settings?.imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop';
  const imageAlt = settings?.imageAlt || heading;

  const videoUrl = settings?.videoUrl;
  const videoPoster = settings?.videoPoster || imageUrl;
  const videoAutoplay = settings?.videoAutoplay ?? true;
  const videoMuted = settings?.videoMuted ?? true;
  const videoLoop = settings?.videoLoop ?? true;
  const videoControls = settings?.videoControls ?? false;

  // Full-width Banner Layout
  if (layout === 'fullwidth-banner') {
    return (
      <section className={`relative overflow-hidden bg-[#151414] ${fullWidth ? 'w-full' : 'py-12 sm:py-16'}`}>
        <div className={`relative ${fullWidth ? 'w-full min-h-[550px] lg:min-h-[680px]' : 'max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8'}`}>
          <div className={`relative overflow-hidden ${fullWidth ? 'w-full h-full min-h-[550px] lg:min-h-[680px]' : 'rounded-3xl border border-[#2A2B28] min-h-[500px]'}`}>
            <img
              src={imageUrl}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151414] via-[#151414]/70 to-black/40" />

            {/* Banner Text Overlay */}
            <div className="relative z-10 flex flex-col justify-end p-8 sm:p-14 lg:p-20 min-h-[550px] lg:min-h-[680px] max-w-4xl space-y-6">
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
                <p className="text-base sm:text-xl text-white/80 max-w-2xl leading-relaxed">
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
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:border-emerald-400 bg-black/60 backdrop-blur-md text-white text-sm font-semibold transition hover:bg-emerald-500/20"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Full-width Video Layout
  if (layout === 'fullwidth-video') {
    return (
      <section className={`relative overflow-hidden bg-[#151414] ${fullWidth ? 'w-full' : 'py-12 sm:py-16'}`}>
        <div className={`relative ${fullWidth ? 'w-full min-h-[550px] lg:min-h-[700px]' : 'max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8'}`}>
          <div className={`relative overflow-hidden ${fullWidth ? 'w-full min-h-[550px] lg:min-h-[700px]' : 'rounded-3xl border border-[#2A2B28] min-h-[500px]'}`}>
            {videoUrl ? (
              <video
                src={videoUrl}
                poster={videoPoster}
                autoPlay={videoAutoplay}
                muted={videoMuted}
                loop={videoLoop}
                controls={videoControls}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img src={imageUrl} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#151414] via-[#151414]/60 to-black/40 pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-end p-8 sm:p-14 lg:p-20 min-h-[550px] lg:min-h-[700px] max-w-4xl space-y-6">
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
                <p className="text-base sm:text-xl text-white/80 max-w-2xl leading-relaxed">
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
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 hover:border-emerald-400 bg-black/60 backdrop-blur-md text-white text-sm font-semibold transition hover:bg-emerald-500/20"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Split-content Layout (Left Content, Right Media) & Content-only Layout
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

            {/* Dynamic Checklist (rendered only when items exist) */}
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

            {/* CTA Buttons & Social Proof Row */}
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

              {/* Avatar Stack + Customer Counter (only rendered if enabled/configured) */}
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

          {/* Right Column: Dynamic Media (Video, Image, or Badge card) */}
          {layout !== 'content-only' && (
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {mediaType === 'video' && videoUrl ? (
                /* Cross-Browser Responsive Video Player */
                <div className="relative w-full aspect-[16/10] sm:aspect-video rounded-3xl overflow-hidden border border-[#2A2B28] bg-black shadow-2xl group">
                  <video
                    src={videoUrl}
                    poster={videoPoster}
                    autoPlay={videoAutoplay}
                    muted={videoMuted}
                    loop={videoLoop}
                    controls={videoControls}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none" />
                </div>
              ) : mediaType === 'image' && imageUrl ? (
                /* High-Definition Image Showcase */
                <div className="relative w-full aspect-[16/10] sm:aspect-square max-w-md rounded-3xl overflow-hidden border border-[#2A2B28] bg-[#1C1B1B] shadow-2xl group">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151414]/80 via-transparent to-transparent pointer-events-none" />
                </div>
              ) : (
                /* Signature Silwasa Engineering Badge Card */
                <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-b from-[#663399]/20 via-[#1C1B1B] to-[#151414] border border-[#2A2B28] p-4 flex items-center justify-center overflow-hidden shadow-2xl">
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
