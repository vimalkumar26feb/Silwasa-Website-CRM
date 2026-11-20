'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../../../lib/api';
import type { Page, PageSection, SectionType, SEOMetadata, Service } from '@silwasa/types';
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
  Image as ImageIcon,
  Film,
  UploadCloud,
  Link as LinkIcon,
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
      layout: 'split-content',
      fullWidth: false,
      badge: 'SOLUTIONS FOR CREATIVE PRODUCTS',
      heading: 'Sustainable SEO For Serious Brands',
      description: 'Silwasa IT Solutions engineers high-performance web platforms and AI solutions to accelerate business growth.',
      checklist: [
        'Crawlability & Indexing Fixing errors',
        'Identifying exact high-intent queries',
        'Strategically linking high-authority content',
        'Enterprise-grade security and Core Web Vitals',
      ],
      ctaText: 'Get In Touch',
      ctaUrl: '/contact',
      whatsappUrl: 'https://wa.me/917070717794',
      mediaType: 'badge-card',
      satisfiedCustomersCount: '200K+',
    },
  },
  {
    type: 'services-grid',
    label: 'Services (Grid & Carousel)',
    category: 'Content',
    defaultSettings: {
      badge: 'OUR COMPREHENSIVE EXPERTISE',
      heading: 'Transformative Digital Services',
      subheading: 'We engineer tailor-made digital platforms designed to outpace the competition.',
      layout: 'grid',
      desktopColumns: 3,
      mobileColumns: 1,
      selectedCategory: 'All',
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
      selectedServiceId: 'all',
    },
  },
  {
    type: 'testimonials-carousel',
    label: 'Client Testimonials & Reviews',
    category: 'Showcase',
    defaultSettings: {
      badge: 'PROVEN CLIENT EXCELLENCE',
      heading: 'Trusted by Market Leaders',
      subheading: 'What founders, CTOs, and tech leaders say about shipping high-concurrency systems with Silwasa IT Solutions.',
      layout: 'carousel',
      desktopColumns: 3,
      featuredOnly: false,
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
  {
    type: 'image-carousel',
    label: 'Image Carousel & Slider',
    category: 'Media',
    defaultSettings: {
      badge: 'FEATURED GALLERY & PORTFOLIO',
      heading: 'Visual Innovation & Product Showcases',
      subheading: 'Browse high-impact interactive visuals, product architectures, and project highlights.',
      aspectRatio: '16/9',
      autoplay: true,
      autoplayInterval: 5000,
      showArrows: true,
      showDots: true,
      pauseOnHover: true,
      slides: [
        {
          imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop',
          posterUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=20&w=400&auto=format&fit=crop',
          title: 'Enterprise Software & Cloud Platforms',
          caption: 'Architected with Next.js 15, microservices, and 99.99% uptime guarantees.',
          linkUrl: '/services/custom-software-development',
          altText: 'Enterprise software architecture',
        },
        {
          imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop',
          posterUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=20&w=400&auto=format&fit=crop',
          title: 'AI Solutions & Generative Engine Optimization',
          caption: 'Position your enterprise authority directly inside ChatGPT, Claude, and Perplexity AI citations.',
          linkUrl: '/services/ai-solutions-geo',
          altText: 'AI and Generative Engine Optimization',
        },
      ],
    },
  },
  {
    type: 'video-carousel',
    label: 'Video Carousel & Player',
    category: 'Media',
    defaultSettings: {
      badge: 'INTERACTIVE MEDIA & DEMOS',
      heading: 'Technical Demos & Architecture Walkthroughs',
      subheading: 'High-definition video tours, case study breakdowns, and live engineering recordings.',
      aspectRatio: '16/9',
      autoplay: false,
      muted: true,
      loop: true,
      controls: true,
      showArrows: true,
      showDots: true,
      slides: [
        {
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
          title: 'Enterprise AI Architecture & Microservices Delivery',
          description: 'Watch how our lead engineering teams design, test, and ship distributed cloud applications with zero downtime.',
          linkUrl: '/services/custom-software-development',
          ctaText: 'Explore Cloud Services',
        },
      ],
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

  const [uploadingAsset, setUploadingAsset] = useState(false);

  const handleUploadAsset = async (file: File, onUploaded: (url: string) => void) => {
    try {
      setUploadingAsset(true);
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
          onUploaded(json.data.url);
        }
      }
    } catch {
      // Ignore
    } finally {
      setUploadingAsset(false);
    }
  };

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

  // Dynamic services for selector dropdowns
  const [availableServices, setAvailableServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await apiClient<{ success: boolean; data: Service[] }>('/admin/services');
        if (res.success && res.data) {
          setAvailableServices(res.data);
        }
      } catch {
        // Fallback / ignore
      }
    }
    fetchServices();
  }, []);

  const serviceCategories = React.useMemo(() => {
    const cats = new Set<string>();
    availableServices.forEach((s) => {
      if (s.category && s.category.trim()) cats.add(s.category.trim());
    });
    ['Web Development', 'Software Engineering', 'AI & Automation', 'Cloud & DevOps'].forEach((c) => cats.add(c));
    return Array.from(cats);
  }, [availableServices]);

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
      console.error('Failed to save page:', err);
      const msg = err instanceof Error ? err.message : 'Failed to save page configuration';
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 5000);
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

                      {/* Dynamic Hero Configuration */}
                      {(selectedSection.type === 'hero' || selectedSection.type === 'hero-carousel') && (() => {
                        const layoutMode = settings.layout || 'split-content';
                        const checklistItems: string[] = Array.isArray(settings.checklist) ? settings.checklist : [];
                        const imageSlides: any[] = Array.isArray(settings.imageSlides) ? settings.imageSlides : [];
                        const videoSlides: any[] = Array.isArray(settings.videoSlides) ? settings.videoSlides : [];

                        const handleAddChecklistItem = () => {
                          handleUpdateSetting('checklist', [...checklistItems, 'New Key Deliverable / Technical Benefit']);
                        };

                        const handleUpdateChecklistItem = (idx: number, val: string) => {
                          const updated = [...checklistItems];
                          updated[idx] = val;
                          handleUpdateSetting('checklist', updated);
                        };

                        const handleRemoveChecklistItem = (idx: number) => {
                          handleUpdateSetting('checklist', checklistItems.filter((_, i) => i !== idx));
                        };

                        // Image Slides handlers
                        const handleAddImageSlide = () => {
                          const newSlide = {
                            id: `slide-${Date.now()}`,
                            desktopImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop',
                            mobileImage: '',
                            linkUrl: '',
                            openInNewTab: false,
                            altText: '',
                          };
                          handleUpdateSetting('imageSlides', [...imageSlides, newSlide]);
                        };

                        const handleUpdateImageSlide = (idx: number, field: string, val: any) => {
                          const updated = [...imageSlides];
                          updated[idx] = { ...updated[idx], [field]: val };
                          handleUpdateSetting('imageSlides', updated);
                        };

                        const handleRemoveImageSlide = (idx: number) => {
                          handleUpdateSetting('imageSlides', imageSlides.filter((_, i) => i !== idx));
                        };

                        return (
                          <div className="space-y-4 pt-3 border-t border-[#2A2B28]">
                            <div className="flex items-center gap-2 text-xs font-bold text-[#D9F45F] uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Hero Layout &amp; Reusable Structure</span>
                            </div>

                            {/* 1. Layout Mode Selector */}
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-1">
                                Hero Layout Mode
                              </label>
                              <select
                                value={layoutMode}
                                onChange={(e) => handleUpdateSetting('layout', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                              >
                                <option value="split-content">Split Content with Right Media</option>
                                <option value="fullwidth-banner">Full-Width Image Banner</option>
                                <option value="fullwidth-video">Full-Width Video banner</option>
                                <option value="content-only">Minimalist Content Only (Centered)</option>
                              </select>
                            </div>

                            {/* 2. FULL-WIDTH IMAGE BANNER CONFIGURATION */}
                            {layoutMode === 'fullwidth-banner' && (
                              <div className="p-3.5 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-[#2A2B28]">
                                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <ImageIcon className="w-3.5 h-3.5 text-[#D9F45F]" /> Hero Banner Image Settings
                                  </div>
                                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#D9F45F]/10 text-[#D9F45F] border border-[#D9F45F]/30">
                                    Responsive Media
                                  </span>
                                </div>

                                {/* Full Viewport Width Toggle */}
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1B1B] border border-[#2A2B28]">
                                  <div>
                                    <div className="text-xs font-semibold text-white">Full Viewport Width (Zero Margin/Padding)</div>
                                    <div className="text-[10px] text-white/40">Stretch banner to edge-to-edge window width</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSetting('fullWidth', !settings.fullWidth)}
                                    className="text-[#D9F45F] hover:opacity-80 transition"
                                  >
                                    {settings.fullWidth ? (
                                      <ToggleRight className="w-6 h-6 text-[#D9F45F]" />
                                    ) : (
                                      <ToggleLeft className="w-6 h-6 text-white/40" />
                                    )}
                                  </button>
                                </div>

                                {/* Dark Contrast Overlay Toggle */}
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1B1B] border border-[#2A2B28]">
                                  <div>
                                    <div className="text-xs font-semibold text-white">Dark Contrast Overlay</div>
                                    <div className="text-[10px] text-white/40">Luxury gradient overlay for high text readability</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSetting('overlay', settings.overlay === false ? true : false)}
                                    className="text-[#D9F45F] hover:opacity-80 transition"
                                  >
                                    {settings.overlay !== false ? (
                                      <ToggleRight className="w-6 h-6 text-[#D9F45F]" />
                                    ) : (
                                      <ToggleLeft className="w-6 h-6 text-white/40" />
                                    )}
                                  </button>
                                </div>

                                {/* Carousel Mode Toggle */}
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1B1B] border border-[#2A2B28]">
                                  <div>
                                    <div className="text-xs font-semibold text-white">Enable Multi-Image Carousel</div>
                                    <div className="text-[10px] text-white/40">Add multiple sliding banners with individual links</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSetting('isCarousel', !settings.isCarousel)}
                                    className="text-[#D9F45F] hover:opacity-80 transition"
                                  >
                                    {settings.isCarousel ? (
                                      <ToggleRight className="w-6 h-6 text-[#D9F45F]" />
                                    ) : (
                                      <ToggleLeft className="w-6 h-6 text-white/40" />
                                    )}
                                  </button>
                                </div>

                                {/* SINGLE IMAGE BANNER MODE */}
                                {!settings.isCarousel ? (
                                  <div className="space-y-3 pt-1">
                                    <div>
                                      <label className="block text-xs text-white/70 mb-1">
                                        Desktop Banner Image URL * (Shown on desktop)
                                      </label>
                                      <Input
                                        type="text"
                                        value={String(settings.desktopImageUrl || settings.imageUrl || '')}
                                        onChange={(e) => {
                                          handleUpdateSetting('desktopImageUrl', e.target.value);
                                          handleUpdateSetting('imageUrl', e.target.value);
                                        }}
                                        placeholder="https://images.unsplash.com/... or /uploads/..."
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-xs text-white/70 mb-1">
                                        Mobile Banner Image URL (Optional - Fallback to desktop image on mobile)
                                      </label>
                                      <Input
                                        type="text"
                                        value={String(settings.mobileImageUrl || '')}
                                        onChange={(e) => handleUpdateSetting('mobileImageUrl', e.target.value)}
                                        placeholder="https://images.unsplash.com/... (if empty, uses desktop image)"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs text-white/70 mb-1">Banner Click Link (Optional)</label>
                                        <Input
                                          type="text"
                                          value={String(settings.bannerLinkUrl || '')}
                                          onChange={(e) => handleUpdateSetting('bannerLinkUrl', e.target.value)}
                                          placeholder="/services or https://..."
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-white/70 mb-1">Image Alt Text</label>
                                        <Input
                                          type="text"
                                          value={String(settings.imageAlt || '')}
                                          onChange={(e) => handleUpdateSetting('imageAlt', e.target.value)}
                                          placeholder="SEO Alt text"
                                        />
                                      </div>
                                    </div>

                                    <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer pt-1">
                                      <input
                                        type="checkbox"
                                        checked={Boolean(settings.bannerLinkOpenInNewTab)}
                                        onChange={(e) => handleUpdateSetting('bannerLinkOpenInNewTab', e.target.checked)}
                                        className="rounded"
                                      />
                                      <span>Open link in new browser tab</span>
                                    </label>
                                  </div>
                                ) : (
                                  /* MULTI-IMAGE CAROUSEL MODE */
                                  <div className="space-y-3 pt-1">
                                    <div className="flex items-center justify-between">
                                      <div className="text-xs font-semibold text-white">Carousel Slides ({imageSlides.length})</div>
                                      <Button variant="ghost" size="sm" onClick={handleAddImageSlide} className="h-7 text-xs text-[#D9F45F]">
                                        <Plus className="w-3 h-3 mr-1" /> Add Slide
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs p-2 rounded-lg bg-[#1C1B1B] border border-[#2A2B28]">
                                      <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={settings.carouselAutoplay !== false}
                                          onChange={(e) => handleUpdateSetting('carouselAutoplay', e.target.checked)}
                                          className="rounded"
                                        />
                                        <span>Autoplay Slides</span>
                                      </label>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-white/60">Interval:</span>
                                        <input
                                          type="number"
                                          min={2}
                                          max={30}
                                          value={Number(settings.carouselInterval) || 5}
                                          onChange={(e) => handleUpdateSetting('carouselInterval', Number(e.target.value))}
                                          className="w-14 px-1.5 py-0.5 rounded bg-[#151414] border border-[#2A2B28] text-white text-xs"
                                        />
                                        <span className="text-white/40">sec</span>
                                      </div>
                                    </div>

                                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                                      {imageSlides.map((slide, sIdx) => (
                                        <div key={slide.id || sIdx} className="p-3 rounded-lg bg-[#1C1B1B] border border-[#2A2B28] space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs font-mono text-[#D9F45F]">Slide #{sIdx + 1}</span>
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveImageSlide(sIdx)}
                                              className="p-1 text-rose-400 hover:bg-rose-500/10 rounded transition"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                          <div>
                                            <label className="block text-[11px] text-white/60 mb-0.5">Desktop Image URL *</label>
                                            <Input
                                              type="text"
                                              value={String(slide.desktopImage || '')}
                                              onChange={(e) => handleUpdateImageSlide(sIdx, 'desktopImage', e.target.value)}
                                              placeholder="https://... desktop banner"
                                              className="text-xs py-1"
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-[11px] text-white/60 mb-0.5">Mobile Image URL (Fallback to desktop)</label>
                                            <Input
                                              type="text"
                                              value={String(slide.mobileImage || '')}
                                              onChange={(e) => handleUpdateImageSlide(sIdx, 'mobileImage', e.target.value)}
                                              placeholder="https://... mobile banner (optional)"
                                              className="text-xs py-1"
                                            />
                                          </div>
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="block text-[11px] text-white/60 mb-0.5">Target Link URL</label>
                                              <Input
                                                type="text"
                                                value={String(slide.linkUrl || '')}
                                                onChange={(e) => handleUpdateImageSlide(sIdx, 'linkUrl', e.target.value)}
                                                placeholder="/services/..."
                                                className="text-xs py-1"
                                              />
                                            </div>
                                            <div className="flex items-end pb-1.5">
                                              <label className="flex items-center gap-1.5 text-[11px] text-white/70 cursor-pointer">
                                                <input
                                                  type="checkbox"
                                                  checked={Boolean(slide.openInNewTab)}
                                                  onChange={(e) => handleUpdateImageSlide(sIdx, 'openInNewTab', e.target.checked)}
                                                  className="rounded"
                                                />
                                                <span>New Tab</span>
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* 3. FULL-WIDTH VIDEO BANNER CONFIGURATION */}
                            {layoutMode === 'fullwidth-video' && (
                              <div className="p-3.5 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-[#2A2B28]">
                                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Film className="w-3.5 h-3.5 text-[#D9F45F]" /> Hero Banner Video Settings
                                  </div>
                                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#D9F45F]/10 text-[#D9F45F] border border-[#D9F45F]/30">
                                    Cross-Browser HTML5
                                  </span>
                                </div>

                                {/* Full Viewport Width Toggle */}
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1B1B] border border-[#2A2B28]">
                                  <div>
                                    <div className="text-xs font-semibold text-white">Full Viewport Width (Zero Margin/Padding)</div>
                                    <div className="text-[10px] text-white/40">Stretch video player to edge-to-edge window width</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSetting('fullWidth', !settings.fullWidth)}
                                    className="text-[#D9F45F] hover:opacity-80 transition"
                                  >
                                    {settings.fullWidth ? (
                                      <ToggleRight className="w-6 h-6 text-[#D9F45F]" />
                                    ) : (
                                      <ToggleLeft className="w-6 h-6 text-white/40" />
                                    )}
                                  </button>
                                </div>

                                {/* Dark Contrast Overlay Toggle */}
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1C1B1B] border border-[#2A2B28]">
                                  <div>
                                    <div className="text-xs font-semibold text-white">Dark Contrast Overlay</div>
                                    <div className="text-[10px] text-white/40">Soft gradient overlay for text readability over video</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSetting('overlay', settings.overlay === false ? true : false)}
                                    className="text-[#D9F45F] hover:opacity-80 transition"
                                  >
                                    {settings.overlay !== false ? (
                                      <ToggleRight className="w-6 h-6 text-[#D9F45F]" />
                                    ) : (
                                      <ToggleLeft className="w-6 h-6 text-white/40" />
                                    )}
                                  </button>
                                </div>

                                <div>
                                  <label className="block text-xs text-white/70 mb-1">
                                    Desktop Video URL * (MP4 / WebM for Desktop View)
                                  </label>
                                  <Input
                                    type="text"
                                    value={String(settings.desktopVideoUrl || settings.videoUrl || '')}
                                    onChange={(e) => {
                                      handleUpdateSetting('desktopVideoUrl', e.target.value);
                                      handleUpdateSetting('videoUrl', e.target.value);
                                    }}
                                    placeholder="https://.../video.mp4"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs text-white/70 mb-1">
                                    Mobile Video URL (Optional - Fallback to desktop video on mobile)
                                  </label>
                                  <Input
                                    type="text"
                                    value={String(settings.mobileVideoUrl || '')}
                                    onChange={(e) => handleUpdateSetting('mobileVideoUrl', e.target.value)}
                                    placeholder="https://.../mobile-video.mp4"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-white/70 mb-1">Desktop Video Poster Image</label>
                                    <Input
                                      type="text"
                                      value={String(settings.videoPoster || '')}
                                      onChange={(e) => handleUpdateSetting('videoPoster', e.target.value)}
                                      placeholder="https://.../poster.jpg"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-white/70 mb-1">Mobile Poster Image</label>
                                    <Input
                                      type="text"
                                      value={String(settings.mobileVideoPoster || '')}
                                      onChange={(e) => handleUpdateSetting('mobileVideoPoster', e.target.value)}
                                      placeholder="https://.../mobile-poster.jpg"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs text-white/70 mb-1">Video Banner Click Link (Optional)</label>
                                  <Input
                                    type="text"
                                    value={String(settings.videoLinkUrl || '')}
                                    onChange={(e) => handleUpdateSetting('videoLinkUrl', e.target.value)}
                                    placeholder="/contact or https://..."
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                                  <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={settings.videoAutoplay !== false}
                                      onChange={(e) => handleUpdateSetting('videoAutoplay', e.target.checked)}
                                      className="rounded"
                                    />
                                    <span>Autoplay</span>
                                  </label>
                                  <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={settings.videoMuted !== false}
                                      onChange={(e) => handleUpdateSetting('videoMuted', e.target.checked)}
                                      className="rounded"
                                    />
                                    <span>Muted (Required for Autoplay)</span>
                                  </label>
                                  <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={settings.videoLoop !== false}
                                      onChange={(e) => handleUpdateSetting('videoLoop', e.target.checked)}
                                      className="rounded"
                                    />
                                    <span>Loop Playback</span>
                                  </label>
                                  <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(settings.videoControls)}
                                      onChange={(e) => handleUpdateSetting('videoControls', e.target.checked)}
                                      className="rounded"
                                    />
                                    <span>Show Player Controls</span>
                                  </label>
                                </div>
                              </div>
                            )}

                            {/* 4. SPLIT CONTENT RIGHT SIDE MEDIA CONFIGURATION */}
                            {layoutMode === 'split-content' && (
                              <div className="p-3.5 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-[#2A2B28]">
                                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <Layers className="w-3.5 h-3.5 text-[#D9F45F]" /> Right Side Media Type
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-semibold text-white/70 mb-1">
                                    Choose Right Side Media
                                  </label>
                                  <select
                                    value={settings.mediaType || 'badge-card'}
                                    onChange={(e) => handleUpdateSetting('mediaType', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                                  >
                                    <option value="image">Custom Showcase Image (Full Width)</option>
                                    <option value="video">Cross-Browser HTML5 Video Player</option>
                                    <option value="badge-card">Silwasa Tech Badge Card</option>
                                  </select>
                                </div>

                                {/* Custom Showcase Image Options */}
                                {settings.mediaType === 'image' && (
                                  <div className="space-y-3 pt-1">
                                    <div>
                                      <label className="block text-xs text-white/70 mb-1">
                                        Desktop Showcase Image URL * (Full Width in Column)
                                      </label>
                                      <Input
                                        type="text"
                                        value={String(settings.rightImageUrl || settings.imageUrl || '')}
                                        onChange={(e) => {
                                          handleUpdateSetting('rightImageUrl', e.target.value);
                                          handleUpdateSetting('imageUrl', e.target.value);
                                        }}
                                        placeholder="https://images.unsplash.com/..."
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-white/70 mb-1">
                                        Mobile Showcase Image URL (Optional - Fallback to desktop)
                                      </label>
                                      <Input
                                        type="text"
                                        value={String(settings.rightImageMobileUrl || '')}
                                        onChange={(e) => handleUpdateSetting('rightImageMobileUrl', e.target.value)}
                                        placeholder="https://images.unsplash.com/... (optional)"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs text-white/70 mb-1">Image Alt Text</label>
                                        <Input
                                          type="text"
                                          value={String(settings.rightImageAlt || settings.imageAlt || '')}
                                          onChange={(e) => handleUpdateSetting('rightImageAlt', e.target.value)}
                                          placeholder="Alt description"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-white/70 mb-1">Image Click Link (Optional)</label>
                                        <Input
                                          type="text"
                                          value={String(settings.rightImageLink || '')}
                                          onChange={(e) => handleUpdateSetting('rightImageLink', e.target.value)}
                                          placeholder="/portfolio or https://..."
                                        />
                                      </div>
                                    </div>
                                    <p className="text-[11px] text-white/40 italic">
                                      Showcase image renders full width within the right column with responsive rounded corners and subtle hover zoom.
                                    </p>
                                  </div>
                                )}

                                {/* Video Options */}
                                {settings.mediaType === 'video' && (
                                  <div className="space-y-3 pt-1">
                                    <div>
                                      <label className="block text-xs text-white/70 mb-1">MP4 / WebM Video URL *</label>
                                      <Input
                                        type="text"
                                        value={String(settings.videoUrl || '')}
                                        onChange={(e) => handleUpdateSetting('videoUrl', e.target.value)}
                                        placeholder="https://.../video.mp4"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-white/70 mb-1">Video Poster / Thumbnail URL</label>
                                      <Input
                                        type="text"
                                        value={String(settings.videoPoster || '')}
                                        onChange={(e) => handleUpdateSetting('videoPoster', e.target.value)}
                                        placeholder="https://.../thumbnail.jpg"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={settings.videoAutoplay !== false}
                                          onChange={(e) => handleUpdateSetting('videoAutoplay', e.target.checked)}
                                          className="rounded"
                                        />
                                        <span>Autoplay</span>
                                      </label>
                                      <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={settings.videoMuted !== false}
                                          onChange={(e) => handleUpdateSetting('videoMuted', e.target.checked)}
                                          className="rounded"
                                        />
                                        <span>Muted</span>
                                      </label>
                                      <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={settings.videoLoop !== false}
                                          onChange={(e) => handleUpdateSetting('videoLoop', e.target.checked)}
                                          className="rounded"
                                        />
                                        <span>Loop Playback</span>
                                      </label>
                                      <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={Boolean(settings.videoControls)}
                                          onChange={(e) => handleUpdateSetting('videoControls', e.target.checked)}
                                          className="rounded"
                                        />
                                        <span>Show Controls</span>
                                      </label>
                                    </div>
                                  </div>
                                )}

                                {/* Badge Card Info */}
                                {settings.mediaType === 'badge-card' && (
                                  <p className="text-[11px] text-white/50 italic p-2.5 rounded-lg bg-[#1C1B1B] border border-[#2A2B28]">
                                    Displays the signature Silwasa IT Solutions geometric brand badge card with glowing ambient backdrop.
                                  </p>
                                )}
                              </div>
                            )}

                            {/* 5. DYNAMIC CHECKLIST (For split-content & content-only) */}
                            {(layoutMode === 'split-content' || layoutMode === 'content-only') && (
                              <div className="space-y-2 pt-2">
                                <div className="flex items-center justify-between">
                                  <label className="text-xs font-semibold text-white/70">
                                    Key Bullet Points / Guarantee Checklist ({checklistItems.length})
                                  </label>
                                  <Button variant="ghost" size="sm" onClick={handleAddChecklistItem} className="h-7 text-xs text-[#D9F45F]">
                                    <Plus className="w-3 h-3 mr-1" /> Add Point
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {checklistItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <Input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleUpdateChecklistItem(idx, e.target.value)}
                                        placeholder="Checklist point..."
                                        className="text-xs py-1.5"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveChecklistItem(idx)}
                                        className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* 6. SECONDARY BUTTONS & SOCIAL PROOF */}
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <div>
                                <label className="block text-xs font-semibold text-white/70 mb-1">WhatsApp CTA Link</label>
                                <Input
                                  type="text"
                                  value={String(settings.whatsappUrl || '')}
                                  onChange={(e) => handleUpdateSetting('whatsappUrl', e.target.value)}
                                  placeholder="https://wa.me/91..."
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-white/70 mb-1">Satisfied Customers Count</label>
                                <Input
                                  type="text"
                                  value={String(settings.satisfiedCustomersCount || '')}
                                  onChange={(e) => handleUpdateSetting('satisfiedCustomersCount', e.target.value)}
                                  placeholder="e.g. 200K+"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Dynamic Services Configuration */}
                      {(selectedSection.type === 'services-grid' || selectedSection.type === 'featured-services') && (
                        <div className="space-y-4 pt-3 border-t border-[#2A2B28]">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#D9F45F] uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Services Layout & Filters</span>
                          </div>

                          {/* Layout & Category */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-1">
                                Display Layout
                              </label>
                              <select
                                value={settings.layout || 'grid'}
                                onChange={(e) => handleUpdateSetting('layout', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                              >
                                <option value="grid">Grid Layout</option>
                                <option value="carousel">Interactive Carousel</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-1">
                                Service Category
                              </label>
                              <select
                                value={settings.selectedCategory || 'All'}
                                onChange={(e) => handleUpdateSetting('selectedCategory', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                              >
                                <option value="All">All Categories (Show Everything)</option>
                                {serviceCategories.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Column count */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-1">
                                Desktop Columns
                              </label>
                              <select
                                value={Number(settings.desktopColumns) || 3}
                                onChange={(e) => handleUpdateSetting('desktopColumns', Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                              >
                                <option value={1}>1 Column</option>
                                <option value={2}>2 Columns</option>
                                <option value={3}>3 Columns (Recommended)</option>
                                <option value={4}>4 Columns</option>
                                <option value={5}>5 Columns (Wide)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-1">
                                Mobile Columns
                              </label>
                              <select
                                value={Number(settings.mobileColumns) || 1}
                                onChange={(e) => handleUpdateSetting('mobileColumns', Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                              >
                                <option value={1}>1 Column (Stacked)</option>
                                <option value={2}>2 Columns (Compact)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-white/70 mb-1">
                              "View All Services" Link URL
                            </label>
                            <Input
                              type="text"
                              value={String(settings.viewAllUrl || '/services')}
                              onChange={(e) => handleUpdateSetting('viewAllUrl', e.target.value)}
                              placeholder="/services"
                            />
                          </div>
                        </div>
                      )}

                      {/* Dynamic Pricing Configuration */}
                      {selectedSection.type === 'pricing-plans' && (
                        <div className="space-y-4 pt-3 border-t border-[#2A2B28]">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#D9F45F] uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Pricing Package Filter</span>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-white/70 mb-1">
                              Filter by Associated Service
                            </label>
                            <select
                              value={settings.selectedServiceId || 'all'}
                              onChange={(e) => handleUpdateSetting('selectedServiceId', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                            >
                              <option value="all">All Services (Global Packages)</option>
                              {availableServices.map((srv) => (
                                <option key={srv.id} value={srv.id}>
                                  {srv.title} ({srv.category || 'General'})
                                </option>
                              ))}
                            </select>
                            <p className="mt-1 text-[11px] text-white/40">
                              Choose a specific service to showcase only its custom pricing tiers, or choose "All Services" to display all global offerings.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Dynamic Testimonials Configuration */}
                      {selectedSection.type === 'testimonials-carousel' && (
                        <div className="space-y-4 pt-3 border-t border-[#2A2B28]">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#D9F45F] uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Testimonials Settings</span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-1">
                                Layout Format
                              </label>
                              <select
                                value={settings.layout || 'carousel'}
                                onChange={(e) => handleUpdateSetting('layout', e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                              >
                                <option value="carousel">Interactive Carousel</option>
                                <option value="grid">Grid View</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-white/70 mb-1">
                                Desktop Columns
                              </label>
                              <select
                                value={Number(settings.desktopColumns) || 3}
                                onChange={(e) => handleUpdateSetting('desktopColumns', Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                              >
                                <option value={1}>1 Column</option>
                                <option value={2}>2 Columns</option>
                                <option value={3}>3 Columns (Recommended)</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-[#151414] border border-[#2A2B28]">
                            <div>
                              <div className="text-xs font-semibold text-white">Featured Only</div>
                              <div className="text-[11px] text-white/40">Show only testimonials flagged as featured</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUpdateSetting('featuredOnly', !settings.featuredOnly)}
                              className="text-[#D9F45F] hover:opacity-80 transition"
                            >
                              {settings.featuredOnly ? (
                                <ToggleRight className="w-6 h-6 text-[#D9F45F]" />
                              ) : (
                                <ToggleLeft className="w-6 h-6 text-white/40" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Dynamic FAQs Editor */}
                      {selectedSection.type === 'faqs' && (() => {
                        const faqsList: Array<{ question: string; answer: string }> =
                          Array.isArray(settings.faqs) ? settings.faqs : [];

                        const handleAddFaqItem = () => {
                          const updated = [
                            ...faqsList,
                            { question: 'New Question?', answer: 'Detailed answer goes here...' },
                          ];
                          handleUpdateSetting('faqs', updated);
                        };

                        const handleUpdateFaqItem = (idx: number, field: 'question' | 'answer', val: string) => {
                          const updated = [...faqsList];
                          updated[idx] = { ...updated[idx], [field]: val };
                          handleUpdateSetting('faqs', updated);
                        };

                        const handleRemoveFaqItem = (idx: number) => {
                          const updated = faqsList.filter((_, i) => i !== idx);
                          handleUpdateSetting('faqs', updated);
                        };

                        return (
                          <div className="space-y-3 pt-3 border-t border-[#2A2B28]">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-bold text-[#D9F45F] uppercase tracking-wider">
                                Custom Page FAQs ({faqsList.length})
                              </label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddFaqItem}
                                className="h-7 text-[11px] px-2.5"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add FAQ Item
                              </Button>
                            </div>

                            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                              {faqsList.length === 0 ? (
                                <p className="text-xs text-white/40 italic p-3 rounded-lg bg-[#151414] border border-[#2A2B28]">
                                  Using default global FAQs. Click "Add FAQ Item" to create dynamic questions specific to this page.
                                </p>
                              ) : (
                                faqsList.map((item, fIdx) => (
                                  <div
                                    key={fIdx}
                                    className="p-3 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-2 relative group"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[10px] font-mono text-white/50">
                                        Q{fIdx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFaqItem(fIdx)}
                                        className="text-red-400 hover:text-red-300 p-0.5"
                                        title="Delete FAQ"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={item.question}
                                      onChange={(e) => handleUpdateFaqItem(fIdx, 'question', e.target.value)}
                                      placeholder="Question?"
                                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs font-semibold border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                    />
                                    <textarea
                                      rows={2}
                                      value={item.answer}
                                      onChange={(e) => handleUpdateFaqItem(fIdx, 'answer', e.target.value)}
                                      placeholder="Answer..."
                                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                    />
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Image Carousel Inspector */}
                      {selectedSection.type === 'image-carousel' && (() => {
                        const slides: any[] = Array.isArray(settings.slides) ? settings.slides : [];

                        const handleAddSlide = () => {
                          const updated = [
                            ...slides,
                            {
                              imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop',
                              posterUrl: '',
                              title: 'New Slide Showcase',
                              caption: 'Describe this slide or highlight key product features.',
                              linkUrl: '/contact',
                              altText: 'Slide visual',
                            },
                          ];
                          handleUpdateSetting('slides', updated);
                        };

                        const handleUpdateSlide = (idx: number, field: string, val: any) => {
                          const updated = [...slides];
                          updated[idx] = { ...updated[idx], [field]: val };
                          handleUpdateSetting('slides', updated);
                        };

                        const handleRemoveSlide = (idx: number) => {
                          const updated = slides.filter((_, i) => i !== idx);
                          handleUpdateSetting('slides', updated);
                        };

                        return (
                          <div className="space-y-4 pt-3 border-t border-[#2A2B28]">
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-[#D9F45F] uppercase tracking-wider">
                                Image Carousel Display Settings
                              </label>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] text-white/70 mb-1">Aspect Ratio</label>
                                  <select
                                    value={settings.aspectRatio || '16/9'}
                                    onChange={(e) => handleUpdateSetting('aspectRatio', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#151414] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                  >
                                    <option value="16/9">16:9 Widescreen (Standard)</option>
                                    <option value="21/9">21:9 Cinema Ultra-wide</option>
                                    <option value="4/3">4:3 Classic</option>
                                    <option value="auto">Auto Adaptive Height</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[11px] text-white/70 mb-1">Slide Interval (ms)</label>
                                  <Input
                                    type="number"
                                    min={1000}
                                    step={500}
                                    value={settings.autoplayInterval || 5000}
                                    onChange={(e) => handleUpdateSetting('autoplayInterval', parseInt(e.target.value) || 5000)}
                                    className="h-8 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-white/80">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={settings.autoplay !== false}
                                    onChange={(e) => handleUpdateSetting('autoplay', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-[#663399]"
                                  />
                                  <span>Autoplay</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={settings.showArrows !== false}
                                    onChange={(e) => handleUpdateSetting('showArrows', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-[#663399]"
                                  />
                                  <span>Arrows</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={settings.showDots !== false}
                                    onChange={(e) => handleUpdateSetting('showDots', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-[#663399]"
                                  />
                                  <span>Dots</span>
                                </label>
                              </div>
                            </div>

                            {/* Slides List */}
                            <div className="space-y-3 pt-2 border-t border-[#2A2B28]">
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                                  Image Slides ({slides.length})
                                </label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleAddSlide}
                                  className="h-7 text-[11px] px-2.5"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Image Slide
                                </Button>
                              </div>

                              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                                {slides.map((slide, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-3 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-2.5 text-xs"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-[#D9F45F] font-mono">
                                        Slide #{sIdx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveSlide(sIdx)}
                                        className="text-red-400 hover:text-red-300 p-0.5"
                                        title="Delete Slide"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Main Image URL & Upload */}
                                    <div>
                                      <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                        Image URL (or upload) *
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={slide.imageUrl || ''}
                                          onChange={(e) => handleUpdateSlide(sIdx, 'imageUrl', e.target.value)}
                                          placeholder="https://..."
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                        />
                                        <label className="px-2 py-1.5 rounded-lg bg-[#663399]/20 hover:bg-[#663399]/40 border border-[#663399]/50 text-white text-xs font-medium cursor-pointer shrink-0 transition flex items-center gap-1">
                                          <UploadCloud className="w-3.5 h-3.5 text-[#D9F45F]" />
                                          <span>Upload</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                handleUploadAsset(file, (url) => handleUpdateSlide(sIdx, 'imageUrl', url));
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    {/* Poster / Low-res Placeholder URL */}
                                    <div>
                                      <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                        Poster / Preview Image (Optional)
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={slide.posterUrl || ''}
                                          onChange={(e) => handleUpdateSlide(sIdx, 'posterUrl', e.target.value)}
                                          placeholder="https://... (low-res preview or poster)"
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                        />
                                        <label className="px-2 py-1.5 rounded-lg bg-[#1C1B1B] hover:bg-[#2A2B28] border border-[#2A2B28] text-white/70 hover:text-white text-xs font-medium cursor-pointer shrink-0 transition flex items-center gap-1">
                                          <UploadCloud className="w-3.5 h-3.5 text-white/50" />
                                          <span>Upload</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                handleUploadAsset(file, (url) => handleUpdateSlide(sIdx, 'posterUrl', url));
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    {/* Title & Link */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                          Slide Title
                                        </label>
                                        <input
                                          type="text"
                                          value={slide.title || ''}
                                          onChange={(e) => handleUpdateSlide(sIdx, 'title', e.target.value)}
                                          placeholder="Title..."
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                          Slide Link URL (Clickable)
                                        </label>
                                        <input
                                          type="text"
                                          value={slide.linkUrl || ''}
                                          onChange={(e) => handleUpdateSlide(sIdx, 'linkUrl', e.target.value)}
                                          placeholder="/services or https://..."
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                        />
                                      </div>
                                    </div>

                                    {/* Caption */}
                                    <div>
                                      <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                        Caption / Description
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={slide.caption || ''}
                                        onChange={(e) => handleUpdateSlide(sIdx, 'caption', e.target.value)}
                                        placeholder="Brief descriptive text..."
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Video Carousel Inspector */}
                      {selectedSection.type === 'video-carousel' && (() => {
                        const slides: any[] = Array.isArray(settings.slides) ? settings.slides : [];

                        const handleAddVideoSlide = () => {
                          const updated = [
                            ...slides,
                            {
                              videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                              thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop',
                              title: 'New Video Feature',
                              description: 'Watch the full walkthrough of our engineering capabilities.',
                              linkUrl: '/contact',
                              ctaText: 'Get Started',
                            },
                          ];
                          handleUpdateSetting('slides', updated);
                        };

                        const handleUpdateVideoSlide = (idx: number, field: string, val: any) => {
                          const updated = [...slides];
                          updated[idx] = { ...updated[idx], [field]: val };
                          handleUpdateSetting('slides', updated);
                        };

                        const handleRemoveVideoSlide = (idx: number) => {
                          const updated = slides.filter((_, i) => i !== idx);
                          handleUpdateSetting('slides', updated);
                        };

                        return (
                          <div className="space-y-4 pt-3 border-t border-[#2A2B28]">
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-[#D9F45F] uppercase tracking-wider">
                                Video Carousel &amp; Player Settings (Cross-Browser)
                              </label>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] text-white/70 mb-1">Aspect Ratio</label>
                                  <select
                                    value={settings.aspectRatio || '16/9'}
                                    onChange={(e) => handleUpdateSetting('aspectRatio', e.target.value)}
                                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#151414] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                  >
                                    <option value="16/9">16:9 Widescreen (Standard)</option>
                                    <option value="21/9">21:9 Cinema Ultra-wide</option>
                                    <option value="4/3">4:3 Classic Video</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-white/80">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={settings.autoplay === true}
                                    onChange={(e) => handleUpdateSetting('autoplay', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-[#663399]"
                                  />
                                  <span>Autoplay</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={settings.muted !== false}
                                    onChange={(e) => handleUpdateSetting('muted', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-[#663399]"
                                  />
                                  <span>Muted (iOS safe)</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={settings.loop !== false}
                                    onChange={(e) => handleUpdateSetting('loop', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-[#663399]"
                                  />
                                  <span>Loop Video</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={settings.controls !== false}
                                    onChange={(e) => handleUpdateSetting('controls', e.target.checked)}
                                    className="w-3.5 h-3.5 rounded text-[#663399]"
                                  />
                                  <span>Controls</span>
                                </label>
                              </div>
                            </div>

                            {/* Video Slides List */}
                            <div className="space-y-3 pt-2 border-t border-[#2A2B28]">
                              <div className="flex items-center justify-between">
                                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                                  Video Slides ({slides.length})
                                </label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleAddVideoSlide}
                                  className="h-7 text-[11px] px-2.5"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Video Slide
                                </Button>
                              </div>

                              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                                {slides.map((slide, vIdx) => (
                                  <div
                                    key={vIdx}
                                    className="p-3 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-2.5 text-xs"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-[#D9F45F] font-mono">
                                        Video #{vIdx + 1}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveVideoSlide(vIdx)}
                                        className="text-red-400 hover:text-red-300 p-0.5"
                                        title="Delete Video"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Video URL & Upload */}
                                    <div>
                                      <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                        Video URL (MP4, WebM, or YouTube/Vimeo) *
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={slide.videoUrl || ''}
                                          onChange={(e) => handleUpdateVideoSlide(vIdx, 'videoUrl', e.target.value)}
                                          placeholder="https://...mp4 or https://youtube.com/..."
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                        />
                                        <label className="px-2 py-1.5 rounded-lg bg-[#663399]/20 hover:bg-[#663399]/40 border border-[#663399]/50 text-white text-xs font-medium cursor-pointer shrink-0 transition flex items-center gap-1">
                                          <UploadCloud className="w-3.5 h-3.5 text-[#D9F45F]" />
                                          <span>Upload</span>
                                          <input
                                            type="file"
                                            accept="video/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                handleUploadAsset(file, (url) => handleUpdateVideoSlide(vIdx, 'videoUrl', url));
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    {/* Thumbnail / Poster Image URL */}
                                    <div>
                                      <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                        Video Thumbnail / Poster Image *
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={slide.thumbnailUrl || ''}
                                          onChange={(e) => handleUpdateVideoSlide(vIdx, 'thumbnailUrl', e.target.value)}
                                          placeholder="https://... (JPG, PNG, WebP)"
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                        />
                                        <label className="px-2 py-1.5 rounded-lg bg-[#1C1B1B] hover:bg-[#2A2B28] border border-[#2A2B28] text-white/70 hover:text-white text-xs font-medium cursor-pointer shrink-0 transition flex items-center gap-1">
                                          <UploadCloud className="w-3.5 h-3.5 text-white/50" />
                                          <span>Upload</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) {
                                                handleUploadAsset(file, (url) => handleUpdateVideoSlide(vIdx, 'thumbnailUrl', url));
                                              }
                                            }}
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    {/* Title & Link */}
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                          Video Title
                                        </label>
                                        <input
                                          type="text"
                                          value={slide.title || ''}
                                          onChange={(e) => handleUpdateVideoSlide(vIdx, 'title', e.target.value)}
                                          placeholder="Title..."
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                          CTA Destination URL
                                        </label>
                                        <input
                                          type="text"
                                          value={slide.linkUrl || ''}
                                          onChange={(e) => handleUpdateVideoSlide(vIdx, 'linkUrl', e.target.value)}
                                          placeholder="/contact"
                                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                        />
                                      </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                      <label className="block text-[10px] font-semibold text-white/70 mb-1">
                                        Video Description / Overview
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={slide.description || ''}
                                        onChange={(e) => handleUpdateVideoSlide(vIdx, 'description', e.target.value)}
                                        placeholder="Brief summary of what this video demonstrates..."
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#1C1B1B] text-white text-xs border border-[#2A2B28] focus:outline-none focus:border-[#D9F45F]"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

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
