import { Router } from 'express';
import { pageController } from '../controllers/page.controller.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = Router();

// Public routes for website visitors
router.get('/', pageController.listPublicPages);
router.get('/:slug', pageController.getPublicPageBySlug);

// Admin routes (requires authentication)
export const adminPageRouter: Router = Router();
adminPageRouter.use(authenticate);

adminPageRouter.get('/', pageController.listAdminPages);
adminPageRouter.post('/', pageController.createPage);
adminPageRouter.get('/:id', pageController.getAdminPage);
adminPageRouter.put('/:id', pageController.updatePage);
adminPageRouter.delete('/:id', pageController.deletePage);
adminPageRouter.post('/:id/publish', pageController.publishPage);
adminPageRouter.post('/:id/duplicate', pageController.duplicatePage);
adminPageRouter.get('/:id/revisions', pageController.getRevisions);
adminPageRouter.post('/:id/revisions/:revisionId/restore', pageController.restoreRevision);

export default router;
