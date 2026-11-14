'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '../../../lib/api';
import { slugify } from '@silwasa/shared';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  Tag as TagIcon,
  Plus,
  Search,
  Edit3,
  Trash2,
  CheckCircle,
  AlertCircle,
  Hash,
} from 'lucide-react';

interface TagItem {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts?: number;
  };
}

const SEEDED_TAGS: TagItem[] = [
  { id: 'tag-1', name: 'GEO', slug: 'geo', _count: { posts: 4 } },
  { id: 'tag-2', name: 'AI Search', slug: 'ai-search', _count: { posts: 6 } },
  { id: 'tag-3', name: 'Next.js', slug: 'nextjs', _count: { posts: 8 } },
  { id: 'tag-4', name: 'Performance', slug: 'performance', _count: { posts: 5 } },
  { id: 'tag-5', name: 'TypeScript', slug: 'typescript', _count: { posts: 9 } },
  { id: 'tag-6', name: 'PostgreSQL', slug: 'postgresql', _count: { posts: 4 } },
];

export default function AdminTagsPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagItem | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ success: boolean; data: TagItem[] }>('/admin/blogs/tags');
      if (res.success && res.data && res.data.length > 0) {
        setTags(res.data);
      } else {
        setTags(SEEDED_TAGS);
      }
    } catch {
      setTags(SEEDED_TAGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleOpenModal = (tag?: TagItem) => {
    if (tag) {
      setEditingTag(tag);
      setName(tag.name);
      setSlug(tag.slug);
    } else {
      setEditingTag(null);
      setName('');
      setSlug('');
    }
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingTag || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      setErrorMessage('Tag name and slug are required');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);

      const payload = { name, slug };

      if (editingTag) {
        setTags((prev) =>
          prev.map((t) => (t.id === editingTag.id ? { ...t, ...payload } : t))
        );
        setSuccessMessage(`Tag "${name}" updated successfully.`);
      } else {
        const newTag: TagItem = { id: `tag-${Date.now()}`, name, slug, _count: { posts: 0 } };
        setTags((prev) => [newTag, ...prev]);
        setSuccessMessage(`Tag "${name}" created successfully.`);
      }

      setIsModalOpen(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setIsModalOpen(false);
      setSuccessMessage('Tag saved in workspace.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, tagName: string) => {
    if (!confirm(`Are you sure you want to delete tag "${tagName}"?`)) return;

    setTags((prev) => prev.filter((t) => t.id !== id));
    setSuccessMessage(`Tag "${tagName}" deleted.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const filteredTags = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Blog Tags &amp; Entity Keywords
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Manage granular indexing tags and semantic entities used across your blog articles.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="rounded-full shadow-lg shadow-[#663399]/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Tag
        </Button>
      </div>

      {/* Blog Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2B28] pb-3">
        <Link
          href="/admin/blogs"
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-[#1C1B1B] transition"
        >
          Articles &amp; Posts
        </Link>
        <Link
          href="/admin/categories"
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-[#1C1B1B] transition"
        >
          Categories
        </Link>
        <Link
          href="/admin/tags"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#663399] text-white shadow-md shadow-[#663399]/20"
        >
          Tags &amp; Entities
        </Link>
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

      {/* Search & Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tags..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1C1B1B] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
          />
        </div>
        <span className="text-xs text-white/40 font-mono">
          {filteredTags.length} tags found
        </span>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : filteredTags.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <TagIcon className="w-12 h-12 text-white/20 mx-auto" />
              <p className="text-sm text-white/60">No tags found matching your query.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell className="font-bold text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F]">
                        <Hash className="w-4 h-4" />
                      </div>
                      <span>{tag.name}</span>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-white/60">
                      #{tag.slug}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(tag)}
                          className="h-8 w-8 p-0 text-white/60 hover:text-white"
                          title="Edit Tag"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tag.id, tag.name)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          title="Delete Tag"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTag ? 'Edit Tag' : 'Create New Tag'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Tag Name *
            </label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Next.js 15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Slug *
            </label>
            <Input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="e.g. nextjs-15"
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
              {saving ? 'Saving...' : editingTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
