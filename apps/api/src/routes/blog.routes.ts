import { Router } from 'express';
import { blogController } from '../controllers/blog.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { UserRole } from '@silwasa/types';

export function createBlogRoutes(): { publicRouter: Router; adminRouter: Router } {
  const publicRouter = Router();
  const adminRouter = Router();

  // Public endpoints
  publicRouter.get('/categories', (req, res, next) =>
    blogController.getCategories(req, res, next)
  );

  publicRouter.get('/tags', (req, res, next) =>
    blogController.getTags(req, res, next)
  );

  publicRouter.get('/', (req, res, next) =>
    blogController.getPublishedBlogs(req, res, next)
  );

  publicRouter.get('/:slug', (req, res, next) =>
    blogController.getBlogBySlug(req, res, next)
  );

  // Admin protected endpoints
  adminRouter.use(authenticate, requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.EDITOR));

  adminRouter.get('/', (req, res, next) =>
    blogController.listAllBlogs(req, res, next)
  );

  adminRouter.get('/:id', (req, res, next) =>
    blogController.getBlogById(req, res, next)
  );

  adminRouter.post('/', (req, res, next) =>
    blogController.createBlog(req, res, next)
  );

  adminRouter.put('/:id', (req, res, next) =>
    blogController.updateBlog(req, res, next)
  );

  adminRouter.delete('/:id', (req, res, next) =>
    blogController.deleteBlog(req, res, next)
  );

  adminRouter.post('/categories', (req, res, next) =>
    blogController.createCategory(req, res, next)
  );

  adminRouter.put('/categories/:id', (req, res, next) =>
    blogController.updateCategory(req, res, next)
  );

  adminRouter.delete('/categories/:id', (req, res, next) =>
    blogController.deleteCategory(req, res, next)
  );

  return { publicRouter, adminRouter };
}
