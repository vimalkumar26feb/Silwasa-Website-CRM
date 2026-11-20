'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../lib/api';
import type { Service } from '@silwasa/types';
import { slugify } from '@silwasa/shared';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Briefcase,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Layers,
  Globe,
  Code2,
  Sparkles,
  ShoppingCart,
  Smartphone,
  Cpu,
  Database,
  ShieldCheck,
  Zap,
  BarChart,
  Server,
  Monitor,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';

const POPULAR_CATEGORIES = [
  'Web Development',
  'Software Engineering',
  'AI & Automation',
  'E-Commerce',
  'Digital Marketing',
  'Mobile Apps',
  'Cloud & DevOps',
];

const AVAILABLE_ICONS = [
  { name: 'Globe', label: 'Web / Global', Icon: Globe },
  { name: 'Code2', label: 'Software / Code', Icon: Code2 },
  { name: 'Sparkles', label: 'AI / Innovation', Icon: Sparkles },
  { name: 'ShoppingCart', label: 'E-Commerce / Store', Icon: ShoppingCart },
  { name: 'Search', label: 'SEO / Marketing', Icon: Search },
  { name: 'Smartphone', label: 'Mobile Apps', Icon: Smartphone },
  { name: 'Cpu', label: 'Hardware / AI', Icon: Cpu },
  { name: 'Database', label: 'Database & Cloud', Icon: Database },
  { name: 'Layers', label: 'Architecture / Full-Stack', Icon: Layers },
  { name: 'ShieldCheck', label: 'Security & SLA', Icon: ShieldCheck },
  { name: 'Zap', label: 'High Speed / Real-Time', Icon: Zap },
  { name: 'BarChart', label: 'Analytics & Growth', Icon: BarChart },
  { name: 'Server', label: 'Backend & Infrastructure', Icon: Server },
  { name: 'Monitor', label: 'UI/UX & Frontend', Icon: Monitor },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Code2,
  Sparkles,
  ShoppingCart,
  Search,
  Smartphone,
  Cpu,
  Database,
  Layers,
  ShieldCheck,
  Zap,
  BarChart,
  Server,
  Monitor,
};

const SEEDED_SERVICES: Service[] = [
  {
    id: 's-1',
    title: 'Website Design and Development',
    slug: 'website-design-development',
    category: 'Web Development',
    customUrl: '',
    shortDescription: 'Custom, high-converting enterprise websites built on Next.js 15 & React 19.',
    fullDescription: 'We build high-performance web platforms engineered for sub-second Core Web Vitals, maximum search crawlability, and flawless conversion funnels.',
    icon: 'Globe',
    featuredImageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
    features: ['Custom Next.js 15 Architecture', 'Mobile-First Responsive Design', 'Sub-Second LCP Performance', 'CMS Integration'],
    benefits: ['Accelerate Organic Traffic', 'Higher Conversion Rates', 'Zero Architectural Debt'],
    process: [{ step: 1, title: 'Discovery & Wireframes', description: 'Interactive Figma design prototypes' }],
    faqs: [{ question: 'What tech stack do you use?', answer: 'Next.js 15, React 19, TypeScript, and Tailwind CSS.' }],
    isPublished: true,
    order: 0,
  },
  {
    id: 's-2',
    title: 'Custom Software Development',
    slug: 'custom-software-development',
    category: 'Software Engineering',
    customUrl: '',
    shortDescription: 'Bespoke business portals, enterprise workflows, and high-concurrency microservices.',
    fullDescription: 'Custom enterprise software designed to automate complex operational workflows, integrate disparate data silos, and scale reliably.',
    icon: 'Code2',
    featuredImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    features: ['Microservices & API Gateways', 'Role-Based Granular Access', 'ACID Database Integrity', '99.99% Uptime Guarantee'],
    benefits: ['Eliminate Manual Data Entry', 'Unify Multi-Department Workflows', 'Bank-Grade Data Security'],
    process: [{ step: 1, title: 'Requirements & Scope', description: 'Technical design document and architecture diagram' }],
    faqs: [{ question: 'Do we own the code?', answer: 'Yes, 100% full intellectual property and code ownership upon completion.' }],
    isPublished: true,
    order: 1,
  },
  {
    id: 's-3',
    title: 'AI Solutions & GEO Optimization',
    slug: 'ai-solutions-geo',
    category: 'AI & Automation',
    customUrl: '',
    shortDescription: 'Generative Engine Optimization (GEO), private RAG pipelines, and autonomous AI agents.',
    fullDescription: 'Position your brand as the primary cited authority inside ChatGPT, Claude, and Perplexity AI while automating repetitive enterprise processes.',
    icon: 'Sparkles',
    featuredImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    features: ['Entity Schema Architecture', 'Vector Search Retrieval (RAG)', 'Private LLM Fine-Tuning', 'AI Workflow Automation'],
    benefits: ['Top Rank in AI Citations', 'High-Intent Enterprise Leads', '24/7 Automated Support'],
    process: [{ step: 1, title: 'Entity Audit', description: 'Mapping semantic authority graphs across LLMs' }],
    faqs: [{ question: 'How is GEO different from SEO?', answer: 'GEO optimizes for generative AI citations rather than traditional keyword lists.' }],
    isPublished: true,
    order: 2,
  },
  {
    id: 's-4',
    title: 'E-commerce Platform Architecture',
    slug: 'ecommerce-website-development',
    category: 'E-Commerce',
    customUrl: '',
    shortDescription: 'High-volume omnichannel storefronts with multi-currency checkout and automated ERP sync.',
    fullDescription: 'Robust headless e-commerce architectures capable of processing millions in gross merchandise value with sub-second page loads.',
    icon: 'ShoppingCart',
    featuredImageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?q=80&w=600&auto=format&fit=crop',
    features: ['Headless Storefronts', 'Multi-Currency Global Checkout', 'Automated POS & ERP Sync', 'Cart Abandonment Engines'],
    benefits: ['Double-Digit Conversion Boost', 'Seamless Multi-Region Sales', 'Sub-Second Checkout Speeds'],
    process: [{ step: 1, title: 'Catalog Modeling', description: 'Optimizing product schemas and payment gateways' }],
    faqs: [{ question: 'Which payment processors are supported?', answer: 'Stripe, Razorpay, PayPal, Apple Pay, and Google Pay.' }],
    isPublished: true,
    order: 3,
  },
];

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New service state
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newIcon, setNewIcon] = useState('Globe');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [newShortDesc, setNewShortDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ success: boolean; data: Service[] }>('/admin/services');
      if (res.success && res.data && res.data.length > 0) {
        setServices(res.data);
      } else {
        setServices(SEEDED_SERVICES);
      }
    } catch {
      setServices(SEEDED_SERVICES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    setNewSlug(slugify(val));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim() || !newShortDesc.trim()) return;

    try {
      setIsCreating(true);
      setErrorMessage(null);

      const payload = {
        title: newTitle.trim(),
        slug: newSlug.trim(),
        category: newCategory.trim() || 'General',
        icon: newIcon.trim(),
        featuredImageUrl: newImageUrl.trim() || null,
        customUrl: newCustomUrl.trim() || null,
        shortDescription: newShortDesc.trim(),
        fullDescription: newShortDesc.trim(),
        features: ['Custom Enterprise Architecture', 'Full Production Support', 'Sub-Second Response Times'],
        benefits: ['Maximum Scalability & Speed', 'Zero Vendor Lock-In'],
        process: [{ step: 1, title: 'Discovery & Architecture Blueprint', description: 'Technical scope, wireframes, and data modeling.' }],
        faqs: [{ question: 'What is the estimated delivery timeframe?', answer: 'Delivery schedules range from 2 to 4 weeks depending on exact scope.' }],
        isPublished: true,
      };

      const res = await apiClient<{ success: boolean; data: Service }>('/admin/services', {
        method: 'POST',
        body: payload,
      });

      if (res.success && res.data) {
        setIsModalOpen(false);
        router.push(`/admin/services/${res.data.id}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create service in database');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await apiClient(`/admin/services/${id}`, { method: 'DELETE' });
      setSuccessMessage(`Service "${title}" deleted`);
      setServices(services.filter((s) => s.id !== id));
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || `Failed to delete service`);
    }
  };

  // Distinct category list
  const allCategories = ['All', ...Array.from(new Set(services.map((s) => s.category || 'General').filter(Boolean)))];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategoryFilter === 'All' ||
      (s.category || 'General').toLowerCase() === selectedCategoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-7 h-7 text-[#D9F45F]" />
            Services & Solutions Management
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Configure fully dynamic service cards, icons, images, custom landing page URLs, categories, deliverables, and linked pricing plans.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="rounded-full shadow-lg shadow-[#663399]/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
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
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Search Bar & Category Filters */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services by title, slug, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#663399] text-white shadow-md shadow-[#663399]/20'
                      : 'bg-[#151414] text-white/70 hover:text-white border border-[#2A2B28]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <CardHeader>
          <CardTitle className="text-white">All Configured Services ({filteredServices.length})</CardTitle>
          <CardDescription className="text-zinc-400">
            Each service can be rendered dynamically across custom pages using the Services reusable component, or on dedicated custom details pages.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-16 text-white/50 space-y-3">
              <Briefcase className="w-10 h-10 mx-auto text-white/20" />
              <p className="text-base font-medium">No services found matching your criteria</p>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                Create First Service
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2A2B28]">
                    <TableHead className="text-zinc-400">Service & Icon/Image</TableHead>
                    <TableHead className="text-zinc-400">Category</TableHead>
                    <TableHead className="text-zinc-400">Custom Target Page</TableHead>
                    <TableHead className="text-zinc-400">Deliverables</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => {
                    const IconComp = (service.icon && ICON_MAP[service.icon]) || Globe;
                    const previewUrl = service.customUrl?.trim() || `/services/${service.slug}`;

                    return (
                      <TableRow key={service.id} className="border-[#2A2B28] hover:bg-white/[0.02]">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {service.featuredImageUrl ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#2A2B28] shrink-0 bg-[#151414]">
                                <img
                                  src={service.featuredImageUrl}
                                  alt={service.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F] shrink-0">
                                <IconComp className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-white hover:text-[#D9F45F] transition-colors">
                                <Link href={`/admin/services/${service.id}`}>{service.title}</Link>
                              </div>
                              <div className="text-xs text-white/50 font-mono">
                                /services/{service.slug}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#151414] border border-[#2A2B28] text-[#D9F45F]">
                            {service.category || 'General'}
                          </span>
                        </TableCell>

                        <TableCell>
                          {service.customUrl ? (
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {service.customUrl}
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-500 font-mono">
                              /services/{service.slug} (Default)
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-[#151414] border border-[#2A2B28] text-white/80">
                            {service.features?.length || 0} Items
                          </span>
                        </TableCell>

                        <TableCell>
                          {service.isPublished ? (
                            <Badge className="bg-emerald-500/10 border-emerald-500/30 text-emerald-400 text-xs">
                              Published
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 border-amber-500/30 text-amber-400 text-xs">
                              Draft
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/services/${service.id}`}>
                              <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs border-[#2A2B28] hover:border-[#663399]">
                                <Edit3 className="w-3.5 h-3.5 mr-1" />
                                Edit
                              </Button>
                            </Link>

                            <Link href={previewUrl} target="_blank" rel="noopener noreferrer">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-white/70 hover:text-white"
                                title="Preview Service Landing Page"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                            </Link>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => handleDelete(service.id, service.title)}
                              title="Delete Service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Dynamic Service"
        description="Initialize a new dedicated service offering with custom icon, image, category, and target details page."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Service Title *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Node.js Microservices & Enterprise Architecture"
              value={newTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="bg-[#151414] border-[#2A2B28] text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                URL Slug *
              </label>
              <Input
                type="text"
                required
                value={newSlug}
                onChange={(e) => setNewSlug(slugify(e.target.value))}
                placeholder="nodejs-microservices"
                className="bg-[#151414] border-[#2A2B28] text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Category *
              </label>
              <input
                type="text"
                list="category-suggestions"
                required
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Web Development"
                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
              />
              <datalist id="category-suggestions">
                {POPULAR_CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Icon and Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Display Icon
              </label>
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
              >
                {AVAILABLE_ICONS.map((i) => (
                  <option key={i.name} value={i.name}>
                    {i.name} ({i.label})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Card Image URL (Optional)
              </label>
              <Input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="bg-[#151414] border-[#2A2B28] text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1 flex items-center justify-between">
              <span>Custom Service Details Page URL (Optional)</span>
              <span className="text-[11px] text-[#D9F45F]">Leave blank for default /services/[slug]</span>
            </label>
            <Input
              type="text"
              value={newCustomUrl}
              onChange={(e) => setNewCustomUrl(e.target.value)}
              placeholder="e.g. /custom-web-development or /landing-page"
              className="bg-[#151414] border-[#2A2B28] text-white font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Short Summary Description *
            </label>
            <textarea
              rows={2}
              required
              placeholder="High-throughput, resilient backend services designed for 99.99% uptime..."
              value={newShortDesc}
              onChange={(e) => setNewShortDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2A2B28]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-[#2A2B28]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating || !newTitle.trim() || !newSlug.trim()}
              className="bg-[#663399] hover:bg-[#52297A] text-white font-semibold"
            >
              {isCreating ? 'Creating Service...' : 'Create & Configure'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
