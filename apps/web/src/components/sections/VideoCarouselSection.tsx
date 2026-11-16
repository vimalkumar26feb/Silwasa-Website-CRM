'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ExternalLink,
  Film,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface VideoSlideItem {
  videoUrl: string;
  thumbnailUrl?: string; // Poster / thumbnail image
  title?: string;
  description?: string;
  linkUrl?: string;
  ctaText?: string;
}

export interface VideoCarouselSettings {
  badge?: string;
  heading?: string;
  subheading?: string;
  slides?: VideoSlideItem[];
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  aspectRatio?: '16/9' | '21/9' | '4/3';
}

const DEFAULT_VIDEO_SLIDES: VideoSlideItem[] = [
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
    title: 'Enterprise AI Architecture & Microservices Delivery',
    description: 'Watch how our lead engineering teams design, test, and ship distributed cloud applications with zero downtime.',
    linkUrl: '/services/custom-software-development',
    ctaText: 'Explore Cloud Services',
  },
  {
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    title: 'Generative Engine Optimization (GEO) In Action',
    description: 'Transforming brand content into structured entity knowledge graphs indexed by AI search agents.',
    linkUrl: '/services/ai-solutions-geo',
    ctaText: 'Explore AI & GEO',
  },
];

export function VideoCarouselSection({ settings }: { settings: VideoCarouselSettings }) {
  const slides = settings.slides && settings.slides.length > 0 ? settings.slides : DEFAULT_VIDEO_SLIDES;
  const autoplay = settings.autoplay !== undefined ? settings.autoplay : false;
  const isMuted = settings.muted !== undefined ? settings.muted : true;
  const isLoop = settings.loop !== undefined ? settings.loop : true;
  const showControls = settings.controls !== undefined ? settings.controls : true;
  const showArrows = settings.showArrows !== undefined ? settings.showArrows : true;
  const showDots = settings.showDots !== undefined ? settings.showDots : true;
  const aspectRatio = settings.aspectRatio || '16/9';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [muted, setMuted] = useState(isMuted);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // When changing slides, reload the video with appropriate play state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      if (autoplay) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        }
      } else {
        setIsPlaying(false);
      }
    }
  }, [currentIndex, autoplay]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '21/9':
        return 'aspect-[21/9]';
      case '4/3':
        return 'aspect-[4/3]';
      case '16/9':
      default:
        return 'aspect-[16/9]';
    }
  };

  // Helper: Detect if URL is YouTube or Vimeo embed
  const isEmbed =
    currentSlide.videoUrl.includes('youtube.com') ||
    currentSlide.videoUrl.includes('youtu.be') ||
    currentSlide.videoUrl.includes('vimeo.com');

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${isLoop ? 1 : 0}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${isLoop ? 1 : 0}`;
    }
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${isLoop ? 1 : 0}`;
    }
    return url;
  };

  return (
    <section className="relative py-16 lg:py-24 bg-[#151414] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#663399]/15 rounded-full blur-[150px] pointer-events-none" />

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

        {/* Video Player Box */}
        <div
          className={`relative w-full rounded-3xl overflow-hidden border border-[#2A2B28] bg-black shadow-2xl group ${getAspectClass()}`}
        >
          {isEmbed ? (
            /* YouTube / Vimeo Embed Support */
            <iframe
              src={getEmbedUrl(currentSlide.videoUrl)}
              title={currentSlide.title || 'Video Player'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            /* Universal Cross-Browser HTML5 Video Player */
            <video
              ref={videoRef}
              src={currentSlide.videoUrl}
              poster={currentSlide.thumbnailUrl}
              autoPlay={autoplay}
              muted={muted}
              loop={isLoop}
              playsInline
              webkit-playsinline="true"
              x5-playsinline="true"
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover"
            />
          )}

          {/* Vignette Overlay for Title & Caption readability */}
          {!isEmbed && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
          )}

          {/* Center Play Button Overlay (when paused on direct video) */}
          {!isEmbed && !isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#663399]/90 hover:bg-[#663399] border border-[#D9F45F]/40 flex items-center justify-center text-white transition transform hover:scale-110 shadow-2xl z-20"
              aria-label="Play video"
            >
              <Play className="w-7 h-7 sm:w-8 sm:h-8 text-[#D9F45F] fill-[#D9F45F] ml-1" />
            </button>
          )}

          {/* Bottom Bar: Title, Description & CTA */}
          {!isEmbed && (currentSlide.title || currentSlide.description) && (
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20 max-w-3xl space-y-2 pointer-events-none">
              {currentSlide.title && (
                <h3 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
                  {currentSlide.title}
                </h3>
              )}
              {currentSlide.description && (
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                  {currentSlide.description}
                </p>
              )}
              {currentSlide.linkUrl && (
                <div className="pt-2 pointer-events-auto">
                  <Link href={currentSlide.linkUrl}>
                    <Button variant="primary" size="sm" className="rounded-xl text-xs">
                      <span>{currentSlide.ctaText || 'Learn More'}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Custom Video Controls Bar */}
          {!isEmbed && showControls && (
            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-[#2A2B28] flex items-center justify-center text-white transition shadow-lg"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-[#2A2B28] flex items-center justify-center text-white transition shadow-lg"
                title={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 text-white/60" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#D9F45F]" />
                )}
              </button>
            </div>
          )}

          {/* Navigation Arrows */}
          {showArrows && totalSlides > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#663399]/90 backdrop-blur-md border border-[#2A2B28] flex items-center justify-center text-white transition hover:scale-105 shadow-xl"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#663399]/90 backdrop-blur-md border border-[#2A2B28] flex items-center justify-center text-white transition hover:scale-105 shadow-xl"
                aria-label="Next video"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Indicator Dots */}
          {showDots && totalSlides > 1 && (
            <div className="absolute bottom-4 right-6 z-30 flex items-center gap-1.5 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#2A2B28]">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 bg-[#D9F45F]'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Jump to video ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
