'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import type { PricingPackage, Service } from '@silwasa/types';
import { calculateEffectivePrice, formatCurrency } from '@silwasa/shared';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Tag,
  ToggleLeft,
  ToggleRight,
  Zap,
  Briefcase,
  Table as TableIcon,
  List,
  Check,
  X,
} from 'lucide-react';

interface TableFeatureRow {
  feature: string;
  spec: string;
  included: boolean;
}

const SEEDED_PACKAGES: PricingPackage[] = [
  {
    id: 'pkg-1',
    name: 'Growth Foundation',
    serviceId: null,
    serviceName: 'General / All Services',
    shortDescription: 'Ideal for ambitious businesses seeking a custom, high-converting digital platform.',
    regularPrice: 1299,
    discountType: 'PERCENTAGE',
    discountValue: 15,
    currency: 'USD',
    features: [
      { id: 'f1', text: 'Custom Next.js 15 Web Platform', included: true },
      { id: 'f2', text: 'Up to 10 Dynamic Pages', included: true },
      { id: 'f3', text: 'Sub-Second LCP Performance', included: true },
      { id: 'f4', text: 'Full Custom CMS Access', included: true },
      { id: 'f5', text: '30-Day Post-Launch SLA Warranty', included: true },
    ],
    isPopular: false,
    ctaLabel: 'Choose Growth Plan',
    ctaUrl: '/contact?plan=growth',
    order: 0,
    isActive: true,
  },
  {
    id: 'pkg-2',
    name: 'Scale & Performance',
    serviceId: null,
    serviceName: 'General / All Services',
    shortDescription: 'Enterprise architecture with Generative Engine Optimization and advanced workflows.',
    regularPrice: 2499,
    discountType: 'PERCENTAGE',
    discountValue: 20,
    currency: 'USD',
    features: [
      { id: 'f6', text: 'Everything in Growth Foundation', included: true },
      { id: 'f7', text: 'Generative Engine Optimization (GEO)', included: true },
      { id: 'f8', text: 'Custom Role-Based Admin Dashboard', included: true },
      { id: 'f9', text: 'Blog & Resource Center CMS', included: true },
      { id: 'f10', text: '90-Day Priority Engineering SLA', included: true },
    ],
    isPopular: true,
    ctaLabel: 'Get Scale Architecture',
    ctaUrl: '/contact?plan=scale',
    order: 1,
    isActive: true,
  },
  {
    id: 'pkg-3',
    name: 'Custom Enterprise Architecture',
    serviceId: null,
    serviceName: 'General / All Services',
    shortDescription: 'Bespoke systems, microservices, private AI agent integrations, and dedicated tech leads.',
    regularPrice: 4999,
    currency: 'USD',
    features: [
      { id: 'f11', text: 'Everything in Scale & Performance', included: true },
      { id: 'f12', text: 'Private AI Agent / RAG Pipeline', included: true },
      { id: 'f13', text: 'Microservices & API Gateway', included: true },
      { id: 'f14', text: 'SOC 2 / HIPAA Compliance Hardening', included: true },
      { id: 'f15', text: '24/7 Dedicated Tech Lead SLA', included: true },
    ],
    isPopular: false,
    ctaLabel: 'Schedule Consultation',
    ctaUrl: '/contact?plan=enterprise',
    order: 2,
    isActive: true,
  },
];

export default function AdminPricingPage() {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [serviceId, setServiceId] = useState<string>('');
  const [shortDesc, setShortDesc] = useState('');
  const [regularPrice, setRegularPrice] = useState<number>(1000);
  const [currency, setCurrency] = useState('USD');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED' | ''>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [isPopular, setIsPopular] = useState(false);
  const [ctaLabel, setCtaLabel] = useState('Choose Plan');
  const [ctaUrl, setCtaUrl] = useState('/contact');

  // Advanced Features Editor State
  const [featureEditorMode, setFeatureEditorMode] = useState<'lines' | 'table'>('lines');
  const [featureLines, setFeatureLines] = useState('');
  const [tableRows, setTableRows] = useState<TableFeatureRow[]>([
    { feature: 'Core Web Architecture', spec: 'Next.js 15 App Router', included: true },
    { feature: 'Page Count', spec: 'Up to 10 Pages', included: true },
    { feature: 'Search Performance', spec: 'Sub-Second LCP', included: true },
    { feature: 'CMS Access', spec: 'Full Role-Based Access', included: true },
  ]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pricingRes, servicesRes] = await Promise.allSettled([
        apiClient<{ success: boolean; data: PricingPackage[] }>('/admin/pricing'),
        apiClient<{ success: boolean; data: Service[] }>('/admin/services'),
      ]);

      if (pricingRes.status === 'fulfilled' && pricingRes.value.success && pricingRes.value.data) {
        setPackages(pricingRes.value.data);
      } else {
        setPackages(SEEDED_PACKAGES);
      }

      if (servicesRes.status === 'fulfilled' && servicesRes.value.success && servicesRes.value.data) {
        setServices(servicesRes.value.data);
      }
    } catch {
      setPackages(SEEDED_PACKAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setServiceId(selectedServiceFilter !== 'All' ? selectedServiceFilter : '');
    setShortDesc('');
    setRegularPrice(1200);
    setCurrency('USD');
    setDiscountType('PERCENTAGE');
    setDiscountValue(15);
    setIsPopular(false);
    setCtaLabel('Choose Plan');
    setCtaUrl('/contact');
    setFeatureEditorMode('lines');
    setFeatureLines('Custom Next.js 15 Platform\nSub-Second LCP Performance\nFull CMS Access\nPost-Launch SLA Warranty');
    setTableRows([
      { feature: 'Architecture', spec: 'Next.js 15 & React 19', included: true },
      { feature: 'Pages Included', spec: 'Up to 10 Pages', included: true },
      { feature: 'SEO & Core Web Vitals', spec: '< 1s LCP Benchmark', included: true },
      { feature: 'Support SLA', spec: '30-Day Priority Engineering', included: true },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: PricingPackage) => {
    setEditingId(pkg.id);
    setName(pkg.name);
    setServiceId(pkg.serviceId || '');
    setShortDesc(pkg.shortDescription);
    setRegularPrice(Number(pkg.regularPrice));
    setCurrency(pkg.currency || 'USD');
    setDiscountType(pkg.discountType || '');
    setDiscountValue(pkg.discountValue ? Number(pkg.discountValue) : 0);
    setIsPopular(pkg.isPopular);
    setCtaLabel(pkg.ctaLabel || 'Choose Plan');
    setCtaUrl(pkg.ctaUrl || '/contact');

    // Populate lines
    setFeatureLines(pkg.features.map((f) => f.text).join('\n'));

    // Populate table rows if present, or generate from features
    if (pkg.tableFeatures && Array.isArray(pkg.tableFeatures) && pkg.tableFeatures.length > 0) {
      setTableRows(pkg.tableFeatures);
      setFeatureEditorMode('table');
    } else {
      setTableRows(
        pkg.features.map((f) => {
          const parts = f.text.split(':');
          return {
            feature: parts[0]?.trim() || f.text,
            spec: parts[1]?.trim() || 'Included',
            included: f.included !== false,
          };
        })
      );
      setFeatureEditorMode('lines');
    }

    setIsModalOpen(true);
  };

  const handleAddTableRow = () => {
    setTableRows([...tableRows, { feature: '', spec: 'Included', included: true }]);
  };

  const handleRemoveTableRow = (idx: number) => {
    setTableRows(tableRows.filter((_, i) => i !== idx));
  };

  const handleUpdateTableRow = (idx: number, field: keyof TableFeatureRow, value: any) => {
    const updated = [...tableRows];
    updated[idx] = { ...updated[idx], [field]: value };
    setTableRows(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortDesc.trim() || regularPrice <= 0) return;

    let parsedFeatures: { id: string; text: string; included: boolean }[] = [];

    if (featureEditorMode === 'table') {
      parsedFeatures = tableRows
        .filter((r) => r.feature.trim())
        .map((r, idx) => ({
          id: `feat-${idx}`,
          text: r.spec.trim() ? `${r.feature.trim()}: ${r.spec.trim()}` : r.feature.trim(),
          included: r.included,
        }));
    } else {
      parsedFeatures = featureLines
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((text, idx) => ({ id: `feat-${idx}`, text, included: true }));
    }

    if (parsedFeatures.length === 0) {
      setErrorMessage('Please include at least one feature');
      return;
    }

    const payload = {
      name: name.trim(),
      serviceId: serviceId.trim() || null,
      shortDescription: shortDesc.trim(),
      regularPrice: Number(regularPrice),
      currency: currency.trim() || 'USD',
      discountType: discountType || null,
      discountValue: discountValue ? Number(discountValue) : null,
      isPopular,
      features: parsedFeatures,
      tableFeatures: featureEditorMode === 'table' ? tableRows.filter((r) => r.feature.trim()) : null,
      ctaLabel: ctaLabel.trim() || 'Choose Plan',
      ctaUrl: ctaUrl.trim() || '/contact',
      isActive: true,
    };

    try {
      if (editingId) {
        await apiClient(`/admin/pricing/${editingId}`, {
          method: 'PUT',
          body: payload,
        });
        setSuccessMessage(`Pricing package "${name}" updated successfully`);
      } else {
        await apiClient<{ success: boolean; data: PricingPackage }>('/admin/pricing', {
          method: 'POST',
          body: payload,
        });
        setSuccessMessage(`Pricing package "${name}" created successfully`);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save pricing package');
    }
  };

  const handleDelete = async (id: string, pkgName: string) => {
    if (!confirm(`Are you sure you want to delete "${pkgName}"?`)) return;

    try {
      await apiClient(`/admin/pricing/${id}`, { method: 'DELETE' });
      setPackages(packages.filter((p) => p.id !== id));
      setSuccessMessage(`Package "${pkgName}" deleted`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete pricing package');
    }
  };

  // Filter packages based on selected service
  const filteredPackages = packages.filter((pkg) => {
    if (selectedServiceFilter === 'All') return true;
    if (selectedServiceFilter === 'general') return !pkg.serviceId;
    return pkg.serviceId === selectedServiceFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-7 h-7 text-[#D9F45F]" />
            Pricing Plans & Service Packages
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Configure dynamic pricing tiers tied to specific services (or general offerings) with multi-line features and comparison tables.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="rounded-full shadow-lg shadow-[#663399]/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Package
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

      {/* Filter by Service Bar */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#D9F45F]" />
            <span className="text-xs font-semibold text-white/80">Filter Packages By Service:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedServiceFilter('All')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedServiceFilter === 'All'
                  ? 'bg-[#663399] text-white shadow-md'
                  : 'bg-[#151414] text-white/70 hover:text-white border border-[#2A2B28]'
              }`}
            >
              All Packages ({packages.length})
            </button>
            <button
              onClick={() => setSelectedServiceFilter('general')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedServiceFilter === 'general'
                  ? 'bg-[#663399] text-white shadow-md'
                  : 'bg-[#151414] text-white/70 hover:text-white border border-[#2A2B28]'
              }`}
            >
              General / Core Platform
            </button>
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedServiceFilter(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition shrink-0 ${
                  selectedServiceFilter === s.id
                    ? 'bg-[#663399] text-white shadow-md'
                    : 'bg-[#151414] text-white/70 hover:text-white border border-[#2A2B28]'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Packages Table */}
      <Card className="bg-[#1C1B1B] border-[#2A2B28]">
        <CardHeader>
          <CardTitle className="text-white">Active Packages ({filteredPackages.length})</CardTitle>
          <CardDescription className="text-zinc-400">
            Tied to your service landing pages and dynamically pulled by the Pricing Plan reusable section.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="text-center py-16 text-white/50 space-y-3">
              <CreditCard className="w-10 h-10 mx-auto text-white/20" />
              <p className="text-base font-medium">No pricing packages found</p>
              <Button variant="outline" size="sm" onClick={openCreateModal}>
                Create Package
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#2A2B28]">
                    <TableHead className="text-zinc-400">Package Name</TableHead>
                    <TableHead className="text-zinc-400">Associated Service</TableHead>
                    <TableHead className="text-zinc-400">Price & Discount</TableHead>
                    <TableHead className="text-zinc-400">Features Format</TableHead>
                    <TableHead className="text-zinc-400">Badge</TableHead>
                    <TableHead className="text-right text-zinc-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.map((pkg) => {
                    const priceCalc = calculateEffectivePrice(
                      Number(pkg.regularPrice),
                      pkg.discountType,
                      pkg.discountValue ? Number(pkg.discountValue) : null
                    );
                    const associatedService = services.find((s) => s.id === pkg.serviceId);

                    return (
                      <TableRow key={pkg.id} className="border-[#2A2B28] hover:bg-white/[0.02]">
                        <TableCell>
                          <div>
                            <div className="font-bold text-white text-sm">{pkg.name}</div>
                            <div className="text-xs text-white/50 truncate max-w-xs">
                              {pkg.shortDescription}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {associatedService ? (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#663399]/20 text-[#D9F45F] border border-[#663399]/40">
                              {associatedService.title}
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-400 px-2 py-0.5 rounded bg-[#151414] border border-[#2A2B28]">
                              General Platform
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="font-bold text-white text-sm">
                              {formatCurrency(priceCalc.effectivePrice, pkg.currency)}
                            </span>
                            {priceCalc.hasActiveDiscount && (
                              <span className="text-xs text-white/40 line-through">
                                {formatCurrency(Number(pkg.regularPrice), pkg.currency)}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            {pkg.tableFeatures && pkg.tableFeatures.length > 0 ? (
                              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                                <TableIcon className="w-3 h-3" /> Matrix Table ({pkg.tableFeatures.length})
                              </span>
                            ) : (
                              <span className="text-[11px] text-zinc-400 bg-[#151414] px-2 py-0.5 rounded border border-[#2A2B28] flex items-center gap-1">
                                <List className="w-3 h-3" /> List ({pkg.features.length} items)
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          {pkg.isPopular ? (
                            <Badge className="bg-[#D9F45F] text-[#151414] text-[10px] font-bold">
                              POPULAR
                            </Badge>
                          ) : (
                            <span className="text-xs text-zinc-500">Standard</span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 text-xs border-[#2A2B28] hover:border-[#663399]"
                              onClick={() => openEditModal(pkg)}
                            >
                              <Edit3 className="w-3.5 h-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => handleDelete(pkg.id, pkg.name)}
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

      {/* Create / Edit Pricing Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Service Package' : 'Create New Service Package'}
        description="Configure pricing, linked service, and included feature list or comparison table."
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Associated Service Selection */}
          <div className="p-3.5 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-1.5">
            <label className="block text-xs font-semibold text-white/80 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#D9F45F]" />
              Associated Service Offering *
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
            >
              <option value="">General / Core Platform (All Services)</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.category || 'General'})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-500">
              When creating a page layout with the Pricing Plans component, you can choose to display only packages tied to this service.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Package Name *
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Scale & Performance"
                className="bg-[#151414] border-[#2A2B28] text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Currency & Base Price *
              </label>
              <div className="flex gap-2">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-24 px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs"
                >
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
                <Input
                  type="number"
                  required
                  min="1"
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(Number(e.target.value))}
                  placeholder="2499"
                  className="bg-[#151414] border-[#2A2B28] text-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Discount Type & Value
              </label>
              <div className="flex gap-2">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-36 px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs"
                >
                  <option value="">No Discount</option>
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount</option>
                </select>
                {discountType && (
                  <Input
                    type="number"
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    placeholder="15"
                    className="bg-[#151414] border-[#2A2B28] text-white"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-white">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="rounded bg-[#151414] border-[#2A2B28] text-[#663399] focus:ring-0 w-4 h-4"
                />
                <span>Highlight As Most Popular Plan</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Short Description / Value Proposition *
            </label>
            <textarea
              rows={2}
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Enterprise architecture with Generative Engine Optimization..."
              className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
            />
          </div>

          {/* ADVANCED INCLUDED FEATURES & TABLE BUILDER */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-[#2A2B28] pb-2">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <span>Included Features & Deliverables *</span>
              </label>

              {/* Mode Switcher */}
              <div className="flex items-center rounded-lg bg-[#151414] border border-[#2A2B28] p-0.5">
                <button
                  type="button"
                  onClick={() => setFeatureEditorMode('lines')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                    featureEditorMode === 'lines'
                      ? 'bg-[#663399] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <List className="w-3 h-3" /> List View
                </button>
                <button
                  type="button"
                  onClick={() => setFeatureEditorMode('table')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                    featureEditorMode === 'table'
                      ? 'bg-[#663399] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-3 h-3" /> Advanced Table Builder
                </button>
              </div>
            </div>

            {featureEditorMode === 'lines' ? (
              <div>
                <textarea
                  rows={5}
                  value={featureLines}
                  onChange={(e) => setFeatureLines(e.target.value)}
                  placeholder="Custom Next.js 15 Web Platform&#10;Up to 10 Dynamic Pages&#10;Sub-Second LCP Performance&#10;Full Custom CMS Access"
                  className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs font-mono focus:outline-none focus:border-[#D9F45F] leading-relaxed"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Enter each feature on a separate line.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="overflow-x-auto rounded-xl border border-[#2A2B28]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#151414] text-zinc-400 font-semibold border-b border-[#2A2B28]">
                      <tr>
                        <th className="p-2">Feature / Capability Name</th>
                        <th className="p-2">Spec / Tier Value</th>
                        <th className="p-2 text-center w-20">Included</th>
                        <th className="p-2 text-right w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2B28] bg-[#1C1B1B]">
                      {tableRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.feature}
                              onChange={(e) => handleUpdateTableRow(idx, 'feature', e.target.value)}
                              placeholder="e.g. Next.js 15 Platform"
                              className="w-full px-2 py-1 rounded bg-[#151414] border border-[#2A2B28] text-white text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.spec}
                              onChange={(e) => handleUpdateTableRow(idx, 'spec', e.target.value)}
                              placeholder="e.g. Included / 10 Pages"
                              className="w-full px-2 py-1 rounded bg-[#151414] border border-[#2A2B28] text-white text-xs"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleUpdateTableRow(idx, 'included', !row.included)}
                              className={`w-6 h-6 rounded flex items-center justify-center mx-auto transition ${
                                row.included
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
                              }`}
                            >
                              {row.included ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveTableRow(idx)}
                              className="text-zinc-500 hover:text-red-400 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTableRow}
                  className="text-xs border-[#2A2B28] text-[#D9F45F] hover:bg-[#D9F45F]/10 w-full"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Feature Row
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                CTA Button Text
              </label>
              <Input
                type="text"
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                placeholder="Choose Plan"
                className="bg-[#151414] border-[#2A2B28] text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                CTA Target URL
              </label>
              <Input
                type="text"
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                placeholder="/contact?plan=scale"
                className="bg-[#151414] border-[#2A2B28] text-white font-mono text-xs"
              />
            </div>
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
              className="bg-[#663399] hover:bg-[#52297A] text-white font-semibold"
            >
              {editingId ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
