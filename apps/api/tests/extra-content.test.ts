import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { industryRepository } from '../src/repositories/industry.repository.js';
import { portfolioRepository } from '../src/repositories/portfolio.repository.js';
import { contentRepository } from '../src/repositories/content.repository.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';

describe('Phase 10: SEO & Remaining CMS Modules API', () => {
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

  it('GET /api/v1/industries returns published industry verticals', async () => {
    vi.spyOn(industryRepository, 'findPublished').mockResolvedValue([
      {
        id: 'ind-1',
        name: 'Healthcare & Telemedicine',
        slug: 'healthcare',
        shortDescription: 'HIPAA-ready clinical workflows.',
        fullDescription: 'Comprehensive EHR and telehealth software platforms.',
        icon: 'Stethoscope',
        featuredImageUrl: null,
        challenges: ['HIPAA Data Compliance', 'Legacy EHR Silos'],
        solutions: ['Encrypted FHIR APIs', 'Real-Time Patient Queues'],
        isPublished: true,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ]);

    const res = await request(app).get('/api/v1/industries');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].slug).toBe('healthcare');
  });

  it('GET /api/v1/industries/:slug returns detailed industry specifications', async () => {
    vi.spyOn(industryRepository, 'findBySlug').mockResolvedValue({
      id: 'ind-1',
      name: 'Healthcare & Telemedicine',
      slug: 'healthcare',
      shortDescription: 'HIPAA-ready clinical workflows.',
      fullDescription: 'Comprehensive EHR and telehealth software platforms.',
      challenges: ['Data Security'],
      solutions: ['End-to-End Encryption'],
      isPublished: true,
      order: 0,
      seo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const res = await request(app).get('/api/v1/industries/healthcare');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Healthcare & Telemedicine');
  });

  it('GET /api/v1/portfolio returns case studies and portfolio projects', async () => {
    vi.spyOn(portfolioRepository, 'findPublished').mockResolvedValue([
      {
        id: 'port-1',
        title: 'HealthFlow Clinical Telemetry Portal',
        slug: 'healthflow-telemetry-portal',
        clientName: 'NovaCura Health System',
        industry: 'Healthcare',
        category: 'Web Application',
        projectUrl: 'https://healthflow-demo.silwasa.com',
        featuredImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d',
        galleryImages: [],
        description: 'Real-time patient telemetry monitoring portal.',
        technologies: ['Next.js 15', 'TypeScript', 'WebSockets'],
        challenges: 'Severe sub-second latency constraints across 10,000 parallel streams.',
        solutions: 'Stateless edge API orchestration with Redis pub/sub.',
        results: '0.42s latency, 99.99% uptime, 15,000 concurrent patients.',
        isPublished: true,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ]);

    const res = await request(app).get('/api/v1/portfolio');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].clientName).toBe('NovaCura Health System');
  });

  it('GET /api/v1/testimonials returns client reviews and ratings', async () => {
    vi.spyOn(contentRepository, 'findTestimonials').mockResolvedValue([
      {
        id: 'test-1',
        clientName: 'Dr. Vikram Malhotra',
        clientRole: 'Chief Technology Officer',
        clientCompany: 'NovaCura Healthcare',
        clientAvatarUrl: null,
        content: 'Silwasa delivered our complete clinical telemetry platform with zero downtime.',
        rating: 5,
        isFeatured: true,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ]);

    const res = await request(app).get('/api/v1/testimonials');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].rating).toBe(5);
  });

  it('GET /api/v1/faqs returns structured questions and answers', async () => {
    vi.spyOn(contentRepository, 'findFaqs').mockResolvedValue([
      {
        id: 'faq-1',
        question: 'What is your software engineering tech stack?',
        answer: 'We build primarily on Next.js 15, React 19, TypeScript, Node.js, and PostgreSQL.',
        category: 'Engineering',
        order: 0,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any,
    ]);

    const res = await request(app).get('/api/v1/faqs');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /api/v1/admin/logs returns authenticated activity audit trail', async () => {
    vi.spyOn(contentRepository, 'findActivityLogs').mockResolvedValue([
      {
        id: 'log-1',
        userId: 'admin-1',
        userName: 'Admin User',
        action: 'UPDATE_SETTINGS',
        module: 'SETTINGS',
        details: { siteName: 'Silwasa IT Solutions' },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        createdAt: new Date(),
      } as any,
    ]);

    const res = await request(app)
      .get('/api/v1/admin/logs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].action).toBe('UPDATE_SETTINGS');
  });
});
