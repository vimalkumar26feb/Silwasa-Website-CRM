'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemeSettingsSchema } from '@silwasa/validation';
import { ThemeSettings } from '@silwasa/types';
import { DEFAULT_THEME } from '@silwasa/shared';
import { apiClient, ApiError } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { RotateCcw, Save, CheckCircle2, AlertCircle, Eye, Sparkles } from 'lucide-react';

export default function AdminThemePage() {
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ThemeSettings>({
    resolver: zodResolver(ThemeSettingsSchema),
    defaultValues: DEFAULT_THEME as unknown as ThemeSettings,
  });

  const currentTheme = watch();

  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await apiClient<{ success: boolean; data: ThemeSettings }>(
          '/admin/settings/theme'
        );
        if (res.success && res.data) {
          reset(res.data);
        }
      } catch {
        // Fallback default
      } finally {
        setLoading(false);
      }
    }
    loadTheme();
  }, [reset]);

  const onSubmit = async (data: ThemeSettings) => {
    try {
      setSaveError(null);
      setSaveSuccess(false);
      const res = await apiClient<{ success: boolean; data: ThemeSettings }>(
        '/admin/settings/theme',
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : 'Failed to update theme';
      setSaveError(msg);
    }
  };

  const handleRestoreDefaults = () => {
    if (confirm('Restore the default Silwasa brand palette?')) {
      reset(DEFAULT_THEME as unknown as ThemeSettings);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const colors = currentTheme.colors || DEFAULT_THEME.colors;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Theme &amp; Global Styling</h1>
          <p className="text-xs text-white/50 mt-1">
            Customize global brand colors, typography, borders, and CSS design variables
          </p>
        </div>

        <Button
          type="button"
          onClick={handleRestoreDefaults}
          variant="outline"
          size="sm"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Restore Default Palette
        </Button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-300 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Theme and design variables published successfully.</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/40 flex items-center gap-3 text-xs text-red-300 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Color Pickers & Typography (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Brand Palette</CardTitle>
                <CardDescription>
                  Modify the CSS custom properties applied across the public website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Primary Color */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-[#2A2B28]">
                  <div>
                    <label className="block text-xs font-semibold text-white">Primary Brand Color</label>
                    <p className="text-[11px] text-white/40">Buttons, hero accents, gradients</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                      {...register('colors.primary')}
                    />
                    <input
                      type="text"
                      className="w-24 px-2 py-1 text-xs font-mono bg-[#151414] border border-[#2A2B28] rounded text-white text-center"
                      {...register('colors.primary')}
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-[#2A2B28]">
                  <div>
                    <label className="block text-xs font-semibold text-white">Accent Highlight (Neon Lime)</label>
                    <p className="text-[11px] text-white/40">Badges, checkmarks, metrics, link arrows</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                      {...register('colors.accent')}
                    />
                    <input
                      type="text"
                      className="w-24 px-2 py-1 text-xs font-mono bg-[#151414] border border-[#2A2B28] rounded text-white text-center"
                      {...register('colors.accent')}
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-[#2A2B28]">
                  <div>
                    <label className="block text-xs font-semibold text-white">Dark Background</label>
                    <p className="text-[11px] text-white/40">Main page body background</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                      {...register('colors.background')}
                    />
                    <input
                      type="text"
                      className="w-24 px-2 py-1 text-xs font-mono bg-[#151414] border border-[#2A2B28] rounded text-white text-center"
                      {...register('colors.background')}
                    />
                  </div>
                </div>

                {/* Card Surface Color */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-[#2A2B28]">
                  <div>
                    <label className="block text-xs font-semibold text-white">Card Surface Background</label>
                    <p className="text-[11px] text-white/40">Cards, dropdowns, panels, modal boxes</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                      {...register('colors.cardBackground')}
                    />
                    <input
                      type="text"
                      className="w-24 px-2 py-1 text-xs font-mono bg-[#151414] border border-[#2A2B28] rounded text-white text-center"
                      {...register('colors.cardBackground')}
                    />
                  </div>
                </div>

                {/* Border Color */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-[#2A2B28]">
                  <div>
                    <label className="block text-xs font-semibold text-white">Border Color</label>
                    <p className="text-[11px] text-white/40">Dividers, card outlines, input borders</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                      {...register('colors.borderColor')}
                    />
                    <input
                      type="text"
                      className="w-24 px-2 py-1 text-xs font-mono bg-[#151414] border border-[#2A2B28] rounded text-white text-center"
                      {...register('colors.borderColor')}
                    />
                  </div>
                </div>

                {/* Secondary (Headings) */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-[#2A2B28]">
                  <div>
                    <label className="block text-xs font-semibold text-white">Heading Text Color</label>
                    <p className="text-[11px] text-white/40">H1-H6 titles, strong text</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                      {...register('colors.secondary')}
                    />
                    <input
                      type="text"
                      className="w-24 px-2 py-1 text-xs font-mono bg-[#151414] border border-[#2A2B28] rounded text-white text-center"
                      {...register('colors.secondary')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typography &amp; Radius</CardTitle>
                <CardDescription>Font families and global component rounding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-white/70 mb-1.5">
                    Heading Font Family
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-[#1C1B1B] border border-[#2A2B28] rounded-md text-xs text-white"
                    {...register('fontFamilyHeading')}
                  >
                    <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Default)</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Outfit, sans-serif">Outfit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-white/70 mb-1.5">
                    Body Font Family
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-[#1C1B1B] border border-[#2A2B28] rounded-md text-xs text-white"
                    {...register('fontFamilyBody')}
                  >
                    <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans (Default)</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="system-ui, sans-serif">System UI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-white/70 mb-1.5">
                    Border Radius Scale
                  </label>
                  <select
                    className="w-full px-3 py-2 bg-[#1C1B1B] border border-[#2A2B28] rounded-md text-xs text-white"
                    {...register('borderRadius')}
                  >
                    <option value="6px">Small (6px)</option>
                    <option value="8px">Standard (8px - Default)</option>
                    <option value="12px">Rounded (12px)</option>
                    <option value="16px">Large (16px)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="accent" size="lg" isLoading={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                Save &amp; Apply Theme
              </Button>
            </div>
          </form>
        </div>

        {/* Right Pane: Live Visual Preview Box (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              <Eye className="w-4 h-4 text-[#D9F45F]" />
              Live Visual Preview
            </div>

            {/* Simulated Public Component Card */}
            <div
              style={{
                backgroundColor: colors.background,
                color: colors.text,
                borderRadius: currentTheme.borderRadius || '8px',
                fontFamily: currentTheme.fontFamilyBody || 'sans-serif',
              }}
              className="p-6 border border-[#2A2B28] shadow-2xl space-y-6"
            >
              {/* Badge */}
              <div
                style={{
                  color: colors.accent,
                  backgroundColor: `${colors.accent}15`,
                  borderColor: `${colors.accent}30`,
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase border tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Live Preview
              </div>

              {/* Heading */}
              <div>
                <h3
                  style={{
                    color: colors.secondary,
                    fontFamily: currentTheme.fontFamilyHeading || 'sans-serif',
                  }}
                  className="text-2xl font-bold tracking-tight"
                >
                  Sustainable SEO For Serious Brands
                </h3>
                <p className="text-xs mt-2 leading-relaxed opacity-80">
                  This preview renders using the live color variables currently selected in the form.
                </p>
              </div>

              {/* Sample Surface Box */}
              <div
                style={{
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.borderColor,
                }}
                className="p-4 rounded-lg border space-y-2"
              >
                <span style={{ color: colors.secondary }} className="font-semibold text-xs block">
                  Interactive Deliverable Card
                </span>
                <p className="text-[11px] opacity-70">
                  Custom React &amp; Next.js applications engineered for sub-second Core Web Vitals.
                </p>
              </div>

              {/* Buttons Row */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  style={{
                    backgroundColor: colors.primary,
                    color: '#ffffff',
                    borderRadius: currentTheme.borderRadius || '8px',
                  }}
                  className="px-4 py-2 text-xs font-semibold shadow hover:opacity-90 transition"
                >
                  Primary Action
                </button>
                <button
                  type="button"
                  style={{
                    backgroundColor: colors.accent,
                    color: '#000000',
                    borderRadius: currentTheme.borderRadius || '8px',
                  }}
                  className="px-4 py-2 text-xs font-semibold shadow hover:opacity-90 transition"
                >
                  Accent CTA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
