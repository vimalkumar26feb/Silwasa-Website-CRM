'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Sparkles, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface PopupData {
  id?: string;
  isEnabled: boolean;
  title: string;
  badge: string;
  description: string;
  discountCode?: string;
  ctaText: string;
  ctaUrl: string;
  showNewsletterForm: boolean;
  triggerType: 'timer' | 'scroll' | 'exit';
  delaySeconds: number;
  scrollPercentage: number;
  imageUrl?: string;
}

export function PromotionalPopup() {
  const pathname = usePathname();
  const [popups, setPopups] = useState<PopupData[]>([]);
  const [activePopup, setActivePopup] = useState<PopupData | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const activePopupRef = useRef<PopupData | null>(null);
  activePopupRef.current = activePopup;
  const pendingQueueRef = useRef<Set<string>>(new Set());

  // CRITICAL: Never show promotional popup on administrative dashboard routes
  const isAdminRoute = !pathname || pathname.startsWith('/admin');

  // Fetch active promotional popups from public endpoint
  useEffect(() => {
    if (typeof window === 'undefined' || isAdminRoute) return;

    async function fetchPopupConfigs() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/settings/public`);
        if (res.ok) {
          const json = await res.json();

          let list: PopupData[] = [];
          if (json.data?.popups && Array.isArray(json.data.popups) && json.data.popups.length > 0) {
            list = json.data.popups.filter((p: any) => p.isEnabled);
          } else if (json.data?.popup && json.data.popup.isEnabled) {
            list = [json.data.popup];
          }

          const withIds = list.map((p, idx) => ({
            ...p,
            id: p.id || `popup-${idx}-${p.triggerType}`,
          }));

          setPopups(withIds);
        }
      } catch {
        // Fallback
      }
    }

    fetchPopupConfigs();
  }, [isAdminRoute]);

  // Helper to trigger or enqueue a popup
  const triggerPopup = useCallback((popup: PopupData) => {
    const pid = popup.id!;
    if (sessionStorage.getItem(`silwasa_popup_dismissed_${pid}`) === 'true') return;

    if (!activePopupRef.current) {
      setActivePopup(popup);
    } else if (activePopupRef.current.id !== pid) {
      pendingQueueRef.current.add(pid);
    }
  }, []);

  // Evaluate conditions for all enabled popups independently
  useEffect(() => {
    if (isAdminRoute || popups.length === 0) return;

    const isDismissed = (id: string) => {
      return sessionStorage.getItem(`silwasa_popup_dismissed_${id}`) === 'true';
    };

    const cleanups: Array<() => void> = [];

    popups.forEach((popup) => {
      const pid = popup.id!;
      if (isDismissed(pid)) return;

      // 1. Timer condition
      if (popup.triggerType === 'timer') {
        const delayMs = (popup.delaySeconds || 5) * 1000;
        const timer = setTimeout(() => {
          if (!isDismissed(pid)) {
            triggerPopup(popup);
          }
        }, delayMs);
        cleanups.push(() => clearTimeout(timer));
      }

      // 2. Scroll depth condition
      if (popup.triggerType === 'scroll') {
        const targetPercent = popup.scrollPercentage || 35;
        const handleScroll = () => {
          if (isDismissed(pid)) return;
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            const percent = (scrollTop / docHeight) * 100;
            if (percent >= targetPercent) {
              triggerPopup(popup);
            }
          }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        cleanups.push(() => window.removeEventListener('scroll', handleScroll));
      }

      // 3. Exit Intent condition
      if (popup.triggerType === 'exit') {
        const handleMouseLeave = (e: MouseEvent) => {
          if (isDismissed(pid)) return;
          if (e.clientY <= 0) {
            triggerPopup(popup);
          }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        cleanups.push(() => document.removeEventListener('mouseleave', handleMouseLeave));
      }
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [popups, isAdminRoute, triggerPopup]);

  const handleDismiss = () => {
    const currentId = activePopup?.id;
    if (currentId) {
      sessionStorage.setItem(`silwasa_popup_dismissed_${currentId}`, 'true');
      pendingQueueRef.current.delete(currentId);
    }
    setActivePopup(null);
    setSubscribed(false);
    setEmail('');

    // Check for next queued or condition-met popup after smooth dismissal
    setTimeout(() => {
      // 1. Any queued popup that hasn't been dismissed
      const nextPendingId = Array.from(pendingQueueRef.current).find(
        (id) => sessionStorage.getItem(`silwasa_popup_dismissed_${id}`) !== 'true'
      );
      if (nextPendingId) {
        const nextPopup = popups.find((p) => p.id === nextPendingId);
        if (nextPopup) {
          pendingQueueRef.current.delete(nextPendingId);
          setActivePopup(nextPopup);
          return;
        }
      }

      // 2. Check if scroll position already satisfies another un-dismissed scroll popup
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const currentPercent = (scrollTop / docHeight) * 100;
        const eligibleScroll = popups.find(
          (p) =>
            p.triggerType === 'scroll' &&
            p.id &&
            sessionStorage.getItem(`silwasa_popup_dismissed_${p.id}`) !== 'true' &&
            currentPercent >= (p.scrollPercentage || 35)
        );
        if (eligibleScroll) {
          setActivePopup(eligibleScroll);
        }
      }
    }, 450);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      setSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      await fetch(`${apiUrl}/settings/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source: `Popup: ${activePopup?.title || 'Promotional'}`,
        }),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (isAdminRoute || !activePopup) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#241a2e] to-[#1C1B1B] border border-[#663399]/60 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Close Button: anchored to top-right with high z-index and backdrop blur */}
        <button
          onClick={handleDismiss}
          className="absolute top-3.5 right-3.5 z-50 w-8 h-8 rounded-full bg-black/75 hover:bg-black/95 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white transition shadow-xl"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Custom Image Banner (flush edge-to-edge) or standalone Badge */}
        {activePopup.imageUrl ? (
          <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full overflow-hidden bg-[#151414] border-b border-[#2A2B28]">
            <img
              src={activePopup.imageUrl}
              alt={activePopup.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B] via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#151414]/90 backdrop-blur-md text-[#D9F45F] border border-[#2A2B28]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activePopup.badge || 'SPECIAL OFFER'}</span>
            </div>
          </div>
        ) : (
          <div className="px-6 sm:px-8 pt-6 sm:pt-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9F45F]/15 text-[#D9F45F] border border-[#D9F45F]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activePopup.badge || 'SPECIAL OFFER'}</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 pt-4 space-y-4">
          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight pr-6">
            {activePopup.title}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
            {activePopup.description}
          </p>

          {/* Voucher Code */}
          {activePopup.discountCode && (
            <div className="p-3 rounded-2xl bg-[#151414] border border-dashed border-[#D9F45F]/40 flex items-center justify-between">
              <span className="text-xs text-white/60 font-mono">Special Access Code:</span>
              <span className="text-sm font-mono font-extrabold text-[#D9F45F] tracking-wider">
                {activePopup.discountCode}
              </span>
            </div>
          )}

          {/* Newsletter Form */}
          {activePopup.showNewsletterForm && (
            <div className="pt-1">
              {subscribed ? (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Check your inbox! We’ve sent over your strategy details.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your corporate email..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#D9F45F]"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    className="rounded-xl px-4 text-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    <span>Join</span>
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* CTA Link Action */}
          <div className="pt-2 flex flex-col gap-2">
            <Link href={activePopup.ctaUrl || '/contact'} onClick={handleDismiss}>
              <Button
                variant="primary"
                className="w-full rounded-2xl py-3 text-sm font-bold shadow-xl shadow-[#663399]/30 flex items-center justify-center gap-2 group"
              >
                <span>{activePopup.ctaText || 'Get Started Now'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <button
              onClick={handleDismiss}
              className="text-center text-[11px] text-white/40 hover:text-white/70 transition py-1"
            >
              No thanks, I'll explore later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
