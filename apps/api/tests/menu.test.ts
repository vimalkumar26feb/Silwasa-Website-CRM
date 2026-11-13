import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { menuRepository } from '../src/repositories/menu.repository.js';
import { generateToken } from '../src/utils/jwt.js';
import { UserRole } from '@silwasa/types';

describe('Phase 6: Menu & Navigation API', () => {
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

  it('GET /api/v1/menus/location/:location returns public menu', async () => {
    vi.spyOn(menuRepository, 'findByLocation').mockResolvedValue({
      id: 'menu-1',
      name: 'Main Header Navigation',
      location: 'header',
      items: [
        { id: 'item-1', label: 'Services', url: '/services', order: 0, isEnabled: true },
        { id: 'item-2', label: 'About', url: '/about', order: 1, isEnabled: true },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app).get('/api/v1/menus/location/header');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.location).toBe('header');
    expect(res.body.data.items).toHaveLength(2);
  });

  it('GET /api/v1/menus/location/:location returns 404 when location does not exist', async () => {
    vi.spyOn(menuRepository, 'findByLocation').mockResolvedValue(null);

    const res = await request(app).get('/api/v1/menus/location/non-existent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/admin/menus lists all menus for admin', async () => {
    vi.spyOn(menuRepository, 'findMany').mockResolvedValue([
      {
        id: 'menu-1',
        name: 'Header Menu',
        location: 'header',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'menu-2',
        name: 'Footer Menu',
        location: 'footer-main',
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const res = await request(app)
      .get('/api/v1/admin/menus')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  it('POST /api/v1/admin/menus creates a new navigation menu', async () => {
    vi.spyOn(menuRepository, 'findByLocation').mockResolvedValue(null);
    vi.spyOn(menuRepository, 'create').mockResolvedValue({
      id: 'menu-new',
      name: 'Mobile Menu',
      location: 'mobile',
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .post('/api/v1/admin/menus')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Mobile Menu',
        location: 'mobile',
        items: [],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Mobile Menu');
  });

  it('PUT /api/v1/admin/menus/:id/items updates navigation structure and mega menus', async () => {
    vi.spyOn(menuRepository, 'findById').mockResolvedValue({
      id: 'menu-1',
      name: 'Header Menu',
      location: 'header',
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newItems = [
      {
        id: 'nav-1',
        label: 'Services',
        url: '/services',
        order: 0,
        isEnabled: true,
        isMegaMenu: true,
        megaMenuColumns: [
          {
            heading: 'Core Services',
            links: [{ label: 'Custom Web Dev', url: '/services/web-dev' }],
          },
        ],
      },
    ];

    vi.spyOn(menuRepository, 'update').mockResolvedValue({
      id: 'menu-1',
      name: 'Header Menu',
      location: 'header',
      items: newItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .put('/api/v1/admin/menus/menu-1/items')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ items: newItems });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.items[0].isMegaMenu).toBe(true);
  });

  it('DELETE /api/v1/admin/menus/:id deletes a navigation menu', async () => {
    vi.spyOn(menuRepository, 'findById').mockResolvedValue({
      id: 'menu-1',
      name: 'Old Menu',
      location: 'mobile',
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.spyOn(menuRepository, 'delete').mockResolvedValue({
      id: 'menu-1',
      name: 'Old Menu',
      location: 'mobile',
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const res = await request(app)
      .delete('/api/v1/admin/menus/menu-1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Menu deleted successfully');
  });
});
