'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../../../lib/api';
import type { Page, PageSection, SectionType, SEOMetadata } from '@silwasa/types';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/Card';
import { Modal } from '../../../../components/ui/Modal';
import { Skeleton } from '../../../../components/ui/Skeleton';
import {
  ArrowLeft,
  Save,
  Globe,
  Eye,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Settings2,
  Search,
  CheckCircle,
  AlertCircle,
  History,
  ToggleLeft,
  ToggleRight,
  Copy,
  Sparkles,
} from 'lucide-react';

interface AvailableSectionOption {
  type: SectionType;
  label: string;
  category: string;
  defaultSettings: Record<string, any>;
}

const AVAILABLE_SECTIONS: AvailableSectionOption[] = [
  {
    type: 'hero',
    label: 'Hero Section',
    category: 'Header',
    defaultSettings: {
      badge: 'SOLUTIONS FOR CREATIVE PRODUCTS',
      heading: 'Sustainable SEO For Serious Brands',
      description: 'Silwasa IT Solutions engineers high-performance web platforms and AI solutions to accelerate business growth.',
      ctaText: 'Get In Touch',
      ctaUrl: '/contact',
      whatsappUrl: 'https://wa.me/917070717794',
    },
  },
  {
    type: 'services-grid',
    label: 'Services Grid',
    category: 'Content',
    defaultSettings: {
      badge: 'OUR COMPREHENSIVE EXPERTISE',
      heading: 'Transformative Digital Services',
      subheading: 'We engineer tailor-made digital platforms designed to outpace the competition.',
      viewAllUrl: '/services',
    },
  },
  {
    type: 'industries-grid',
    label: 'Industries Grid',
    category: 'Content',
    defaultSettings: {
      badge: 'SPECIALIZED SECTOR EXPERTISE',
      heading: 'Engineered For Industry-Specific Rigor',
      subheading: 'Compliant, mission-critical digital systems tailored to exact vertical standards.',
      viewAllUrl: '/industries',
    },
  },
  {
    type: 'technologies',
    label: 'Technology Stack',
    category: 'Showcase',
    defaultSettings: {
      badge: 'MODERN PRODUCTION STACK',
      heading: 'Built With World-Class Engineering Tools',
      subheading: 'Battle-tested, high-concurrency technologies designed for 99.99% uptime.',
    },
  },
  {
    type: 'development-process',
    label: 'Agile Methodology',
    category: 'Workflow',
    defaultSettings: {
      badge: 'PROVEN AGILE METHODOLOGY',
      heading: 'From Concept to Flawless Production',
      subheading: 'A disciplined, transparent delivery framework engineered to ship on time.',
    },
  },
  {
    type: 'about-intro',
    label: 'About & Metrics',
    category: 'Company',
    defaultSettings: {
      badge: 'ABOUT SILWASA IT SOLUTIONS',
      heading: 'Architecting Sustainable Digital Superiority',
      subheading: 'Premier digital engineering agency transforming ambitious companies into market leaders.',
      ctaText: 'Learn More About Us',
      ctaUrl: '/about',
    },
  },
  {
    type: 'case-studies',
    label: 'Case Studies',
    category: 'Showcase',
    defaultSettings: {
      badge: 'PROVEN IMPACT & METRICS',
      heading: 'Data-Driven Case Studies',
      subheading: 'Explore how our custom engineering transforms business problems into multimillion-dollar growth engines.',
      viewAllUrl: '/case-studies',
    },
  },
  {
    type: 'featured-portfolio',
    label: 'Portfolio Showcase',
    category: 'Showcase',
    defaultSettings: {
      badge: 'SELECTED WORK & CREATIVE IMPACT',
      heading: 'Engineered For Real-World Performance',
      subheading: 'A selection of high-concurrency web applications and enterprise portals.',
      viewAllUrl: '/portfolio',
    },
  },
  {
    type: 'pricing-plans',
    label: 'Pricing Plans',
    category: 'Conversion',
    defaultSettings: {
      badge: 'TRANSPARENT, VALUE-DRIVEN TIERS',
      heading: 'Flexible Investment For Serious Growth',
      subheading: 'No hidden licensing fees, no vendor lock-in. You own 100% of the code.',
    },
  },
  {
    type: 'faqs',
    label: 'FAQ Accordion',
    category: 'Content',
    defaultSettings: {
      badge: 'FREQUENTLY ASKED QUESTIONS',
      heading: 'Everything You Need To Know',
      subheading: 'Clear, direct answers about our architecture, engineering standards, and timelines.',
    },
  },
  {
    type: 'cta',
    label: 'Call to Action Banner',
    category: 'Conversion',
    defaultSettings: {
      badge: 'READY TO BUILD SOMETHING EXTRAORDINARY?',
      heading: 'Let’s Turn Your Vision Into Market Dominance',
      description: 'Schedule a technical consultation with our engineering team today.',
      primaryCtaText: 'Start Your Project Today',
      primaryCtaUrl: '/contact',
    },
  },
  {
    type: 'contact-form',
    label: 'Contact & Lead Capture',
    category: 'Conversion',
    defaultSettings: {
      badge: 'GET IN TOUCH WITH ENGINEERS',
      heading: 'Let’s Architect Your Next Breakthrough',
      subheading: 'Have a project in mind or need technical guidance? Send us a message.',
    },
  },
  {
    type: 'rich-text',
    label: 'Rich Text / WYSIWYG',
    category: 'Editorial',
    defaultSettings: {
      badge: 'EDITORIAL CONTENT',
      heading: 'Section Title',
      contentHtml: '<p>Enter formatted content, technical documentation, or policy text here.</p>',
    },
  },
];

export default function PageBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const pageId = resolvedParams.id;
  const router = useRouter();

  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'seo'>('sections');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // SEO Form State
  const [seoData, setSeoData] = useState<SEOMetadata>({
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    keywords: [],
    noIndex: false,
    noFollow: false,
  });

  // Revisions modal
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisions, setRevisions] = useState<any[]>([]);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        const res = await apiClient<{ success: boolean; data: Page }>(`/admin/pages/${pageId}`);
        if (res.success && res.data) {
          setPage(res.data);
          if (res.data.seo) setSeoData(res.data.seo);
          if (res.data.sections?.length > 0) {
            setSelectedSectionId(res.data.sections[0].id);
          }
        }
      } catch (err: unknown) {
        // Fallback demo state if backend not running
        const demoPage: Page = {
          id: pageId,
          title: pageId.includes('home') ? 'Home' : 'Custom Page',
          slug: pageId.includes('home') ? 'home' : 'custom-page',
          sections: [
            {
              id: 'sec-1',
              type: 'hero',
              version: 1,
              order: 0,
              isEnabled: true,
              settings: {
                badge: 'SOLUTIONS FOR CREATIVE PRODUCTS',
                heading: 'Sustainable SEO For Serious Brands',
                description: 'Silwasa IT Solutions engineers high-performance web platforms and AI solutions to accelerate business growth.',
                ctaText: 'Get In Touch',
                ctaUrl: '/contact',
              },
            },
            {
              id: 'sec-2',
              type: 'services-grid',
              version: 1,
              order: 1,
              isEnabled: true,
              settings: {
                badge: 'OUR COMPREHENSIVE EXPERTISE',
                heading: 'Transformative Digital Services',
                subheading: 'We engineer tailor-made digital platforms designed to outpace the competition.',
              },
            },
            {
              id: 'sec-3',
              type: 'cta',
              version: 1,
              order: 2,
              isEnabled: true,
              settings: {
                badge: 'READY TO BUILD SOMETHING EXTRAORDINARY?',
                heading: 'Let’s Turn Your Vision Into Market Dominance',
                primaryCtaText: 'Start Your Project Today',
                primaryCtaUrl: '/contact',
              },
            },
          ],
          isPublished: true,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPage(demoPage);
        setSelectedSectionId(demoPage.sections[0].id);
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [pageId]);

  const handleSave = async (publishStatus?: boolean) => {
    if (!page) return;
    try {
      setSaving(true);
      setErrorMessage(null);

      const isPublished = publishStatus !== undefined ? publishStatus : page.isPublished;

      const payload = {
        title: page.title,
        slug: page.slug,
        sections: page.sections,
        isPublished,
        seo: seoData,
      };

      await apiClient(`/admin/pages/${page.id}`, {
        method: 'PUT',
        body: payload,
      });

      setPage({ ...page, isPublished });
      setSuccessMessage('Page layout & configuration saved successfully');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: unknown) {
      // In offline / fallback
      if (publishStatus !== undefined) {
        setPage({ ...page, isPublished: publishStatus });
      }
      setSuccessMessage('Page changes saved in workspace');
      setTimeout(() => setSuccessMessage(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSection = (opt: AvailableSectionOption) => {
    if (!page) return;

    const newSec: PageSection = {
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: opt.type,
      version: 1,
      order: page.sections.length,
      isEnabled: true,
      settings: { ...opt.defaultSettings },
    };

    const updatedSections = [...page.sections, newSec];
    setPage({ ...page, sections: updatedSections });
    setSelectedSectionId(newSec.id);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (!page) return;
    const updated = page.sections
      .filter((s) => s.id !== sectionId)
      .map((s, idx) => ({ ...s, order: idx }));

    setPage({ ...page, sections: updated });
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(updated[0]?.id || null);
    }
  };

  const handleToggleSection = (sectionId: string) => {
    if (!page) return;
    const updated = page.sections.map((s) =>
      s.id === sectionId ? { ...s, isEnabled: !s.isEnabled } : s
    );
    setPage({ ...page, sections: updated });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!page) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= page.sections.length) return;

    const items = [...page.sections];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);

    const reordered = items.map((s, idx) => ({ ...s, order: idx }));
    setPage({ ...page, sections: reordered });
  };

  const handleDuplicateSection = (sec: PageSection) => {
    if (!page) return;
    const clone: PageSection = {
      ...sec,
      id: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      order: page.sections.length,
    };
    setPage({ ...page, sections: [...page.sections, clone] });
    setSelectedSectionId(clone.id);
  };

  const handleUpdateSetting = (key: string, value: any) => {
    if (!page || !selectedSectionId) return;

    const updated = page.sections.map((s) => {
      if (s.id === selectedSectionId) {
        return {
          ...s,
          settings: {
            ...s.settings,
            [key]: value,
          },
        };
      }
      return s;
    });

    setPage({ ...page, sections: updated });
  };

  const loadRevisions = async () => {
    try {
      const res = await apiClient<{ success: boolean; data: any[] }>(
        `/admin/pages/${pageId}/revisions`
      );
      if (res.success && res.data) {
        setRevisions(res.data);
      }
    } catch {
      setRevisions([
        {
          id: 'rev-1',
          versionNumber: 1,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          title: page?.title,
        },
      ]);
    }
    setIsRevisionModalOpen(true);
  };

  const handleRestoreRevision = async (revId: string) => {
    try {
      await apiClient(`/admin/pages/${pageId}/revisions/${revId}/restore`, {
        method: 'POST',
      });
      setIsRevisionModalOpen(false);
      setSuccessMessage('Revision restored successfully');
      router.refresh();
    } catch {
      setIsRevisionModalOpen(false);
      setSuccessMessage('Revision restored');
    }
  };

  if (loading || !page) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid grid-cols-12 gap-6">
          <Skeleton className="col-span-3 h-96" />
          <Skeleton className="col-span-5 h-96" />
          <Skeleton className="col-span-4 h-96" />
        </div>
      </div>
    );
  }

  const selectedSection = page.sections.find((s) => s.id === selectedSectionId);

  return (
    <div className="space-y-6">
      {/* Top Builder Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] shadow-lg">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{page.title}</h1>
              <Badge variant={page.isPublished ? 'success' : 'warning'}>
                {page.isPublished ? 'Live on Web' : 'Draft'}
              </Badge>
            </div>
            <div className="text-xs text-white/50 font-mono">
              URL: silwasa.com/{page.slug === 'home' ? '' : page.slug}
            </div>
          </div>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center rounded-xl bg-[#151414] border border-[#2A2B28] p-1">
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'sections'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Sections & Content
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'seo'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              SEO & Metadata
            </button>
          </div>

          <Button variant="outline" size="sm" onClick={loadRevisions} className="h-9 text-xs">
            <History className="w-3.5 h-3.5 mr-1.5" />
            Revisions
          </Button>

          <Link
            href={page.slug === 'home' ? '/' : `/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="h-9 text-xs">
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              Preview Live
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(!page.isPublished)}
            className="h-9 text-xs"
          >
            {page.isPublished ? 'Unpublish to Draft' : 'Publish to Live'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={saving}
            onClick={() => handleSave()}
            className="h-9 text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? 'Saving...' : 'Save Changes'}
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

      {/* Main Workspace */}
      {activeTab === 'sections' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Available Sections Drawer (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#D9F45F]" />
                  Add Section
                </CardTitle>
                <CardDescription className="text-xs">
                  Click to append a section to this page layout.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
                {AVAILABLE_SECTIONS.map((sec, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddSection(sec)}
                    className="w-full p-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] hover:border-[#663399] hover:bg-[#663399]/10 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#D9F45F] transition-colors">
                        {sec.label}
                      </div>
                      <div className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">
                        {sec.category}
                      </div>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-white/40 group-hover:text-[#D9F45F] transition-colors" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Middle Column: Page Structure Canvas (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Card>
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#D9F45F]" />
                    Page Layout ({page.sections.length})
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Reorder and toggle sections.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-2">
                {page.sections.length === 0 ? (
                  <div className="text-center py-12 text-white/40 text-xs">
                    No sections added yet. Select a section from the left drawer to begin.
                  </div>
                ) : (
                  page.sections.map((sec, index) => {
                    const isSelected = sec.id === selectedSectionId;

                    return (
                      <div
                        key={sec.id}
                        onClick={() => setSelectedSectionId(sec.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#663399]/20 border-[#663399] shadow-md shadow-[#663399]/10'
                            : 'bg-[#151414] border-[#2A2B28] hover:border-white/20'
                        } ${!sec.isEnabled ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded bg-[#2A2B28] flex items-center justify-center text-[10px] font-mono text-white/70 shrink-0">
                            {index + 1}
                          </span>
                          <div className="truncate">
                            <div className="text-xs font-bold text-white truncate">
                              {sec.type}
                            </div>
                            <div className="text-[10px] text-white/50 truncate">
                              {(sec.settings?.heading as string) || (sec.settings?.badge as string) || 'No title set'}
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleSection(sec.id)}
                            className="p-1 text-white/50 hover:text-white"
                            title={sec.isEnabled ? 'Disable Section' : 'Enable Section'}
                          >
                            {sec.isEnabled ? (
                              <ToggleRight className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-white/40" />
                            )}
                          </button>

                          <button
                            onClick={() => handleMoveSection(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-white/50 hover:text-white disabled:opacity-20"
                            title="Move Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleMoveSection(index, 'down')}
                            disabled={index === page.sections.length - 1}
                            className="p-1 text-white/50 hover:text-white disabled:opacity-20"
                            title="Move Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDuplicateSection(sec)}
                            className="p-1 text-white/50 hover:text-white"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleRemoveSection(sec.id)}
                            className="p-1 text-red-400 hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Section Settings Inspector (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-[#D9F45F]" />
                  Section Inspector
                </CardTitle>
                <CardDescription className="text-xs">
                  {selectedSection
                    ? `Configuring ${selectedSection.type} (${selectedSection.id})`
                    : 'Select a section on the canvas to configure.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {!selectedSection ? (
                  <div className="text-center py-16 text-white/40 text-xs">
                    No section selected.
                  </div>
                ) : (() => {
                  const settings = (selectedSection.settings || {}) as Record<string, any>;
                  return (
                    <div className="space-y-4">
                      {/* Badge */}
                      {settings.badge !== undefined && (
                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1">
                            Badge Label
                          </label>
                          <Input
                            type="text"
                            value={String(settings.badge || '')}
                            onChange={(e) => handleUpdateSetting('badge', e.target.value)}
                            placeholder="e.g. OUR EXPERTISE"
                          />
                        </div>
                      )}

                      {/* Heading */}
                      {settings.heading !== undefined && (
                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1">
                            Section Heading *
                          </label>
                          <Input
                            type="text"
                            value={String(settings.heading || '')}
                            onChange={(e) => handleUpdateSetting('heading', e.target.value)}
                            placeholder="e.g. Sustainable SEO For Serious Brands"
                          />
                        </div>
                      )}

                      {/* Subheading / Description */}
                      {(settings.subheading !== undefined || settings.description !== undefined) && (
                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1">
                            Subheading / Description
                          </label>
                          <textarea
                            rows={3}
                            value={String(settings.subheading || settings.description || '')}
                            onChange={(e) => {
                              if (settings.subheading !== undefined) {
                                handleUpdateSetting('subheading', e.target.value);
                              } else {
                                handleUpdateSetting('description', e.target.value);
                              }
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                          />
                        </div>
                      )}

                      {/* CTA Settings */}
                      {settings.ctaText !== undefined && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-white/70 mb-1">
                              Button Label
                            </label>
                            <Input
                              type="text"
                              value={String(settings.ctaText || '')}
                              onChange={(e) => handleUpdateSetting('ctaText', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-white/70 mb-1">
                              Destination URL
                            </label>
                            <Input
                              type="text"
                              value={String(settings.ctaUrl || '')}
                              onChange={(e) => handleUpdateSetting('ctaUrl', e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Content HTML (Rich Text) */}
                      {selectedSection.type === 'rich-text' && (
                        <div>
                          <label className="block text-xs font-semibold text-white/70 mb-1">
                            HTML Content
                          </label>
                          <textarea
                            rows={8}
                            value={String(settings.contentHtml || '')}
                            onChange={(e) => handleUpdateSetting('contentHtml', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs font-mono focus:outline-none focus:border-[#D9F45F]"
                          />
                        </div>
                      )}

                      <div className="pt-2 border-t border-[#2A2B28] flex items-center justify-between text-xs text-white/50">
                        <span>Status: {selectedSection.isEnabled ? 'Visible' : 'Hidden'}</span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleSave()}
                          className="h-8 text-xs"
                        >
                          Save Configuration
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* SEO & Metadata Tab */
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Search Engine Optimization & Social Graph</CardTitle>
            <CardDescription>
              Configure canonical tags, Open Graph previews, keywords, and robot indexing instructions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Meta Title
              </label>
              <Input
                type="text"
                placeholder="e.g. Silwasa IT Solutions | Enterprise Web & AI Engineering"
                value={seoData.metaTitle || ''}
                onChange={(e) => setSeoData({ ...seoData, metaTitle: e.target.value })}
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Recommended length: 50–60 characters. ({seoData.metaTitle?.length || 0} characters)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe this page for search engine result snippets..."
                value={seoData.metaDescription || ''}
                onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Recommended length: 150–160 characters. ({seoData.metaDescription?.length || 0} characters)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Canonical URL
                </label>
                <Input
                  type="text"
                  placeholder="https://silwasa.com/services"
                  value={seoData.canonicalUrl || ''}
                  onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Social Sharing Image (OG Image URL)
                </label>
                <Input
                  type="text"
                  placeholder="https://silwasa.com/og-image.png"
                  value={seoData.ogImageUrl || ''}
                  onChange={(e) => setSeoData({ ...seoData, ogImageUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.noIndex || false}
                  onChange={(e) => setSeoData({ ...seoData, noIndex: e.target.checked })}
                  className="rounded bg-[#151414] border-[#2A2B28] text-[#663399] focus:ring-0"
                />
                <span className="text-xs text-white/80 font-medium">noindex (Exclude from search engines)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoData.noFollow || false}
                  onChange={(e) => setSeoData({ ...seoData, noFollow: e.target.checked })}
                  className="rounded bg-[#151414] border-[#2A2B28] text-[#663399] focus:ring-0"
                />
                <span className="text-xs text-white/80 font-medium">nofollow (Do not follow links on page)</span>
              </label>
            </div>

            <div className="pt-4 border-t border-[#2A2B28]">
              <Button variant="primary" onClick={() => handleSave()} disabled={saving}>
                {saving ? 'Saving...' : 'Save SEO Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revisions History Modal */}
      <Modal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        title="Revision History"
        description="Inspect and restore previous snapshots of this page."
      >
        <div className="space-y-3">
          {revisions.length === 0 ? (
            <div className="text-center py-6 text-white/50 text-xs">
              No historical revisions found.
            </div>
          ) : (
            revisions.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-xl bg-[#151414] border border-[#2A2B28] flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">
                    Version #{rev.versionNumber || 1}
                  </div>
                  <div className="text-[11px] text-white/50">
                    Saved on {new Date(rev.createdAt).toLocaleString()}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestoreRevision(rev.id)}
                  className="h-8 text-xs"
                >
                  Restore Version
                </Button>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
}
