import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { serviceRepository } from '../src/repositories/service.repository.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';

describe('Phase 8: Services & Pricing Management API', () => {
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

  it('GET /api/v1/services returns published services', async () => {
    vi.spyOn(serviceRepository, 'findPublishedServices').mockResolvedValue([
      {
        id: 's-1',
        title: 'Website Design & Development',
        slug: 'website-design-development',
        shortDescription: 'Modern Next.js web platforms.',
        fullDescription: 'Comprehensive full-stack engineering.',
        icon: 'Globe',
        featuredImageUrl: null,
        features: ['Responsive UI', 'Sub-second LCP'],
        benefits: ['High Conversion'],
        process: [],
        faqs: [],
        isPublished: true,
        order: 0,
        pricingPackages: [],
        seo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ]);

    const res = await request(app).get('/api/v1/services');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].slug).toBe('website-design-development');
  });

  it('GET /api/v1/services/:slug returns single service with deliverables', async () => {
    vi.spyOn(serviceRepository, 'findServiceBySlug').mockResolvedValue({
      id: 's-1',
      title: 'Website Design & Development',
      slug: 'website-design-development',
      shortDescription: 'Modern Next.js web platforms.',
      fullDescription: 'Comprehensive full-stack engineering.',
      icon: 'Globe',
      featuredImageUrl: null,
      features: ['Responsive UI'],
      benefits: ['Fast performance'],
      process: [{ step: 1, title: 'Discovery', description: 'Auditing requirements' }],
      faqs: [{ question: 'How fast is delivery?', answer: 'Within 2-4 weeks' }],
      isPublished: true,
      order: 0,
      pricingPackages: [],
      seo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const res = await request(app).get('/api/v1/services/website-design-development');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('website-design-development');
    expect(res.body.data.features).toContain('Responsive UI');
  });

  it('GET /api/v1/services/:slug returns 404 for missing service', async () => {
    vi.spyOn(serviceRepository, 'findServiceBySlug').mockResolvedValue(null);

    const res = await request(app).get('/api/v1/services/non-existent-service');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/pricing calculates automated discount promotions correctly', async () => {
    vi.spyOn(serviceRepository, 'findPricingPackages').mockResolvedValue([
      {
        id: 'pkg-1',
        name: 'Growth Plan',
        serviceId: 's-1',
        shortDescription: 'Full package with discount',
        regularPrice: 2000 as any,
        discountedPrice: null,
        discountType: 'PERCENTAGE',
        discountValue: 20 as any, // 20% discount = $400 off, effective = $1600
        discountStartDate: new Date(Date.now() - 86400000), // active
        discountEndDate: new Date(Date.now() + 86400000), // active
        currency: 'USD',
        features: [{ id: 'f1', text: 'Full Next.js Platform', included: true }],
        isPopular: true,
        ctaLabel: 'Choose Plan',
        ctaUrl: '/contact',
        order: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ]);

    const res = await request(app).get('/api/v1/pricing');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].hasActiveDiscount).toBe(true);
    expect(res.body.data[0].effectivePrice).toBe(1600);
    expect(res.body.data[0].discountAmount).toBe(400);
  });

  it('POST /api/v1/admin/services creates a new service', async () => {
    vi.spyOn(serviceRepository, 'findServiceBySlug').mockResolvedValue(null);
    vi.spyOn(serviceRepository, 'createService').mockResolvedValue({
      id: 's-new',
      title: 'React.js Development',
      slug: 'reactjs-development',
      shortDescription: 'High-velocity React applications.',
      fullDescription: 'Custom components, state management, and high concurrency.',
      features: ['React 19'],
      benefits: ['Fast interactions'],
      process: [],
      faqs: [],
      isPublished: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const res = await request(app)
      .post('/api/v1/admin/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'React.js Development',
        slug: 'reactjs-development',
        shortDescription: 'High-velocity React applications.',
        fullDescription: 'Custom components, state management, and high concurrency.',
        features: ['React 19'],
        benefits: ['Fast interactions'],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('reactjs-development');
  });

  it('DELETE /api/v1/admin/services/:id removes a service', async () => {
    vi.spyOn(serviceRepository, 'findServiceById').mockResolvedValue({ id: 's-1' } as any);
    vi.spyOn(serviceRepository, 'deleteService').mockResolvedValue({ id: 's-1' } as any);

    const res = await request(app)
      .delete('/api/v1/admin/services/s-1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
