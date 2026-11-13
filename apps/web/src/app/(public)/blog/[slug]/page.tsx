import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2, Tag, Home, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import type { BlogPost } from '@silwasa/types';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PRESEEDED_ARTICLES: Record<string, BlogPost> = {
  'generative-engine-optimization-guide': {
    id: 'post-1',
    title: 'The Evolution of Generative Engine Optimization (GEO)',
    slug: 'generative-engine-optimization-guide',
    excerpt: 'Why traditional keywords are being replaced by entity authority, schema graphs, and vector retrieval in the AI search era.',
    content: `
      <h2>The Shift From Keywords to Entity Intelligence</h2>
      <p>For more than two decades, search engine optimization was centered on keyword density, backlink quantities, and algorithmic page crawls. Today, generative search models—powered by Perplexity AI, OpenAI ChatGPT Search, and Google AI Overviews—operate on semantic entity networks, vector embeddings, and direct information retrieval.</p>
      
      <h2>1. Structuring Schema.org Entity Graphs</h2>
      <p>Modern GEO demands that organizations publish unambiguous, structured JSON-LD entity representations. Rather than indexing standalone paragraphs, LLM crawlers map relationships between organizations, executive founders, verified software specifications, and customer case study outcomes.</p>
      
      <h2>2. Authoritative Source Citations</h2>
      <p>When an enterprise client asks an AI model to evaluate vendor alternatives, models prioritize content that features high factual density, explicit performance metrics, verifiable client references, and technical implementation details.</p>
      
      <h2>3. Core Web Vitals & Sub-Second Latency</h2>
      <p>Crawl budgets and token processing costs for AI engines mean slow, JavaScript-heavy client rendered pages are often skipped or poorly represented in synthesis. Server-rendered Next.js 15 pages with sub-second response times guarantee maximum indexing precision.</p>
    `,
    readingTimeMinutes: 6,
    isPublished: true,
    publishedAt: '2026-11-10T00:00:00.000Z',
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'c1', name: 'AI & Data', slug: 'ai-data' }],
    tags: [{ id: 't1', name: 'GEO', slug: 'geo' }, { id: 't2', name: 'AI Search', slug: 'ai-search' }],
    seo: {
      metaTitle: 'The Evolution of Generative Engine Optimization (GEO) | Silwasa',
      metaDescription: 'Learn how to architect high-authority structured entity graphs for ChatGPT and Perplexity citations.',
      canonicalUrl: 'https://silwasa.com/blog/generative-engine-optimization-guide',
      robotsIndex: true,
      robotsFollow: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'nextjs-15-core-web-vitals-guide': {
    id: 'post-2',
    title: 'Sub-Second Core Web Vitals: Architecting Next.js 15 Platforms',
    slug: 'nextjs-15-core-web-vitals-guide',
    excerpt: 'Detailed engineering blueprint for hitting 99+ Lighthouse performance scores, instant streaming SSR, and sub-second Largest Contentful Paint.',
    content: `
      <h2>The Performance Imperative</h2>
      <p>Every 100ms delay in page latency degrades user conversion rates and penalizes organic search visibility. In Next.js 15, we leverage React 19 Server Components, Turbopack bundling, and edge streaming to deliver lightning-fast interactive experiences.</p>
      <h2>Zero-JavaScript Default Render</h2>
      <p>By default, components should execute strictly on the server, streaming minimal HTML over the wire without bundling unnecessary client dependencies. Client components are reserved solely for interactive controls like toggles and forms.</p>
    `,
    readingTimeMinutes: 8,
    isPublished: true,
    publishedAt: '2026-11-05T00:00:00.000Z',
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'c2', name: 'Web Engineering', slug: 'web-engineering' }],
    tags: [{ id: 't3', name: 'Next.js', slug: 'nextjs' }, { id: 't4', name: 'Performance', slug: 'performance' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

async function getPost(slug: string): Promise<BlogPost | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    const res = await fetch(`${apiUrl}/blogs/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch {
    // API offline, fallback
  }

  return PRESEEDED_ARTICLES[slug] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Article Not Found | Silwasa IT Solutions' };
  }

  return {
    title: post.seo?.metaTitle || `${post.title} | Silwasa IT Solutions`,
    description: post.seo?.metaDescription || post.excerpt,
    alternates: {
      canonical: post.seo?.canonicalUrl || `https://silwasa.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seo?.ogTitle || post.title,
      description: post.seo?.ogDescription || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      authors: [post.author?.name || 'Silwasa IT Solutions'],
    },
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="py-16 lg:py-24 bg-[#151414] relative">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-white/50 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-[#D9F45F] truncate max-w-xs">{post.title}</span>
        </div>

        {/* Header Block */}
        <div className="space-y-6 pb-8 border-b border-[#2A2B28]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#663399]/30 text-white border border-[#663399]/40">
              {post.categories?.[0]?.name || (post.categories?.[0] as any)?.category?.name || 'Engineering'}
            </span>

            <span className="text-xs text-white/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D9F45F]" />
              {post.readingTimeMinutes || 5} min read
            </span>

            {post.publishedAt && (
              <span className="text-xs text-white/60 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                {new Date(post.publishedAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-white/80 leading-relaxed font-medium">
            {post.excerpt}
          </p>

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-[#663399] flex items-center justify-center text-white font-bold text-sm shadow-md">
              S
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{post.author?.name || 'Lead Architect'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs text-white/50">
                Silwasa IT Solutions Engineering Team
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div
          className="py-12 prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed space-y-6 prose-headings:text-white prose-headings:font-bold prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-a:text-[#D9F45F] prose-strong:text-white prose-code:text-[#D9F45F] prose-code:bg-[#1C1B1B] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-[#663399] prose-blockquote:text-white/70"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags Block */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-8 pb-12 border-t border-[#2A2B28] flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-white/50 mr-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Topics:
            </span>
            {post.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#1C1B1B] border border-[#2A2B28] text-white/80"
              >
                #{t.name || (t as any).tag?.name || 'tech'}
              </span>
            ))}
          </div>
        )}

        {/* Article End CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-[#1C1B1B] via-[#211b27] to-[#1C1B1B] border border-[#663399]/40 p-8 sm:p-10 shadow-2xl text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151414] border border-[#2A2B28] text-[#D9F45F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turn Knowledge Into Action</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Need Enterprise Software or GEO Architecture?
          </h3>

          <p className="text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            Schedule a technical blueprint consultation with our lead engineering team. We review your architecture, scope requirements, and deliver transparent milestone estimates.
          </p>

          <div className="pt-2 flex items-center justify-center gap-4">
            <Link href="/contact">
              <Button variant="primary" size="lg" className="rounded-full shadow-lg shadow-[#663399]/20">
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link href="/blog">
              <Button variant="outline" size="lg" className="rounded-full">
                <span>All Articles</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
