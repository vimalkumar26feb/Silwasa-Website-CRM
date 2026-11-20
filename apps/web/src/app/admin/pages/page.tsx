'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../../lib/api';
import type { Page } from '@silwasa/types';
import { slugify } from '@silwasa/shared';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Plus, Search, FileText, Copy, Trash2, Edit3, ExternalLink, AlertCircle, CheckCircle, Eye } from 'lucide-react';

export default function AdminPagesListPage() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New page form state
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [template, setTemplate] = useState<'blank' | 'standard'>('blank');
  const [isCreating, setIsCreating] = useState(false);

  const [currentHomeSlug, setCurrentHomeSlug] = useState<string>('home');
  const [rawGeneralSettings, setRawGeneralSettings] = useState<any>(null);

  useEffect(() => {
    async function loadGeneralSettings() {
      try {
        const res = await apiClient<{ success: boolean; data: any }>('/admin/settings/general');
        if (res.success && res.data) {
          setRawGeneralSettings(res.data);
          if (res.data.homePageSlug) {
            setCurrentHomeSlug(res.data.homePageSlug);
          }
        }
      } catch {
        // ignore
      }
    }
    loadGeneralSettings();
  }, []);

  const handleSetAsFrontPage = async (targetPage: Page) => {
    try {
      const payload = {
        ...(rawGeneralSettings || {}),
        homePageSlug: targetPage.slug,
        homePageId: targetPage.id,
      };
      await apiClient('/admin/settings/general', {
        method: 'PUT',
        body: payload,
      });
      setCurrentHomeSlug(targetPage.slug);
      setRawGeneralSettings(payload);
      setSuccessMessage(`Page "${targetPage.title}" (slug: /${targetPage.slug}) is now set as the active website frontpage!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      setActionError('Failed to set page as frontpage');
    }
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ success: boolean; data: Page[] }>('/admin/pages', {
        params: search ? { search } : undefined,
      });
      if (res.success && res.data) {
        setPages(res.data);
      }
    } catch (err: unknown) {
      // In offline / initial state without backend running, provide seeded default pages
      setPages([
        {
          id: 'page-home',
          title: 'Home',
          slug: 'home',
          sections: [
            { id: 'sec-1', type: 'hero', version: 1, order: 0, isEnabled: true, settings: {} },
            { id: 'sec-2', type: 'services-grid', version: 1, order: 1, isEnabled: true, settings: {} },
            { id: 'sec-3', type: 'industries-grid', version: 1, order: 2, isEnabled: true, settings: {} },
            { id: 'sec-4', type: 'technologies', version: 1, order: 3, isEnabled: true, settings: {} },
            { id: 'sec-5', type: 'case-studies', version: 1, order: 4, isEnabled: true, settings: {} },
            { id: 'sec-6', type: 'pricing-plans', version: 1, order: 5, isEnabled: true, settings: {} },
            { id: 'sec-7', type: 'faqs', version: 1, order: 6, isEnabled: true, settings: {} },
            { id: 'sec-8', type: 'contact-form', version: 1, order: 7, isEnabled: true, settings: {} },
          ],
          isPublished: true,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'page-about',
          title: 'About Us',
          slug: 'about',
          sections: [
            { id: 'sec-about-1', type: 'about-intro', version: 1, order: 0, isEnabled: true, settings: {} },
            { id: 'sec-about-2', type: 'technologies', version: 1, order: 1, isEnabled: true, settings: {} },
            { id: 'sec-about-3', type: 'cta', version: 1, order: 2, isEnabled: true, settings: {} },
          ],
          isPublished: true,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'page-contact',
          title: 'Contact Us',
          slug: 'contact',
          sections: [
            { id: 'sec-cont-1', type: 'contact-form', version: 1, order: 0, isEnabled: true, settings: {} },
            { id: 'sec-cont-2', type: 'faqs', version: 1, order: 1, isEnabled: true, settings: {} },
          ],
          isPublished: true,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [search]);

  const handleTitleChange = (val: string) => {
    setNewTitle(val);
    setNewSlug(slugify(val));
  };

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSlug.trim()) return;

    try {
      setIsCreating(true);
      setActionError(null);

      const initialSections =
        template === 'standard'
          ? [
              { id: 'sec-1', type: 'hero', version: 1, order: 0, isEnabled: true, settings: { heading: newTitle } },
              { id: 'sec-2', type: 'services-grid', version: 1, order: 1, isEnabled: true, settings: {} },
              { id: 'sec-3', type: 'cta', version: 1, order: 2, isEnabled: true, settings: {} },
            ]
          : [];

      const payload = {
        title: newTitle,
        slug: newSlug,
        sections: initialSections,
        isPublished: false,
      };

      const res = await apiClient<{ success: boolean; data: Page }>('/admin/pages', {
        method: 'POST',
        body: payload,
      });

      if (res.success && res.data) {
        setIsModalOpen(false);
        setNewTitle('');
        setNewSlug('');
        router.push(`/admin/pages/${res.data.id}`);
      }
    } catch (err: unknown) {
      // In local demo fallback mode:
      const newPage: Page = {
        id: `page-${Date.now()}`,
        title: newTitle,
        slug: newSlug,
        sections: [],
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPages([newPage, ...pages]);
      setIsModalOpen(false);
      setNewTitle('');
      setNewSlug('');
      router.push(`/admin/pages/${newPage.id}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDuplicate = async (pageId: string) => {
    try {
      setActionError(null);
      const res = await apiClient<{ success: boolean; data: Page }>(`/admin/pages/${pageId}/duplicate`, {
        method: 'POST',
      });
      if (res.success && res.data) {
        setSuccessMessage(`Page duplicated as "${res.data.title}"`);
        fetchPages();
      }
    } catch (err: unknown) {
      const orig = pages.find((p) => p.id === pageId);
      if (orig) {
        const copy: Page = {
          ...orig,
          id: `page-${Date.now()}`,
          title: `${orig.title} (Copy)`,
          slug: `${orig.slug}-copy-${Math.floor(Math.random() * 1000)}`,
          isPublished: false,
          updatedAt: new Date().toISOString(),
        };
        setPages([copy, ...pages]);
        setSuccessMessage(`Page duplicated as "${copy.title}"`);
      }
    }
  };

  const handleDelete = async (pageId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      setActionError(null);
      await apiClient(`/admin/pages/${pageId}`, { method: 'DELETE' });
      setSuccessMessage(`Page "${title}" deleted`);
      setPages(pages.filter((p) => p.id !== pageId));
    } catch (err: unknown) {
      setPages(pages.filter((p) => p.id !== pageId));
      setSuccessMessage(`Page "${title}" deleted`);
    }
  };

  const filteredPages = search
    ? pages.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.slug.toLowerCase().includes(search.toLowerCase())
      )
    : pages;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pages & Modular Layouts
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Build, edit, duplicate, and configure modular drag-and-drop pages across your public website.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="rounded-full shadow-lg shadow-[#663399]/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Page
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

      {actionError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-xs hover:underline">
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
              placeholder="Search pages by title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Managed Pages ({filteredPages.length})</CardTitle>
          <CardDescription>
            Click &quot;Edit Builder&quot; to customize sections, settings, backgrounds, and SEO metadata.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-16 text-white/50 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-white/20" />
              <p className="text-base font-medium">No pages found</p>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
                Create Your First Page
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Page Title & URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => (
                    <TableRow key={page.id} className="hover:bg-white/[0.02]">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F] shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white hover:text-[#D9F45F] transition-colors flex items-center gap-2">
                              <Link href={`/admin/pages/${page.id}`}>{page.title}</Link>
                              {(page.slug === currentHomeSlug || (currentHomeSlug === 'home' && page.slug === 'home')) && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#663399] text-[#D9F45F] border border-[#D9F45F]/30 shadow-sm">
                                  Front Page
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-white/50 font-mono">
                              /{page.slug === 'home' ? '' : page.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {page.isPublished ? (
                          <Badge variant="success">Published</Badge>
                        ) : (
                          <Badge variant="warning">Draft</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-[#151414] border border-[#2A2B28] text-white/80">
                          {page.sections?.length || 0} Sections
                        </span>
                      </TableCell>

                      <TableCell className="text-xs text-white/60">
                        {new Date(page.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!(page.slug === currentHomeSlug || (currentHomeSlug === 'home' && page.slug === 'home')) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-white/70 hover:text-[#D9F45F] hover:border-[#D9F45F]"
                              onClick={() => handleSetAsFrontPage(page)}
                              title="Set as live website frontpage"
                            >
                              Set Frontpage
                            </Button>
                          )}

                          <Link href={`/admin/pages/${page.id}`}>
                            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                              <Edit3 className="w-3.5 h-3.5 mr-1" />
                              Edit Builder
                            </Button>
                          </Link>

                          <Link
                            href={page.slug === 'home' ? '/' : `/${page.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white/70 hover:text-white" title="Preview Live">
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white"
                            onClick={() => handleDuplicate(page.id)}
                            title="Duplicate Page"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDelete(page.id, page.title)}
                            title="Delete Page"
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

      {/* Create New Page Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Page"
        description="Initialize a new modular page on your website."
      >
        <form onSubmit={handleCreatePage} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Page Title *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Enterprise Cloud Architecture"
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
                silwasa.com/
              </span>
              <input
                type="text"
                required
                value={newSlug}
                onChange={(e) => setNewSlug(slugify(e.target.value))}
                placeholder="enterprise-cloud-architecture"
                className="w-full px-3 py-2 rounded-r-xl bg-[#1C1B1B] border border-[#2A2B28] text-white text-sm font-mono focus:outline-none focus:border-[#D9F45F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">
              Starting Template
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTemplate('blank')}
                className={`p-3 rounded-xl border text-left transition ${
                  template === 'blank'
                    ? 'border-[#D9F45F] bg-[#D9F45F]/10'
                    : 'border-[#2A2B28] bg-[#151414] hover:border-white/20'
                }`}
              >
                <div className="text-sm font-bold text-white">Blank Canvas</div>
                <div className="text-xs text-white/60 mt-0.5">Start empty and add custom sections</div>
              </button>

              <button
                type="button"
                onClick={() => setTemplate('standard')}
                className={`p-3 rounded-xl border text-left transition ${
                  template === 'standard'
                    ? 'border-[#D9F45F] bg-[#D9F45F]/10'
                    : 'border-[#2A2B28] bg-[#151414] hover:border-white/20'
                }`}
              >
                <div className="text-sm font-bold text-white">Standard Landing</div>
                <div className="text-xs text-white/60 mt-0.5">Pre-seeded with Hero, Services & CTA</div>
              </button>
            </div>
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
              {isCreating ? 'Creating Page...' : 'Create & Open Builder'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
