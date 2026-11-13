import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { dashboardRepository } from '../src/repositories/dashboard.repository.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';

describe('Phase 3: Dashboard Stats API', () => {
  const app = createApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/v1/admin/dashboard/stats rejects unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/v1/admin/dashboard/stats');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/dashboard/stats returns metrics when authenticated', async () => {
    const token = generateToken({
      userId: 'user-uuid-1',
      email: 'admin@silwasa.com',
      role: UserRole.ADMIN,
    });

    vi.spyOn(userRepository, 'findSession').mockResolvedValue({
      id: 'session-1',
      userId: 'user-uuid-1',
      token,
      expiresAt: new Date(Date.now() + 86400000),
      createdAt: new Date(),
      user: {
        id: 'user-uuid-1',
        email: 'admin@silwasa.com',
        name: 'Admin User',
        role: 'ADMIN',
        avatarUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    vi.spyOn(dashboardRepository, 'getMetrics').mockResolvedValue({
      metrics: {
        totalEnquiries: 12,
        newEnquiries: 4,
        totalPages: 8,
        publishedPages: 6,
        totalPosts: 5,
        totalServices: 10,
        totalMedia: 24,
      },
      recentLogs: [
        {
          id: 'log-1',
          userName: 'Admin User',
          action: 'LOGIN',
          module: 'AUTH',
          createdAt: new Date(),
        },
      ],
      recentEnquiries: [
        {
          id: 'enq-1',
          enquiryId: 'ENQ-2026-001',
          name: 'Jane Smith',
          email: 'jane@example.com',
          service: 'Web Development',
          status: 'NEW',
          createdAt: new Date(),
        },
      ],
    });

    const res = await request(app)
      .get('/api/v1/admin/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.metrics.totalEnquiries).toBe(12);
    expect(res.body.data.metrics.newEnquiries).toBe(4);
    expect(res.body.data.recentEnquiries.length).toBe(1);
    expect(res.body.data.recentLogs.length).toBe(1);
  });
});
