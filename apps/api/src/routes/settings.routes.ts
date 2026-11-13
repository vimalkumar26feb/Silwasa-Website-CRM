import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = Router();

// Public route for public website styling and branding
router.get('/public', settingsController.getPublicSettings);

// Protected administrative settings routes
router.get('/theme', authenticate, settingsController.getThemeSettings);
router.put('/theme', authenticate, settingsController.updateThemeSettings);
router.get('/general', authenticate, settingsController.getGeneralSettings);
router.put('/general', authenticate, settingsController.updateGeneralSettings);
router.get('/email', authenticate, settingsController.getEmailSettings);
router.put('/email', authenticate, settingsController.updateEmailSettings);

export default router;
