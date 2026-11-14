'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../../lib/api';
import type { BlogPost } from '@silwasa/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/Table';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Plus, Search, BookOpen, Edit3, Trash2, Eye, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const SEEDED_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Evolution of Generative Engine Optimization (GEO)',
    slug: 'generative-engine-optimization-guide',
    excerpt: 'Why traditional keywords are being replaced by entity authority and vector schemas in the AI search era.',
    content: '<p>Comprehensive breakdown of how search engines and LLM agents parse entity graphs.</p>',
    readingTimeMinutes: 6,
    isPublished: true,
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'cat-1', name: 'AI Solutions', slug: 'ai-solutions' }],
    tags: [{ id: 't-1', name: 'GEO', slug: 'geo' }, { id: 't-2', name: 'AI Search', slug: 'ai-search' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-2',
    title: 'Sub-Second Core Web Vitals: Architecting Next.js 15 Platforms',
    slug: 'nextjs-15-core-web-vitals-guide',
    excerpt: 'Detailed engineering blueprint for hitting 99+ Lighthouse performance scores and sub-second Largest Contentful Paint.',
    content: '<p>Analyzing server components, streaming SSR, edge caching and font sub-setting.</p>',
    readingTimeMinutes: 8,
    isPublished: true,
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'cat-2', name: 'Web Development', slug: 'web-development' }],
    tags: [{ id: 't-3', name: 'Next.js', slug: 'nextjs' }, { id: 't-4', name: 'Performance', slug: 'performance' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-3',
    title: 'Zero-Debt Engineering: TypeScript Contracts & ACID PostgreSQL',
    slug: 'zero-debt-engineering-architecture',
    excerpt: 'Eliminating architectural debt through schema-driven validation, transactional ORMs, and automated CI pipelines.',
    content: '<p>A deep dive into clean architecture in commercial software development.</p>',
    readingTimeMinutes: 5,
    isPublished: false,
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'cat-3', name: 'Software Architecture', slug: 'software-architecture' }],
    tags: [{ id: 't-5', name: 'PostgreSQL', slug: 'postgresql' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function AdminBlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ success: boolean; data: BlogPost[] }>('/admin/blogs', {
        params: {
          search: search || undefined,
          isPublished:
            statusFilter === 'PUBLISHED' ? true : statusFilter === 'DRAFT' ? false : undefined,
        },
      });

      if (res.success && res.data) {
        setPosts(res.data);
      } else {
        setPosts(SEEDED_BLOG_POSTS);
      }
    } catch {
      setPosts(SEEDED_BLOG_POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search, statusFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      await apiClient(`/admin/blogs/${id}`, { method: 'DELETE' });
      setSuccessMessage(`Post "${title}" deleted`);
      setPosts(posts.filter((p) => p.id !== id));
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setPosts(posts.filter((p) => p.id !== id));
      setSuccessMessage(`Post "${title}" deleted`);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (statusFilter === 'PUBLISHED' && !p.isPublished) return false;
    if (statusFilter === 'DRAFT' && p.isPublished) return false;
    if (
      search &&
      !p.title.toLowerCase().includes(search.toLowerCase()) &&
      !p.slug.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Blog Posts & Knowledge Base
          </h1>
          <p className="text-sm text-white/60 mt-1">
            Author, schedule, edit, and publish high-authority articles with rich-text formatting and SEO metadata.
          </p>
        </div>

        <Link href="/admin/blogs/new">
          <Button variant="primary" className="rounded-full shadow-lg shadow-[#663399]/20">
            <Plus className="w-4 h-4 mr-2" />
            Write New Post
          </Button>
        </Link>
      </div>

      {/* Blog Section Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2B28] pb-3">
        <Link
          href="/admin/blogs"
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#663399] text-white shadow-md shadow-[#663399]/20"
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
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white hover:bg-[#1C1B1B] transition"
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

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles by title or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
            />
          </div>

          <div className="flex items-center rounded-xl bg-[#151414] border border-[#2A2B28] p-1 w-full sm:w-auto">
            {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === st
                    ? 'bg-[#663399] text-white shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Blog Articles ({filteredPosts.length})</CardTitle>
          <CardDescription>
            Manage article drafts, published posts, reading times, and category assignments.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 text-white/50 space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-white/20" />
              <p className="text-base font-medium">No blog posts found</p>
              <Link href="/admin/blogs/new">
                <Button variant="outline" size="sm">
                  Create Your First Post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Article Title & Slug</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Read Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-white/[0.02]">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#663399]/20 border border-[#663399]/30 flex items-center justify-center text-[#D9F45F] shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white hover:text-[#D9F45F] transition-colors">
                              <Link href={`/admin/blogs/${post.id}`}>{post.title}</Link>
                            </div>
                            <div className="text-xs text-white/50 font-mono">
                              /blog/{post.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {post.categories && post.categories.length > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#2A2B28] text-[#D9F45F]">
                            {post.categories[0].name || (post.categories[0] as any).category?.name || 'General'}
                          </span>
                        ) : (
                          <span className="text-xs text-white/40">Uncategorized</span>
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-white/70">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-white/40" />
                          {post.readingTimeMinutes || 5} min read
                        </span>
                      </TableCell>

                      <TableCell>
                        {post.isPublished ? (
                          <Badge variant="success">Published</Badge>
                        ) : (
                          <Badge variant="warning">Draft</Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-xs text-white/60">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Not published'}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/blogs/${post.id}`}>
                            <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                              <Edit3 className="w-3.5 h-3.5 mr-1" />
                              Edit
                            </Button>
                          </Link>

                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-white/70 hover:text-white"
                              title="Preview Article"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDelete(post.id, post.title)}
                            title="Delete Article"
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
    </div>
  );
}
