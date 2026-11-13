import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { enquiryRepository } from '../src/repositories/enquiry.repository.js';
import { notificationEmailService } from '../src/integrations/email/index.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';

describe('Phase 9: Enquiries & Email System API', () => {
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

  it('POST /api/v1/enquiries accepts valid lead and returns 201 with enquiry reference', async () => {
    const mockCreated = {
      id: 'enq-uuid-1',
      enquiryId: 'ENQ-261113-TEST',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 9876543210',
      company: 'Sharma Retail Tech',
      country: 'India',
      service: 'E-commerce Website Development',
      budget: '₹2,00,000 - ₹5,00,000',
      message: 'Looking for a custom Next.js e-commerce storefront with high concurrency and razorpay payments.',
      sourcePage: '/services/ecommerce-development',
      status: 'NEW',
      assignedUserId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const emailSpy = vi.spyOn(notificationEmailService, 'sendEnquiryEmails').mockResolvedValue([] as any);
    vi.spyOn(enquiryRepository, 'create').mockResolvedValue(mockCreated as any);

    const res = await request(app)
      .post('/api/v1/enquiries')
      .send({
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 9876543210',
        company: 'Sharma Retail Tech',
        service: 'E-commerce Website Development',
        budget: '₹2,00,000 - ₹5,00,000',
        message: 'Looking for a custom Next.js e-commerce storefront with high concurrency and razorpay payments.',
        sourcePage: '/services/ecommerce-development'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.enquiryId).toBe('ENQ-261113-TEST');
    expect(res.body.data.name).toBe('Priya Sharma');
    expect(emailSpy).toHaveBeenCalled();
  });

  it('POST /api/v1/enquiries rejects invalid payload with 400 validation error', async () => {
    const res = await request(app)
      .post('/api/v1/enquiries')
      .send({
        name: 'A', // too short (< 2)
        email: 'invalid-email',
        message: 'short' // too short (< 10)
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.details).toBeDefined();
    expect(res.body.details.email).toBeDefined();
  });

  it('GET /api/v1/admin/enquiries returns paginated lead inbox for admin', async () => {
    vi.spyOn(enquiryRepository, 'list').mockResolvedValue({
      items: [
        {
          id: 'enq-uuid-1',
          enquiryId: 'ENQ-261113-TEST',
          name: 'Priya Sharma',
          email: 'priya@example.com',
          phone: '+91 9876543210',
          company: 'Sharma Retail Tech',
          country: 'India',
          service: 'E-commerce Website Development',
          budget: '₹2,00,000 - ₹5,00,000',
          message: 'Looking for a custom Next.js e-commerce storefront.',
          sourcePage: '/services/ecommerce-development',
          status: 'NEW',
          assignedUserId: null,
          assignedUser: null,
          notes: [],
          createdAt: new Date(),
          updatedAt: new Date()
        } as any
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1
    });

    const res = await request(app)
      .get('/api/v1/admin/enquiries?status=NEW')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].enquiryId).toBe('ENQ-261113-TEST');
  });

  it('GET /api/v1/admin/enquiries/stats returns aggregate metrics', async () => {
    vi.spyOn(enquiryRepository, 'getStats').mockResolvedValue({
      total: 15,
      new: 4,
      contacted: 5,
      inProgress: 3,
      converted: 2,
      closed: 1
    });

    const res = await request(app)
      .get('/api/v1/admin/enquiries/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.total).toBe(15);
    expect(res.body.data.new).toBe(4);
    expect(res.body.data.contacted).toBe(5);
  });

  it('PUT /api/v1/admin/enquiries/:id/status updates status and appends internal note', async () => {
    vi.spyOn(enquiryRepository, 'findById').mockResolvedValue({
      id: 'enq-uuid-1',
      status: 'NEW',
    } as any);

    vi.spyOn(enquiryRepository, 'updateStatus').mockResolvedValue({
      id: 'enq-uuid-1',
      enquiryId: 'ENQ-261113-TEST',
      status: 'CONTACTED',
      notes: [
        {
          id: 'note-1',
          content: 'Spoke with Priya on WhatsApp. Requirements document requested.',
          authorName: 'Admin User',
          createdAt: new Date()
        }
      ]
    } as any);

    const res = await request(app)
      .put('/api/v1/admin/enquiries/enq-uuid-1/status')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        status: 'CONTACTED',
        note: 'Spoke with Priya on WhatsApp. Requirements document requested.'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('CONTACTED');
    expect(res.body.data.notes).toHaveLength(1);
  });

  it('POST /api/v1/admin/enquiries/:id/notes adds an internal note', async () => {
    vi.spyOn(enquiryRepository, 'findById').mockResolvedValue({
      id: 'enq-uuid-1',
      status: 'CONTACTED',
    } as any);

    vi.spyOn(enquiryRepository, 'addNote').mockResolvedValue({
      id: 'note-2',
      enquiryId: 'enq-uuid-1',
      content: 'Follow-up call scheduled for Monday at 11:00 AM IST.',
      authorName: 'Admin User',
      userId: 'admin-1',
      createdAt: new Date()
    } as any);

    const res = await request(app)
      .post('/api/v1/admin/enquiries/enq-uuid-1/notes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        content: 'Follow-up call scheduled for Monday at 11:00 AM IST.',
        authorName: 'Admin User'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.content).toBe('Follow-up call scheduled for Monday at 11:00 AM IST.');
  });

  it('DELETE /api/v1/admin/enquiries/:id removes an enquiry', async () => {
    vi.spyOn(enquiryRepository, 'findById').mockResolvedValue({
      id: 'enq-uuid-1',
    } as any);

    vi.spyOn(enquiryRepository, 'delete').mockResolvedValue({
      id: 'enq-uuid-1',
    } as any);

    const res = await request(app)
      .delete('/api/v1/admin/enquiries/enq-uuid-1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
