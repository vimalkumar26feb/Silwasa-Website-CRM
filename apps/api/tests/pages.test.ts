import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { pageRepository } from '../src/repositories/page.repository.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';

describe('Phase 5: Dynamic Pages & Page Builder API', () => {
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

  it('GET /api/v1/pages/:slug returns published page', async () => {
    vi.spyOn(pageRepository, 'findBySlug').mockResolvedValue({
      id: 'page-1',
      title: 'About Us',
      slug: 'about',
      content: null,
      sections: [
        {
          id: 'sec-1',
          type: 'hero',
          version: 1,
          order: 0,
          isEnabled: true,
          settings: { heading: 'About Silwasa' },
        },
      ] as object,
      isPublished: true,
      publishedAt: new Date(),
      featuredImageId: null,
      featuredImageUrl: null,
      parentPageId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      seo: {
        id: 'seo-1',
        metaTitle: 'About Us | Silwasa IT Solutions',
        metaDescription: 'Who we are',
        metaKeywords: null,
        canonicalUrl: null,
        robotsIndex: true,
        robotsFollow: true,
        ogTitle: null,
        ogDescription: null,
        ogImageUrl: null,
        twitterCard: 'summary_large_image',
        structuredDataJson: null,
        pageId: 'page-1',
        blogPostId: null,
        serviceId: null,
        industryId: null,
        portfolioId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const res = await request(app).get('/api/v1/pages/about');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('about');
    expect(res.body.data.isPublished).toBe(true);
  });

  it('GET /api/v1/pages/:slug returns 404 for non-existent or unpublished pages', async () => {
    vi.spyOn(pageRepository, 'findBySlug').mockResolvedValue(null);

    const res = await request(app).get('/api/v1/pages/non-existent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/admin/pages creates a new page with sections and initial revision', async () => {
    vi.spyOn(pageRepository, 'findBySlug').mockResolvedValue(null);
    vi.spyOn(pageRepository, 'create').mockResolvedValue({
      id: 'page-new-1',
      title: 'Our Process',
      slug: 'process',
      content: null,
      sections: [
        {
          id: 'sec-1',
          type: 'development-process',
          version: 1,
          order: 0,
          isEnabled: true,
          settings: {},
        },
      ] as object,
      isPublished: false,
      publishedAt: null,
      featuredImageId: null,
      featuredImageUrl: null,
      parentPageId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      seo: null,
    });
    vi.spyOn(pageRepository, 'createRevision').mockResolvedValue({
      id: 'rev-1',
      pageId: 'page-new-1',
      title: 'Our Process',
      sections: [] as object,
      version: 1,
      createdById: 'admin-1',
      createdAt: new Date(),
    });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/admin/pages')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Our Process',
        slug: 'process',
        isPublished: false,
        sections: [
          {
            id: 'sec-1',
            type: 'development-process',
            version: 1,
            order: 0,
            isEnabled: true,
            settings: {},
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('process');
  });

  it('POST /api/v1/admin/pages/:id/publish toggles published state', async () => {
    vi.spyOn(pageRepository, 'findById').mockResolvedValue({
      id: 'page-1',
      title: 'About Us',
      slug: 'about',
      content: null,
      sections: [] as object,
      isPublished: false,
      publishedAt: null,
      featuredImageId: null,
      featuredImageUrl: null,
      parentPageId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      seo: null,
      revisions: [],
    });

    vi.spyOn(pageRepository, 'update').mockResolvedValue({
      id: 'page-1',
      title: 'About Us',
      slug: 'about',
      content: null,
      sections: [] as object,
      isPublished: true,
      publishedAt: new Date(),
      featuredImageId: null,
      featuredImageUrl: null,
      parentPageId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      seo: null,
    });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/admin/pages/page-1/publish')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isPublished: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isPublished).toBe(true);
  });
});
