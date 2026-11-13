import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';

describe('Phase 2: RBAC (Role-Based Access Control) & Protected Routes', () => {
  const app = createApp();

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function createMockSession(role: UserRole, userId = 'user-test-id') {
    const token = generateToken({
      userId,
      email: `${role.toLowerCase()}@silwasa.com`,
      role,
    });

    vi.spyOn(userRepository, 'findSession').mockResolvedValue({
      id: 'session-id',
      userId,
      token,
      expiresAt: new Date(Date.now() + 86400000),
      createdAt: new Date(),
      user: {
        id: userId,
        email: `${role.toLowerCase()}@silwasa.com`,
        name: `Test ${role}`,
        role,
        avatarUrl: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return token;
  }

  it('GET /api/v1/admin/users rejects unauthenticated access with 401', async () => {
    const res = await request(app).get('/api/v1/admin/users');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/users rejects EDITOR role with 403 Forbidden', async () => {
    const editorToken = createMockSession(UserRole.EDITOR);

    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${editorToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Forbidden');
  });

  it('GET /api/v1/admin/users rejects SEO_MANAGER role with 403 Forbidden', async () => {
    const seoToken = createMockSession(UserRole.SEO_MANAGER);

    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${seoToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/users allows ADMIN role with 200 OK', async () => {
    const adminToken = createMockSession(UserRole.ADMIN);

    vi.spyOn(userRepository, 'findAll').mockResolvedValue({
      users: [],
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    });

    const res = await request(app)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it('POST /api/v1/admin/users rejects ADMIN role with 403 (SUPER_ADMIN required)', async () => {
    const adminToken = createMockSession(UserRole.ADMIN);

    const res = await request(app)
      .post('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'newadmin@silwasa.com',
        password: 'Password123!',
        name: 'New Admin',
        role: UserRole.ADMIN,
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('SUPER_ADMIN');
  });

  it('POST /api/v1/admin/users allows SUPER_ADMIN role to create new users', async () => {
    const superAdminToken = createMockSession(UserRole.SUPER_ADMIN, 'super-admin-id');

    vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
    vi.spyOn(userRepository, 'create').mockResolvedValue({
      id: 'new-user-id',
      email: 'created@silwasa.com',
      name: 'Created User',
      role: UserRole.EDITOR,
      avatarUrl: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/admin/users')
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        email: 'created@silwasa.com',
        password: 'NewUserPass123!',
        name: 'Created User',
        role: UserRole.EDITOR,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe('created@silwasa.com');
  });

  it('DELETE /api/v1/admin/users/:id prevents self-deletion', async () => {
    const superAdminToken = createMockSession(UserRole.SUPER_ADMIN, 'super-admin-123');

    const res = await request(app)
      .delete('/api/v1/admin/users/super-admin-123')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('cannot delete your own account');
  });
});
