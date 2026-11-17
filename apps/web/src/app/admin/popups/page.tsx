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
  Plus,
  Copy,
  Layers,
  Check,
} from 'lucide-react';

export interface PopupItem {
  id: string;
  name: string;
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
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_POPUP: PopupItem = {
  id: 'popup-default',
  name: 'Engineering Strategy Call',
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
};

export default function AdminPopupsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [popups, setPopups] = useState<PopupItem[]>([DEFAULT_POPUP]);
  const [selectedPopupId, setSelectedPopupId] = useState<string>('popup-default');

  const selectedPopup = popups.find((p) => p.id === selectedPopupId) || popups[0] || DEFAULT_POPUP;

  const updateSelectedPopup = (patch: Partial<PopupItem>) => {
    setPopups((prev) =>
      prev.map((item) => (item.id === selectedPopup.id ? { ...item, ...patch } : item))
    );
  };

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
          updateSelectedPopup({ imageUrl: json.data.url });
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
        const res = await apiClient<{
          success: boolean;
          data: { list?: PopupItem[]; [key: string]: any };
        }>('/admin/settings/popups');

        if (res.success && res.data) {
          if (res.data.list && Array.isArray(res.data.list) && res.data.list.length > 0) {
            setPopups(res.data.list);
            const activeOne = res.data.list.find((p) => p.isEnabled) || res.data.list[0];
            setSelectedPopupId(activeOne.id);
          } else if (res.data.title) {
            // Single popup fallback
            const single: PopupItem = {
              ...DEFAULT_POPUP,
              ...res.data,
              id: res.data.id || 'popup-default',
              name: res.data.name || 'Default Promotion',
            };
            setPopups([single]);
            setSelectedPopupId(single.id);
          }
        }
      } catch {
        // Fallback default
      } finally {
        setLoading(false);
      }
    }
    loadPopups();
  }, []);

  const handleCreateNewPopup = () => {
    const newId = `popup-${Date.now()}`;
    const newPopup: PopupItem = {
      id: newId,
      name: `Special Offer #${popups.length + 1}`,
      isEnabled: false,
      title: 'Limited-Time Digital Transformation Offer',
      badge: 'SPECIAL PROMOTION',
      description: 'Get an exclusive discount on your next enterprise digital engineering sprint or architecture audit.',
      discountCode: `SAVE-${new Date().getFullYear()}`,
      ctaText: 'Claim Special Offer',
      ctaUrl: '/contact',
      showNewsletterForm: true,
      triggerType: 'timer',
      delaySeconds: 6,
      scrollPercentage: 40,
      imageUrl: '',
      createdAt: new Date().toISOString(),
    };

    setPopups((prev) => [newPopup, ...prev]);
    setSelectedPopupId(newId);
    setSuccessMessage(`Created "${newPopup.name}". You can now customize and save it.`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleDuplicatePopup = (popupToDup: PopupItem) => {
    const newId = `popup-${Date.now()}`;
    const duplicated: PopupItem = {
      ...popupToDup,
      id: newId,
      name: `${popupToDup.name} (Copy)`,
      isEnabled: false,
      createdAt: new Date().toISOString(),
    };
    setPopups((prev) => [duplicated, ...prev]);
    setSelectedPopupId(newId);
    setSuccessMessage(`Duplicated "${popupToDup.name}".`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeletePopup = async (id: string, name: string) => {
    if (popups.length <= 1) {
      setErrorMessage('You must keep at least one popup template.');
      setTimeout(() => setErrorMessage(null), 3500);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await apiClient(`/admin/settings/popups/${id}`, { method: 'DELETE' });
    } catch {
      // Local fallback
    }

    const updated = popups.filter((p) => p.id !== id);
    setPopups(updated);
    if (selectedPopupId === id) {
      setSelectedPopupId(updated[0].id);
    }
    setSuccessMessage(`Deleted "${name}".`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);

      // Save full list
      await apiClient('/admin/settings/popups', {
        method: 'PUT',
        body: {
          list: popups,
          ...selectedPopup,
        },
      });

      setSuccessMessage('All promotional popups and campaign offers saved successfully.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch {
      setSuccessMessage('Popups updated in workspace.');
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

  const activePopupsCount = popups.filter((p) => p.isEnabled).length;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Promotional &amp; Newsletter Popups
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Build and manage high-converting modal popups for special discounts, architecture consultations, and newsletter lead capture.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={handleCreateNewPopup}
            variant="outline"
            className="rounded-full border-[#663399]/60 text-white hover:bg-[#663399]/20"
          >
            <Plus className="w-4 h-4 mr-1.5 text-[#D9F45F]" />
            Create New Popup
          </Button>

          <Button
            onClick={() => handleSave()}
            disabled={saving}
            variant="primary"
            className="rounded-full shadow-lg shadow-[#663399]/20"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
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

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Popups Selector Carousel / Cards */}
      <Card>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D9F45F]" />
            Your Promotional Campaigns ({popups.length})
          </CardTitle>
          <span className="text-[11px] font-mono text-white/50">
            {activePopupsCount} Live on Website
          </span>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popups.map((p) => {
              const isSelected = p.id === selectedPopup.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPopupId(p.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between gap-3 relative ${
                    isSelected
                      ? 'bg-[#663399]/20 border-[#663399] shadow-lg shadow-[#663399]/15'
                      : 'bg-[#151414] border-[#2A2B28] hover:border-[#663399]/50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant={p.isEnabled ? 'success' : 'warning'} className="text-[10px] py-0 px-2">
                        {p.isEnabled ? 'Live' : 'Draft'}
                      </Badge>
                      <span className="text-[10px] text-white/40 uppercase font-mono">
                        {p.triggerType}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white truncate" title={p.name}>
                      {p.name || 'Untitled Offer'}
                    </h4>
                    <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">
                      {p.title}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#2A2B28]/80 text-[11px]">
                    <span className="text-white/40 text-[10px] font-mono">
                      {p.discountCode ? `Code: ${p.discountCode}` : 'Lead Capture'}
                    </span>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleDuplicatePopup(p)}
                        className="text-white/40 hover:text-white p-1"
                        title="Duplicate Popup"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePopup(p.id, p.name)}
                        className="text-rose-400 hover:text-rose-300 p-1"
                        title="Delete Popup"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Controls (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* Campaign Identification */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Popup Identity &amp; Status</span>
                <Badge variant={selectedPopup.isEnabled ? 'success' : 'warning'}>
                  {selectedPopup.isEnabled ? 'Currently Active' : 'Disabled / Draft'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Campaign / Offer Name (Internal Label) *
                </label>
                <Input
                  type="text"
                  required
                  value={selectedPopup.name}
                  onChange={(e) => updateSelectedPopup({ name: e.target.value })}
                  placeholder="e.g. Q4 Cloud Engineering Consultation Promo"
                />
              </div>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#151414] border border-[#2A2B28] cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Enable this popup on public website</div>
                  <div className="text-[11px] text-white/50">
                    When active, public visitors will see this popup based on the trigger below.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedPopup.isEnabled}
                  onChange={(e) => updateSelectedPopup({ isEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-[#663399] bg-[#1C1B1B] border-[#2A2B28]"
                />
              </label>
            </CardContent>
          </Card>

          {/* Trigger Settings */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D9F45F]" />
                Display &amp; Trigger Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-2">
                  Trigger Mechanism
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => updateSelectedPopup({ triggerType: 'timer' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition ${
                      selectedPopup.triggerType === 'timer'
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
                    onClick={() => updateSelectedPopup({ triggerType: 'scroll' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition ${
                      selectedPopup.triggerType === 'scroll'
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
                    onClick={() => updateSelectedPopup({ triggerType: 'exit' })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition ${
                      selectedPopup.triggerType === 'exit'
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

              {selectedPopup.triggerType === 'timer' && (
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Display Delay (Seconds)
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={selectedPopup.delaySeconds}
                    onChange={(e) =>
                      updateSelectedPopup({ delaySeconds: parseInt(e.target.value) || 5 })
                    }
                  />
                </div>
              )}

              {selectedPopup.triggerType === 'scroll' && (
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Trigger at Page Scroll Percentage (1 - 99%)
                  </label>
                  <Input
                    type="number"
                    min={5}
                    max={95}
                    value={selectedPopup.scrollPercentage}
                    onChange={(e) =>
                      updateSelectedPopup({ scrollPercentage: parseInt(e.target.value) || 30 })
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
                  {selectedPopup.imageUrl && (
                    <button
                      type="button"
                      onClick={() => updateSelectedPopup({ imageUrl: '' })}
                      className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-normal"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove Image
                    </button>
                  )}
                </label>

                {selectedPopup.imageUrl ? (
                  <div className="relative aspect-[16/7] w-full rounded-2xl overflow-hidden border border-[#2A2B28] bg-[#151414] group mb-2">
                    <img
                      src={selectedPopup.imageUrl}
                      alt="Popup preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateSelectedPopup({ imageUrl: '' })}
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
                  value={selectedPopup.imageUrl || ''}
                  onChange={(e) => updateSelectedPopup({ imageUrl: e.target.value })}
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
                    value={selectedPopup.badge}
                    onChange={(e) => updateSelectedPopup({ badge: e.target.value })}
                    placeholder="e.g. SPECIAL OFFER"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Discount / Promo Code (Optional)
                  </label>
                  <Input
                    type="text"
                    value={selectedPopup.discountCode || ''}
                    onChange={(e) => updateSelectedPopup({ discountCode: e.target.value })}
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
                  value={selectedPopup.title}
                  onChange={(e) => updateSelectedPopup({ title: e.target.value })}
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
                  value={selectedPopup.description}
                  onChange={(e) => updateSelectedPopup({ description: e.target.value })}
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
                    value={selectedPopup.ctaText}
                    onChange={(e) => updateSelectedPopup({ ctaText: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    CTA Link URL *
                  </label>
                  <Input
                    type="text"
                    required
                    value={selectedPopup.ctaUrl}
                    onChange={(e) => updateSelectedPopup({ ctaUrl: e.target.value })}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80 pt-2 border-t border-[#2A2B28]">
                <input
                  type="checkbox"
                  checked={selectedPopup.showNewsletterForm}
                  onChange={(e) => updateSelectedPopup({ showNewsletterForm: e.target.checked })}
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
              Visitor View Preview ({selectedPopup.name})
            </span>
            <span className="text-[10px] font-mono text-white/40">Auto-updates</span>
          </div>

          {/* Modal Mockup Container */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#241a2e] to-[#1C1B1B] border border-[#663399]/60 shadow-2xl relative overflow-hidden">
            {/* Close Button: anchored top-right with high z-index and backdrop blur */}
            <span className="absolute top-3.5 right-3.5 z-50 w-7 h-7 rounded-full bg-black/80 hover:bg-black backdrop-blur-md border border-white/25 flex items-center justify-center text-white/90 text-xs shadow-xl cursor-default">
              ✕
            </span>

            {/* Custom Image Banner or Badge */}
            {selectedPopup.imageUrl ? (
              <div className="w-full relative aspect-[16/7] overflow-hidden border-b border-[#2A2B28] bg-[#151414]">
                <img src={selectedPopup.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#151414]/90 backdrop-blur-md text-[#D9F45F] border border-[#2A2B28]">
                  <Sparkles className="w-3 h-3" />
                  <span>{selectedPopup.badge || 'PROMOTION'}</span>
                </div>
              </div>
            ) : (
              <div className="px-6 sm:px-8 pt-6 sm:pt-8">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D9F45F]/15 text-[#D9F45F] border border-[#D9F45F]/30 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {selectedPopup.badge || 'PROMOTION'}
                </span>
              </div>
            )}

            <div className="p-6 sm:p-8 pt-4 space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight pr-8">
                {selectedPopup.title || 'Enter High-Impact Headline'}
              </h3>

            <p className="text-xs text-white/70 leading-relaxed">
              {selectedPopup.description || 'Describe the value proposition or discount for your visitor.'}
            </p>

            {selectedPopup.discountCode && (
              <div className="p-2.5 rounded-xl bg-[#151414] border border-dashed border-[#D9F45F]/50 flex items-center justify-between">
                <span className="text-[11px] text-white/60 font-mono">Voucher Code:</span>
                <span className="text-xs font-mono font-bold text-[#D9F45F] tracking-wider">
                  {selectedPopup.discountCode}
                </span>
              </div>
            )}

            {selectedPopup.showNewsletterForm && (
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
                <span>{selectedPopup.ctaText || 'Get Started'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
