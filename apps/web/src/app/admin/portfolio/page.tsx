'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import type { PortfolioProject } from '@silwasa/types';
import { slugify } from '@silwasa/shared';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Sparkles,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Folder,
  Layers
} from 'lucide-react';

const SEEDED_PORTFOLIO: PortfolioProject[] = [
  {
    id: 'port-1',
    title: 'HealthFlow Clinical Telemetry Portal',
    slug: 'healthflow-telemetry-portal',
    clientName: 'NovaCura Health System',
    industry: 'Healthcare',
    category: 'Web Application',
    projectUrl: 'https://healthflow-demo.silwasa.com',
    featuredImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    galleryImages: [],
    description: 'Real-time patient telemetry monitoring portal aggregating critical ICU telemetry with sub-second alert triggers.',
    technologies: ['Next.js 15', 'TypeScript', 'WebSockets', 'Redis', 'PostgreSQL'],
    challenges: 'Severe sub-second latency constraints across 10,000 parallel streams with zero downtime allowance.',
    solutions: 'Stateless edge API orchestration with Redis pub/sub and optimistic UI synchronization.',
    results: '0.42s latency, 99.99% uptime, 15,000 concurrent monitored beds.',
    isPublished: true,
    order: 0,
  },
  {
    id: 'port-2',
    title: 'Apex Real Estate & Brokerage CRM',
    slug: 'apex-real-estate-crm',
    clientName: 'Apex Prime Properties',
    industry: 'Real Estate',
    category: 'Custom Software',
    projectUrl: 'https://apex-demo.silwasa.com',
    featuredImageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
    galleryImages: [],
    description: 'High-volume luxury property portal with 3D virtual walkthroughs, automated agent lead routing, and escrow status tracking.',
    technologies: ['React 19', 'Next.js 15', 'Tailwind CSS', 'Prisma ORM'],
    challenges: 'High asset storage costs and slow mobile rendering of interactive vector maps.',
    solutions: 'Client-side WebGL vector rendering with edge CDN caching for high-res property assets.',
    results: '+320% qualified buyer tours booked, 68% decrease in media storage costs.',
    isPublished: true,
    order: 1,
  },
  {
    id: 'port-3',
    title: 'Luxor Headless Commerce Storefront',
    slug: 'luxor-ecommerce-storefront',
    clientName: 'Luxor Lifestyle Brands',
    industry: 'E-commerce',
    category: 'E-commerce',
    projectUrl: 'https://luxor-demo.silwasa.com',
    featuredImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    galleryImages: [],
    description: 'Sub-second luxury retail storefront with multi-currency checkout, dynamic inventory synchronization, and AI product recommendations.',
    technologies: ['Next.js 15', 'Tailwind CSS', 'Stripe', 'Razorpay', 'Algolia'],
    challenges: 'Cart abandonment due to slow 3.5s page load speeds during high-traffic holiday sales.',
    solutions: 'Static generation with ISR, optimized image pipelines, and one-click checkout modal.',
    results: '0.78s LCP, +48% increase in checkout completions, $2.4M GMV processed in 30 days.',
    isPublished: true,
    order: 2,
  }
];

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    clientName: '',
    industry: 'Healthcare',
    category: 'Web Application',
    projectUrl: '',
    featuredImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
    description: '',
    technologies: 'Next.js 15, TypeScript, Tailwind CSS',
    challenges: '',
    solutions: '',
    results: '',
    isPublished: true,
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/admin/portfolio');
      if (res && res.data && res.data.length > 0) {
        setProjects(res.data);
      } else {
        setProjects(SEEDED_PORTFOLIO);
      }
    } catch {
      setProjects(SEEDED_PORTFOLIO);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (p?: PortfolioProject) => {
    if (p) {
      setEditingProject(p);
      setFormData({
        title: p.title,
        slug: p.slug,
        clientName: p.clientName,
        industry: p.industry,
        category: p.category,
        projectUrl: p.projectUrl || '',
        featuredImageUrl: p.featuredImageUrl,
        description: p.description,
        technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
        challenges: p.challenges,
        solutions: p.solutions,
        results: p.results,
        isPublished: p.isPublished,
        order: p.order,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        slug: '',
        clientName: '',
        industry: 'Healthcare',
        category: 'Web Application',
        projectUrl: '',
        featuredImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        description: '',
        technologies: 'Next.js 15, TypeScript, PostgreSQL',
        challenges: 'Describe core challenge...',
        solutions: 'Describe technical architecture...',
        results: 'Key business outcomes...',
        isPublished: true,
        order: projects.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    const payload = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingProject) {
        await apiClient.put(`/admin/portfolio/${editingProject.id}`, payload);
        setProjects((prev) =>
          prev.map((item) => (item.id === editingProject.id ? { ...item, ...payload } : item))
        );
        setNotification({ type: 'success', message: 'Project updated successfully' });
      } else {
        const res = await apiClient.post<any>('/admin/portfolio', payload);
        const created: PortfolioProject = res.data || {
          id: `port-${Date.now()}`,
          galleryImages: [],
          ...payload,
        };
        setProjects((prev) => [...prev, created]);
        setNotification({ type: 'success', message: 'Project created successfully' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save project' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await apiClient.delete(`/admin/portfolio/${id}`);
      setProjects((prev) => prev.filter((item) => item.id !== id));
      setNotification({ type: 'success', message: 'Project removed successfully' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete project' });
    }
  };

  const filteredProjects = projects.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.clientName.toLowerCase().includes(search.toLowerCase()) ||
      item.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#D9F45F]" />
            Portfolio & Case Studies CMS
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Showcase enterprise deliverables, engineering architectures, client ROI outcomes, and technology stacks.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#663399] hover:bg-[#52297A] text-white font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Case Study
        </Button>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between border ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs hover:underline text-zinc-400 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search portfolio by client, title..."
          className="pl-9 bg-[#1C1B1B] border-[#2A2B28] text-white text-xs h-9"
        />
      </div>

      {/* Portfolio Table */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2A2B28]">
              <TableHead className="text-zinc-400 text-xs">Project & Client</TableHead>
              <TableHead className="text-zinc-400 text-xs">Industry & Category</TableHead>
              <TableHead className="text-zinc-400 text-xs">Key Outcome / Metrics</TableHead>
              <TableHead className="text-zinc-400 text-xs">Status</TableHead>
              <TableHead className="text-zinc-400 text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i} className="border-[#2A2B28]">
                  <TableCell><Skeleton className="h-5 w-40 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-44 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 bg-zinc-800 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 bg-zinc-800 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                  No portfolio projects found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((p) => (
                <TableRow key={p.id} className="border-[#2A2B28] hover:bg-zinc-800/40">
                  <TableCell>
                    <div className="font-semibold text-white text-sm">
                      {p.title}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Client: <span className="text-white font-medium">{p.clientName}</span>
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <span className="text-zinc-300 font-medium">{p.industry}</span>
                      <span className="text-zinc-500 block">{p.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-[#D9F45F] font-mono line-clamp-1 max-w-xs">
                      {p.results}
                    </p>
                  </TableCell>
                  <TableCell>
                    {p.isPublished ? (
                      <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        PUBLISHED
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-zinc-400 border-zinc-700">
                        DRAFT
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(p)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(p.id, p.title)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-rose-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? `Edit Case Study: ${editingProject.title}` : 'Add Portfolio Case Study'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Project Title</label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    title: val,
                    slug: editingProject ? formData.slug : slugify(val),
                  });
                }}
                placeholder="HealthFlow Telemetry Portal"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="healthflow-telemetry-portal"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Client Name</label>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="NovaCura Health"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Industry</label>
              <Input
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Healthcare"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Web Application"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Live Project URL (Optional)</label>
              <Input
                value={formData.projectUrl}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                placeholder="https://..."
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Featured Image URL</label>
              <Input
                value={formData.featuredImageUrl}
                onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1 block">Technologies (Comma separated)</label>
            <Input
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="Next.js 15, TypeScript, Redis, PostgreSQL"
              className="bg-[#151414] border-[#2A2B28] text-white text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1 block">Executive Summary</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full bg-[#151414] border border-[#2A2B28] rounded-md p-2.5 text-xs text-white focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">The Challenge</label>
              <textarea
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                rows={3}
                className="w-full bg-[#151414] border border-[#2A2B28] rounded-md p-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">The Solution</label>
              <textarea
                value={formData.solutions}
                onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
                rows={3}
                className="w-full bg-[#151414] border border-[#2A2B28] rounded-md p-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">The Business Results</label>
              <textarea
                value={formData.results}
                onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                rows={3}
                className="w-full bg-[#151414] border border-[#2A2B28] rounded-md p-2 text-xs text-white focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-[#2A2B28] bg-[#151414] text-[#663399]"
              />
              Publish on Live Portfolio
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#2A2B28]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="border-[#2A2B28] text-zinc-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="bg-[#663399] hover:bg-[#52297A] text-white font-semibold"
            >
              {saving ? 'Saving...' : editingProject ? 'Update Case Study' : 'Create Case Study'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
