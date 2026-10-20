import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { getClasses, createClass, getClassById, updateClass, deleteClass } from '../controllers/classController';

const router = Router();
router.use(authenticateToken, authorizeRole('teacher'));

router.get('/', getClasses);
router.post('/', createClass);
router.get('/:id', getClassById);
router.patch('/:id', updateClass);
router.delete('/:id', deleteClass);

export default router;
