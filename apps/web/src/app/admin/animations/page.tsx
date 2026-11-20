'use client';

import React, { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../../../lib/api';
import type { AnimationSettings } from '@silwasa/types';
import { DEFAULT_ANIMATION } from '@silwasa/shared';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sliders,
  Eye,
  Check,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  ArrowRight,
  Flame,
  Feather,
  Compass,
  Type,
  MousePointer,
} from 'lucide-react';

export default function AdminAnimationsPage() {
  const [settings, setSettings] = useState<AnimationSettings>(DEFAULT_ANIMATION);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Live preview replay key
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    async function loadAnimations() {
      try {
        setLoading(true);
        const res = await apiClient<{ success: boolean; data: AnimationSettings }>('/admin/settings/animations');
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch {
        setSettings(DEFAULT_ANIMATION);
      } finally {
        setLoading(false);
      }
    }
    loadAnimations();
  }, []);

  const handlePresetSelect = (preset: 'luxury' | 'dynamic' | 'minimal') => {
    if (preset === 'luxury') {
      setSettings((prev) => ({
        ...prev,
        preset: 'luxury',
        scrollReveal: 'fade-up',
        headingAnimation: 'word-reveal',
        paragraphAnimation: 'fade-up',
        cardHoverEffect: 'lift-glow',
        buttonEffect: 'shine-sweep',
        speed: 'normal',
        staggerChildren: true,
        smoothScroll: true,
      }));
    } else if (preset === 'dynamic') {
      setSettings((prev) => ({
        ...prev,
        preset: 'dynamic',
        scrollReveal: 'scale-up',
        headingAnimation: 'slide-left',
        paragraphAnimation: 'word-reveal',
        cardHoverEffect: 'scale',
        buttonEffect: 'pulse-glow',
        speed: 'fast',
        staggerChildren: true,
        smoothScroll: true,
      }));
    } else if (preset === 'minimal') {
      setSettings((prev) => ({
        ...prev,
        preset: 'minimal',
        scrollReveal: 'fade-in',
        headingAnimation: 'fade-up',
        paragraphAnimation: 'none',
        cardHoverEffect: 'lime-border',
        buttonEffect: 'lift',
        speed: 'relaxed',
        staggerChildren: false,
        smoothScroll: false,
      }));
    }
    setPreviewKey((k) => k + 1);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      const res = await apiClient<{ success: boolean; data: AnimationSettings }>('/admin/settings/animations', {
        method: 'PUT',
        body: settings,
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to save animation settings';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Preview word-reveal split
  const sampleWords = 'Engineered For Measurable Business Superiority'.split(' ');

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#663399]/30 text-[#D9F45F]">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Website Motion Engine &amp; Animation Controls
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Configure Lenis smooth scrolling, word-by-word bottom reveals, card hover physics, and clean button shine
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full text-xs px-5 py-2.5 font-bold"
        >
          {saving ? 'Saving...' : 'Save Animation Settings'}
        </Button>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Motion settings saved and active across your entire public website.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center gap-3 text-xs text-red-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Master Toggles Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Master Motion Switch */}
        <Card className="border-[#2A2B28] bg-[#1C1B1B]">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${settings.enabled ? 'bg-[#D9F45F] shadow-[0_0_8px_#D9F45F]' : 'bg-zinc-600'}`} />
                <h3 className="text-sm font-bold text-white">Global Animations</h3>
              </div>
              <p className="text-xs text-white/50">
                Master toggle for all scroll entrance animations, card lifts, and heading reveals.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSettings((prev) => ({ ...prev, enabled: !prev.enabled }));
                setPreviewKey((k) => k + 1);
              }}
              className="text-[#D9F45F] hover:opacity-80 transition shrink-0"
            >
              {settings.enabled ? (
                <ToggleRight className="w-8 h-8 text-[#D9F45F]" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-white/30" />
              )}
            </button>
          </CardContent>
        </Card>

        {/* Lenis Smooth Scrolling Engine Switch */}
        <Card className="border-[#2A2B28] bg-[#1C1B1B]">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1 pr-4">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D9F45F]" />
                <h3 className="text-sm font-bold text-white">Lenis Smooth Scrolling</h3>
              </div>
              <p className="text-xs text-white/50">
                Inertial physics-based silky smooth scrolling engine for ultra-luxury navigation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSettings((prev) => ({ ...prev, smoothScroll: !prev.smoothScroll }));
              }}
              className="text-[#D9F45F] hover:opacity-80 transition shrink-0"
            >
              {settings.smoothScroll ? (
                <ToggleRight className="w-8 h-8 text-[#D9F45F]" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-white/30" />
              )}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Style Presets Card */}
      <Card className="border-[#2A2B28] bg-[#1C1B1B]">
        <CardHeader>
          <CardTitle>Curated Motion Presets</CardTitle>
          <CardDescription>
            One-click calibrated design system presets balancing aesthetics, performance, and smoothness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Luxury Smooth */}
            <div
              onClick={() => handlePresetSelect('luxury')}
              className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                settings.preset === 'luxury'
                  ? 'border-[#D9F45F] bg-[#663399]/20 shadow-lg shadow-[#663399]/20 -translate-y-1'
                  : 'border-[#2A2B28] bg-[#151414] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-[#663399]/40 text-[#D9F45F]">
                  <Sparkles className="w-4 h-4" />
                </span>
                {settings.preset === 'luxury' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9F45F] text-[#151414]">
                    Active
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Luxury Smooth (Recommended)</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Lenis inertial smooth scrolling, word reveal from bottom on headings, subtle card float lifts, and sheen sweep buttons.
              </p>
            </div>

            {/* Dynamic & Punchy */}
            <div
              onClick={() => handlePresetSelect('dynamic')}
              className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                settings.preset === 'dynamic'
                  ? 'border-[#D9F45F] bg-[#663399]/20 shadow-lg shadow-[#663399]/20 -translate-y-1'
                  : 'border-[#2A2B28] bg-[#151414] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                  <Flame className="w-4 h-4" />
                </span>
                {settings.preset === 'dynamic' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9F45F] text-[#151414]">
                    Active
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Dynamic &amp; Punchy</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Snappy scale-up reveals, energetic slide-in typography, and responsive micro-interactions for modern tech products.
              </p>
            </div>

            {/* Minimalist Subtle */}
            <div
              onClick={() => handlePresetSelect('minimal')}
              className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                settings.preset === 'minimal'
                  ? 'border-[#D9F45F] bg-[#663399]/20 shadow-lg shadow-[#663399]/20 -translate-y-1'
                  : 'border-[#2A2B28] bg-[#151414] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Feather className="w-4 h-4" />
                </span>
                {settings.preset === 'minimal' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9F45F] text-[#151414]">
                    Active
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Minimalist Subtle</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Clean opacity fades without heavy physical motion. Designed for maximum accessibility, clarity, and executive rigor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Typography & Layout Motion Controls */}
      <Card className="border-[#2A2B28] bg-[#1C1B1B]">
        <CardHeader>
          <CardTitle>Advanced Motion Customization</CardTitle>
          <CardDescription>Configure word reveals, scroll thresholds, and component hover mechanics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Heading Entrance Animation */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#D9F45F]" /> Headings Animation Mode
              </label>
              <select
                value={settings.headingAnimation}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    preset: 'custom',
                    headingAnimation: e.target.value as any,
                  }));
                  setPreviewKey((k) => k + 1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#151414] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
              >
                <option value="word-reveal">Word Reveal From Bottom (Staggered Mask — Recommended)</option>
                <option value="blur-glow">Blur-In with Soft Radial Glow</option>
                <option value="fade-up">Fade &amp; Slide Up</option>
                <option value="slide-left">Slide In From Left</option>
                <option value="none">None (Instant display)</option>
              </select>
            </div>

            {/* Paragraph Animation */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#D9F45F]" /> Paragraph &amp; Subtitle Animation
              </label>
              <select
                value={settings.paragraphAnimation || 'fade-up'}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    preset: 'custom',
                    paragraphAnimation: e.target.value as any,
                  }));
                  setPreviewKey((k) => k + 1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#151414] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
              >
                <option value="word-reveal">Word Reveal From Bottom (Staggered)</option>
                <option value="fade-up">Smooth Fade Up (Recommended)</option>
                <option value="blur-in">Soft Blur In</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Card Hover Effect */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#D9F45F]" /> Card Hover Interaction
              </label>
              <select
                value={settings.cardHoverEffect}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    preset: 'custom',
                    cardHoverEffect: e.target.value as any,
                  }));
                  setPreviewKey((k) => k + 1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#151414] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
              >
                <option value="lift-glow">Elevate &amp; Purple Aura Glow (Recommended)</option>
                <option value="lime-border">Neon Lime Border Highlight</option>
                <option value="scale">Subtle Scale Expansion</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Button Micro-interaction */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5 text-[#D9F45F]" /> Button Hover Effect (No Box-Shadow)
              </label>
              <select
                value={settings.buttonEffect}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    preset: 'custom',
                    buttonEffect: e.target.value as any,
                  }));
                  setPreviewKey((k) => k + 1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#151414] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
              >
                <option value="shine-sweep">Lustrous Sheen Light Sweep (Clean — No Box Shadow)</option>
                <option value="lift">Subtle Button Micro-Lift (-2px)</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Motion Speed */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Motion Speed &amp; Duration
              </label>
              <select
                value={settings.speed}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    speed: e.target.value as any,
                  }));
                  setPreviewKey((k) => k + 1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#151414] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
              >
                <option value="fast">Fast (450ms — Snappy &amp; rapid)</option>
                <option value="normal">Normal (700ms — Balanced &amp; luxury)</option>
                <option value="relaxed">Relaxed (950ms — Cinematic &amp; deliberate)</option>
              </select>
            </div>

            {/* Stagger Grid Items Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#151414] border border-[#2A2B28] mt-3">
              <div>
                <div className="text-xs font-semibold text-white">Stagger Grid Cards</div>
                <div className="text-[11px] text-white/40">
                  Sequentially cascade card entrance reveals (e.g. 50ms stagger)
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSettings((prev) => ({ ...prev, staggerChildren: !prev.staggerChildren }));
                  setPreviewKey((k) => k + 1);
                }}
                className="text-[#D9F45F] hover:opacity-80 transition"
              >
                {settings.staggerChildren ? (
                  <ToggleRight className="w-7 h-7 text-[#D9F45F]" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-white/30" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Interactive Preview Canvas */}
      <Card className="border-[#663399]/40 bg-[#151414]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#D9F45F]" />
              <CardTitle>Interactive Live Preview</CardTitle>
            </div>
            <CardDescription>
              Test Word Reveal from bottom, clean button hover (no box-shadow), and card physics in real-time
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewKey((k) => k + 1)}
            className="text-xs h-8"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Replay Animations
          </Button>
        </CardHeader>
        <CardContent>
          <div
            key={previewKey}
            className={`p-8 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] relative overflow-hidden transition-all ${
              settings.enabled ? '' : 'opacity-80'
            }`}
          >
            {/* Ambient Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#663399]/15 rounded-full blur-[90px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#151414] border border-[#2A2B28] ${
                  settings.enabled ? 'animate-in fade-in slide-in-from-bottom-2 duration-500' : ''
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9F45F]">
                  MOTION PREVIEW
                </span>
              </div>

              {/* Heading with Word Reveal from Bottom */}
              {settings.enabled && settings.headingAnimation === 'word-reveal' ? (
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {sampleWords.map((word, idx) => (
                    <span key={idx} className="word-mask">
                      <span
                        className="word-inner animate-in slide-in-from-bottom-[120%] fade-in fill-mode-forwards"
                        style={{
                          animationDuration: '0.75s',
                          animationDelay: `${idx * 60}ms`,
                          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        {word}
                      </span>
                    </span>
                  ))}
                </h2>
              ) : (
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight ${
                    settings.enabled && settings.headingAnimation === 'blur-glow'
                      ? 'animate-in fade-in duration-700'
                      : settings.enabled && settings.headingAnimation === 'slide-left'
                      ? 'animate-in fade-in slide-in-from-left-4 duration-500'
                      : settings.enabled
                      ? 'animate-in fade-in slide-in-from-bottom-3 duration-600'
                      : ''
                  }`}
                >
                  Engineered For Measurable Business Superiority
                </h2>
              )}

              <p className="text-xs sm:text-sm text-white/60 max-w-xl">
                Hover over the sample cards below to feel the calibrated elevation physics, or test the button shine sweep (notice zero box shadow on button hover).
              </p>

              {/* Sample Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div
                  className={`p-5 rounded-xl bg-[#151414] border border-[#2A2B28] transition-all cursor-pointer ${
                    settings.enabled && settings.cardHoverEffect === 'lift-glow'
                      ? 'card-anim-lift'
                      : settings.enabled && settings.cardHoverEffect === 'lime-border'
                      ? 'hover:border-[#D9F45F] transition-colors'
                      : settings.enabled && settings.cardHoverEffect === 'scale'
                      ? 'hover:scale-[1.03] transition-transform'
                      : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#663399]/30 text-[#D9F45F] flex items-center justify-center mb-3">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">Custom Software Engineering</h4>
                  <p className="text-xs text-white/50">
                    High-concurrency microservices, automated CI/CD pipelines, and 99.99% uptime guarantees.
                  </p>
                </div>

                <div
                  className={`p-5 rounded-xl bg-[#151414] border border-[#2A2B28] transition-all cursor-pointer ${
                    settings.enabled && settings.cardHoverEffect === 'lift-glow'
                      ? 'card-anim-lift'
                      : settings.enabled && settings.cardHoverEffect === 'lime-border'
                      ? 'hover:border-[#D9F45F] transition-colors'
                      : settings.enabled && settings.cardHoverEffect === 'scale'
                      ? 'hover:scale-[1.03] transition-transform'
                      : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#663399]/30 text-[#D9F45F] flex items-center justify-center mb-3">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">AI Solutions &amp; Generative SEO</h4>
                  <p className="text-xs text-white/50">
                    Entity schema engineering, automated knowledge graph injection, and LLM copilot workflows.
                  </p>
                </div>
              </div>

              {/* Sample Button (clean hover without box-shadow) */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  className={`rounded-xl px-6 py-2.5 text-xs font-bold ${
                    settings.enabled && settings.buttonEffect === 'shine-sweep' ? 'btn-anim-shine' : ''
                  }`}
                >
                  Schedule Technical Consultation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
