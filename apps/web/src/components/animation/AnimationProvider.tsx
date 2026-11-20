'use client';

import React, { useEffect, createContext, useContext } from 'react';
import type { AnimationSettings } from '@silwasa/types';
import { DEFAULT_ANIMATION } from '@silwasa/shared';

interface AnimationContextValue {
  settings: AnimationSettings;
}

const AnimationContext = createContext<AnimationContextValue>({
  settings: DEFAULT_ANIMATION,
});

export function useAnimation() {
  return useContext(AnimationContext);
}

export function AnimationProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: AnimationSettings | null;
}) {
  const settings: AnimationSettings = initialSettings || DEFAULT_ANIMATION;

  useEffect(() => {
    if (!settings.enabled) {
      document.documentElement.classList.add('no-animations');
      return;
    }

    document.documentElement.classList.remove('no-animations');

    // Configure CSS variables based on speed
    const duration =
      settings.speed === 'fast' ? '0.4s' : settings.speed === 'relaxed' ? '0.9s' : '0.65s';
    document.documentElement.style.setProperty('--anim-duration', duration);

    // Modern IntersectionObserver for scroll-reveal animations
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;

          if (el.classList.contains('reveal-init')) {
            el.classList.add('reveal-active');
          } else if (el.classList.contains('reveal-blur-init')) {
            el.classList.add('reveal-blur-active');
          } else if (el.classList.contains('reveal-scale-init')) {
            el.classList.add('reveal-scale-active');
          }

          // Unobserve once revealed to keep DOM performant
          observer.unobserve(el);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    });

    // Auto-attach animation classes to sections, headings, cards, and buttons
    const attachAnimations = () => {
      // Revealable headings
      const headings = document.querySelectorAll(
        'section h2, section h3, section > div > h1'
      );
      headings.forEach((h) => {
        if (!h.classList.contains('reveal-blur-init') && !h.classList.contains('reveal-blur-active')) {
          h.classList.add('reveal-blur-init');
          observer.observe(h);
        }
      });

      // Cards (Services, Pricing, Testimonials, Case Studies, Portfolio)
      const cards = document.querySelectorAll(
        '.grid > div, .relative.p-8.rounded-2xl, .card-anim-lift'
      );
      cards.forEach((card, idx) => {
        const el = card as HTMLElement;
        if (!el.classList.contains('reveal-init') && !el.classList.contains('reveal-active')) {
          el.classList.add('reveal-init');
          if (settings.staggerChildren) {
            const staggerNum = (idx % 6) + 1;
            el.classList.add(`stagger-${staggerNum}`);
          }
          if (settings.cardHoverEffect === 'lift-glow' && !el.classList.contains('card-anim-lift')) {
            el.classList.add('card-anim-lift');
          }
          observer.observe(el);
        }
      });

      // Interactive Buttons
      if (settings.buttonEffect === 'shine-sweep') {
        const buttons = document.querySelectorAll('button, .btn, a > button');
        buttons.forEach((btn) => {
          if (!btn.classList.contains('btn-anim-shine')) {
            btn.classList.add('btn-anim-shine');
          }
        });
      }

      // Manually annotated elements
      const explicitElements = document.querySelectorAll(
        '.reveal-init, .reveal-blur-init, .reveal-scale-init'
      );
      explicitElements.forEach((el) => observer.observe(el));
    };

    // Run on mount
    attachAnimations();

    // Observe future dynamically loaded components
    const mutationObserver = new MutationObserver(() => {
      attachAnimations();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [settings]);

  return (
    <AnimationContext.Provider value={{ settings }}>
      {children}
    </AnimationContext.Provider>
  );
}
