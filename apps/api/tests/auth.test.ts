import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { hashPassword } from '../src/utils/password.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';

describe('Phase 2: Authentication & Sessions', () => {
  const app = createApp();
  let mockPasswordHash: string;

  beforeEach(async () => {
    vi.restoreAllMocks();
    mockPasswordHash = await hashPassword('AdminPass2026!');
  });

  it('Argon2id hashing creates secure hashes and verifies correctly', async () => {
    const raw = 'SuperSecret123!';
    const hash = await hashPassword(raw);
    expect(hash).toContain('$argon2id$');
    const { verifyPassword } = await import('../src/utils/password.js');
    expect(await verifyPassword(hash, raw)).toBe(true);
    expect(await verifyPassword(hash, 'WrongPassword')).toBe(false);
  });

  it('POST /api/v1/auth/login succeeds with valid credentials', async () => {
    const mockUser = {
      id: 'user-uuid-1',
      email: 'admin@silwasa.com',
      passwordHash: mockPasswordHash,
      name: 'Silwasa Super Admin',
      role: 'SUPER_ADMIN' as UserRole,
      avatarUrl: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);
    vi.spyOn(userRepository, 'createSession').mockResolvedValue({
      id: 'session-uuid-1',
      userId: mockUser.id,
      token: 'mock-token',
      expiresAt: new Date(Date.now() + 7 * 86400000),
      createdAt: new Date(),
    });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@silwasa.com',
        password: 'AdminPass2026!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('admin@silwasa.com');
    expect(res.body.data.user.role).toBe('SUPER_ADMIN');
    expect(res.body.data.token).toBeDefined();

    // Verify HTTP-only cookie was set
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('silwasa_token=');
    expect(cookies[0]).toContain('HttpOnly');
  });

  it('POST /api/v1/auth/login fails with invalid password', async () => {
    const mockUser = {
      id: 'user-uuid-1',
      email: 'admin@silwasa.com',
      passwordHash: mockPasswordHash,
      name: 'Silwasa Admin',
      role: 'ADMIN' as UserRole,
      avatarUrl: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@silwasa.com',
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid email or password');
  });

  it('POST /api/v1/auth/login fails for deactivated user', async () => {
    const inactiveUser = {
      id: 'user-uuid-2',
      email: 'inactive@silwasa.com',
      passwordHash: mockPasswordHash,
      name: 'Former Staff',
      role: 'EDITOR' as UserRole,
      avatarUrl: null,
      isActive: false, // Inactive!
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.spyOn(userRepository, 'findByEmail').mockResolvedValue(inactiveUser);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'inactive@silwasa.com',
        password: 'AdminPass2026!',
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('deactivated');
  });

  it('GET /api/v1/auth/me returns current user when valid token provided', async () => {
    const token = generateToken({
      userId: 'user-uuid-1',
      email: 'admin@silwasa.com',
      role: UserRole.ADMIN,
    });

    vi.spyOn(userRepository, 'findSession').mockResolvedValue({
      id: 'session-uuid-1',
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

    vi.spyOn(userRepository, 'findById').mockResolvedValue({
      id: 'user-uuid-1',
      email: 'admin@silwasa.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      avatarUrl: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('user-uuid-1');
    expect(res.body.data.email).toBe('admin@silwasa.com');
  });

  it('GET /api/v1/auth/me rejects unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/logout clears session and cookie', async () => {
    const token = generateToken({
      userId: 'user-uuid-1',
      email: 'admin@silwasa.com',
      role: UserRole.ADMIN,
    });

    vi.spyOn(userRepository, 'findSession').mockResolvedValue({
      id: 'session-uuid-1',
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

    const deleteSessionSpy = vi.spyOn(userRepository, 'deleteSession').mockResolvedValue({ count: 1 });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(deleteSessionSpy).toHaveBeenCalledWith(token);

    // Verify cookie clearance header (set to epoch 1970)
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('silwasa_token=');
    expect(cookies[0]).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  });
});
