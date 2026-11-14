'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Sparkles, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface PopupData {
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
}

export function PromotionalPopup() {
  const [data, setData] = useState<PopupData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Only check on client side and if not already dismissed in this session
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('silwasa_popup_dismissed')) return;

    async function fetchPopupConfig() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/settings/public`);
        if (res.ok) {
          const json = await res.json();
          if (json.data?.popup && json.data.popup.isEnabled) {
            setData(json.data.popup);
          }
        }
      } catch {
        // Fallback
      }
    }

    fetchPopupConfig();
  }, []);

  useEffect(() => {
    if (!data || !data.isEnabled) return;
    if (sessionStorage.getItem('silwasa_popup_dismissed')) return;

    if (data.triggerType === 'timer') {
      const delayMs = (data.delaySeconds || 5) * 1000;
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, delayMs);
      return () => clearTimeout(timer);
    }

    if (data.triggerType === 'scroll') {
      const targetPercent = data.scrollPercentage || 35;
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
          const percent = (scrollTop / docHeight) * 100;
          if (percent >= targetPercent) {
            setIsOpen(true);
            window.removeEventListener('scroll', handleScroll);
          }
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    if (data.triggerType === 'exit') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsOpen(true);
          document.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [data]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('silwasa_popup_dismissed', 'true');
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
        body: JSON.stringify({ email, source: 'Promotional Popup' }),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#241a2e] to-[#1C1B1B] border border-[#663399]/60 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#151414] border border-[#2A2B28] flex items-center justify-center text-white/60 hover:text-white transition"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9F45F]/15 text-[#D9F45F] border border-[#D9F45F]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{data.badge || 'SPECIAL OFFER'}</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight pr-6">
          {data.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/75 leading-relaxed">
          {data.description}
        </p>

        {/* Voucher Code */}
        {data.discountCode && (
          <div className="p-3 rounded-2xl bg-[#151414] border border-dashed border-[#D9F45F]/40 flex items-center justify-between">
            <span className="text-xs text-white/60 font-mono">Special Access Code:</span>
            <span className="text-sm font-mono font-extrabold text-[#D9F45F] tracking-wider">
              {data.discountCode}
            </span>
          </div>
        )}

        {/* Newsletter form if enabled */}
        {data.showNewsletterForm && (
          <div className="pt-1">
            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Thank you! Your consultation pass has been reserved.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your corporate email..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs placeholder-white/30 focus:outline-none focus:border-[#D9F45F]"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="rounded-xl shrink-0 text-xs px-4"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Join</span>
                </Button>
              </form>
            )}
          </div>
        )}

        {/* CTA Button */}
        <div className="pt-2">
          <Link href={data.ctaUrl || '/contact'} onClick={handleDismiss} className="block w-full">
            <Button variant="primary" size="lg" className="w-full rounded-xl shadow-lg shadow-[#663399]/30">
              <span>{data.ctaText || 'Get Started'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
