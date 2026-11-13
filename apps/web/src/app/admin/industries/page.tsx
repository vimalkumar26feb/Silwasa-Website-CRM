'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import type { Industry } from '@silwasa/types';
import { slugify } from '@silwasa/shared';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Building2,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';

const SEEDED_INDUSTRIES: Industry[] = [
  {
    id: 'ind-1',
    name: 'Healthcare & Telemedicine',
    slug: 'healthcare',
    shortDescription: 'HIPAA-compliant patient portals, EHR telemetry, and doctor scheduling systems.',
    fullDescription: 'We architect enterprise healthcare platforms designed to safeguard patient privacy under HIPAA and NABH regulations while optimizing clinical throughput and EHR integrations.',
    icon: 'Stethoscope',
    challenges: ['Strict HIPAA & NABH Compliance', 'Legacy EHR Data Silos', 'High-Latency Remote Telemedicine'],
    solutions: ['End-to-End Encrypted FHIR Sockets', 'Unified Telemetry Aggregation', 'Sub-second WebRTC Consultations'],
    isPublished: true,
    order: 0,
  },
  {
    id: 'ind-2',
    name: 'Real Estate & PropTech',
    slug: 'real-estate',
    shortDescription: 'Interactive property showcases, CRM automation, and map telemetry.',
    fullDescription: 'Custom real estate portals featuring 3D virtual architectural walkthroughs, lead routing engines, automated commission tracking, and high-concurrency property listings.',
    icon: 'Building',
    challenges: ['Slow Map Rendering on Mobile', 'Lead Leakage across Agent Networks', 'High Asset Storage Footprints'],
    solutions: ['Vector Tile Mapping via WebGL', 'Automated WhatsApp Lead Routing', 'Cloudflare Image Delivery Networks'],
    isPublished: true,
    order: 1,
  },
  {
    id: 'ind-3',
    name: 'E-commerce & Retail',
    slug: 'ecommerce-retail',
    shortDescription: 'Sub-second headless storefronts, multi-warehouse sync, and flash-sale resilience.',
    fullDescription: 'High-volume commerce platforms built on Next.js 15 App Router engineered to handle 50,000+ concurrent checkout requests without database locking.',
    icon: 'ShoppingCart',
    challenges: ['Cart Abandonment from Slow LCP', 'Inventory Race Conditions During Flash Sales'],
    solutions: ['Edge-Rendered Catalogs with 0.4s LCP', 'Redis Atomic Stock Reservation Locks'],
    isPublished: true,
    order: 2,
  },
  {
    id: 'ind-4',
    name: 'FinTech & Banking',
    slug: 'fintech-banking',
    shortDescription: 'RBI/PCI-DSS compliant payments, ledger accounting, and KYC workflows.',
    fullDescription: 'Secure financial systems featuring end-to-end payload encryption, biometric authentication, fraud detection pipelines, and automated reconciliation.',
    icon: 'Landmark',
    challenges: ['PCI-DSS Level 1 Compliance', 'Sub-millisecond Transaction Verification'],
    solutions: ['Argon2id & AES-256 GCM Cryptography', 'Idempotent Webhook Processing Queues'],
    isPublished: true,
    order: 3,
  },
  {
    id: 'ind-5',
    name: 'Logistics & Supply Chain',
    slug: 'logistics-supply-chain',
    shortDescription: 'Real-time vehicle GPS tracking, dispatch portals, and automated billing.',
    fullDescription: 'Custom enterprise supply chain software designed to track multi-hub freight movements, calculate automated toll tariffs, and deliver instant proof-of-delivery.',
    icon: 'Truck',
    challenges: ['Intermittent Fleet Connectivity', 'Complex Multi-tier Dispatch Hierarchies'],
    solutions: ['Offline-First Progressive Web Apps', 'Role-Based Telematics Dashboards'],
    isPublished: true,
    order: 4,
  },
  {
    id: 'ind-6',
    name: 'Education & EdTech',
    slug: 'education-edtech',
    shortDescription: 'Scalable LMS portals, live video classrooms, and automated examination proctoring.',
    fullDescription: 'High-concurrency learning platforms with student analytics, video on demand, automated test grading, and payment gateway subscriptions.',
    icon: 'GraduationCap',
    challenges: ['Peak Examination Concurrency Spikes', 'Video Buffering on Low Bandwidth'],
    solutions: ['Adaptive HLS Bitrate Streaming', 'Serverless On-Demand Compute Scaling'],
    isPublished: true,
    order: 5,
  }
];

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    icon: 'Building2',
    challenges: '',
    solutions: '',
    isPublished: true,
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchIndustries();
  }, []);

  const fetchIndustries = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/admin/industries');
      if (res && res.data && res.data.length > 0) {
        setIndustries(res.data);
      } else {
        setIndustries(SEEDED_INDUSTRIES);
      }
    } catch {
      setIndustries(SEEDED_INDUSTRIES);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ind?: Industry) => {
    if (ind) {
      setEditingIndustry(ind);
      setFormData({
        name: ind.name,
        slug: ind.slug,
        shortDescription: ind.shortDescription,
        fullDescription: ind.fullDescription,
        icon: ind.icon || 'Building2',
        challenges: Array.isArray(ind.challenges) ? ind.challenges.join('\n') : '',
        solutions: Array.isArray(ind.solutions) ? ind.solutions.join('\n') : '',
        isPublished: ind.isPublished,
        order: ind.order,
      });
    } else {
      setEditingIndustry(null);
      setFormData({
        name: '',
        slug: '',
        shortDescription: '',
        fullDescription: '',
        icon: 'Building2',
        challenges: 'Challenge 1\nChallenge 2',
        solutions: 'Solution 1\nSolution 2',
        isPublished: true,
        order: industries.length,
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
      challenges: formData.challenges.split('\n').map((c) => c.trim()).filter(Boolean),
      solutions: formData.solutions.split('\n').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingIndustry) {
        await apiClient.put(`/admin/industries/${editingIndustry.id}`, payload);
        setIndustries((prev) =>
          prev.map((item) => (item.id === editingIndustry.id ? { ...item, ...payload } : item))
        );
        setNotification({ type: 'success', message: 'Industry updated successfully' });
      } else {
        const res = await apiClient.post<any>('/admin/industries', payload);
        const created: Industry = res.data || {
          id: `ind-${Date.now()}`,
          ...payload,
        };
        setIndustries((prev) => [...prev, created]);
        setNotification({ type: 'success', message: 'Industry created successfully' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save industry' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" industry vertical?`)) return;

    try {
      await apiClient.delete(`/admin/industries/${id}`);
      setIndustries((prev) => prev.filter((item) => item.id !== id));
      setNotification({ type: 'success', message: 'Industry removed successfully' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete industry' });
    }
  };

  const filteredIndustries = industries.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#D9F45F]" />
            Industry Verticals CMS
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage industry-specific landing pages, engineering solutions, compliance requirements, and business case studies.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#663399] hover:bg-[#52297A] text-white font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Industry Vertical
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
          placeholder="Search industries..."
          className="pl-9 bg-[#1C1B1B] border-[#2A2B28] text-white text-xs h-9"
        />
      </div>

      {/* Industries Table */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2A2B28]">
              <TableHead className="text-zinc-400 text-xs">Vertical Name</TableHead>
              <TableHead className="text-zinc-400 text-xs">Slug</TableHead>
              <TableHead className="text-zinc-400 text-xs">Challenges / Solutions</TableHead>
              <TableHead className="text-zinc-400 text-xs">Status</TableHead>
              <TableHead className="text-zinc-400 text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i} className="border-[#2A2B28]">
                  <TableCell><Skeleton className="h-5 w-36 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 bg-zinc-800 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 bg-zinc-800 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredIndustries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                  No industries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredIndustries.map((ind) => (
                <TableRow key={ind.id} className="border-[#2A2B28] hover:bg-zinc-800/40">
                  <TableCell>
                    <div className="font-semibold text-white text-sm flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-[#663399]/20 flex items-center justify-center text-[#D9F45F]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      {ind.name}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1 max-w-md">
                      {ind.shortDescription}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-[#D9F45F]">/industries/{ind.slug}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-zinc-300">
                      <span>{ind.challenges?.length || 0} Challenges</span> •{' '}
                      <span>{ind.solutions?.length || 0} Solutions</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ind.isPublished ? (
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
                        onClick={() => handleOpenModal(ind)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                        title="Edit Industry"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(ind.id, ind.name)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-rose-400"
                        title="Delete Industry"
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

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndustry ? `Edit Industry: ${editingIndustry.name}` : 'Create New Industry Vertical'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Industry Name</label>
              <Input
                value={formData.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    name: val,
                    slug: editingIndustry ? formData.slug : slugify(val),
                  });
                }}
                placeholder="e.g. Healthcare & Telemedicine"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="healthcare"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1 block">Short Summary (Teaser)</label>
            <Input
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="1-2 sentences summarizing value proposition..."
              className="bg-[#151414] border-[#2A2B28] text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1 block">Detailed Architectural Scope</label>
            <textarea
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              rows={4}
              placeholder="In-depth narrative on enterprise systems..."
              className="w-full bg-[#151414] border border-[#2A2B28] rounded-md p-3 text-sm text-white focus:outline-none focus:border-[#663399]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">
                Enterprise Challenges (One per line)
              </label>
              <textarea
                value={formData.challenges}
                onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                rows={3}
                className="w-full bg-[#151414] border border-[#2A2B28] rounded-md p-2 text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">
                Engineering Solutions (One per line)
              </label>
              <textarea
                value={formData.solutions}
                onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
                rows={3}
                className="w-full bg-[#151414] border border-[#2A2B28] rounded-md p-2 text-xs text-white focus:outline-none"
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
              Publish on Live Website
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
              {saving ? 'Saving...' : editingIndustry ? 'Update Industry' : 'Create Industry'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
