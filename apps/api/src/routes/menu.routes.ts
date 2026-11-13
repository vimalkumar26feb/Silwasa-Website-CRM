import { Router } from 'express';
import { menuController } from '../controllers/menu.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { UserRole } from '@silwasa/types';

export function createMenuRoutes(): Router {
  const router = Router();

  // Public endpoint
  router.get('/location/:location', (req, res, next) =>
    menuController.getPublicMenuByLocation(req, res, next)
  );

  // Admin protected endpoints
  router.get('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), (req, res, next) =>
    menuController.listMenus(req, res, next)
  );

  router.get('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), (req, res, next) =>
    menuController.getMenu(req, res, next)
  );

  router.post('/', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), (req, res, next) =>
    menuController.createMenu(req, res, next)
  );

  router.put('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), (req, res, next) =>
    menuController.updateMenu(req, res, next)
  );

  router.put('/:id/items', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), (req, res, next) =>
    menuController.updateMenuItems(req, res, next)
  );

  router.delete('/:id', authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), (req, res, next) =>
    menuController.deleteMenu(req, res, next)
  );

  return router;
}
