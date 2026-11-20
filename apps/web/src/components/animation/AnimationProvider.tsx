'use client';

import React, { useEffect, createContext, useContext } from 'react';
import type { AnimationSettings } from '@silwasa/types';
import { DEFAULT_ANIMATION } from '@silwasa/shared';
import Lenis from 'lenis';

interface AnimationContextValue {
  settings: AnimationSettings;
}

const AnimationContext = createContext<AnimationContextValue>({
  settings: DEFAULT_ANIMATION,
});

export function useAnimation() {
  return useContext(AnimationContext);
}

// Utility to apply word-masking to text elements
function wrapWordsInElement(el: HTMLElement) {
  if (el.dataset.wordWrapped === 'true') return;
  el.dataset.wordWrapped = 'true';

  const text = el.innerText;
  if (!text || !text.trim()) return;

  const words = text.trim().split(/\s+/);
  el.innerHTML = '';

  words.forEach((word, idx) => {
    const mask = document.createElement('span');
    mask.className = 'word-mask';

    const inner = document.createElement('span');
    inner.className = 'word-inner';
    inner.textContent = word;
    inner.style.transitionDelay = `${idx * 45}ms`;

    mask.appendChild(inner);
    el.appendChild(mask);
  });
}

export function AnimationProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings?: AnimationSettings | null;
}) {
  const settings: AnimationSettings = initialSettings || DEFAULT_ANIMATION;

  // 1. Lenis Smooth Scrolling Engine
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!settings.enabled || !settings.smoothScroll) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: settings.speed === 'fast' ? 0.75 : settings.speed === 'relaxed' ? 1.4 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [settings.enabled, settings.smoothScroll, settings.speed]);

  // 2. IntersectionObserver & Word-Reveal Animation Engine
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!settings.enabled) {
      document.documentElement.classList.add('no-animations');
      return;
    }

    document.documentElement.classList.remove('no-animations');

    // Configure CSS duration variable based on speed setting
    const duration =
      settings.speed === 'fast' ? '0.45s' : settings.speed === 'relaxed' ? '0.95s' : '0.7s';
    document.documentElement.style.setProperty('--anim-duration', duration);

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;

          if (el.classList.contains('word-reveal-target')) {
            el.classList.add('word-revealed');
          }

          if (el.classList.contains('reveal-init')) {
            el.classList.add('reveal-active');
          } else if (el.classList.contains('reveal-blur-init')) {
            el.classList.add('reveal-blur-active');
          } else if (el.classList.contains('reveal-scale-init')) {
            el.classList.add('reveal-scale-active');
          }

          observer.unobserve(el);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12,
    });

    const attachAnimations = () => {
      // Heading animations (Word Reveal from Bottom vs Blur Glow vs Fade)
      const headings = document.querySelectorAll(
        'section h1, section h2, section h3, .word-reveal'
      );

      headings.forEach((h) => {
        const el = h as HTMLElement;
        if (settings.headingAnimation === 'word-reveal') {
          if (!el.dataset.wordWrapped) {
            wrapWordsInElement(el);
            el.classList.add('word-reveal-target');
            observer.observe(el);
          }
        } else if (settings.headingAnimation === 'blur-glow') {
          if (!el.classList.contains('reveal-blur-init') && !el.classList.contains('reveal-blur-active')) {
            el.classList.add('reveal-blur-init');
            observer.observe(el);
          }
        } else if (settings.headingAnimation === 'fade-up') {
          if (!el.classList.contains('reveal-init') && !el.classList.contains('reveal-active')) {
            el.classList.add('reveal-init');
            observer.observe(el);
          }
        }
      });

      // Paragraph word reveal (if configured)
      if (settings.paragraphAnimation === 'word-reveal') {
        const paragraphs = document.querySelectorAll('.para-word-reveal');
        paragraphs.forEach((p) => {
          const el = p as HTMLElement;
          if (!el.dataset.wordWrapped) {
            wrapWordsInElement(el);
            el.classList.add('word-reveal-target');
            observer.observe(el);
          }
        });
      }

      // Card entrance and hover effects
      const cards = document.querySelectorAll(
        '.grid > div, .card-anim-lift, [data-animated-card]'
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

      // Interactive Buttons: Add sheen sweep (hover box shadow removed!)
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
        '.reveal-init, .reveal-blur-init, .reveal-scale-init, .word-reveal-target'
      );
      explicitElements.forEach((el) => observer.observe(el));
    };

    attachAnimations();

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
