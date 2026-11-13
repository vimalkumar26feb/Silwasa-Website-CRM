import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = Router();

// Protected dashboard stats endpoint
router.get('/stats', authenticate, dashboardController.getStats);

export default router;
