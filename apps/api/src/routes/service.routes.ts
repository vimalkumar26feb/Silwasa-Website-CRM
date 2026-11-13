import { Router } from 'express';
import { serviceController } from '../controllers/service.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { UserRole } from '@silwasa/types';

export function createServiceRoutes(): {
  publicServiceRouter: Router;
  adminServiceRouter: Router;
  publicPricingRouter: Router;
  adminPricingRouter: Router;
} {
  const publicServiceRouter = Router();
  const adminServiceRouter = Router();
  const publicPricingRouter = Router();
  const adminPricingRouter = Router();

  // Public Services
  publicServiceRouter.get('/', (req, res, next) =>
    serviceController.getPublishedServices(req, res, next)
  );

  publicServiceRouter.get('/:slug', (req, res, next) =>
    serviceController.getServiceBySlug(req, res, next)
  );

  // Public Pricing
  publicPricingRouter.get('/', (req, res, next) =>
    serviceController.getPublicPricing(req, res, next)
  );

  // Admin Services
  adminServiceRouter.use(authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR));

  adminServiceRouter.get('/', (req, res, next) =>
    serviceController.listAllServices(req, res, next)
  );

  adminServiceRouter.get('/:id', (req, res, next) =>
    serviceController.getService(req, res, next)
  );

  adminServiceRouter.post('/', (req, res, next) =>
    serviceController.createService(req, res, next)
  );

  adminServiceRouter.put('/:id', (req, res, next) =>
    serviceController.updateService(req, res, next)
  );

  adminServiceRouter.delete('/:id', (req, res, next) =>
    serviceController.deleteService(req, res, next)
  );

  // Admin Pricing Packages
  adminPricingRouter.use(authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR));

  adminPricingRouter.get('/', (req, res, next) =>
    serviceController.listAllPricing(req, res, next)
  );

  adminPricingRouter.post('/', (req, res, next) =>
    serviceController.createPricingPackage(req, res, next)
  );

  adminPricingRouter.put('/:id', (req, res, next) =>
    serviceController.updatePricingPackage(req, res, next)
  );

  adminPricingRouter.delete('/:id', (req, res, next) =>
    serviceController.deletePricingPackage(req, res, next)
  );

  return { publicServiceRouter, adminServiceRouter, publicPricingRouter, adminPricingRouter };
}
