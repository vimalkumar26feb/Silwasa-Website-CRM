import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, BookOpen, Sparkles, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { BlogPost } from '@silwasa/types';

export const metadata: Metadata = {
  title: 'Blog & Engineering Insights | Silwasa IT Solutions',
  description:
    'Deep dives on Generative Engine Optimization (GEO), Next.js 15 performance, enterprise software architecture, and modern full-stack development.',
  alternates: {
    canonical: 'https://silwasa.com/blog',
  },
};

const SEEDED_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Evolution of Generative Engine Optimization (GEO)',
    slug: 'generative-engine-optimization-guide',
    excerpt:
      'Why traditional keywords are being replaced by entity authority, schema graphs, and vector retrieval in the AI search era.',
    content: '<p>Comprehensive breakdown of how search engines and LLM agents parse entity graphs.</p>',
    readingTimeMinutes: 6,
    isPublished: true,
    publishedAt: '2026-11-10T00:00:00.000Z',
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'c1', name: 'AI & Data', slug: 'ai-data' }],
    tags: [{ id: 't1', name: 'GEO', slug: 'geo' }, { id: 't2', name: 'AI Search', slug: 'ai-search' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-2',
    title: 'Sub-Second Core Web Vitals: Architecting Next.js 15 Platforms',
    slug: 'nextjs-15-core-web-vitals-guide',
    excerpt:
      'Detailed engineering blueprint for hitting 99+ Lighthouse performance scores, instant streaming SSR, and sub-second Largest Contentful Paint.',
    content: '<p>Analyzing server components, streaming SSR, edge caching and font sub-setting.</p>',
    readingTimeMinutes: 8,
    isPublished: true,
    publishedAt: '2026-11-05T00:00:00.000Z',
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'c2', name: 'Web Engineering', slug: 'web-engineering' }],
    tags: [{ id: 't3', name: 'Next.js', slug: 'nextjs' }, { id: 't4', name: 'Performance', slug: 'performance' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'post-3',
    title: 'Zero-Debt Engineering: Strict TypeScript Contracts & ACID Relational Systems',
    slug: 'zero-debt-engineering-architecture',
    excerpt:
      'Eliminating architectural debt through schema-driven validation, transactional Prisma ORMs, and automated end-to-end integration testing.',
    content: '<p>A deep dive into clean architecture in commercial software development.</p>',
    readingTimeMinutes: 5,
    isPublished: true,
    publishedAt: '2026-10-28T00:00:00.000Z',
    author: { id: 'admin-1', name: 'Lead Architect', email: 'admin@silwasa.com' },
    categories: [{ id: 'c3', name: 'Architecture', slug: 'architecture' }],
    tags: [{ id: 't5', name: 'TypeScript', slug: 'typescript' }, { id: 't6', name: 'PostgreSQL', slug: 'postgresql' }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function getBlogPosts(): Promise<BlogPost[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    const res = await fetch(`${apiUrl}/blogs`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        return data.data;
      }
    }
  } catch {
    // API not reachable, fallback to seeded posts
  }

  return SEEDED_POSTS;
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="py-16 lg:py-24 bg-[#151414] relative">
      <div className="max-w-[1369px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1B1B] border border-[#2A2B28]">
            <span className="w-2 h-2 rounded-full bg-[#D9F45F]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#D9F45F]">
              KNOWLEDGE BASE & ARCHITECTURE
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Engineering Insights & GEO Strategy
          </h1>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed">
            Technical guides, full-stack architectural blueprints, and generative search optimization strategies authored by our senior engineering team.
          </p>
        </div>

        {/* Featured Post Card */}
        {featuredPost && (
          <div className="mb-16">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#1C1B1B] to-[#211b27] border border-[#663399]/40 shadow-2xl relative overflow-hidden group">
              <div className="space-y-4 max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D9F45F]/15 text-[#D9F45F] border border-[#D9F45F]/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Featured Article
                  </span>
                  <span className="text-xs text-white/50 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredPost.readingTimeMinutes || 5} min read
                  </span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white group-hover:text-[#D9F45F] transition-colors leading-tight">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-base text-white/70 leading-relaxed max-w-2xl">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-4 flex items-center gap-4">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    <Button variant="primary" size="lg" className="rounded-full">
                      <span>Read Full Blueprint</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Remaining Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingPosts.map((post) => (
            <div
              key={post.id}
              className="p-8 rounded-3xl bg-[#1C1B1B] border border-[#2A2B28] hover:border-[#663399]/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#151414] border border-[#2A2B28] text-white/80 font-medium">
                    {post.categories?.[0]?.name || (post.categories?.[0] as any)?.category?.name || 'Technical'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-white/40" />
                    {post.readingTimeMinutes || 5} min read
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#D9F45F] transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-sm text-white/70 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#2A2B28]/60 flex items-center justify-between">
                <span className="text-xs text-white/40">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Recent'}
                </span>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9F45F] group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
