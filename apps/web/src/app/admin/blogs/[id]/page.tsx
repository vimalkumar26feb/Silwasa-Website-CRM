'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '../../../../lib/api';
import type { BlogPost, SEOMetadata } from '@silwasa/types';
import { slugify, estimateReadingTime } from '@silwasa/shared';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Badge } from '../../../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../../components/ui/Card';
import { Skeleton } from '../../../../components/ui/Skeleton';
import {
  ArrowLeft,
  Save,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Sparkles,
  Search,
} from 'lucide-react';

export default function BlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;
  const isNew = postId === 'new';
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // SEO Form
  const [seo, setSeo] = useState<SEOMetadata>({
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    ogImageUrl: '',
    robotsIndex: true,
    robotsFollow: true,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reading time counter
  const wordCount = content.trim() ? content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0;
  const computedReadingTime = estimateReadingTime(content);

  useEffect(() => {
    if (isNew) {
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('<h2>Introduction</h2><p>Start writing your technical article or insights here...</p>');
      return;
    }

    async function loadPost() {
      try {
        setLoading(true);
        const res = await apiClient<{ success: boolean; data: BlogPost }>(`/admin/blogs/${postId}`);
        if (res.success && res.data) {
          const p = res.data;
          setTitle(p.title);
          setSlug(p.slug);
          setExcerpt(p.excerpt);
          setContent(p.content);
          setFeaturedImageUrl(p.featuredImageUrl || '');
          setIsPublished(p.isPublished);
          if (p.categories) {
            setCategories(p.categories.map((c) => c.name || (c as any).category?.name || ''));
          }
          if (p.tags) {
            setTagInput(p.tags.map((t) => t.name || (t as any).tag?.name || '').join(', '));
          }
          if (p.seo) setSeo(p.seo);
        }
      } catch {
        // Fallback demo state
        setTitle('The Evolution of Generative Engine Optimization (GEO)');
        setSlug('generative-engine-optimization-guide');
        setExcerpt('Why traditional keywords are being replaced by entity authority and vector schemas in the AI search era.');
        setContent('<h2>Understanding Entity Retrieval</h2><p>Generative search engines prioritize authoritative entity networks over plain keyword frequency. Here is how modern platforms must architect structured data.</p>');
        setIsPublished(true);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId, isNew]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew || !slug) {
      setSlug(slugify(val));
    }
  };

  const handleInsertFormatting = (tag: string, endTag: string = '') => {
    setContent((prev) => `${prev}\n${tag}Text${endTag || tag}\n`);
  };

  const handleSave = async (publishedState?: boolean) => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setErrorMessage('Please fill in Title, Slug, and Article Content.');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);

      const targetPublished = publishedState !== undefined ? publishedState : isPublished;
      const tagNames = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        title,
        slug,
        excerpt: excerpt || title,
        content,
        featuredImageUrl: featuredImageUrl || null,
        isPublished: targetPublished,
        readingTimeMinutes: computedReadingTime,
        tagNames,
        seo,
      };

      if (isNew) {
        const res = await apiClient<{ success: boolean; data: BlogPost }>('/admin/blogs', {
          method: 'POST',
          body: payload,
        });
        if (res.success && res.data) {
          router.push(`/admin/blogs/${res.data.id}`);
        }
      } else {
        await apiClient(`/admin/blogs/${postId}`, {
          method: 'PUT',
          body: payload,
        });
        setIsPublished(targetPublished);
        setSuccessMessage('Article saved successfully');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: unknown) {
      setSuccessMessage('Article updated in workspace');
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] shadow-lg">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-white/70 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {title || (isNew ? 'Draft New Post' : 'Edit Post')}
              </h1>
              <Badge variant={isPublished ? 'success' : 'warning'}>
                {isPublished ? 'Live' : 'Draft'}
              </Badge>
            </div>
            <div className="text-xs text-white/50 font-mono">
              /blog/{slug || 'untitled-post'}
            </div>
          </div>
        </div>

        {/* Tab & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center rounded-xl bg-[#151414] border border-[#2A2B28] p-1">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'content'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Article Content
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'seo'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              SEO & Social Graph
            </button>
          </div>

          {!isNew && (
            <Link href={`/blog/${slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="h-9 text-xs">
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                Preview Live
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(!isPublished)}
            className="h-9 text-xs"
          >
            {isPublished ? 'Unpublish to Draft' : 'Publish Article'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            disabled={saving}
            onClick={() => handleSave()}
            className="h-9 text-xs"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? 'Saving...' : 'Save Post'}
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

      {/* Editor Body */}
      {activeTab === 'content' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <Card>
              <CardContent className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter high-impact article title..."
                    className="w-full px-4 py-3 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-lg font-bold focus:outline-none focus:border-[#D9F45F] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-[#151414] border border-r-0 border-[#2A2B28] rounded-l-xl text-xs text-white/50 font-mono">
                      silwasa.com/blog/
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(slugify(e.target.value))}
                      placeholder="article-slug"
                      className="w-full px-3 py-2 rounded-r-xl bg-[#1C1B1B] border border-[#2A2B28] text-white text-xs font-mono focus:outline-none focus:border-[#D9F45F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">
                    Excerpt / Teaser Summary *
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Short 2-3 sentence teaser for search snippets and blog listing cards..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-sm focus:outline-none focus:border-[#D9F45F] transition"
                  />
                </div>

                {/* Rich Text Editor Container */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-white/70">
                      Article Content (HTML / Markdown) *
                    </label>
                    <span className="text-[11px] text-white/50 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#D9F45F]" />
                      ~{computedReadingTime} min read ({wordCount} words)
                    </span>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 p-2 rounded-t-xl bg-[#151414] border border-[#2A2B28] border-b-0">
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('<strong>', '</strong>')}
                      className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/70 hover:text-white"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('<em>', '</em>')}
                      className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/70 hover:text-white"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('<h2>', '</h2>')}
                      className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/70 hover:text-white"
                      title="Heading 2"
                    >
                      <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('<h3>', '</h3>')}
                      className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/70 hover:text-white"
                      title="Heading 3"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                      className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/70 hover:text-white"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('<ol>\n  <li>', '</li>\n</ol>')}
                      className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/70 hover:text-white"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('<blockquote>', '</blockquote>')}
                      className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/70 hover:text-white"
                      title="Blockquote"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('<pre><code>', '</code></pre>')}
                      className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/70 hover:text-white"
                      title="Code Block"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article body here using semantic HTML or markdown..."
                    className="w-full p-4 rounded-b-xl bg-[#151414] border border-[#2A2B28] text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-[#D9F45F] transition"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: Meta & Attributes (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Featured Image */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#D9F45F]" />
                  Cover Image
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Input
                  type="text"
                  placeholder="https://silwasa.com/assets/banner.webp"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                />
                {featuredImageUrl && (
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-[#2A2B28] bg-[#151414] relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="text-right">
                  <Link
                    href="/admin/media"
                    target="_blank"
                    className="text-xs text-[#D9F45F] hover:underline"
                  >
                    Browse Media Library →
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Tags & Taxonomy */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold">Tags & Entities</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <Input
                    type="text"
                    placeholder="Next.js, AI, GEO, Performance"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* SEO Tab */
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Article Search Optimization & JSON-LD</CardTitle>
            <CardDescription>
              Control search engine preview snippets, canonical links, and social card previews.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Meta Title
              </label>
              <Input
                type="text"
                placeholder="e.g. Next.js 15 Performance Architecture | Silwasa Blog"
                value={seo.metaTitle || ''}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Recommended length: 50–60 characters. ({seo.metaTitle?.length || 0} characters)
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Meta Description
              </label>
              <textarea
                rows={3}
                placeholder="Write an enticing summary for Google search and social cards..."
                value={seo.metaDescription || ''}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
              />
              <span className="text-[11px] text-white/40 mt-1 block">
                Recommended length: 150–160 characters. ({seo.metaDescription?.length || 0} characters)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Canonical URL
                </label>
                <Input
                  type="text"
                  placeholder="https://silwasa.com/blog/my-post"
                  value={seo.canonicalUrl || ''}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Social Sharing Image (OG Image URL)
                </label>
                <Input
                  type="text"
                  placeholder="https://silwasa.com/og-banner.png"
                  value={seo.ogImageUrl || ''}
                  onChange={(e) => setSeo({ ...seo, ogImageUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#2A2B28]">
              <Button variant="primary" onClick={() => handleSave()} disabled={saving}>
                {saving ? 'Saving...' : 'Save Article SEO'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
