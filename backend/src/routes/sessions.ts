import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { getSessions, createSession, getSessionById, updateSession } from '../controllers/sessionController';
import { getSessionAttendance, submitManualAttendance, reviewAttendance } from '../controllers/attendanceController';

const router = Router();
router.use(authenticateToken, authorizeRole('teacher'));

router.get('/', getSessions);
router.post('/', createSession);
router.get('/:id', getSessionById);
router.patch('/:id', updateSession);
router.get('/:id/attendance', getSessionAttendance);
router.post('/:id/attendance/manual', submitManualAttendance);
router.post('/:id/attendance/review', reviewAttendance);

export default router;
