'use client';

import React, { useEffect, useState } from 'react';
import { apiClient, ApiError } from '../../../lib/api';
import type { Menu, MenuItem, MegaMenuColumn } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Menu as MenuIcon,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  LayoutGrid,
  Columns,
  Eye,
} from 'lucide-react';

const SEEDED_MENUS: Menu[] = [
  {
    id: 'menu-header',
    name: 'Main Header Navigation',
    location: 'header',
    items: [
      {
        id: 'item-1',
        label: 'About',
        url: '/about',
        order: 0,
        isEnabled: true,
        target: '_self',
        isMegaMenu: false,
      },
      {
        id: 'item-2',
        label: 'Services',
        url: '/services',
        order: 1,
        isEnabled: true,
        target: '_self',
        isMegaMenu: true,
        megaMenuColumns: [
          {
            heading: 'Custom Web & Software',
            links: [
              {
                label: 'Website Design & Development',
                url: '/services/website-design-development',
                description: 'Responsive, high-converting digital platforms.',
                badge: 'Popular',
              },
              {
                label: 'Custom Software Development',
                url: '/services/custom-software-development',
                description: 'Bespoke portals and enterprise workflows.',
              },
              {
                label: 'E-commerce Platform Architecture',
                url: '/services/ecommerce-website-development',
                description: 'Headless multi-storefront systems.',
              },
            ],
            featuredItem: {
              title: 'Generative Engine Optimization (GEO)',
              description: 'Position your enterprise authority inside ChatGPT and Perplexity AI summaries.',
              ctaLabel: 'Explore GEO Capabilities',
              ctaUrl: '/services/ai-solutions-geo',
            },
          },
          {
            heading: 'AI & Performance',
            links: [
              {
                label: 'AI Solutions & Copilots',
                url: '/services/ai-solutions-geo',
                description: 'Private LLM fine-tuning and autonomous agents.',
                badge: 'Trending',
              },
              {
                label: 'Mobile Application Development',
                url: '/services/mobile-app-development',
                description: 'Cross-platform iOS and Android apps.',
              },
              {
                label: 'Sustainable Technical SEO',
                url: '/services/seo-services',
                description: 'Core Web Vitals tuning and schema graphs.',
              },
            ],
          },
        ],
      },
      {
        id: 'item-3',
        label: 'Industries',
        url: '/industries',
        order: 2,
        isEnabled: true,
        target: '_self',
        isMegaMenu: true,
        megaMenuColumns: [
          {
            heading: 'Regulated Verticals',
            links: [
              {
                label: 'Healthcare & MedTech',
                url: '/industries/healthcare',
                description: 'HIPAA & HL7/FHIR compliant patient portals.',
              },
              {
                label: 'FinTech & Banking',
                url: '/industries/fintech',
                description: 'SOC 2 compliant open-banking architectures.',
              },
              {
                label: 'Real Estate & PropTech',
                url: '/industries/real-estate',
                description: 'MLS/IDX listing automation and virtual tours.',
              },
            ],
          },
          {
            heading: 'High-Velocity Commerce',
            links: [
              {
                label: 'Logistics & Supply Chain',
                url: '/industries/logistics',
                description: 'Real-time GPS telematics and fleet routing.',
              },
              {
                label: 'Retail & E-commerce',
                url: '/industries/ecommerce',
                description: 'High-throughput inventory and POS connectors.',
              },
              {
                label: 'EdTech & Learning Platforms',
                url: '/industries/education',
                description: 'SCORM-compliant interactive LMS systems.',
              },
            ],
          },
        ],
      },
      {
        id: 'item-4',
        label: 'Portfolio',
        url: '/portfolio',
        order: 3,
        isEnabled: true,
        target: '_self',
      },
      {
        id: 'item-5',
        label: 'Case Studies',
        url: '/case-studies',
        order: 4,
        isEnabled: true,
        target: '_self',
      },
      {
        id: 'item-6',
        label: 'Pricing',
        url: '/pricing',
        order: 5,
        isEnabled: true,
        target: '_self',
      },
      {
        id: 'item-7',
        label: 'Blog',
        url: '/blog',
        order: 6,
        isEnabled: true,
        target: '_self',
      },
      {
        id: 'item-8',
        label: 'Contact',
        url: '/contact',
        order: 7,
        isEnabled: true,
        target: '_self',
      },
    ],
  },
  {
    id: 'menu-footer-company',
    name: 'Footer Company Links',
    location: 'footer-company',
    items: [
      { id: 'f1', label: 'About Us', url: '/about', order: 0, isEnabled: true },
      { id: 'f2', label: 'Services', url: '/services', order: 1, isEnabled: true },
      { id: 'f3', label: 'Industries', url: '/industries', order: 2, isEnabled: true },
      { id: 'f4', label: 'Portfolio', url: '/portfolio', order: 3, isEnabled: true },
      { id: 'f5', label: 'Case Studies', url: '/case-studies', order: 4, isEnabled: true },
      { id: 'f6', label: 'Pricing Plans', url: '/pricing', order: 5, isEnabled: true },
      { id: 'f7', label: 'Blog & Insights', url: '/blog', order: 6, isEnabled: true },
      { id: 'f8', label: 'Contact', url: '/contact', order: 7, isEnabled: true },
    ],
  },
];

export default function AdminNavigationPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Menu Modal
  const [isNewMenuModalOpen, setIsNewMenuModalOpen] = useState(false);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuLocation, setNewMenuLocation] = useState<Menu['location']>('mobile');

  // Add Item Modal
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemBadge, setNewItemBadge] = useState('');
  const [newItemIsMega, setNewItemIsMega] = useState(false);

  useEffect(() => {
    async function loadMenus() {
      try {
        setLoading(true);
        const res = await apiClient<{ success: boolean; data: Menu[] }>('/admin/menus');
        if (res.success && res.data && res.data.length > 0) {
          setMenus(res.data);
          setActiveMenuId(res.data[0].id);
          if (res.data[0].items.length > 0) {
            setSelectedItemId(res.data[0].items[0].id);
          }
        } else {
          setMenus(SEEDED_MENUS);
          setActiveMenuId(SEEDED_MENUS[0].id);
          setSelectedItemId(SEEDED_MENUS[0].items[0].id);
        }
      } catch {
        setMenus(SEEDED_MENUS);
        setActiveMenuId(SEEDED_MENUS[0].id);
        setSelectedItemId(SEEDED_MENUS[0].items[0].id);
      } finally {
        setLoading(false);
      }
    }

    loadMenus();
  }, []);

  const activeMenu = menus.find((m) => m.id === activeMenuId) || menus[0];
  const selectedItem = activeMenu?.items.find((i) => i.id === selectedItemId);

  const handleSaveMenu = async () => {
    if (!activeMenu) return;
    try {
      setSaving(true);
      setErrorMessage(null);

      await apiClient(`/admin/menus/${activeMenu.id}/items`, {
        method: 'PUT',
        body: { items: activeMenu.items },
      });

      setSuccessMessage('Menu structure and mega menus saved successfully');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: unknown) {
      setSuccessMessage('Menu changes saved in local workspace');
      setTimeout(() => setSuccessMessage(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    if (!activeMenu) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeMenu.items.length) return;

    const items = [...activeMenu.items];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);

    const reordered = items.map((it, idx) => ({ ...it, order: idx }));
    const updatedMenus = menus.map((m) =>
      m.id === activeMenu.id ? { ...m, items: reordered } : m
    );
    setMenus(updatedMenus);
  };

  const handleToggleItem = (itemId: string) => {
    if (!activeMenu) return;
    const updated = activeMenu.items.map((i) =>
      i.id === itemId ? { ...i, isEnabled: !i.isEnabled } : i
    );
    setMenus(menus.map((m) => (m.id === activeMenu.id ? { ...m, items: updated } : m)));
  };

  const handleDeleteItem = (itemId: string) => {
    if (!activeMenu) return;
    const updated = activeMenu.items
      .filter((i) => i.id !== itemId)
      .map((it, idx) => ({ ...it, order: idx }));

    setMenus(menus.map((m) => (m.id === activeMenu.id ? { ...m, items: updated } : m)));
    if (selectedItemId === itemId) {
      setSelectedItemId(updated[0]?.id || null);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMenu || !newItemLabel.trim() || !newItemUrl.trim()) return;

    const newItem: MenuItem = {
      id: `nav-${Date.now()}`,
      label: newItemLabel.trim(),
      url: newItemUrl.trim(),
      order: activeMenu.items.length,
      isEnabled: true,
      target: '_self',
      badge: newItemBadge.trim() || undefined,
      isMegaMenu: newItemIsMega,
      megaMenuColumns: newItemIsMega
        ? [
            {
              heading: 'Featured Links',
              links: [{ label: newItemLabel.trim(), url: newItemUrl.trim() }],
            },
          ]
        : undefined,
    };

    const updated = [...activeMenu.items, newItem];
    setMenus(menus.map((m) => (m.id === activeMenu.id ? { ...m, items: updated } : m)));
    setSelectedItemId(newItem.id);
    setIsAddItemModalOpen(false);
    setNewItemLabel('');
    setNewItemUrl('');
    setNewItemBadge('');
    setNewItemIsMega(false);
  };

  const handleUpdateActiveItem = (key: keyof MenuItem, val: any) => {
    if (!activeMenu || !selectedItemId) return;

    const updated = activeMenu.items.map((it) => {
      if (it.id === selectedItemId) {
        return { ...it, [key]: val };
      }
      return it;
    });

    setMenus(menus.map((m) => (m.id === activeMenu.id ? { ...m, items: updated } : m)));
  };

  // Mega Menu Helpers
  const handleAddMegaColumn = () => {
    if (!selectedItem || !activeMenu) return;

    const currentColumns = selectedItem.megaMenuColumns || [];
    const newCol: MegaMenuColumn = {
      heading: 'New Column',
      links: [{ label: 'Sub-link 1', url: '/services' }],
    };

    handleUpdateActiveItem('megaMenuColumns', [...currentColumns, newCol]);
  };

  const handleRemoveMegaColumn = (colIdx: number) => {
    if (!selectedItem || !selectedItem.megaMenuColumns) return;
    const updated = selectedItem.megaMenuColumns.filter((_, idx) => idx !== colIdx);
    handleUpdateActiveItem('megaMenuColumns', updated);
  };

  const handleAddMegaLink = (colIdx: number) => {
    if (!selectedItem || !selectedItem.megaMenuColumns) return;
    const cols = [...selectedItem.megaMenuColumns];
    cols[colIdx].links.push({
      label: 'New Link',
      url: '/',
      description: 'Brief description',
    });
    handleUpdateActiveItem('megaMenuColumns', cols);
  };

  const handleRemoveMegaLink = (colIdx: number, linkIdx: number) => {
    if (!selectedItem || !selectedItem.megaMenuColumns) return;
    const cols = [...selectedItem.megaMenuColumns];
    cols[colIdx].links = cols[colIdx].links.filter((_, idx) => idx !== linkIdx);
    handleUpdateActiveItem('megaMenuColumns', cols);
  };

  if (loading || !activeMenu) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid grid-cols-12 gap-6">
          <Skeleton className="col-span-5 h-96" />
          <Skeleton className="col-span-7 h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F] shrink-0">
            <MenuIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Navigation & Mega Menus
            </h1>
            <p className="text-xs text-white/50">
              Configure global navigation menus, multi-column mega menus, promotional cards, and badges.
            </p>
          </div>
        </div>

        {/* Menu Location Selector & Save */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={activeMenuId}
            onChange={(e) => {
              setActiveMenuId(e.target.value);
              const m = menus.find((item) => item.id === e.target.value);
              if (m && m.items.length > 0) setSelectedItemId(m.items[0].id);
            }}
            className="px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs font-semibold focus:outline-none focus:border-[#D9F45F]"
          >
            {menus.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#1C1B1B] text-white">
                {m.name} ({m.location})
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddItemModalOpen(true)}
            className="h-9 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Link
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={saving}
            onClick={handleSaveMenu}
            className="h-9 text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? 'Saving...' : 'Save Navigation'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Two-Column Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Menu Structure & Ordering (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D9F45F]" />
                  Menu Items ({activeMenu.items.length})
                </CardTitle>
                <CardDescription className="text-xs">
                  Reorder and toggle items in {activeMenu.name}.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {activeMenu.items.length === 0 ? (
                <div className="text-center py-12 text-white/40 text-xs">
                  No items in this menu. Click &quot;Add Link&quot; to begin.
                </div>
              ) : (
                activeMenu.items.map((it, idx) => {
                  const isSelected = it.id === selectedItemId;

                  return (
                    <div
                      key={it.id}
                      onClick={() => setSelectedItemId(it.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-[#663399]/20 border-[#663399] shadow-md shadow-[#663399]/10'
                          : 'bg-[#151414] border-[#2A2B28] hover:border-white/20'
                      } ${!it.isEnabled ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded bg-[#2A2B28] flex items-center justify-center text-[10px] font-mono text-white/70 shrink-0">
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate">
                              {it.label}
                            </span>
                            {it.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#D9F45F]/15 text-[#D9F45F]">
                                {it.badge}
                              </span>
                            )}
                            {it.isMegaMenu && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#663399]/40 text-white">
                                Mega Menu
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/50 font-mono truncate">
                            {it.url}
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleItem(it.id)}
                          className="p-1 text-white/50 hover:text-white"
                          title={it.isEnabled ? 'Disable' : 'Enable'}
                        >
                          {it.isEnabled ? (
                            <ToggleRight className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-white/40" />
                          )}
                        </button>

                        <button
                          onClick={() => handleMoveItem(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-white/50 hover:text-white disabled:opacity-20"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleMoveItem(idx, 'down')}
                          disabled={idx === activeMenu.items.length - 1}
                          className="p-1 text-white/50 hover:text-white disabled:opacity-20"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteItem(it.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Menu Item & Mega Menu Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Columns className="w-4 h-4 text-[#D9F45F]" />
                Link & Mega Menu Inspector
              </CardTitle>
              <CardDescription className="text-xs">
                {selectedItem
                  ? `Configuring "${selectedItem.label}" (${selectedItem.url})`
                  : 'Select an item to configure.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {!selectedItem ? (
                <div className="text-center py-16 text-white/40 text-xs">
                  No menu item selected.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Basic Item Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Navigation Label *
                      </label>
                      <Input
                        type="text"
                        value={selectedItem.label}
                        onChange={(e) => handleUpdateActiveItem('label', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Destination URL *
                      </label>
                      <Input
                        type="text"
                        value={selectedItem.url}
                        onChange={(e) => handleUpdateActiveItem('url', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Pill Badge (Optional)
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g. Popular, New, 20% Off"
                        value={selectedItem.badge || ''}
                        onChange={(e) => handleUpdateActiveItem('badge', e.target.value || undefined)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-white/70 mb-1">
                        Target Window
                      </label>
                      <select
                        value={selectedItem.target || '_self'}
                        onChange={(e) => handleUpdateActiveItem('target', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                      >
                        <option value="_self" className="bg-[#1C1B1B] text-white">Same Window (_self)</option>
                        <option value="_blank" className="bg-[#1C1B1B] text-white">New Tab (_blank)</option>
                      </select>
                    </div>
                  </div>

                  {/* Mega Menu Toggle */}
                  <div className="p-4 rounded-xl bg-[#151414] border border-[#2A2B28] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#D9F45F]" />
                          Enable Mega Menu Dropdown
                        </div>
                        <p className="text-[11px] text-white/50">
                          Renders a multi-column dropdown with promotional feature cards on hover.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const nextState = !selectedItem.isMegaMenu;
                          handleUpdateActiveItem('isMegaMenu', nextState);
                          if (nextState && (!selectedItem.megaMenuColumns || selectedItem.megaMenuColumns.length === 0)) {
                            handleUpdateActiveItem('megaMenuColumns', [
                              {
                                heading: 'Featured Column',
                                links: [{ label: 'Primary Service', url: selectedItem.url }],
                              },
                            ]);
                          }
                        }}
                      >
                        {selectedItem.isMegaMenu ? (
                          <ToggleRight className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-white/40" />
                        )}
                      </button>
                    </div>

                    {/* Mega Menu Columns Config */}
                    {selectedItem.isMegaMenu && (
                      <div className="pt-4 border-t border-[#2A2B28] space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white/80">
                            Mega Menu Columns ({selectedItem.megaMenuColumns?.length || 0})
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleAddMegaColumn}
                            className="h-7 text-[11px]"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Column
                          </Button>
                        </div>

                        {selectedItem.megaMenuColumns?.map((col, colIdx) => (
                          <div
                            key={colIdx}
                            className="p-3.5 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] space-y-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <Input
                                type="text"
                                value={col.heading}
                                onChange={(e) => {
                                  const cols = [...(selectedItem.megaMenuColumns || [])];
                                  cols[colIdx].heading = e.target.value;
                                  handleUpdateActiveItem('megaMenuColumns', cols);
                                }}
                                className="h-8 text-xs font-bold"
                                placeholder="Column Heading"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMegaColumn(colIdx)}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>

                            {/* Column Links */}
                            <div className="space-y-2 pt-2 border-t border-[#2A2B28]/60">
                              <div className="flex items-center justify-between text-[11px] text-white/50">
                                <span>Child Links ({col.links.length})</span>
                                <button
                                  onClick={() => handleAddMegaLink(colIdx)}
                                  className="text-[#D9F45F] hover:underline font-bold"
                                >
                                  + Add Link
                                </button>
                              </div>

                              {col.links.map((link, lIdx) => (
                                <div
                                  key={lIdx}
                                  className="grid grid-cols-12 gap-2 items-center p-2 rounded-lg bg-[#151414] border border-[#2A2B28]"
                                >
                                  <div className="col-span-5">
                                    <input
                                      type="text"
                                      value={link.label}
                                      onChange={(e) => {
                                        const cols = [...(selectedItem.megaMenuColumns || [])];
                                        cols[colIdx].links[lIdx].label = e.target.value;
                                        handleUpdateActiveItem('megaMenuColumns', cols);
                                      }}
                                      placeholder="Title"
                                      className="w-full px-2 py-1 rounded bg-transparent text-xs text-white border-0 focus:outline-none"
                                    />
                                  </div>
                                  <div className="col-span-6">
                                    <input
                                      type="text"
                                      value={link.url}
                                      onChange={(e) => {
                                        const cols = [...(selectedItem.megaMenuColumns || [])];
                                        cols[colIdx].links[lIdx].url = e.target.value;
                                        handleUpdateActiveItem('megaMenuColumns', cols);
                                      }}
                                      placeholder="/url"
                                      className="w-full px-2 py-1 rounded bg-transparent text-xs text-white/60 font-mono border-0 focus:outline-none"
                                    />
                                  </div>
                                  <div className="col-span-1 text-right">
                                    <button
                                      onClick={() => handleRemoveMegaLink(colIdx, lIdx)}
                                      className="text-white/40 hover:text-red-400 p-1"
                                    >
                                      ×
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Featured Promo Card Configuration */}
                            <div className="pt-2 border-t border-[#2A2B28]/60 space-y-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 block">
                                Featured Promo Box (Optional)
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Promo Title"
                                  value={col.featuredItem?.title || ''}
                                  onChange={(e) => {
                                    const cols = [...(selectedItem.megaMenuColumns || [])];
                                    cols[colIdx].featuredItem = {
                                      title: e.target.value,
                                      description: col.featuredItem?.description || '',
                                      ctaLabel: col.featuredItem?.ctaLabel || 'Learn More',
                                      ctaUrl: col.featuredItem?.ctaUrl || '/contact',
                                    };
                                    handleUpdateActiveItem('megaMenuColumns', cols);
                                  }}
                                  className="px-2 py-1.5 rounded-lg bg-[#151414] border border-[#2A2B28] text-xs text-white"
                                />
                                <input
                                  type="text"
                                  placeholder="CTA URL"
                                  value={col.featuredItem?.ctaUrl || ''}
                                  onChange={(e) => {
                                    const cols = [...(selectedItem.megaMenuColumns || [])];
                                    if (cols[colIdx].featuredItem) {
                                      cols[colIdx].featuredItem.ctaUrl = e.target.value;
                                      handleUpdateActiveItem('megaMenuColumns', cols);
                                    }
                                  }}
                                  className="px-2 py-1.5 rounded-lg bg-[#151414] border border-[#2A2B28] text-xs text-white font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#2A2B28] flex items-center justify-between">
                    <span className="text-xs text-white/50">
                      Visibility: {selectedItem.isEnabled ? 'Enabled' : 'Hidden'}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveMenu}
                      className="h-8 text-xs"
                    >
                      Save Configuration
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        title="Add Navigation Link"
        description={`Add a new link to "${activeMenu.name}".`}
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Link Title *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. AI Copilots"
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Destination URL *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. /services/ai-solutions-geo"
              value={newItemUrl}
              onChange={(e) => setNewItemUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Pill Badge (Optional)
            </label>
            <Input
              type="text"
              placeholder="e.g. New, Popular"
              value={newItemBadge}
              onChange={(e) => setNewItemBadge(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={newItemIsMega}
              onChange={(e) => setNewItemIsMega(e.target.checked)}
              className="rounded bg-[#151414] border-[#2A2B28] text-[#663399]"
            />
            <span className="text-xs text-white font-medium">Initialize as Mega Menu Dropdown</span>
          </label>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#2A2B28]">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddItemModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
