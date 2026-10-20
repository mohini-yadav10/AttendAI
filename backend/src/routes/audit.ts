import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { AuditLog } from '../models/AuditLog';
import { createSuccessResponse, createPaginationMeta } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { Response, NextFunction } from 'express';

const router = Router();
router.use(authenticateToken, authorizeRole('teacher'));

router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      AuditLog.find({ user: req.user!.id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments({ user: req.user!.id }),
    ]);
    res.json(createSuccessResponse(logs, undefined, createPaginationMeta(total, page, limit)));
  } catch (error) { next(error); }
});

export default router;
