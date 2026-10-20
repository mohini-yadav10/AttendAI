import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { detectFaces, getAIStatus } from '../controllers/aiController';

const router = Router();
router.use(authenticateToken);

router.get('/status', getAIStatus);
router.post('/detect-faces', authorizeRole('teacher'), detectFaces);

export default router;
