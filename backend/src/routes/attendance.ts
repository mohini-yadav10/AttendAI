import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { updateAttendanceRecord, getAttendanceReports } from '../controllers/attendanceController';

const router = Router();
router.use(authenticateToken);

router.get('/reports', authorizeRole('teacher'), getAttendanceReports);
router.patch('/:id', authorizeRole('teacher'), updateAttendanceRecord);

export default router;
