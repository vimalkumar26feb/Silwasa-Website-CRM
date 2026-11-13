import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import settingsRoutes from './settings.routes.js';
import mediaRoutes from './media.routes.js';
import pageRoutes, { adminPageRouter } from './page.routes.js';
import { createMenuRoutes } from './menu.routes.js';
import { createBlogRoutes } from './blog.routes.js';
import { createServiceRoutes } from './service.routes.js';
import { enquiryRoutes } from './enquiry.routes.js';
import { extraContentRoutes } from './extra-content.routes.js';

const router: Router = Router();
const menuRoutes = createMenuRoutes();
const blogRoutes = createBlogRoutes();
const serviceRoutes = createServiceRoutes();

// Public routes
router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/pages', pageRoutes);
router.use('/menus', menuRoutes);
router.use('/blogs', blogRoutes.publicRouter);
router.use('/services', serviceRoutes.publicServiceRouter);
router.use('/pricing', serviceRoutes.publicPricingRouter);
router.use('/', enquiryRoutes);
router.use('/', extraContentRoutes);

// Admin routes
router.use('/admin/dashboard', dashboardRoutes);
router.use('/admin/users', userRoutes);
router.use('/admin/settings', settingsRoutes);
router.use('/admin/media', mediaRoutes);
router.use('/admin/pages', adminPageRouter);
router.use('/admin/menus', menuRoutes);
router.use('/admin/blogs', blogRoutes.adminRouter);
router.use('/admin/services', serviceRoutes.adminServiceRouter);
router.use('/admin/pricing', serviceRoutes.adminPricingRouter);

export default router;
