import { Router } from 'express';
import { UserRole } from '@silwasa/types';
import { authenticate, requireRole } from '../middleware/auth.js';
import { extraContentController } from '../controllers/extra-content.controller.js';

const router = Router();

// Public routes
router.get('/industries', (req, res) => extraContentController.getPublicIndustries(req, res));
router.get('/industries/:slug', (req, res) => extraContentController.getPublicIndustryBySlug(req, res));
router.get('/portfolio', (req, res) => extraContentController.getPublicPortfolio(req, res));
router.get('/portfolio/:slug', (req, res) => extraContentController.getPublicPortfolioBySlug(req, res));
router.get('/testimonials', (req, res) => extraContentController.getPublicTestimonials(req, res));
router.get('/faqs', (req, res) => extraContentController.getPublicFaqs(req, res));

// Protected admin routes
router.use('/admin', authenticate, requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR));

// Admin Industries
router.get('/admin/industries', (req, res) => extraContentController.getAdminIndustries(req, res));
router.post('/admin/industries', (req, res) => extraContentController.createIndustry(req, res));
router.put('/admin/industries/:id', (req, res) => extraContentController.updateIndustry(req, res));
router.delete('/admin/industries/:id', (req, res) => extraContentController.deleteIndustry(req, res));

// Admin Portfolio
router.get('/admin/portfolio', (req, res) => extraContentController.getAdminPortfolio(req, res));
router.post('/admin/portfolio', (req, res) => extraContentController.createPortfolio(req, res));
router.put('/admin/portfolio/:id', (req, res) => extraContentController.updatePortfolio(req, res));
router.delete('/admin/portfolio/:id', (req, res) => extraContentController.deletePortfolio(req, res));

// Admin Testimonials
router.get('/admin/testimonials', (req, res) => extraContentController.getPublicTestimonials(req, res));
router.post('/admin/testimonials', (req, res) => extraContentController.createTestimonial(req, res));
router.put('/admin/testimonials/:id', (req, res) => extraContentController.updateTestimonial(req, res));
router.delete('/admin/testimonials/:id', (req, res) => extraContentController.deleteTestimonial(req, res));

// Admin FAQs
router.get('/admin/faqs', (req, res) => extraContentController.getAdminFaqs(req, res));
router.post('/admin/faqs', (req, res) => extraContentController.createFaq(req, res));
router.put('/admin/faqs/:id', (req, res) => extraContentController.updateFaq(req, res));
router.delete('/admin/faqs/:id', (req, res) => extraContentController.deleteFaq(req, res));

// Admin Logs
router.get('/admin/logs', (req, res) => extraContentController.getAdminActivityLogs(req, res));

export const extraContentRoutes = router;
