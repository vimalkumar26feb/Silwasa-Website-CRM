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
    featuredImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
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
    featuredImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    readingTimeMinutes: 8,
    isPublished: true,
    publishedAt: '2026-11-05T00:00:00.000Z',
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'c2', name: 'Web Engineering', slug: 'web-engineering' }],
    tags: [{ id: 't3', name: 'Next.js', slug: 'nextjs' }, { id: 't4', name: 'Performance', slug: 'performance' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'zero-debt-engineering-architecture': {
    id: 'post-3',
    title: 'Zero-Debt Engineering: Strict TypeScript Contracts & ACID Relational Systems',
    slug: 'zero-debt-engineering-architecture',
    excerpt: 'Eliminating architectural debt through schema-driven validation, transactional Prisma ORMs, and automated end-to-end integration testing.',
    content: `
      <h2>Eliminating Architectural Debt</h2>
      <p>Clean code without strict schema boundaries is a myth. By enforcing end-to-end TypeScript interfaces spanning the database layer, API controllers, and client frontends, we guarantee bulletproof software delivery.</p>
    `,
    featuredImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    readingTimeMinutes: 5,
    isPublished: true,
    publishedAt: '2026-10-28T00:00:00.000Z',
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'c3', name: 'Architecture', slug: 'architecture' }],
    tags: [{ id: 't5', name: 'TypeScript', slug: 'typescript' }, { id: 't6', name: 'PostgreSQL', slug: 'postgresql' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

async function getRelatedPosts(currentSlug: string): Promise<BlogPost[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  try {
    const res = await fetch(`${apiUrl}/blogs`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        return (data.data as BlogPost[]).filter((p) => p.slug !== currentSlug).slice(0, 3);
      }
    }
  } catch {
    // Fallback
  }
  return Object.values(PRESEEDED_ARTICLES).filter((p) => p.slug !== currentSlug).slice(0, 3);
}

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

  const relatedPosts = await getRelatedPosts(slug);

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

        {/* Cover Image Display */}
        {post.featuredImageUrl && (
          <div className="my-8 rounded-3xl overflow-hidden border border-[#2A2B28] aspect-[16/9] sm:aspect-[21/9] bg-[#1C1B1B] shadow-2xl">
            <img
              src={post.featuredImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

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

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#2A2B28] space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-white">Related Architecture Articles</h3>
                <p className="text-xs text-white/50 mt-1">Further reading from our engineering knowledge base</p>
              </div>
              <Link href="/blog" className="text-xs font-bold text-[#D9F45F] hover:underline flex items-center gap-1">
                <span>View All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.id}
                  className="rounded-2xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 p-4 sm:p-5 flex flex-col justify-between group transition duration-300"
                >
                  <div>
                    <Link href={`/blog/${rel.slug}`} className="block relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-4 bg-[#151414] border border-[#2A2B28]">
                      {rel.featuredImageUrl ? (
                        <img
                          src={rel.featuredImageUrl}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          <Sparkles className="w-6 h-6 text-[#663399]" />
                        </div>
                      )}
                    </Link>

                    <div className="flex items-center justify-between text-[11px] text-white/40 mb-2">
                      <span>{rel.categories?.[0]?.name || (rel.categories?.[0] as any)?.category?.name || 'Tech'}</span>
                      <span>{rel.readingTimeMinutes || 5} min read</span>
                    </div>

                    <h4 className="text-sm font-bold text-white group-hover:text-[#D9F45F] transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                  </div>

                  <div className="pt-3 mt-4 border-t border-[#2A2B28]/60 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">
                      {rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'}
                    </span>
                    <Link
                      href={`/blog/${rel.slug}`}
                      className="text-xs font-bold text-[#D9F45F] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
