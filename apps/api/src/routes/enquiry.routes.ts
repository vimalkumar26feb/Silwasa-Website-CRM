import { Router } from 'express';
import { UserRole } from '@silwasa/types';
import { authenticate, requireRole } from '../middleware/auth.js';
import { enquiryController } from '../controllers/enquiry.controller.js';

const router = Router();

// Public submission route
router.post('/enquiries', (req, res) => enquiryController.submitEnquiry(req, res));

// Protected admin routes
router.use('/admin/enquiries', authenticate, requireRole(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.EDITOR));

router.get('/admin/enquiries/stats', (req, res) => enquiryController.getStats(req, res));
router.get('/admin/enquiries', (req, res) => enquiryController.listEnquiries(req, res));
router.get('/admin/enquiries/:id', (req, res) => enquiryController.getEnquiry(req, res));
router.put('/admin/enquiries/:id/status', (req, res) => enquiryController.updateStatus(req, res));
router.post('/admin/enquiries/:id/notes', (req, res) => enquiryController.addNote(req, res));
router.delete('/admin/enquiries/:id', (req, res) => enquiryController.deleteEnquiry(req, res));

export const enquiryRoutes = router;
