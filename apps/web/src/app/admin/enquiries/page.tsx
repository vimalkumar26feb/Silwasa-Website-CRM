'use client';

import React, { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../../../lib/api';
import type { Enquiry, EnquiryNote } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Inbox,
  Search,
  MessageSquare,
  Phone,
  Mail,
  Building,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  Send,
  MessageCircle,
  Filter,
  DollarSign,
  UserCheck
} from 'lucide-react';

const SEEDED_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    enquiryId: 'ENQ-2611-001',
    name: 'Rajesh Singhania',
    email: 'rajesh@singhaniagroup.in',
    phone: '+91 9820011223',
    company: 'Singhania Logistics & Supply',
    country: 'India',
    service: 'Custom Software Development',
    budget: '₹5,00,000 - ₹10,00,000',
    message: 'We require an end-to-end fleet tracking and dispatch coordination portal with real-time GPS telemetry, role-based driver dispatching, and automated billing generation.',
    sourcePage: '/services/custom-software-development',
    status: 'NEW',
    createdAt: '2026-11-13T09:30:00Z',
    updatedAt: '2026-11-13T09:30:00Z',
    notes: [
      {
        id: 'n-1',
        content: 'Lead arrived from Service Detail page. High-priority logistics project.',
        authorName: 'System',
        createdAt: '2026-11-13T09:30:00Z'
      }
    ]
  },
  {
    id: 'enq-2',
    enquiryId: 'ENQ-2611-002',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@novacurahealth.com',
    phone: '+91 9765432190',
    company: 'NovaCura Healthcare',
    country: 'India',
    service: 'Website Design and Development',
    budget: '₹2,00,000 - ₹5,00,000',
    message: 'Seeking a modern, HIPAA-compliant patient intake portal and multi-specialty hospital presentation website with doctor scheduling integrations.',
    sourcePage: '/industries/healthcare',
    status: 'CONTACTED',
    createdAt: '2026-11-12T14:15:00Z',
    updatedAt: '2026-11-12T16:00:00Z',
    notes: [
      {
        id: 'n-2',
        content: 'Spoke with Dr. Ananya via WhatsApp. Scheduled technical discovery call for Friday.',
        authorName: 'Admin',
        createdAt: '2026-11-12T16:00:00Z'
      }
    ]
  },
  {
    id: 'enq-3',
    enquiryId: 'ENQ-2611-003',
    name: 'Marcus Vance',
    email: 'm.vance@vancetech.io',
    phone: '+1 415 890 2311',
    company: 'Vance Autonomous Systems',
    country: 'United States',
    service: 'React.js Development',
    budget: '$5,000 - $10,000',
    message: 'We need senior React 19 / TypeScript developers to accelerate our SaaS telemetry dashboard refactor. Clean code and architectural rigor are paramount.',
    sourcePage: '/contact',
    status: 'IN_PROGRESS',
    createdAt: '2026-11-11T18:40:00Z',
    updatedAt: '2026-11-12T10:00:00Z',
    notes: [
      {
        id: 'n-3',
        content: 'Signed NDA and delivered sprint proposal. Client reviewing contract.',
        authorName: 'Sales Lead',
        createdAt: '2026-11-12T10:00:00Z'
      }
    ]
  },
  {
    id: 'enq-4',
    enquiryId: 'ENQ-2611-004',
    name: 'Vikram Joshi',
    email: 'vikram@joshi-jewellers.com',
    phone: '+91 9988776655',
    company: 'Joshi Fine Jewels',
    country: 'India',
    service: 'E-commerce Website Development',
    budget: '₹3,00,000 - ₹6,00,000',
    message: 'Luxury jewelry e-commerce website with 3D product showcase, multi-currency checkout, and ERP inventory sync.',
    sourcePage: '/pricing',
    status: 'CONVERTED',
    createdAt: '2026-11-08T11:20:00Z',
    updatedAt: '2026-11-10T15:30:00Z',
    notes: [
      {
        id: 'n-4',
        content: 'Advance payment received. Project kicked off under Silwasa Scale & Performance plan.',
        authorName: 'Admin',
        createdAt: '2026-11-10T15:30:00Z'
      }
    ]
  }
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const queryParam = statusFilter !== 'ALL' ? `?status=${statusFilter}` : '';
      const response = await apiClient.get<any>(`/admin/enquiries${queryParam}`);
      if (response?.data?.items) {
        setEnquiries(response.data.items);
      } else if (response?.items) {
        setEnquiries(response.items);
      } else {
        setEnquiries(SEEDED_ENQUIRIES);
      }
    } catch {
      setEnquiries(SEEDED_ENQUIRIES);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setNewStatus(enq.status);
    setStatusNote('');
    setNewNoteContent('');
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedEnquiry || !newStatus) return;
    setSavingNote(true);
    try {
      await apiClient.put(`/admin/enquiries/${selectedEnquiry.id}/status`, {
        status: newStatus,
        note: statusNote.trim() || undefined
      });

      setNotification({
        type: 'success',
        message: `Status updated to ${newStatus} successfully.`
      });

      // Update locally
      const updatedNotes: EnquiryNote[] = statusNote.trim()
        ? [
            {
              id: `temp-${Date.now()}`,
              content: statusNote.trim(),
              authorName: 'Admin',
              createdAt: new Date().toISOString()
            },
            ...(selectedEnquiry.notes || [])
          ]
        : selectedEnquiry.notes || [];

      const updatedEnquiry: Enquiry = {
        ...selectedEnquiry,
        status: newStatus as any,
        notes: updatedNotes
      };

      setSelectedEnquiry(updatedEnquiry);
      setEnquiries((prev) => prev.map((e) => (e.id === selectedEnquiry.id ? updatedEnquiry : e)));
      setStatusNote('');
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update status'
      });
    } finally {
      setSavingNote(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !newNoteContent.trim()) return;

    setSavingNote(true);
    try {
      await apiClient.post(`/admin/enquiries/${selectedEnquiry.id}/notes`, {
        content: newNoteContent.trim(),
        authorName: 'Admin'
      });

      const newNote: EnquiryNote = {
        id: `note-${Date.now()}`,
        content: newNoteContent.trim(),
        authorName: 'Admin',
        createdAt: new Date().toISOString()
      };

      const updatedNotes = [newNote, ...(selectedEnquiry.notes || [])];
      const updatedEnquiry = { ...selectedEnquiry, notes: updatedNotes };

      setSelectedEnquiry(updatedEnquiry);
      setEnquiries((prev) => prev.map((item) => (item.id === selectedEnquiry.id ? updatedEnquiry : item)));
      setNewNoteContent('');
      setNotification({ type: 'success', message: 'Internal note saved.' });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to save note' });
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string, ref: string) => {
    if (!confirm(`Are you sure you want to delete enquiry ${ref}? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiClient.delete(`/admin/enquiries/${id}`);
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedEnquiry?.id === id) {
        setIsDetailModalOpen(false);
      }
      setNotification({ type: 'success', message: `Enquiry ${ref} deleted successfully.` });
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Failed to delete enquiry' });
    }
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesFilter = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch =
      search.trim() === '' ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      (item.phone && item.phone.includes(search)) ||
      (item.company && item.company.toLowerCase().includes(search.toLowerCase())) ||
      item.enquiryId.toLowerCase().includes(search.toLowerCase()) ||
      (item.service && item.service.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === 'NEW').length,
    contacted: enquiries.filter((e) => e.status === 'CONTACTED').length,
    inProgress: enquiries.filter((e) => e.status === 'IN_PROGRESS').length,
    converted: enquiries.filter((e) => e.status === 'CONVERTED').length
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="default" className="bg-[#D9F45F] text-[#151414] font-bold">NEW LEAD</Badge>;
      case 'CONTACTED':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border border-blue-500/30">CONTACTED</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border border-purple-500/30">IN PROGRESS</Badge>;
      case 'CONVERTED':
        return <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">CONVERTED</Badge>;
      case 'CLOSED':
        return <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">CLOSED</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-[#D9F45F]" />
            Client Enquiries & Leads
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage incoming project requests, customer quotes, consultation requests, and team response notes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchEnquiries} className="border-[#2A2B28] text-zinc-300">
            Refresh Inbox
          </Button>
        </div>
      </div>

      {/* Notifications */}
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

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-[#1C1B1B] border-[#2A2B28]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">Total Leads</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <Inbox className="w-8 h-8 text-zinc-600" />
          </CardContent>
        </Card>
        <Card className="bg-[#1C1B1B] border-[#2A2B28]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">New / Unread</p>
              <p className="text-2xl font-bold text-[#D9F45F] mt-1">{stats.new}</p>
            </div>
            <Clock className="w-8 h-8 text-[#D9F45F]/40" />
          </CardContent>
        </Card>
        <Card className="bg-[#1C1B1B] border-[#2A2B28]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">Contacted</p>
              <p className="text-2xl font-bold text-blue-400 mt-1">{stats.contacted}</p>
            </div>
            <Phone className="w-8 h-8 text-blue-500/40" />
          </CardContent>
        </Card>
        <Card className="bg-[#1C1B1B] border-[#2A2B28]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">In Progress</p>
              <p className="text-2xl font-bold text-purple-400 mt-1">{stats.inProgress}</p>
            </div>
            <UserCheck className="w-8 h-8 text-purple-500/40" />
          </CardContent>
        </Card>
        <Card className="bg-[#1C1B1B] border-[#2A2B28]">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400">Converted</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.converted}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-500/40" />
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {['ALL', 'NEW', 'CONTACTED', 'IN_PROGRESS', 'CONVERTED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-[#663399] text-white shadow-sm'
                  : 'bg-[#1C1B1B] text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {st === 'ALL' ? 'All Leads' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads, phone, email..."
            className="pl-9 bg-[#1C1B1B] border-[#2A2B28] text-white text-xs h-9"
          />
        </div>
      </div>

      {/* Leads Table */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#2A2B28]">
              <TableHead className="text-zinc-400 text-xs">Reference</TableHead>
              <TableHead className="text-zinc-400 text-xs">Client & Organization</TableHead>
              <TableHead className="text-zinc-400 text-xs">Contact Information</TableHead>
              <TableHead className="text-zinc-400 text-xs">Service & Budget</TableHead>
              <TableHead className="text-zinc-400 text-xs">Status</TableHead>
              <TableHead className="text-zinc-400 text-xs">Received</TableHead>
              <TableHead className="text-zinc-400 text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <TableRow key={i} className="border-[#2A2B28]">
                  <TableCell><Skeleton className="h-4 w-20 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 bg-zinc-800 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12 bg-zinc-800 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-zinc-500">
                  <Inbox className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p>No enquiries found matching your filter criteria.</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredEnquiries.map((enq) => (
                <TableRow key={enq.id} className="border-[#2A2B28] hover:bg-zinc-800/40">
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-zinc-300">
                      {enq.enquiryId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-semibold text-white">{enq.name}</p>
                      {enq.company && (
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-zinc-500" />
                          {enq.company}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <a
                        href={`mailto:${enq.email}`}
                        className="text-xs text-zinc-300 hover:text-[#D9F45F] flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3 text-zinc-500" />
                        {enq.email}
                      </a>
                      {enq.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-400">{enq.phone}</span>
                          <a
                            href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-medium text-white">{enq.service || 'General Project'}</p>
                      {enq.budget && (
                        <p className="text-xs text-[#D9F45F] font-mono mt-0.5">{enq.budget}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(enq.status)}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400">
                    {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDetail(enq)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(enq.id, enq.enquiryId)}
                        className="h-8 w-8 p-0 text-zinc-400 hover:text-rose-400"
                        title="Delete Enquiry"
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

      {/* Enquiry Details & Notes Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Enquiry ${selectedEnquiry.enquiryId}`}
        >
          <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
            {/* Overview Grid */}
            <div className="grid grid-cols-2 gap-4 bg-[#151414] p-4 rounded-lg border border-[#2A2B28]">
              <div>
                <p className="text-xs text-zinc-500 font-medium">Client Name</p>
                <p className="text-sm font-semibold text-white mt-0.5">{selectedEnquiry.name}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Company</p>
                <p className="text-sm text-zinc-200 mt-0.5">{selectedEnquiry.company || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Email Address</p>
                <a href={`mailto:${selectedEnquiry.email}`} className="text-sm text-[#D9F45F] hover:underline mt-0.5 block">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Phone / WhatsApp</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-zinc-200">{selectedEnquiry.phone || 'Not provided'}</span>
                  {selectedEnquiry.phone && (
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline text-xs flex items-center gap-1 font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Service Requested</p>
                <p className="text-sm font-semibold text-white mt-0.5">{selectedEnquiry.service || 'General Consultation'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Budget</p>
                <p className="text-sm text-[#D9F45F] font-mono mt-0.5">{selectedEnquiry.budget || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Origin Page</p>
                <p className="text-xs text-zinc-400 mt-0.5">{selectedEnquiry.sourcePage || '/contact'}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Submission Timestamp</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {new Date(selectedEnquiry.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
            </div>

            {/* Client Message */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">
                Project Requirements / Message
              </h4>
              <div className="bg-[#151414] p-4 rounded-lg border border-[#2A2B28] text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Status Update Card */}
            <div className="bg-[#151414] p-4 rounded-lg border border-[#2A2B28] space-y-3">
              <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
                Update Lead Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#1C1B1B] border border-[#2A2B28] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#663399]"
                  >
                    <option value="NEW">NEW LEAD</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="CONVERTED">CONVERTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Transition Note (Optional)</label>
                  <Input
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Discussed pricing via call"
                    className="bg-[#1C1B1B] border-[#2A2B28] text-white text-xs"
                  />
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleUpdateStatus}
                disabled={savingNote}
                className="bg-[#663399] hover:bg-[#52297A] text-white font-medium"
              >
                {savingNote ? 'Updating...' : 'Save Status Change'}
              </Button>
            </div>

            {/* Internal Notes History */}
            <div>
              <h4 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                Internal Team Notes ({selectedEnquiry.notes?.length || 0})
              </h4>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
                <Input
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Add an internal note or update for your team..."
                  className="bg-[#151414] border-[#2A2B28] text-white text-xs flex-1"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={savingNote || !newNoteContent.trim()}
                  className="bg-[#D9F45F] text-[#151414] font-bold hover:bg-[#cbf03f]"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </form>

              {/* Notes Timeline */}
              <div className="space-y-2">
                {!selectedEnquiry.notes || selectedEnquiry.notes.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">No internal notes added yet.</p>
                ) : (
                  selectedEnquiry.notes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-[#151414] p-3 rounded border border-[#2A2B28] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-zinc-400">
                        <span className="font-semibold text-zinc-200">{note.authorName}</span>
                        <span className="text-[11px] text-zinc-500">
                          {new Date(note.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
