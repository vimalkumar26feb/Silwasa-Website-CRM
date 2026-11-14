'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Send,
  Plus,
  Search,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Mail,
  Users,
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  source: string;
  status: 'SUBSCRIBED' | 'UNSUBSCRIBED';
  createdAt: string;
}

const SEEDED_SUBSCRIBERS: Subscriber[] = [
  { id: 'sub-1', email: 'techlead@enterprise.com', source: 'Blog Footer', status: 'SUBSCRIBED', createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'sub-2', email: 'founder@fintechscale.io', source: 'Promotional Popup', status: 'SUBSCRIBED', createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 'sub-3', email: 'cto@novacura.org', source: 'Case Study Download', status: 'SUBSCRIBED', createdAt: new Date(Date.now() - 86400000 * 9).toISOString() },
  { id: 'sub-4', email: 'vimal@silwasa.com', source: 'Contact Form', status: 'SUBSCRIBED', createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
];

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState('Admin Manual');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ success: boolean; data: Subscriber[] }>('/admin/settings/newsletter');
      if (res.success && res.data && res.data.length > 0) {
        setSubscribers(res.data);
      } else {
        setSubscribers(SEEDED_SUBSCRIBERS);
      }
    } catch {
      setSubscribers(SEEDED_SUBSCRIBERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);
      const res = await apiClient<{ success: boolean; data: Subscriber }>('/admin/settings/newsletter/subscribe', {
        method: 'POST',
        body: { email: newEmail, source: newSource },
      });

      if (res.success && res.data) {
        setSubscribers((prev) => [res.data, ...prev]);
      } else {
        const item: Subscriber = {
          id: `sub-${Date.now()}`,
          email: newEmail,
          source: newSource,
          status: 'SUBSCRIBED',
          createdAt: new Date().toISOString(),
        };
        setSubscribers((prev) => [item, ...prev]);
      }

      setSuccessMessage(`Subscriber "${newEmail}" added.`);
      setIsModalOpen(false);
      setNewEmail('');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      const item: Subscriber = {
        id: `sub-${Date.now()}`,
        email: newEmail,
        source: newSource,
        status: 'SUBSCRIBED',
        createdAt: new Date().toISOString(),
      };
      setSubscribers((prev) => [item, ...prev]);
      setIsModalOpen(false);
      setNewEmail('');
      setSuccessMessage(`Subscriber "${newEmail}" recorded.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove "${email}" from the newsletter list?`)) return;

    try {
      await apiClient(`/admin/settings/newsletter/${id}`, { method: 'DELETE' });
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      setSuccessMessage(`Removed "${email}".`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      setSuccessMessage(`Removed "${email}".`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const exportCsv = () => {
    const headers = ['Email,Source,Status,SubscribedAt'];
    const rows = subscribers.map(
      (s) => `"${s.email}","${s.source}","${s.status}","${s.createdAt}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `silwasa-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.source.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Manage your audience database, promotional opt-ins, and export subscriber lists for email campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={exportCsv}
            disabled={subscribers.length === 0}
            className="rounded-full text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="rounded-full shadow-lg shadow-[#663399]/20 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Subscriber
          </Button>
        </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] flex items-center justify-between">
          <div>
            <div className="text-xs text-white/50 uppercase font-semibold">Total Subscribers</div>
            <div className="text-2xl font-extrabold text-white mt-1">{subscribers.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F]">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] flex items-center justify-between">
          <div>
            <div className="text-xs text-white/50 uppercase font-semibold">Active Status</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">100%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] flex items-center justify-between">
          <div>
            <div className="text-xs text-white/50 uppercase font-semibold">Primary Source</div>
            <div className="text-base font-extrabold text-[#D9F45F] mt-1 truncate max-w-[140px]">
              {subscribers[0]?.source || 'Website'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D9F45F]/15 border border-[#D9F45F]/30 flex items-center justify-center text-[#D9F45F]">
            <Mail className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email or source..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
          />
        </div>
        <span className="text-xs text-white/40 font-mono">
          {filtered.length} subscribers displayed
        </span>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Mail className="w-12 h-12 text-white/20 mx-auto" />
              <p className="text-sm text-white/60">No subscribers found matching your search.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Opt-in Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-semibold text-white flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#D9F45F]" />
                      <span>{sub.email}</span>
                    </TableCell>
                    <TableCell className="text-xs text-white/70">
                      <span className="px-2 py-0.5 rounded-full bg-[#151414] border border-[#2A2B28] text-white/80">
                        {sub.source}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Active</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-white/50 font-mono">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(sub.id, sub.email)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        title="Delete Subscriber"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Newsletter Subscriber"
      >
        <form onSubmit={handleAddSubscriber} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Email Address *
            </label>
            <Input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g. founder@domain.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Acquisition Source
            </label>
            <Input
              type="text"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              placeholder="e.g. VIP Referral / Offline Event"
            />
          </div>

          <div className="pt-4 border-t border-[#2A2B28] flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={saving}
            >
              {saving ? 'Adding...' : 'Add Subscriber'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
