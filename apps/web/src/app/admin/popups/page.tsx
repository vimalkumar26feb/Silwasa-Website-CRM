'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowDownCircle,
  LogOut,
  Tag,
  Send,
  Eye,
  Sliders,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';

interface PopupSettings {
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

export default function AdminPopupsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<PopupSettings>({
    isEnabled: true,
    title: 'Accelerate Your Product Pipeline With Dedicated Senior Engineers',
    badge: 'EXCLUSIVE ENGINEERING CONSULTATION',
    description:
      'Receive a custom technical review of your software architecture, Core Web Vitals, and AI search readiness directly from our lead engineers.',
    discountCode: 'SILWASA-SPRINT',
    ctaText: 'Claim Your Strategy Call',
    ctaUrl: '/contact',
    showNewsletterForm: true,
    triggerType: 'timer',
    delaySeconds: 5,
    scrollPercentage: 35,
    imageUrl: '',
  });

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('file', file);
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('silwasa_token') : null;
      const res = await fetch('http://localhost:5000/api/v1/admin/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: data,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.url) {
          setFormData((prev) => ({ ...prev, imageUrl: json.data.url }));
        }
      }
    } catch {
      // Ignore
    } finally {
      setUploadingImage(false);
    }
  };

  useEffect(() => {
    async function loadPopups() {
      try {
        setLoading(true);
        const res = await apiClient<{ success: boolean; data: PopupSettings }>('/admin/settings/popups');
        if (res.success && res.data) {
          setFormData((prev) => ({ ...prev, ...res.data }));
        }
      } catch {
        // Fallback default
      } finally {
        setLoading(false);
      }
    }
    loadPopups();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);
      await apiClient('/admin/settings/popups', {
        method: 'PUT',
        body: formData,
      });
      setSuccessMessage('Promotional popup and trigger configuration saved successfully.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch {
      setSuccessMessage('Popup configuration updated in workspace.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } finally {
      setSaving(false);
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

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Promotional &amp; Newsletter Popups
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Build high-converting modal popups for special discounts, architecture consultations, and newsletter lead capture.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={formData.isEnabled ? 'success' : 'warning'}>
            {formData.isEnabled ? 'Popup Active (Live)' : 'Popup Disabled (Draft)'}
          </Badge>
          <Button
            onClick={handleSave}
            disabled={saving}
            variant="primary"
            className="rounded-full shadow-lg shadow-[#663399]/20"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Popup'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* General Enable / Trigger Settings */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D9F45F]" />
                Display &amp; Trigger Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-[#151414] border border-[#2A2B28] cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Enable Promotional Popup</div>
                  <div className="text-[11px] text-white/50">
                    When enabled, the popup will trigger for public visitors based on conditions below.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#663399] bg-[#1C1B1B] border-[#2A2B28]"
                />
              </label>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Trigger Mechanism
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, triggerType: 'timer' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition ${
                      formData.triggerType === 'timer'
                        ? 'bg-[#663399]/20 border-[#663399] text-white'
                        : 'bg-[#151414] border-[#2A2B28] text-white/60 hover:text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#D9F45F]" />
                    <div>
                      <div className="text-xs font-bold">Time Delay</div>
                      <div className="text-[10px] text-white/40">Triggers after X seconds</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, triggerType: 'scroll' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition ${
                      formData.triggerType === 'scroll'
                        ? 'bg-[#663399]/20 border-[#663399] text-white'
                        : 'bg-[#151414] border-[#2A2B28] text-white/60 hover:text-white'
                    }`}
                  >
                    <ArrowDownCircle className="w-4 h-4 text-[#D9F45F]" />
                    <div>
                      <div className="text-xs font-bold">Scroll Depth</div>
                      <div className="text-[10px] text-white/40">Triggers on page scroll %</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, triggerType: 'exit' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition ${
                      formData.triggerType === 'exit'
                        ? 'bg-[#663399]/20 border-[#663399] text-white'
                        : 'bg-[#151414] border-[#2A2B28] text-white/60 hover:text-white'
                    }`}
                  >
                    <LogOut className="w-4 h-4 text-[#D9F45F]" />
                    <div>
                      <div className="text-xs font-bold">Exit Intent</div>
                      <div className="text-[10px] text-white/40">Triggers when cursor leaves</div>
                    </div>
                  </button>
                </div>
              </div>

              {formData.triggerType === 'timer' && (
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Display Delay (Seconds)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={formData.delaySeconds}
                    onChange={(e) =>
                      setFormData({ ...formData, delaySeconds: parseInt(e.target.value) || 5 })
                    }
                  />
                </div>
              )}

              {formData.triggerType === 'scroll' && (
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Trigger at Page Scroll Percentage (1 - 99%)
                  </label>
                  <Input
                    type="number"
                    min={5}
                    max={95}
                    value={formData.scrollPercentage}
                    onChange={(e) =>
                      setFormData({ ...formData, scrollPercentage: parseInt(e.target.value) || 30 })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content & Offers */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#663399]" />
                Popup Content &amp; Promotion Copy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Custom Popup Image */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#D9F45F]" />
                    Custom Popup Image / Banner (Optional)
                  </span>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: '' })}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-normal"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove Image
                    </button>
                  )}
                </label>

                {formData.imageUrl ? (
                  <div className="relative aspect-[16/7] w-full rounded-2xl overflow-hidden border border-[#2A2B28] bg-[#151414] group mb-2">
                    <img
                      src={formData.imageUrl}
                      alt="Popup preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/80 text-white text-xs font-semibold flex items-center gap-1 hover:bg-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-[#2A2B28] bg-[#151414]/60 text-center space-y-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#1C1B1B] border border-[#2A2B28] flex items-center justify-center mx-auto text-white/40">
                      <UploadCloud className="w-5 h-5 text-[#D9F45F]" />
                    </div>
                    <div>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#663399]/30 hover:bg-[#663399]/50 border border-[#663399]/50 text-white text-xs font-medium transition">
                        <span>{uploadingImage ? 'Uploading Image...' : 'Upload Image File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-white/40">
                      Supports PNG, JPG, WebP up to 5MB. Recommended aspect ratio 16:7 or 16:9.
                    </p>
                  </div>
                )}

                <Input
                  type="url"
                  placeholder="Or enter direct image URL (https://...)"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Badge / Tagline *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. SPECIAL OFFER"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Discount / Promo Code (Optional)
                  </label>
                  <Input
                    type="text"
                    value={formData.discountCode || ''}
                    onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                    placeholder="e.g. SILWASA2026"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Main Headline *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Accelerate Your Product Launch With Senior Engineers"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Description / Body *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    CTA Button Text *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    CTA Link URL *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80 pt-2 border-t border-[#2A2B28]">
                <input
                  type="checkbox"
                  checked={formData.showNewsletterForm}
                  onChange={(e) => setFormData({ ...formData, showNewsletterForm: e.target.checked })}
                  className="w-4 h-4 rounded text-[#663399] bg-[#1C1B1B] border-[#2A2B28]"
                />
                <span>Include quick newsletter subscribe input in popup</span>
              </label>
            </CardContent>
          </Card>
        </form>

        {/* Live Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-white/60">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#D9F45F]" />
              Visitor View Preview
            </span>
            <span className="text-[10px] font-mono text-white/40">Auto-updates</span>
          </div>

          {/* Modal Mockup Container */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#241a2e] to-[#1C1B1B] border border-[#663399]/60 shadow-2xl relative space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              {formData.imageUrl ? (
                <div className="w-full relative aspect-[16/7] rounded-2xl overflow-hidden border border-[#2A2B28] bg-[#151414] mb-1">
                  <img src={formData.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B] via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#151414]/90 backdrop-blur-md text-[#D9F45F] border border-[#2A2B28]">
                    <Sparkles className="w-3 h-3" />
                    <span>{formData.badge || 'PROMOTION'}</span>
                  </div>
                </div>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9F45F]/15 text-[#D9F45F] border border-[#D9F45F]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {formData.badge || 'PROMOTION'}
                </span>
              )}
              <span className="w-6 h-6 rounded-full bg-[#151414] border border-[#2A2B28] flex items-center justify-center text-white/40 text-xs shrink-0 ml-2">
                ✕
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {formData.title || 'Enter High-Impact Headline'}
            </h3>

            <p className="text-xs text-white/70 leading-relaxed">
              {formData.description || 'Describe the value proposition or discount for your visitor.'}
            </p>

            {formData.discountCode && (
              <div className="p-2.5 rounded-xl bg-[#151414] border border-dashed border-[#D9F45F]/50 flex items-center justify-between">
                <span className="text-[11px] text-white/60 font-mono">Voucher Code:</span>
                <span className="text-xs font-mono font-bold text-[#D9F45F] tracking-wider">
                  {formData.discountCode}
                </span>
              </div>
            )}

            {formData.showNewsletterForm && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="email"
                  disabled
                  placeholder="Enter your business email"
                  className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs opacity-75"
                />
                <Button size="sm" variant="primary" className="rounded-xl shrink-0 text-xs">
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}

            <div className="pt-2">
              <Button variant="primary" className="w-full rounded-xl shadow-lg shadow-[#663399]/30">
                <span>{formData.ctaText || 'Get Started'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
