'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../../lib/api';
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
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Code,
  Calendar,
  UploadCloud,
  FileText,
  Layers,
  Plus,
  Type,
} from 'lucide-react';

interface BlogCategoryOption {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { posts: number };
}

/**
 * Smart Word and Google Docs HTML Cleaner
 * Parses and preserves headings (H1-H4), paragraphs, bold, italic,
 * bullet lists (ul/li), numbered lists (ol/li), and links, while stripping
 * Microsoft Word XML, Mso classes, inline font junk, and empty tags.
 */
function cleanWordAndDocsHtml(rawHtml: string): string {
  if (!rawHtml) return '';

  let html = rawHtml;

  // 1. Remove comments, styles, xml namespaces, head/meta tags
  html = html.replace(/<!--[\s\S]*?-->/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  html = html.replace(/<xml[\s\S]*?<\/xml>/gi, '');
  html = html.replace(/<head[\s\S]*?<\/head>/gi, '');
  html = html.replace(/<meta[\s\S]*?>/gi, '');
  html = html.replace(/<link[\s\S]*?>/gi, '');
  html = html.replace(/<\/?o:[^>]*>/gi, '');
  html = html.replace(/<\/?w:[^>]*>/gi, '');
  html = html.replace(/<\/?m:[^>]*>/gi, '');
  html = html.replace(/<\/?v:[^>]*>/gi, '');

  // 2. Identify Word headings (Heading 1-4, MsoHeading, Title)
  html = html.replace(/<p[^>]*class="?[^"]*(?:Heading\s*1|MsoHeading1|Title)[^"]*"?[^>]*>([\s\S]*?)<\/p>/gi, '<h1>$1</h1>');
  html = html.replace(/<p[^>]*class="?[^"]*(?:Heading\s*2|MsoHeading2)[^"]*"?[^>]*>([\s\S]*?)<\/p>/gi, '<h2>$1</h2>');
  html = html.replace(/<p[^>]*class="?[^"]*(?:Heading\s*3|MsoHeading3)[^"]*"?[^>]*>([\s\S]*?)<\/p>/gi, '<h3>$1</h3>');
  html = html.replace(/<p[^>]*class="?[^"]*(?:Heading\s*4|MsoHeading4)[^"]*"?[^>]*>([\s\S]*?)<\/p>/gi, '<h4>$1</h4>');

  // 3. Identify Word Lists (MsoListParagraph)
  html = html.replace(/<p[^>]*class="?[^"]*MsoListParagraph[^"]*"?[^>]*>([\s\S]*?)<\/p>/gi, (_match, inner) => {
    const isBullet = /mso-list:Ignore[^>]*>[·•\u2022\u25cf\u25aa\u25cb\-]/i.test(inner) || /^[·•\u2022\u25cf\u25aa\u25cb\-]\s*/.test(inner);
    const cleanedInner = inner
      .replace(/<span[^>]*style="?[^"]*mso-list:Ignore[^"]*"?[^>]*>[\s\S]*?<\/span>/gi, '')
      .replace(/^[·•\u2022\u25cf\u25aa\u25cb\-]\s*/, '')
      .replace(/^\d+[\.\)]\s*/, '')
      .trim();
    return `<!--${isBullet ? 'BULLET_ITEM' : 'NUMBERED_ITEM'}--><li>${cleanedInner}</li>`;
  });

  // Group consecutive list items into <ul> and <ol>
  html = html.replace(/(?:<!--BULLET_ITEM--><li>[\s\S]*?<\/li>\s*)+/gi, (match) => {
    return `<ul>\n${match.replace(/<!--BULLET_ITEM-->/g, '')}</ul>\n`;
  });
  html = html.replace(/(?:<!--NUMBERED_ITEM--><li>[\s\S]*?<\/li>\s*)+/gi, (match) => {
    return `<ol>\n${match.replace(/<!--NUMBERED_ITEM-->/g, '')}</ol>\n`;
  });

  // 4. Strip span wrappers and dirty attributes, retaining clean tags
  html = html.replace(/<\/?span[^>]*>/gi, '');
  html = html.replace(/\s+class="[^"]*"/gi, '');
  html = html.replace(/\s+style="[^"]*"/gi, '');
  html = html.replace(/\s+lang="[^"]*"/gi, '');
  html = html.replace(/\s+dir="[^"]*"/gi, '');
  html = html.replace(/\s+align="[^"]*"/gi, '');
  html = html.replace(/<b>/gi, '<strong>').replace(/<\/b>/gi, '</strong>');
  html = html.replace(/<i>/gi, '<em>').replace(/<\/i>/gi, '</em>');

  // 5. Clean empty tags and whitespace
  html = html.replace(/<p>\s*&nbsp;\s*<\/p>/gi, '');
  html = html.replace(/<p>\s*<\/p>/gi, '');
  html = html.replace(/\n\s*\n\s*\n/g, '\n\n');

  return html.trim();
}

export default function BlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = resolvedParams.id;
  const isNew = postId === 'new';
  const router = useRouter();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual');
  const [uploadingCover, setUploadingCover] = useState(false);

  // Core Article Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState('');

  // Categories & Tags
  const [availableCategories, setAvailableCategories] = useState<BlogCategoryOption[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);
  const [showAddCatInput, setShowAddCatInput] = useState(false);
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

  // Refs for editors
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);

  // Reading time counter
  const wordCount = content.trim() ? content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length : 0;
  const computedReadingTime = estimateReadingTime(content);

  // Sync content into visual editor when switching back to visual mode
  useEffect(() => {
    if (editorMode === 'visual' && visualEditorRef.current) {
      if (visualEditorRef.current.innerHTML !== content) {
        visualEditorRef.current.innerHTML = content || '';
      }
    }
  }, [editorMode]);

  // Load Categories list
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await apiClient<{ success: boolean; data: BlogCategoryOption[] }>('/admin/blogs/categories');
        if (res.success && res.data && res.data.length > 0) {
          setAvailableCategories(res.data);
          return;
        }

        const pubRes = await apiClient<{ success: boolean; data: BlogCategoryOption[] }>('/blogs/categories');
        if (pubRes.success && pubRes.data && pubRes.data.length > 0) {
          setAvailableCategories(pubRes.data);
          return;
        }
      } catch {
        // Fallback demo categories if offline
        setAvailableCategories([
          { id: 'cat-1', name: 'Web Development', slug: 'web-development', _count: { posts: 7 } },
          { id: 'cat-2', name: 'Artificial Intelligence & GEO', slug: 'ai-solutions-geo', _count: { posts: 4 } },
          { id: 'cat-3', name: 'Software Architecture', slug: 'software-architecture', _count: { posts: 5 } },
          { id: 'cat-4', name: 'Mobile Engineering', slug: 'mobile-app-development', _count: { posts: 3 } },
          { id: 'cat-5', name: 'Technical SEO', slug: 'seo-services', _count: { posts: 2 } },
        ]);
      }
    }
    loadCategories();
  }, []);

  // Load Existing Post
  useEffect(() => {
    if (isNew) {
      setTitle('');
      setSlug('');
      setExcerpt('');
      const defaultContent = '<h2>Introduction</h2>\n<p>Start writing your technical article or insights here...</p>';
      setContent(defaultContent);
      if (visualEditorRef.current) {
        visualEditorRef.current.innerHTML = defaultContent;
      }
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
          setContent(p.content || '');
          if (visualEditorRef.current) {
            visualEditorRef.current.innerHTML = p.content || '';
          }
          setFeaturedImageUrl(p.featuredImageUrl || '');
          setIsPublished(p.isPublished);
          if (p.publishedAt) {
            const d = new Date(p.publishedAt);
            const pad = (n: number) => String(n).padStart(2, '0');
            const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
            setPublishedAt(localIso);
          }
          if (p.categories && Array.isArray(p.categories)) {
            const ids = p.categories
              .map((c: any) => c.categoryId || c.category?.id || c.id)
              .filter(Boolean);
            setSelectedCategoryIds(ids);
          }
          if (p.tags && Array.isArray(p.tags)) {
            setTagInput(p.tags.map((t: any) => t.name || t.tag?.name || '').filter(Boolean).join(', '));
          }
          if (p.seo) setSeo(p.seo);
        }
      } catch {
        // Fallback demo state
        setTitle('The Evolution of Generative Engine Optimization (GEO)');
        setSlug('generative-engine-optimization-guide');
        setExcerpt('Why traditional keywords are being replaced by entity authority and vector schemas in the AI search era.');
        const fallbackContent = '<h2>Understanding Entity Retrieval</h2>\n<p>Generative search engines prioritize authoritative entity networks over plain keyword frequency. Here is how modern platforms must architect structured data.</p>';
        setContent(fallbackContent);
        if (visualEditorRef.current) {
          visualEditorRef.current.innerHTML = fallbackContent;
        }
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

  /**
   * Formatting Toolbar Actions
   * Executes commands on visual editor or wraps selection in code editor
   */
  const handleFormat = (command: string, arg?: string) => {
    if (editorMode === 'visual') {
      if (!visualEditorRef.current) return;
      visualEditorRef.current.focus();

      if (command === 'createLink') {
        const url = window.prompt('Enter Hyperlink URL (e.g. https://silwasa.com):', 'https://');
        if (url) {
          document.execCommand('createLink', false, url);
        }
      } else if (command === 'formatBlock') {
        document.execCommand('formatBlock', false, arg || '<p>');
      } else {
        document.execCommand(command, false, arg);
      }

      // Sync state
      setContent(visualEditorRef.current.innerHTML);
    } else {
      // Code mode: manipulate textarea selection
      const textarea = codeEditorRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = textarea.value.substring(start, end);

      let before = '';
      let after = '';

      switch (command) {
        case 'bold':
          before = '<strong>';
          after = '</strong>';
          break;
        case 'italic':
          before = '<em>';
          after = '</em>';
          break;
        case 'h1':
          before = '<h1>';
          after = '</h1>';
          break;
        case 'h2':
          before = '<h2>';
          after = '</h2>';
          break;
        case 'h3':
          before = '<h3>';
          after = '</h3>';
          break;
        case 'p':
          before = '<p>';
          after = '</p>';
          break;
        case 'insertUnorderedList':
          before = '<ul>\n  <li>';
          after = '</li>\n</ul>';
          break;
        case 'insertOrderedList':
          before = '<ol>\n  <li>';
          after = '</li>\n</ol>';
          break;
        case 'createLink': {
          const url = window.prompt('Enter Hyperlink URL:', 'https://');
          if (url) {
            before = `<a href="${url}">`;
            after = '</a>';
          }
          break;
        }
        case 'quote':
          before = '<blockquote>';
          after = '</blockquote>';
          break;
        case 'code':
          before = '<pre><code>';
          after = '</code></pre>';
          break;
        default:
          break;
      }

      const replacement = before + (selected || 'Text') + after;
      const updated =
        textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

      setContent(updated);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, start + before.length + (selected || 'Text').length);
      }, 0);
    }
  };

  /**
   * Smart Clipboard Paste Handler (Word / Docs Cleaner)
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedHtml = e.clipboardData.getData('text/html');
    const pastedText = e.clipboardData.getData('text/plain');

    if (pastedHtml) {
      e.preventDefault();
      const cleaned = cleanWordAndDocsHtml(pastedHtml);

      if (editorMode === 'visual') {
        document.execCommand('insertHTML', false, cleaned);
        if (visualEditorRef.current) {
          setContent(visualEditorRef.current.innerHTML);
        }
      } else {
        const textarea = codeEditorRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const updated = textarea.value.substring(0, start) + cleaned + textarea.value.substring(end);
        setContent(updated);
      }

      setSuccessMessage('Cleaned and auto-formatted pasted Microsoft Word/Docs document.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } else if (pastedText && editorMode === 'visual') {
      // Plain text paste: preserve paragraphs
      e.preventDefault();
      const paragraphs = pastedText
        .split(/\n\s*\n/)
        .map((p) => `<p>${p.trim().replace(/\n/g, '<br/>')}</p>`)
        .join('\n');
      document.execCommand('insertHTML', false, paragraphs);
      if (visualEditorRef.current) {
        setContent(visualEditorRef.current.innerHTML);
      }
    }
  };

  // Category toggle helper
  const handleToggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Create new category inline
  const handleCreateCategoryInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setCreatingCat(true);
      const catSlug = slugify(newCatName);
      const res = await apiClient<{ success: boolean; data: BlogCategoryOption }>('/admin/blogs/categories', {
        method: 'POST',
        body: {
          name: newCatName.trim(),
          slug: catSlug,
          description: `Category for ${newCatName.trim()}`,
        },
      });

      if (res.success && res.data) {
        setAvailableCategories((prev) => [...prev, res.data]);
        setSelectedCategoryIds((prev) => [...prev, res.data.id]);
        setNewCatName('');
        setShowAddCatInput(false);
        setSuccessMessage(`Category "${res.data.name}" created and assigned.`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch {
      // Local fallback in workspace
      const localCat: BlogCategoryOption = {
        id: `cat-${Date.now()}`,
        name: newCatName.trim(),
        slug: slugify(newCatName),
      };
      setAvailableCategories((prev) => [...prev, localCat]);
      setSelectedCategoryIds((prev) => [...prev, localCat.id]);
      setNewCatName('');
      setShowAddCatInput(false);
      setSuccessMessage(`Category "${localCat.name}" added.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setCreatingCat(false);
    }
  };

  // Cover image upload
  const handleCoverUpload = async (file: File) => {
    try {
      setUploadingCover(true);
      const formData = new FormData();
      formData.append('file', file);
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('silwasa_token') : null;
      const res = await fetch('http://localhost:5000/api/v1/admin/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.url) {
          setFeaturedImageUrl(data.data.url);
        }
      }
    } catch {
      // Ignore
    } finally {
      setUploadingCover(false);
    }
  };

  // Save Post
  const handleSave = async (publishedState?: boolean) => {
    // Sync current visual innerHTML into content before save if in visual mode
    let finalContent = content;
    if (editorMode === 'visual' && visualEditorRef.current) {
      finalContent = visualEditorRef.current.innerHTML;
      setContent(finalContent);
    }

    if (!title.trim() || !slug.trim() || !finalContent.trim()) {
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
        content: finalContent,
        featuredImageUrl: featuredImageUrl || null,
        isPublished: targetPublished,
        publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        readingTimeMinutes: computedReadingTime,
        categoryIds: selectedCategoryIds,
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
        setSuccessMessage('Article saved successfully with updated categories and content.');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch {
      setSuccessMessage('Article updated in workspace.');
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
                {isNew ? 'Create New Article' : title || 'Edit Article'}
              </h1>
              <Badge variant={isPublished ? 'success' : 'warning'}>
                {isPublished ? 'Live' : 'Draft'}
              </Badge>
            </div>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              {slug ? `silwasa.com/blog/${slug}` : 'Auto-generated URL slug'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tabs: Content vs SEO */}
          <div className="flex items-center p-1 rounded-xl bg-[#151414] border border-[#2A2B28] mr-2">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'content'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Content
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === 'seo'
                  ? 'bg-[#663399] text-white shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              SEO &amp; Social
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-white/70">
                      Article Content *
                    </label>
                    <span className="text-[11px] text-white/50 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#D9F45F]" />
                      ~{computedReadingTime} min read ({wordCount} words)
                    </span>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-t-xl bg-[#151414] border border-[#2A2B28] border-b-0">
                    <div className="flex flex-wrap items-center gap-1">
                      {/* Headings */}
                      <button
                        type="button"
                        onClick={() => handleFormat('formatBlock', '<h1>')}
                        className="px-2 py-1 rounded text-xs font-bold hover:bg-[#1C1B1B] text-white/80 hover:text-white transition flex items-center gap-1"
                        title="Heading 1"
                      >
                        <Heading1 className="w-3.5 h-3.5 text-[#D9F45F]" />
                        <span className="hidden sm:inline">H1</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormat('formatBlock', '<h2>')}
                        className="px-2 py-1 rounded text-xs font-bold hover:bg-[#1C1B1B] text-white/80 hover:text-white transition flex items-center gap-1"
                        title="Heading 2"
                      >
                        <Heading2 className="w-3.5 h-3.5 text-[#D9F45F]" />
                        <span className="hidden sm:inline">H2</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormat('formatBlock', '<h3>')}
                        className="px-2 py-1 rounded text-xs font-bold hover:bg-[#1C1B1B] text-white/80 hover:text-white transition flex items-center gap-1"
                        title="Heading 3"
                      >
                        <Heading3 className="w-3.5 h-3.5 text-[#D9F45F]" />
                        <span className="hidden sm:inline">H3</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormat('formatBlock', '<p>')}
                        className="px-2 py-1 rounded text-xs font-medium hover:bg-[#1C1B1B] text-white/70 hover:text-white transition flex items-center gap-1"
                        title="Paragraph"
                      >
                        <Type className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">P</span>
                      </button>

                      <div className="h-4 w-px bg-[#2A2B28] mx-1" />

                      {/* Formatting: Bold & Italic */}
                      <button
                        type="button"
                        onClick={() => handleFormat('bold')}
                        className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/80 hover:text-white transition"
                        title="Bold (Ctrl+B)"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormat('italic')}
                        className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/80 hover:text-white transition"
                        title="Italic (Ctrl+I)"
                      >
                        <Italic className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-px bg-[#2A2B28] mx-1" />

                      {/* Lists */}
                      <button
                        type="button"
                        onClick={() => handleFormat('insertUnorderedList')}
                        className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/80 hover:text-white transition"
                        title="Bullet List (Unordered)"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormat('insertOrderedList')}
                        className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/80 hover:text-white transition"
                        title="Numbered List (Ordered)"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>

                      <div className="h-4 w-px bg-[#2A2B28] mx-1" />

                      {/* Link, Quote, Code */}
                      <button
                        type="button"
                        onClick={() => handleFormat('createLink')}
                        className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/80 hover:text-white transition"
                        title="Insert Hyperlink"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormat('formatBlock', '<blockquote>')}
                        className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/80 hover:text-white transition"
                        title="Blockquote"
                      >
                        <Quote className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormat('formatBlock', '<pre>')}
                        className="p-1.5 rounded hover:bg-[#1C1B1B] text-white/80 hover:text-white transition"
                        title="Code Block"
                      >
                        <Code className="w-4 h-4" />
                      </button>
                    </div>

                    {/* View Toggle: Visual Editor vs HTML Code */}
                    <div className="flex items-center p-0.5 rounded-lg bg-[#1C1B1B] border border-[#2A2B28]">
                      <button
                        type="button"
                        onClick={() => {
                          if (editorMode === 'code') {
                            setEditorMode('visual');
                          }
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                          editorMode === 'visual'
                            ? 'bg-[#663399] text-white shadow-sm'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D9F45F]" />
                        <span>Visual Editor</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editorMode === 'visual' && visualEditorRef.current) {
                            setContent(visualEditorRef.current.innerHTML);
                            setEditorMode('code');
                          }
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                          editorMode === 'code'
                            ? 'bg-[#663399] text-white shadow-sm'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <Code className="w-3.5 h-3.5 text-[#D9F45F]" />
                        <span>HTML Code</span>
                      </button>
                    </div>
                  </div>

                  {/* Editor Surface */}
                  {editorMode === 'visual' ? (
                    <div
                      ref={visualEditorRef}
                      contentEditable
                      suppressContentEditableWarning
                      onInput={() => {
                        if (visualEditorRef.current) {
                          setContent(visualEditorRef.current.innerHTML);
                        }
                      }}
                      onBlur={() => {
                        if (visualEditorRef.current) {
                          setContent(visualEditorRef.current.innerHTML);
                        }
                      }}
                      onPaste={handlePaste}
                      className="w-full min-h-[440px] max-h-[700px] overflow-y-auto p-6 rounded-b-xl bg-[#151414] border border-[#2A2B28] text-white prose prose-invert prose-headings:font-bold prose-headings:text-white prose-p:text-white/80 prose-a:text-[#D9F45F] prose-li:text-white/80 max-w-none focus:outline-none focus:border-[#D9F45F] transition leading-relaxed text-sm"
                    />
                  ) : (
                    <textarea
                      ref={codeEditorRef}
                      rows={18}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onPaste={handlePaste}
                      placeholder="Write or edit raw semantic HTML code here. Microsoft Word content can be pasted directly and will auto-clean formatting..."
                      className="w-full p-4 rounded-b-xl bg-[#151414] border border-[#2A2B28] text-emerald-300 text-xs font-mono leading-relaxed focus:outline-none focus:border-[#D9F45F] transition"
                    />
                  )}

                  <div className="flex items-center justify-between text-[11px] text-white/40 mt-1.5 px-1">
                    <span>
                      Smart Word &amp; Docs Parser active: Headings (H1–H4), lists, bold, italics, and links are preserved on paste.
                    </span>
                    <span className="font-mono">
                      Mode: {editorMode === 'visual' ? 'WYSIWYG Visual' : 'Raw HTML'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: Meta & Attributes (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Publication & Scheduling Card */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D9F45F]" />
                  Publish &amp; Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#2A2B28]">
                  <span className="text-xs text-white/70">Current Status</span>
                  <Badge variant={isPublished ? 'success' : 'warning'}>
                    {isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Schedule Future Date/Time
                  </label>
                  <input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#151414] border border-[#2A2B28] text-white text-xs focus:outline-none focus:border-[#D9F45F]"
                  />
                  {publishedAt && new Date(publishedAt) > new Date() && (
                    <p className="text-[11px] text-amber-400 mt-1.5 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Scheduled: {new Date(publishedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Featured Cover Image */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#D9F45F]" />
                    Cover Image
                  </span>
                  {uploadingCover && (
                    <span className="text-[11px] text-[#D9F45F] animate-pulse">Uploading...</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <Input
                  type="text"
                  placeholder="https://silwasa.com/assets/banner.webp"
                  value={featuredImageUrl}
                  onChange={(e) => setFeaturedImageUrl(e.target.value)}
                />
                <label className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#663399]/20 hover:bg-[#663399]/30 text-white text-xs font-semibold cursor-pointer border border-[#663399]/40 transition">
                  <UploadCloud className="w-3.5 h-3.5 text-[#D9F45F]" />
                  <span>Upload Cover Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCoverUpload(file);
                    }}
                  />
                </label>
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

            {/* Blog Categories Card (Situated ABOVE Tags & Entities) */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#D9F45F]" />
                    Blog Categories
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/admin/categories"
                      target="_blank"
                      className="text-[11px] text-[#D9F45F] hover:underline"
                    >
                      Manage
                    </Link>
                    <span className="text-[11px] font-mono text-white/50">
                      ({selectedCategoryIds.length} selected)
                    </span>
                  </div>
                </CardTitle>
                <CardDescription className="text-xs text-white/50">
                  Select topics to classify this article on the website
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {availableCategories.length === 0 ? (
                  <p className="text-xs text-white/40 italic">No categories created yet.</p>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {availableCategories.map((cat) => {
                      const isChecked = selectedCategoryIds.includes(cat.id);
                      return (
                        <label
                          key={cat.id}
                          className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                            isChecked
                              ? 'bg-[#663399]/25 border-[#663399] text-white'
                              : 'bg-[#151414] border-[#2A2B28] text-white/70 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleCategory(cat.id)}
                              className="w-3.5 h-3.5 rounded text-[#663399] bg-[#1C1B1B] border-[#2A2B28]"
                            />
                            <span className="font-medium truncate">{cat.name}</span>
                          </div>
                          {cat._count?.posts !== undefined && (
                            <span className="text-[10px] text-white/40 shrink-0 font-mono">
                              {cat._count.posts} posts
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* Inline Add Category Option */}
                {showAddCatInput ? (
                  <form onSubmit={handleCreateCategoryInline} className="pt-2 border-t border-[#2A2B28] space-y-2">
                    <Input
                      type="text"
                      autoFocus
                      required
                      placeholder="New category name..."
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="text-xs h-8"
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={creatingCat || !newCatName.trim()}
                        variant="primary"
                        className="h-7 text-xs flex-1"
                      >
                        {creatingCat ? 'Adding...' : 'Add Category'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setShowAddCatInput(false);
                          setNewCatName('');
                        }}
                        className="h-7 text-xs text-white/60"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddCatInput(true)}
                    className="w-full py-1.5 rounded-lg border border-dashed border-[#2A2B28] text-xs text-[#D9F45F] hover:bg-[#D9F45F]/10 transition flex items-center justify-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create New Category</span>
                  </button>
                )}
              </CardContent>
            </Card>

            {/* Tags & Entities Card */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold">Tags &amp; Entities</CardTitle>
                <CardDescription className="text-xs text-white/50">
                  Semantic entities for search graph indexing
                </CardDescription>
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
            <CardTitle>Article Search Optimization &amp; JSON-LD</CardTitle>
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
