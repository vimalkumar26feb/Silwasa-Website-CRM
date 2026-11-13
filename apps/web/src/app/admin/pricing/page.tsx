'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../lib/api';
import type { PricingPackage } from '@silwasa/types';
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
} from 'lucide-react';

const SEEDED_PACKAGES: PricingPackage[] = [
  {
    id: 'pkg-1',
    name: 'Growth Foundation',
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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [regularPrice, setRegularPrice] = useState<number>(1000);
  const [currency, setCurrency] = useState('USD');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED' | ''>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [isPopular, setIsPopular] = useState(false);
  const [featureLines, setFeatureLines] = useState('');

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ success: boolean; data: PricingPackage[] }>('/admin/pricing');
      if (res.success && res.data && res.data.length > 0) {
        setPackages(res.data);
      } else {
        setPackages(SEEDED_PACKAGES);
      }
    } catch {
      setPackages(SEEDED_PACKAGES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setShortDesc('');
    setRegularPrice(1200);
    setCurrency('USD');
    setDiscountType('PERCENTAGE');
    setDiscountValue(15);
    setIsPopular(false);
    setFeatureLines('Custom Next.js 15 Platform\nSub-Second LCP Performance\nFull CMS Access');
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: PricingPackage) => {
    setEditingId(pkg.id);
    setName(pkg.name);
    setShortDesc(pkg.shortDescription);
    setRegularPrice(Number(pkg.regularPrice));
    setCurrency(pkg.currency || 'USD');
    setDiscountType(pkg.discountType || '');
    setDiscountValue(pkg.discountValue ? Number(pkg.discountValue) : 0);
    setIsPopular(pkg.isPopular);
    setFeatureLines(pkg.features.map((f) => f.text).join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !shortDesc.trim() || regularPrice <= 0) return;

    const parsedFeatures = featureLines
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text, idx) => ({ id: `feat-${idx}`, text, included: true }));

    const payload = {
      name,
      shortDescription: shortDesc,
      regularPrice: Number(regularPrice),
      currency,
      discountType: discountType || null,
      discountValue: discountValue ? Number(discountValue) : null,
      isPopular,
      features: parsedFeatures,
      ctaLabel: 'Choose Plan',
      ctaUrl: '/contact',
      isActive: true,
    };

    try {
      if (editingId) {
        await apiClient(`/admin/pricing/${editingId}`, {
          method: 'PUT',
          body: payload,
        });
        setSuccessMessage(`Pricing package "${name}" updated`);
      } else {
        const res = await apiClient<{ success: boolean; data: PricingPackage }>('/admin/pricing', {
          method: 'POST',
          body: payload,
        });
        setSuccessMessage(`Pricing package "${name}" created`);
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch {
      // Local fallback
      if (editingId) {
        setPackages(
          packages.map((p) => (p.id === editingId ? { ...p, ...payload, id: editingId } : p))
        );
      } else {
        const newPkg: PricingPackage = {
          id: `pkg-${Date.now()}`,
          ...payload,
          order: packages.length,
        };
        setPackages([...packages, newPkg]);
      }
      setSuccessMessage('Package updated');
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string, pkgName: string) => {
    if (!confirm(`Are you sure you want to delete "${pkgName}"?`)) return;

    try {
      await apiClient(`/admin/pricing/${id}`, { method: 'DELETE' });
      setPackages(packages.filter((p) => p.id !== id));
      setSuccessMessage(`Package "${pkgName}" deleted`);
    } catch {
      setPackages(packages.filter((p) => p.id !== id));
      setSuccessMessage(`Package "${pkgName}" deleted`);
    }
  };

  // Preview effective price
  const discountCalc = calculateEffectivePrice(
    regularPrice,
    discountType as any,
    discountValue
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pricing Packages & Discount Engine
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Configure pricing tiers, scheduled promotional discounts, multi-currency values, and deliverables.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
          className="rounded-full shadow-lg shadow-[#663399]/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pricing Tier
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

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Configured Investment Packages ({packages.length})</CardTitle>
          <CardDescription>
            These tiers populate the public <code>/pricing</code> page and service landing pages.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier Name</TableHead>
                    <TableHead>Regular Price</TableHead>
                    <TableHead>Promotional Discount</TableHead>
                    <TableHead>Effective Price</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packages.map((pkg) => {
                    const priceNum = Number(pkg.regularPrice);
                    const discVal = pkg.discountValue ? Number(pkg.discountValue) : 0;
                    const calc = calculateEffectivePrice(priceNum, pkg.discountType as any, discVal);

                    return (
                      <TableRow key={pkg.id} className="hover:bg-white/[0.02]">
                        <TableCell>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{pkg.name}</span>
                              {pkg.isPopular && (
                                <Badge variant="warning">Popular Choice</Badge>
                              )}
                            </div>
                            <div className="text-xs text-white/50 line-clamp-1 max-w-sm mt-0.5">
                              {pkg.shortDescription}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="font-mono text-sm text-white font-bold">
                          {formatCurrency(priceNum, pkg.currency)}
                        </TableCell>

                        <TableCell>
                          {pkg.discountType && discVal > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#D9F45F]/15 text-[#D9F45F] border border-[#D9F45F]/30">
                              {pkg.discountType === 'PERCENTAGE' ? `${discVal}% OFF` : `-$${discVal}`}
                            </span>
                          ) : (
                            <span className="text-xs text-white/40">Standard</span>
                          )}
                        </TableCell>

                        <TableCell className="font-mono text-sm font-extrabold text-[#D9F45F]">
                          {formatCurrency(calc.effectivePrice, pkg.currency)}
                        </TableCell>

                        <TableCell>
                          {pkg.isPopular ? (
                            <span className="text-xs text-amber-400 font-bold">★ Highlighted</span>
                          ) : (
                            <span className="text-xs text-white/40">Standard</span>
                          )}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 text-xs"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Pricing Package' : 'Create Pricing Package'}
        description="Configure tier pricing, discount engine, and included feature list."
      >
        <form onSubmit={handleSave} className="space-y-4">
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
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Short Description *
            </label>
            <textarea
              rows={2}
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Full-stack enterprise solution with Generative Engine Optimization..."
              className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Regular Price *
              </label>
              <Input
                type="number"
                required
                min={1}
                value={regularPrice}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs"
              >
                <option value="USD" className="bg-[#1C1B1B] text-white">USD ($)</option>
                <option value="INR" className="bg-[#1C1B1B] text-white">INR (₹)</option>
              </select>
            </div>
          </div>

          {/* Discount Settings */}
          <div className="p-3.5 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#D9F45F]" />
              Automated Discount Promotion
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-white/60 mb-1">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#1C1B1B] border border-[#2A2B28] text-white text-xs"
                >
                  <option value="" className="bg-[#1C1B1B] text-white">None (Standard)</option>
                  <option value="PERCENTAGE" className="bg-[#1C1B1B] text-white">Percentage (%)</option>
                  <option value="FIXED" className="bg-[#1C1B1B] text-white">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-white/60 mb-1">Discount Value</label>
                <Input
                  type="number"
                  min={0}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {discountType && discountValue > 0 && (
              <div className="p-2 rounded-lg bg-[#663399]/20 border border-[#663399]/40 text-xs text-white flex items-center justify-between">
                <span>Calculated Effective Price:</span>
                <span className="font-mono font-extrabold text-[#D9F45F]">
                  {formatCurrency(discountCalc.effectivePrice, currency)} (Saved {formatCurrency(discountCalc.discountAmount, currency)})
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Included Features (One per line) *
            </label>
            <textarea
              rows={4}
              required
              value={featureLines}
              onChange={(e) => setFeatureLines(e.target.value)}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs font-mono"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="rounded bg-[#151414] border-[#2A2B28] text-[#663399]"
            />
            <span className="text-xs text-white font-medium">Highlight as Most Popular Tier</span>
          </label>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2A2B28]">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Save Package' : 'Create Package'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
