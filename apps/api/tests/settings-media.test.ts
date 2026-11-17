import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { settingsRepository } from '../src/repositories/settings.repository.js';
import { mediaRepository } from '../src/repositories/media.repository.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';
import { DEFAULT_THEME, DEFAULT_BRANDING } from '@silwasa/shared';

describe('Phase 4: Settings & Media Management API', () => {
  const app = createApp();
  let adminToken: string;

  beforeEach(() => {
    vi.restoreAllMocks();
    adminToken = generateToken({
      userId: 'admin-id-1',
      email: 'admin@silwasa.com',
      role: UserRole.ADMIN,
    });

    vi.spyOn(userRepository, 'findSession').mockResolvedValue({
      id: 'sess-1',
      userId: 'admin-id-1',
      token: adminToken,
      expiresAt: new Date(Date.now() + 86400000),
      createdAt: new Date(),
      user: {
        id: 'admin-id-1',
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

  it('GET /api/v1/settings/public is publicly accessible without token', async () => {
    vi.spyOn(settingsRepository, 'getSetting').mockImplementation(async (key: string) => {
      if (key === 'theme') return DEFAULT_THEME;
      if (key === 'branding') return DEFAULT_BRANDING;
      return null;
    });

    const res = await request(app).get('/api/v1/settings/public');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.theme.colors.primary).toBe('#663399');
    expect(res.body.data.branding.siteName).toBe('Silwasa IT Solutions');
  });

  it('PUT /api/v1/admin/settings/theme validates and updates theme colors', async () => {
    const updatedColors = {
      ...DEFAULT_THEME,
      colors: {
        ...DEFAULT_THEME.colors,
        primary: '#7733AA',
      },
    };

    vi.spyOn(settingsRepository, 'setSetting').mockResolvedValue({
      id: 'theme-1',
      key: 'theme',
      value: updatedColors as object,
      updatedAt: new Date(),
    });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const res = await request(app)
      .put('/api/v1/admin/settings/theme')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedColors);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.colors.primary).toBe('#7733AA');
  });

  it('PUT /api/v1/admin/settings/theme rejects invalid hex colors', async () => {
    const invalidTheme = {
      ...DEFAULT_THEME,
      colors: {
        ...DEFAULT_THEME.colors,
        primary: 'not-a-color',
      },
    };

    const res = await request(app)
      .put('/api/v1/admin/settings/theme')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(invalidTheme);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/admin/media/upload uploads file and stores metadata', async () => {
    vi.spyOn(mediaRepository, 'create').mockResolvedValue({
      id: 'media-1',
      filename: 'test-logo.png',
      originalName: 'logo.png',
      mimeType: 'image/png',
      sizeBytes: 1024,
      width: 200,
      height: 60,
      url: 'http://localhost:5000/uploads/test-logo.png',
      publicId: 'test-logo',
      altText: null,
      title: null,
      provider: 'local',
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const fakePng = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2d450000000049454e44ae426082', 'hex');

    const res = await request(app)
      .post('/api/v1/admin/media/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', fakePng, 'logo.png');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.filename).toBe('test-logo.png');
  });

  it('DELETE /api/v1/admin/media/:id prevents deletion of media in active use', async () => {
    vi.spyOn(mediaRepository, 'findById').mockResolvedValue({
      id: 'media-used',
      filename: 'banner.webp',
      originalName: 'banner.webp',
      mimeType: 'image/webp',
      sizeBytes: 50000,
      width: 1200,
      height: 600,
      url: 'http://localhost:5000/uploads/banner.webp',
      publicId: 'banner',
      altText: 'Hero banner',
      title: null,
      provider: 'local',
      usageCount: 3, // In active use!
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .delete('/api/v1/admin/media/media-used')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('in use');
  });

  it('POST /api/v1/admin/media/upload supports video upload', async () => {
    vi.spyOn(mediaRepository, 'create').mockResolvedValue({
      id: 'media-vid-1',
      filename: 'demo.mp4',
      originalName: 'demo.mp4',
      mimeType: 'video/mp4',
      sizeBytes: 1024 * 50,
      width: null,
      height: null,
      url: 'http://localhost:5000/uploads/demo.mp4',
      publicId: 'demo',
      altText: null,
      title: 'Demo Reel',
      provider: 'local',
      usageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const fakeMp4 = Buffer.from('00000018667479706d703432000000006d70343269736f6d', 'hex');

    const res = await request(app)
      .post('/api/v1/admin/media/upload')
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', fakeMp4, 'demo.mp4');

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.mimeType).toBe('video/mp4');
  });

  it('POST /api/v1/admin/media/bulk-delete deletes multiple media assets', async () => {
    vi.spyOn(mediaRepository, 'findByIds').mockResolvedValue([
      {
        id: 'media-del-1',
        filename: 'file1.png',
        originalName: 'file1.png',
        mimeType: 'image/png',
        sizeBytes: 1000,
        width: 100,
        height: 100,
        url: 'http://localhost:5000/uploads/file1.png',
        publicId: 'file1',
        altText: null,
        title: null,
        provider: 'local',
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'media-del-2',
        filename: 'file2.mp4',
        originalName: 'file2.mp4',
        mimeType: 'video/mp4',
        sizeBytes: 2000,
        width: null,
        height: null,
        url: 'http://localhost:5000/uploads/file2.mp4',
        publicId: 'file2',
        altText: null,
        title: null,
        provider: 'local',
        usageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    vi.spyOn(mediaRepository, 'deleteMany').mockResolvedValue({ count: 2 } as any);
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/admin/media/bulk-delete')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: ['media-del-1', 'media-del-2'] });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.deletedCount).toBe(2);
    expect(res.body.data.skippedCount).toBe(0);
  });

  it('GET /api/v1/admin/settings/email retrieves stored email configuration', async () => {
    vi.spyOn(settingsRepository, 'getSetting').mockImplementation(async (key: string) => {
      if (key === 'email') {
        return {
          provider: 'gmail',
          fromEmail: 'vimaldigiello@gmail.com',
          fromName: 'Silwasa IT Solutions',
          adminNotificationEmail: 'vimaldigiello@gmail.com',
          brevoApiKey: '',
          sendgridApiKey: '',
          gmailUser: 'vimaldigiello@gmail.com',
          gmailAppPassword: 'abcd efgh ijkl mnop',
        };
      }
      return null;
    });

    const res = await request(app)
      .get('/api/v1/admin/settings/email')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.provider).toBe('gmail');
    expect(res.body.data.gmailUser).toBe('vimaldigiello@gmail.com');
  });

  it('PUT /api/v1/admin/settings/email persists provider settings and credentials', async () => {
    const payload = {
      provider: 'gmail',
      fromEmail: 'vimaldigiello@gmail.com',
      fromName: 'Silwasa IT Solutions',
      adminNotificationEmail: 'vimaldigiello@gmail.com',
      gmailUser: 'vimaldigiello@gmail.com',
      gmailAppPassword: 'abcd efgh ijkl mnop',
    };

    vi.spyOn(settingsRepository, 'setSetting').mockResolvedValue({
      id: 'email-1',
      key: 'email',
      value: payload as object,
      updatedAt: new Date(),
    });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const res = await request(app)
      .put('/api/v1/admin/settings/email')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.provider).toBe('gmail');
    expect(res.body.data.gmailUser).toBe('vimaldigiello@gmail.com');
  });

  it('POST /api/v1/admin/settings/email/test dispatches test email with mock provider', async () => {
    vi.spyOn(settingsRepository, 'getSetting').mockImplementation(async (key: string) => {
      if (key === 'email') {
        return {
          provider: 'mock',
          fromEmail: 'contact@silwasa.com',
          fromName: 'Silwasa IT Solutions',
        };
      }
      return null;
    });
    vi.spyOn(userRepository, 'logActivity').mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/admin/settings/email/test')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        to: 'test@silwasa.com',
        settings: { provider: 'mock' }
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('test@silwasa.com');
  });
});
