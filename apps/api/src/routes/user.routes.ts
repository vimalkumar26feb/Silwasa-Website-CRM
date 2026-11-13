import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { UserRole } from '@silwasa/types';

const router: Router = Router();

// All user routes require authentication
router.use(authenticate);

// View users (ADMIN or SUPER_ADMIN)
router.get('/', requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.listUsers);
router.get('/:id', requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN), userController.getUser);

// Modify users (SUPER_ADMIN only)
router.post('/', requireRole(UserRole.SUPER_ADMIN), userController.createUser);
router.put('/:id', requireRole(UserRole.SUPER_ADMIN), userController.updateUser);
router.delete('/:id', requireRole(UserRole.SUPER_ADMIN), userController.deleteUser);

export default router;
