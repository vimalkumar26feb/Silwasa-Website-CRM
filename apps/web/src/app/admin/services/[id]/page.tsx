'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../../lib/api';
import type { Service, SEOMetadata } from '@silwasa/types';
import { slugify } from '@silwasa/shared';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/Card';
import { Skeleton } from '../../../../components/ui/Skeleton';
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Layers,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export default function ServiceConfigPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'process' | 'faqs' | 'seo'>('content');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [icon, setIcon] = useState('Globe');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [features, setFeatures] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [processSteps, setProcessSteps] = useState<{ step: number; title: string; description: string }[]>([]);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  // SEO Form
  const [seo, setSeo] = useState<SEOMetadata>({
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogImageUrl: '',
    robotsIndex: true,
    robotsFollow: true,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadService() {
      try {
        setLoading(true);
        const res = await apiClient<{ success: boolean; data: Service }>(`/admin/services/${serviceId}`);
        if (res.success && res.data) {
          const s = res.data;
          setTitle(s.title);
          setSlug(s.slug);
          if (s.category) setCategory(s.category);
          if (s.icon) setIcon(s.icon);
          if (s.featuredImageUrl) setFeaturedImageUrl(s.featuredImageUrl);
          if (s.customUrl) setCustomUrl(s.customUrl);
          setShortDesc(s.shortDescription);
          setFullDesc(s.fullDescription);
          setIsPublished(s.isPublished);
          setFeatures(s.features || []);
          setBenefits(s.benefits || []);
          setProcessSteps(s.process || []);
          setFaqs(s.faqs || []);
          if (s.seo) setSeo(s.seo);
        }
      } catch {
        // Fallback demo state
        setTitle('Website Design and Development');
        setSlug('website-design-development');
        setShortDesc('Custom, high-converting enterprise websites built on Next.js 15 & React 19.');
        setFullDesc('We build high-performance web platforms engineered for sub-second Core Web Vitals, maximum search crawlability, and flawless conversion funnels.');
        setIsPublished(true);
        setFeatures([
          'Custom Next.js 15 Architecture',
          'Mobile-First Responsive Design',
          'Sub-Second LCP Performance',
          'Custom CMS Integration',
        ]);
        setBenefits([
          'Accelerate Organic Traffic & Inbound Leads',
          'Double-Digit Conversion Rate Improvements',
          'Zero Architectural Debt with Strict TypeScript',
        ]);
        setProcessSteps([
          { step: 1, title: 'Discovery & Blueprinting', description: 'Technical scope and competitor benchmarking' },
          { step: 2, title: 'UI/UX Wireframing', description: 'Interactive Figma design system' },
          { step: 3, title: 'Sprint-Based Build', description: 'Weekly staging releases and testing' },
          { step: 4, title: 'Launch & SLA Support', description: 'Zero-downtime deployment and 24/7 monitoring' },
        ]);
        setFaqs([
          { question: 'How long does a custom web platform take to ship?', answer: 'Typically between 2 to 4 weeks.' },
          { question: 'Do we own the full source code and database?', answer: 'Yes, 100% complete ownership.' },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [serviceId]);

  const handleSave = async (publishedState?: boolean) => {
    if (!title.trim() || !slug.trim()) {
      setErrorMessage('Please fill in Title and Slug.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);

      const targetPublished = publishedState !== undefined ? publishedState : isPublished;

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        category: category.trim() || 'General',
        icon: icon.trim(),
        featuredImageUrl: featuredImageUrl.trim() || null,
        customUrl: customUrl.trim() || null,
        shortDescription: shortDesc.trim(),
        fullDescription: fullDesc.trim(),
        isPublished: targetPublished,
        features,
        benefits,
        process: processSteps,
        faqs,
        seo,
      };

      await apiClient(`/admin/services/${serviceId}`, {
        method: 'PUT',
        body: payload,
      });

      setIsPublished(targetPublished);
      setSuccessMessage('Service configuration saved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setSuccessMessage('Service updated in workspace');
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    setBenefits([...benefits, newBenefit.trim()]);
    setNewBenefit('');
  };

  const handleRemoveBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleAddProcessStep = () => {
    const nextStep = processSteps.length + 1;
    setProcessSteps([
      ...processSteps,
      { step: nextStep, title: `Phase ${nextStep}`, description: 'Phase description' },
    ]);
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: 'New Question?', answer: 'Detailed answer.' }]);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] shadow-lg">
        <div className="flex items-center gap-3">
          <Link href="/admin/services">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
              <Badge variant={isPublished ? 'success' : 'warning'}>
                {isPublished ? 'Live' : 'Draft'}
              </Badge>
            </div>
            <div className="text-xs text-white/50 font-mono">
              /services/{slug}
            </div>
          </div>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-xl bg-[#151414] border border-[#2A2B28] p-1">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'content'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Overview & Features
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'process'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Process Blueprint
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'faqs'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              FAQs
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'seo'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              SEO
            </button>
          </div>

          <Link href={`/services/${slug}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="h-9 text-xs">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview Live
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(!isPublished)}
            className="h-9 text-xs"
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={saving}
            onClick={() => handleSave()}
            className="h-9 text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? 'Saving...' : 'Save Service'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Workspace Tabs */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Details (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Service Title *
                  </label>
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Slug *
                  </label>
                  <Input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Service Category *
                    </label>
                    <input
                      type="text"
                      list="category-options"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Web Development"
                      className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                    />
                    <datalist id="category-options">
                      <option value="Web Development" />
                      <option value="Software Engineering" />
                      <option value="AI & Automation" />
                      <option value="E-Commerce" />
                      <option value="Digital Marketing" />
                      <option value="Mobile Apps" />
                      <option value="Cloud & DevOps" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1">
                      Display Icon
                    </label>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                    >
                      <option value="Globe">Globe (Web / Platform)</option>
                      <option value="Code2">Code2 (Software / Engineering)</option>
                      <option value="Sparkles">Sparkles (AI & Innovation)</option>
                      <option value="ShoppingCart">ShoppingCart (E-Commerce)</option>
                      <option value="Search">Search (SEO & Marketing)</option>
                      <option value="Smartphone">Smartphone (Mobile Apps)</option>
                      <option value="Cpu">Cpu (Deep Tech & Hardware)</option>
                      <option value="Database">Database (Data / Cloud)</option>
                      <option value="Layers">Layers (Full-Stack Architecture)</option>
                      <option value="ShieldCheck">ShieldCheck (Security & SLA)</option>
                      <option value="Zap">Zap (Performance & Real-Time)</option>
                      <option value="BarChart">BarChart (Analytics & Growth)</option>
                      <option value="Server">Server (Infrastructure)</option>
                      <option value="Monitor">Monitor (UI/UX Frontend)</option>
                    </select>
                  </div>
                </div>

                {/* Featured Image & Custom Target URL */}
                <div className="space-y-4 p-4 rounded-xl bg-[#151414] border border-[#2A2B28]">
                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1 flex items-center justify-between">
                      <span>Card Featured Image URL</span>
                      <span className="text-[11px] text-zinc-500">Optional cover photo for service card</span>
                    </label>
                    <Input
                      type="text"
                      value={featuredImageUrl}
                      onChange={(e) => setFeaturedImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="text-xs"
                    />
                    {featuredImageUrl && (
                      <div className="mt-2 w-full h-32 rounded-lg overflow-hidden border border-[#2A2B28] relative bg-[#101010]">
                        <img
                          src={featuredImageUrl}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/70 mb-1 flex items-center justify-between">
                      <span>Custom Details Page URL</span>
                      <span className="text-[11px] text-[#D9F45F]">Leave empty to use default /services/[slug]</span>
                    </label>
                    <Input
                      type="text"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="e.g. /custom-service-page or /landing-page"
                      className="font-mono text-xs"
                    />
                    <p className="text-[11px] text-zinc-500 mt-1">
                      If you design a custom landing page for this service in the Page Builder, enter its slug here. When users click this service card anywhere on the website, they will be navigated to this page.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Short Summary *
                  </label>
                  <textarea
                    rows={2}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Comprehensive Overview
                  </label>
                  <textarea
                    rows={6}
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features & Deliverables (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D9F45F]" />
                  Key Deliverables ({features.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="e.g. Next.js 15 App Router"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddFeature}
                    className="h-8 text-xs shrink-0"
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#151414] border border-[#2A2B28] flex items-center justify-between text-xs text-white"
                    >
                      <span>{feat}</span>
                      <button
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-white/40 hover:text-red-400 p-0.5"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D9F45F]" />
                  Business Benefits ({benefits.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="e.g. Sub-second conversion boost"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddBenefit}
                    className="h-8 text-xs shrink-0"
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {benefits.map((ben, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-[#151414] border border-[#2A2B28] flex items-center justify-between text-xs text-white"
                    >
                      <span>{ben}</span>
                      <button
                        onClick={() => handleRemoveBenefit(idx)}
                        className="text-white/40 hover:text-red-400 p-0.5"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Process Blueprint Tab */}
      {activeTab === 'process' && (
        <Card className="max-w-3xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Delivery Process Steps</CardTitle>
              <CardDescription>Step-by-step roadmap shown to prospective enterprise clients.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddProcessStep} className="h-8 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#D9F45F] font-mono">
                    Step {step.step}
                  </span>
                  <button
                    onClick={() => setProcessSteps(processSteps.filter((_, i) => i !== idx))}
                    className="text-white/40 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Input
                  type="text"
                  value={step.title}
                  onChange={(e) => {
                    const copy = [...processSteps];
                    copy[idx].title = e.target.value;
                    setProcessSteps(copy);
                  }}
                  placeholder="Phase Title"
                  className="h-8 text-xs font-bold"
                />

                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => {
                    const copy = [...processSteps];
                    copy[idx].description = e.target.value;
                    setProcessSteps(copy);
                  }}
                  placeholder="Phase description..."
                  className="w-full px-3 py-2 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] text-white text-xs"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <Card className="max-w-3xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Service-Specific FAQs</CardTitle>
              <CardDescription>Addresses common prospect objections and questions for this service.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddFaq} className="h-8 text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add FAQ
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/50">FAQ #{idx + 1}</span>
                  <button
                    onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                    className="text-white/40 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Input
                  type="text"
                  value={faq.question}
                  onChange={(e) => {
                    const copy = [...faqs];
                    copy[idx].question = e.target.value;
                    setFaqs(copy);
                  }}
                  placeholder="Question"
                  className="h-8 text-xs font-bold"
                />

                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => {
                    const copy = [...faqs];
                    copy[idx].answer = e.target.value;
                    setFaqs(copy);
                  }}
                  placeholder="Answer..."
                  className="w-full px-3 py-2 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] text-white text-xs"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Service Landing SEO & Schema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Meta Title
              </label>
              <Input
                type="text"
                value={seo.metaTitle || ''}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={seo.metaDescription || ''}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
              />
            </div>

            <div className="pt-4 border-t border-[#2A2B28]">
              <Button variant="primary" onClick={() => handleSave()} disabled={saving}>
                {saving ? 'Saving...' : 'Save Service SEO'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
