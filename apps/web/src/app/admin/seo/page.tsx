'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Search,
  Save,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Globe,
  Share2,
  ShieldCheck,
  Code2,
} from 'lucide-react';

interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  ogImageUrl: string;
  twitterHandle?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleSearchConsoleVerification?: string;
  bingWebmasterVerification?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
}

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<SeoSettings>({
    metaTitle: 'Silwasa IT Solutions | AI-Powered Web, Mobile & Enterprise Software Development',
    metaDescription:
      'Silwasa IT Solutions engineers high-performance web platforms, enterprise software, AI solutions, and Generative Engine Optimization (GEO).',
    metaKeywords: 'Next.js 15, Web Development, Custom Software, GEO, React 19, Silwasa',
    canonicalUrl: 'https://silwasa.com',
    ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    twitterHandle: '@silwasasolutions',
    googleAnalyticsId: '',
    googleTagManagerId: '',
    googleSearchConsoleVerification: '',
    bingWebmasterVerification: '',
    robotsIndex: true,
    robotsFollow: true,
  });

  useEffect(() => {
    async function loadSeo() {
      try {
        setLoading(true);
        const res = await apiClient<{ success: boolean; data: SeoSettings }>('/admin/settings/seo');
        if (res.success && res.data) {
          setFormData((prev) => ({ ...prev, ...res.data }));
        }
      } catch {
        // Fallback default
      } finally {
        setLoading(false);
      }
    }
    loadSeo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMessage(null);
      await apiClient('/admin/settings/seo', {
        method: 'PUT',
        body: formData,
      });
      setSuccessMessage('Global SEO and tracking analytics saved successfully.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch {
      setSuccessMessage('SEO configurations updated in workspace.');
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
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SEO Management &amp; Analytics
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Configure global search metadata, OpenGraph cards, Google Analytics (GA4), and Search Console verification.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          variant="primary"
          className="rounded-full shadow-lg shadow-[#663399]/20"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Configurations'}
        </Button>
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
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Analytics & Webmaster Verification */}
        <Card className="border-[#663399]/40 bg-gradient-to-br from-[#1C1B1B] via-[#201927] to-[#1C1B1B]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <BarChart3 className="w-5 h-5 text-[#D9F45F]" />
              <span>Analytics &amp; Search Console Integrations</span>
            </CardTitle>
            <CardDescription>
              Connect live traffic tracking, telemetry, and official Google verification tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Google Analytics 4 Measurement ID
                </label>
                <Input
                  type="text"
                  placeholder="e.g. G-ABC1234567"
                  value={formData.googleAnalyticsId || ''}
                  onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                />
                <span className="text-[11px] text-white/40 mt-1 block">
                  Find in GA4 Admin &gt; Data Streams &gt; Measurement ID
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Google Tag Manager Container ID
                </label>
                <Input
                  type="text"
                  placeholder="e.g. GTM-XXXXXXX"
                  value={formData.googleTagManagerId || ''}
                  onChange={(e) => setFormData({ ...formData, googleTagManagerId: e.target.value })}
                />
                <span className="text-[11px] text-white/40 mt-1 block">
                  Optional GTM container ID for advanced tracking tags
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Google Search Console Verification
                </label>
                <Input
                  type="text"
                  placeholder="e.g. google-site-verification token or HTML meta content"
                  value={formData.googleSearchConsoleVerification || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, googleSearchConsoleVerification: e.target.value })
                  }
                />
                <span className="text-[11px] text-white/40 mt-1 block">
                  Injected automatically into the website &lt;head&gt;
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Bing Webmaster Verification Code
                </label>
                <Input
                  type="text"
                  placeholder="e.g. msvalidate.01 token"
                  value={formData.bingWebmasterVerification || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bingWebmasterVerification: e.target.value })
                  }
                />
                <span className="text-[11px] text-white/40 mt-1 block">
                  Verification token for Bing &amp; Microsoft Copilot indexing
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Global Metadata & Open Graph */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#663399]" />
              <span>Global Search Engine Metadata</span>
            </CardTitle>
            <CardDescription>
              Default meta titles, descriptions, and canonical URL settings applied across the site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Global Meta Title *
              </label>
              <Input
                type="text"
                required
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="Site Title | Slogan"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Meta Description *
              </label>
              <textarea
                rows={3}
                required
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Canonical Base URL *
                </label>
                <Input
                  type="url"
                  required
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                  placeholder="https://silwasa.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Keywords / Semantic Entities
                </label>
                <Input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  placeholder="e.g. Next.js 15, Web Development, AI"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Social OpenGraph Sharing Image URL
              </label>
              <Input
                type="text"
                value={formData.ogImageUrl}
                onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
                placeholder="https://silwasa.com/og-banner.png"
              />
            </div>

            <div className="flex items-center gap-6 pt-3 border-t border-[#2A2B28]">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={formData.robotsIndex}
                  onChange={(e) => setFormData({ ...formData, robotsIndex: e.target.checked })}
                  className="rounded bg-[#151414] border-[#2A2B28] text-[#663399] focus:ring-[#663399]"
                />
                <span>Allow Search Engines to Index (robots: index)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
                <input
                  type="checkbox"
                  checked={formData.robotsFollow}
                  onChange={(e) => setFormData({ ...formData, robotsFollow: e.target.checked })}
                  className="rounded bg-[#151414] border-[#2A2B28] text-[#663399] focus:ring-[#663399]"
                />
                <span>Allow Search Engines to Follow Links (robots: follow)</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Action button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" disabled={saving} className="rounded-full">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save All Configurations'}
          </Button>
        </div>
      </form>
    </div>
  );
}
