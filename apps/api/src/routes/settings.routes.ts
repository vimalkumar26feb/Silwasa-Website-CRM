import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = Router();

// Public route for public website styling and branding
router.get('/public', settingsController.getPublicSettings);
router.post('/newsletter/subscribe', settingsController.subscribeNewsletter);

// Protected administrative settings routes
router.get('/theme', authenticate, settingsController.getThemeSettings);
router.put('/theme', authenticate, settingsController.updateThemeSettings);
router.get('/animations', authenticate, settingsController.getAnimationSettings);
router.put('/animations', authenticate, settingsController.updateAnimationSettings);
router.get('/general', authenticate, settingsController.getGeneralSettings);
router.put('/general', authenticate, settingsController.updateGeneralSettings);
router.get('/email', authenticate, settingsController.getEmailSettings);
router.put('/email', authenticate, settingsController.updateEmailSettings);
router.post('/email/test', authenticate, settingsController.sendTestEmail);

// SEO & Analytics routes
router.get('/seo', authenticate, settingsController.getSeoSettings);
router.put('/seo', authenticate, settingsController.updateSeoSettings);

// Promotional Popups routes
router.get('/popups', authenticate, settingsController.getPopupSettings);
router.post('/popups', authenticate, settingsController.createPopup);
router.put('/popups/:id', authenticate, settingsController.updatePopup);
router.delete('/popups/:id', authenticate, settingsController.deletePopup);
router.put('/popups', authenticate, settingsController.updatePopupSettings);

// Newsletter Subscribers routes
router.get('/newsletter', authenticate, settingsController.getNewsletterSubscribers);
router.delete('/newsletter/:id', authenticate, settingsController.deleteNewsletterSubscriber);

export default router;
