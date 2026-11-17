import { Router } from 'express';
import multer from 'multer';
import { mediaController } from '../controllers/media.controller.js';
import { authenticate } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

const router: Router = Router();

// All media endpoints require authentication
router.use(authenticate);

router.get('/', mediaController.listMedia);
router.post('/upload', upload.single('file'), mediaController.upload);
router.post('/bulk-delete', mediaController.bulkDelete);
router.put('/:id', mediaController.updateMedia);
router.delete('/:id', mediaController.deleteMedia);

export default router;
