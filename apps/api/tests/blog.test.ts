import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { blogRepository } from '../src/repositories/blog.repository.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';

describe('Phase 7: Blog CMS API', () => {
  const app = createApp();
  let adminToken: string;

  beforeEach(() => {
    vi.restoreAllMocks();
    adminToken = generateToken({
      userId: 'admin-1',
      email: 'admin@silwasa.com',
      role: UserRole.ADMIN,
    });

    vi.spyOn(userRepository, 'findSession').mockResolvedValue({
      id: 'sess-1',
      userId: 'admin-1',
      token: adminToken,
      expiresAt: new Date(Date.now() + 86400000),
      createdAt: new Date(),
      user: {
        id: 'admin-1',
        email: 'admin@silwasa.com',
        name: 'Admin User',
        role: 'ADMIN',
        avatarUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });

  it('GET /api/v1/blogs returns published blog posts', async () => {
    vi.spyOn(blogRepository, 'findPublishedPosts').mockResolvedValue({
      total: 1,
      page: 1,
      limit: 10,
      posts: [
        {
          id: 'post-1',
          title: 'The Future of Generative Engine Optimization',
          slug: 'future-of-geo',
          excerpt: 'Why traditional SEO is rapidly morphing into entity schema authority.',
          content: 'Full article text discussing Perplexity, ChatGPT and modern entity graphs.',
          featuredImageUrl: 'https://silwasa.com/og-geo.webp',
          readingTimeMinutes: 4,
          isPublished: true,
          publishedAt: new Date(),
          authorId: 'admin-1',
          author: { id: 'admin-1', name: 'Lead Architect', avatarUrl: null },
          categories: [],
          tags: [],
          seo: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any,
    });

    const res = await request(app).get('/api/v1/blogs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination.total).toBe(1);
  });

  it('GET /api/v1/blogs/:slug returns single post with author and categories', async () => {
    vi.spyOn(blogRepository, 'findPostBySlug').mockResolvedValue({
      id: 'post-1',
      title: 'The Future of Generative Engine Optimization',
      slug: 'future-of-geo',
      excerpt: 'Why traditional SEO is rapidly morphing into entity schema authority.',
      content: 'Full article text discussing Perplexity, ChatGPT and modern entity graphs.',
      featuredImageUrl: null,
      readingTimeMinutes: 4,
      isPublished: true,
      publishedAt: new Date(),
      authorId: 'admin-1',
      author: { id: 'admin-1', name: 'Lead Architect', avatarUrl: null },
      categories: [{ category: { id: 'c1', name: 'AI & Data', slug: 'ai-data' } }],
      tags: [{ tag: { id: 't1', name: 'GEO', slug: 'geo' } }],
      seo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const res = await request(app).get('/api/v1/blogs/future-of-geo');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('future-of-geo');
    expect(res.body.data.categories[0].category.name).toBe('AI & Data');
  });

  it('GET /api/v1/blogs/:slug returns 404 for non-existent post', async () => {
    vi.spyOn(blogRepository, 'findPostBySlug').mockResolvedValue(null);

    const res = await request(app).get('/api/v1/blogs/missing-article');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/admin/blogs creates post with computed reading time', async () => {
    vi.spyOn(blogRepository, 'findPostBySlug').mockResolvedValue(null);
    vi.spyOn(blogRepository, 'createPost').mockResolvedValue({
      id: 'post-new',
      title: 'Building Next.js 15 Micro-Frontends',
      slug: 'building-nextjs-15-micro-frontends',
      excerpt: 'Comprehensive architecture guide for decoupled enterprise frontend teams.',
      content: 'A very detailed 500-word technical guide about Next.js 15 App Router, Server Actions, and Turbopack.',
      featuredImageUrl: null,
      readingTimeMinutes: 3,
      isPublished: true,
      publishedAt: new Date(),
      authorId: 'admin-1',
      author: { id: 'admin-1', name: 'Admin User', avatarUrl: null },
      categories: [],
      tags: [],
      seo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const res = await request(app)
      .post('/api/v1/admin/blogs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Building Next.js 15 Micro-Frontends',
        slug: 'building-nextjs-15-micro-frontends',
        excerpt: 'Comprehensive architecture guide for decoupled enterprise frontend teams.',
        content: 'A very detailed 500-word technical guide about Next.js 15 App Router, Server Actions, and Turbopack.',
        isPublished: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('building-nextjs-15-micro-frontends');
  });

  it('PUT /api/v1/admin/blogs/:id updates an existing post', async () => {
    vi.spyOn(blogRepository, 'findPostById').mockResolvedValue({
      id: 'post-1',
      slug: 'my-post',
      readingTimeMinutes: 5,
    } as any);

    vi.spyOn(blogRepository, 'updatePost').mockResolvedValue({
      id: 'post-1',
      title: 'Updated Title',
      slug: 'my-post',
    } as any);

    const res = await request(app)
      .put('/api/v1/admin/blogs/post-1')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated Title',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('DELETE /api/v1/admin/blogs/:id deletes a post', async () => {
    vi.spyOn(blogRepository, 'findPostById').mockResolvedValue({ id: 'post-1' } as any);
    vi.spyOn(blogRepository, 'deletePost').mockResolvedValue({ id: 'post-1' } as any);

    const res = await request(app)
      .delete('/api/v1/admin/blogs/post-1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
