'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import type { Testimonial } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  MessageSquare,
  Plus,
  Star,
  Search,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';

const SEEDED_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Dr. Vikram Malhotra',
    clientRole: 'Chief Technology Officer',
    clientCompany: 'NovaCura Healthcare',
    clientAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    content: 'Silwasa delivered our complete clinical telemetry platform with zero downtime and sub-second WebSocket telemetry. Their architectural discipline exceeded our international expectations.',
    rating: 5,
    isFeatured: true,
    order: 0,
  },
  {
    id: 'test-2',
    clientName: 'Marcus Vance',
    clientRole: 'VP of Engineering',
    clientCompany: 'Vance Autonomous Systems (USA)',
    clientAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    content: 'Silwasa’s React 19 and Next.js architects refactored our flagship SaaS portal in record time. Core Web Vitals improved by 74%, directly lowering customer churn.',
    rating: 5,
    isFeatured: true,
    order: 1,
  },
  {
    id: 'test-3',
    clientName: 'Sunita Mehra',
    clientRole: 'Managing Director',
    clientCompany: 'Luxor Lifestyle E-commerce',
    clientAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    content: 'Our conversion rates jumped by 48% within 3 weeks of launching our new custom storefront built by Silwasa. Highly professional, responsive, and innovative.',
    rating: 5,
    isFeatured: true,
    order: 2,
  }
];

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    clientAvatarUrl: '',
    content: '',
    rating: 5,
    isFeatured: true,
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/testimonials');
      if (res && res.data && res.data.length > 0) {
        setTestimonials(res.data);
      } else {
        setTestimonials(SEEDED_TESTIMONIALS);
      }
    } catch {
      setTestimonials(SEEDED_TESTIMONIALS);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (t?: Testimonial) => {
    if (t) {
      setEditingItem(t);
      setFormData({
        clientName: t.clientName,
        clientRole: t.clientRole,
        clientCompany: t.clientCompany,
        clientAvatarUrl: t.clientAvatarUrl || '',
        content: t.content,
        rating: t.rating,
        isFeatured: t.isFeatured,
        order: t.order,
      });
    } else {
      setEditingItem(null);
      setFormData({
        clientName: '',
        clientRole: 'Founder & CEO',
        clientCompany: '',
        clientAvatarUrl: '',
        content: '',
        rating: 5,
        isFeatured: true,
        order: testimonials.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      if (editingItem) {
        await apiClient.put(`/admin/testimonials/${editingItem.id}`, formData);
        setTestimonials((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item))
        );
        setNotification({ type: 'success', message: 'Testimonial updated successfully' });
      } else {
        const res = await apiClient.post<any>('/admin/testimonials', formData);
        const created: Testimonial = res.data || {
          id: `test-${Date.now()}`,
          ...formData,
        };
        setTestimonials((prev) => [...prev, created]);
        setNotification({ type: 'success', message: 'Testimonial created successfully' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save testimonial' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from ${name}?`)) return;

    try {
      await apiClient.delete(`/admin/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
      setNotification({ type: 'success', message: 'Testimonial deleted successfully' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete testimonial' });
    }
  };

  const filteredTestimonials = testimonials.filter(
    (item) =>
      item.clientName.toLowerCase().includes(search.toLowerCase()) ||
      item.clientCompany.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#D9F45F]" />
            Client Reviews & Testimonials CMS
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage authentic client reviews, executive feedback, star ratings, and homepage featured testimonials.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#663399] hover:bg-[#52297A] text-white font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
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

      {/* Testimonials Table */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2A2B28]">
              <TableHead className="text-zinc-400 text-xs">Client & Company</TableHead>
              <TableHead className="text-zinc-400 text-xs">Rating</TableHead>
              <TableHead className="text-zinc-400 text-xs">Feedback Excerpt</TableHead>
              <TableHead className="text-zinc-400 text-xs">Featured</TableHead>
              <TableHead className="text-zinc-400 text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i} className="border-[#2A2B28]">
                  <TableCell><Skeleton className="h-5 w-36 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-60 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 bg-zinc-800 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 bg-zinc-800 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredTestimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                  No testimonials found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTestimonials.map((t) => (
                <TableRow key={t.id} className="border-[#2A2B28] hover:bg-zinc-800/40">
                  <TableCell>
                    <div className="font-semibold text-white text-sm">{t.clientName}</div>
                    <p className="text-xs text-zinc-400">
                      {t.clientRole} • <span className="text-white">{t.clientCompany}</span>
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: t.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-zinc-300 line-clamp-2 max-w-md italic">
                      &quot;{t.content}&quot;
                    </p>
                  </TableCell>
                  <TableCell>
                    {t.isFeatured ? (
                      <Badge variant="default" className="bg-[#D9F45F] text-[#151414] font-bold text-[10px]">
                        FEATURED
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-zinc-500 border-zinc-700 text-[10px]">
                        STANDARD
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(t)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                        title="Edit Testimonial"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(t.id, t.clientName)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-rose-400"
                        title="Delete Testimonial"
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit Testimonial: ${editingItem.clientName}` : 'Add Client Testimonial'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Client Name</label>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Dr. Vikram Malhotra"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Job Title / Role</label>
              <Input
                value={formData.clientRole}
                onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                placeholder="Chief Technology Officer"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Company / Organization</label>
              <Input
                value={formData.clientCompany}
                onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                placeholder="NovaCura Healthcare"
                className="bg-[#151414] border-[#2A2B28] text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1 block">Star Rating (1 - 5)</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                className="w-full bg-[#151414] border border-[#2A2B28] rounded-md px-3 py-2 text-sm text-white"
              >
                <option value={5}>★★★★★ (5 Stars - Outstanding)</option>
                <option value={4}>★★★★☆ (4 Stars - High Quality)</option>
                <option value={3}>★★★☆☆ (3 Stars - Average)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1 block">Client Feedback / Review</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              placeholder="What specific impact did Silwasa's engineering have on your business metrics?"
              className="w-full bg-[#151414] border border-[#2A2B28] rounded-md p-3 text-sm text-white focus:outline-none focus:border-[#663399]"
              required
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-[#2A2B28] bg-[#151414] text-[#663399]"
              />
              Showcase on Homepage Carousel
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
              {saving ? 'Saving...' : editingItem ? 'Update Testimonial' : 'Add Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
