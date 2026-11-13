'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import type { FAQItem } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  HelpCircle,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Folder
} from 'lucide-react';

const SEEDED_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does Silwasa ensure high-performance Core Web Vitals?',
    answer: 'We leverage Next.js 15 App Router with server-side rendering (SSR), incremental static regeneration (ISR), automated image optimization with WebP/AVIF formats, and aggressive tree-shaking to maintain sub-second Largest Contentful Paint (LCP) and 100/100 Lighthouse performance scores.',
    category: 'Engineering & Performance',
    order: 0,
    isPublished: true,
  },
  {
    id: 'faq-2',
    question: 'What is your software development engagement model?',
    answer: 'We offer sprint-based agile delivery, fixed-scope milestone contracts, and dedicated technical architecture teams. Each sprint includes code reviews, automated CI/CD staging deployments, and weekly stakeholder demos.',
    category: 'Contracts & Delivery',
    order: 1,
    isPublished: true,
  },
  {
    id: 'faq-3',
    question: 'Can our in-house team manage website content without editing code?',
    answer: 'Yes. Our custom CMS provides a visual section-based modular page builder, live mega-menu designer, rich-text blog publishing with instant reading time estimation, media library, and pricing tier controls.',
    category: 'CMS & Customization',
    order: 2,
    isPublished: true,
  },
  {
    id: 'faq-4',
    question: 'Do you build HIPAA and RBI/PCI-DSS compliant systems?',
    answer: 'Yes. Our enterprise backends adhere to Argon2id password hashing, HTTP-only signed session cookies, end-to-end TLS payload encryption, role-based access control (RBAC), and strict audit logging.',
    category: 'Security & Compliance',
    order: 3,
    isPublished: true,
  }
];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'General',
    order: 0,
    isPublished: true,
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>('/admin/faqs');
      if (res && res.data && res.data.length > 0) {
        setFaqs(res.data);
      } else {
        setFaqs(SEEDED_FAQS);
      }
    } catch {
      setFaqs(SEEDED_FAQS);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: FAQItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        question: item.question,
        answer: item.answer,
        category: item.category,
        order: item.order,
        isPublished: item.isPublished,
      });
    } else {
      setEditingItem(null);
      setFormData({
        question: '',
        answer: '',
        category: 'General',
        order: faqs.length,
        isPublished: true,
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
        await apiClient.put(`/admin/faqs/${editingItem.id}`, formData);
        setFaqs((prev) =>
          prev.map((f) => (f.id === editingItem.id ? { ...f, ...formData } : f))
        );
        setNotification({ type: 'success', message: 'FAQ updated successfully' });
      } else {
        const res = await apiClient.post<any>('/admin/faqs', formData);
        const created: FAQItem = res.data || {
          id: `faq-${Date.now()}`,
          ...formData,
        };
        setFaqs((prev) => [...prev, created]);
        setNotification({ type: 'success', message: 'FAQ added successfully' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save FAQ' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      await apiClient.delete(`/admin/faqs/${id}`);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      setNotification({ type: 'success', message: 'FAQ deleted successfully' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete FAQ' });
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#D9F45F]" />
            Frequently Asked Questions CMS
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage public FAQs categorized by engineering, security, and project contracts.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-[#663399] hover:bg-[#52297A] text-white font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ Item
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

      {/* FAQs Table */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2A2B28]">
              <TableHead className="text-zinc-400 text-xs">Question & Category</TableHead>
              <TableHead className="text-zinc-400 text-xs">Answer Preview</TableHead>
              <TableHead className="text-zinc-400 text-xs">Status</TableHead>
              <TableHead className="text-zinc-400 text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3].map((i) => (
                <TableRow key={i} className="border-[#2A2B28]">
                  <TableCell><Skeleton className="h-5 w-48 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-72 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16 bg-zinc-800 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 bg-zinc-800 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredFaqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-zinc-500">
                  No FAQs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredFaqs.map((f) => (
                <TableRow key={f.id} className="border-[#2A2B28] hover:bg-zinc-800/40">
                  <TableCell>
                    <div className="font-semibold text-white text-sm">{f.question}</div>
                    <Badge variant="outline" className="text-[10px] text-zinc-400 border-zinc-700 mt-1">
                      {f.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs text-zinc-300 line-clamp-2 max-w-lg leading-relaxed">
                      {f.answer}
                    </p>
                  </TableCell>
                  <TableCell>
                    {f.isPublished ? (
                      <Badge variant="default" className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                        ACTIVE
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-zinc-500 border-zinc-700 text-[10px]">
                        HIDDEN
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(f)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                        title="Edit FAQ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(f.id)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-rose-400"
                        title="Delete FAQ"
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
        title={editingItem ? 'Edit FAQ Item' : 'Create FAQ Item'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1 block">Question</label>
            <Input
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. What is your development methodology?"
              className="bg-[#151414] border-[#2A2B28] text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1 block">Category</label>
            <Input
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Engineering & Performance"
              className="bg-[#151414] border-[#2A2B28] text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1 block">Comprehensive Answer</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows={4}
              placeholder="Detailed technical or operational answer..."
              className="w-full bg-[#151414] border border-[#2A2B28] rounded-md p-3 text-sm text-white focus:outline-none focus:border-[#663399]"
              required
            />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-[#2A2B28] bg-[#151414] text-[#663399]"
              />
              Publish in Public FAQ Section
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
              {saving ? 'Saving...' : editingItem ? 'Update FAQ' : 'Create FAQ'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
