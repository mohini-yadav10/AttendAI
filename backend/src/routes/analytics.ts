import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { getOverview, getAttendanceTrends, getParticipationAnalytics, getClassComparison } from '../controllers/analyticsController';

const router = Router();
router.use(authenticateToken, authorizeRole('teacher'));

router.get('/overview', getOverview);
router.get('/trends', getAttendanceTrends);
router.get('/participation', getParticipationAnalytics);
router.get('/class-comparison', getClassComparison);

export default router;
