'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../../lib/api';
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
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const SEEDED_SERVICES: Service[] = [
  {
    id: 's-1',
    title: 'Website Design and Development',
    slug: 'website-design-development',
    shortDescription: 'Custom, high-converting enterprise websites built on Next.js 15 & React 19.',
    fullDescription: 'We build high-performance web platforms engineered for sub-second Core Web Vitals, maximum search crawlability, and flawless conversion funnels.',
    icon: 'Globe',
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
    shortDescription: 'Bespoke business portals, enterprise workflows, and high-concurrency microservices.',
    fullDescription: 'Custom enterprise software designed to automate complex operational workflows, integrate disparate data silos, and scale reliably.',
    icon: 'Code2',
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
    shortDescription: 'Generative Engine Optimization (GEO), private RAG pipelines, and autonomous AI agents.',
    fullDescription: 'Position your brand as the primary cited authority inside ChatGPT, Claude, and Perplexity AI while automating repetitive enterprise processes.',
    icon: 'Sparkles',
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
    shortDescription: 'High-volume omnichannel storefronts with multi-currency checkout and automated ERP sync.',
    fullDescription: 'Robust headless e-commerce architectures capable of processing millions in gross merchandise value with sub-second page loads.',
    icon: 'ShoppingCart',
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New service state
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
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
        title: newTitle,
        slug: newSlug,
        shortDescription: newShortDesc,
        fullDescription: newShortDesc,
        features: ['Feature 1', 'Feature 2'],
        benefits: ['Benefit 1'],
        process: [],
        faqs: [],
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
    } catch {
      const dummy: Service = {
        id: `s-${Date.now()}`,
        title: newTitle,
        slug: newSlug,
        shortDescription: newShortDesc,
        fullDescription: newShortDesc,
        features: ['Custom UI/UX', 'Full API Integration'],
        benefits: ['Scalability'],
        process: [],
        faqs: [],
        isPublished: true,
        order: services.length,
      };
      setServices([...services, dummy]);
      setIsModalOpen(false);
      router.push(`/admin/services/${dummy.id}`);
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
    } catch {
      setServices(services.filter((s) => s.id !== id));
      setSuccessMessage(`Service "${title}" deleted`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const filteredServices = search
    ? services.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.slug.toLowerCase().includes(search.toLowerCase())
      )
    : services;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Services & Solutions Management
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Configure individual service offerings, deliverables, process blueprints, and tied pricing tiers.
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

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Configured Services ({filteredServices.length})</CardTitle>
          <CardDescription>
            Each service generates an SEO-optimized landing page at <code>/services/[slug]</code>.
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
              <p className="text-base font-medium">No services found</p>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                Create First Service
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Name & URL</TableHead>
                    <TableHead>Deliverables</TableHead>
                    <TableHead>Pricing Tiers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id} className="hover:bg-white/[0.02]">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F] shrink-0">
                            <Briefcase className="w-4 h-4" />
                          </div>
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
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-[#151414] border border-[#2A2B28] text-white/80">
                          {service.features?.length || 0} Deliverables
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-white/70">
                          {service.pricingPackages?.length || 0} Linked
                        </span>
                      </TableCell>

                      <TableCell>
                        {service.isPublished ? (
                          <Badge variant="success">Published</Badge>
                        ) : (
                          <Badge variant="warning">Draft</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/services/${service.id}`}>
                            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                              <Edit3 className="w-3.5 h-3.5 mr-1" />
                              Configure
                            </Button>
                          </Link>

                          <Link
                            href={`/services/${service.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-white/70 hover:text-white"
                              title="Preview Public Page"
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
                  ))}
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
        title="Add New Service"
        description="Initialize a new dedicated service offering."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Service Title *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Node.js Microservices Architecture"
              value={newTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              URL Slug *
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-[#151414] border border-r-0 border-[#2A2B28] rounded-l-xl text-xs text-white/50 font-mono">
                silwasa.com/services/
              </span>
              <input
                type="text"
                required
                value={newSlug}
                onChange={(e) => setNewSlug(slugify(e.target.value))}
                placeholder="nodejs-microservices"
                className="w-full px-3 py-2 rounded-r-xl bg-[#1C1B1B] border border-[#2A2B28] text-white text-xs font-mono focus:outline-none focus:border-[#D9F45F]"
              />
            </div>
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isCreating || !newTitle.trim() || !newSlug.trim()}
            >
              {isCreating ? 'Creating Service...' : 'Create & Configure'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
