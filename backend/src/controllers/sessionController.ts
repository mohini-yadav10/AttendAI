import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { Session } from '../models/Session';
import { Class } from '../models/Class';
import { Enrollment } from '../models/Enrollment';
import { AttendanceRecord } from '../models/AttendanceRecord';
import { createSuccessResponse, createErrorResponse, createPaginationMeta } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditLog } from '../models/AuditLog';

const createSessionSchema = z.object({
  classId: z.string().min(1),
  courseId: z.string().optional(),
  title: z.string().min(1).max(200),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  notes: z.string().max(1000).optional(),
});

const updateSessionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  date: z.string().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  status: z.enum(['scheduled', 'active', 'completed', 'cancelled']).optional(),
  notes: z.string().max(1000).optional(),
});

export const getSessions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;
    const classId = req.query.classId as string;
    const status = req.query.status as string;

    const filter: Record<string, unknown> = { teacher: req.user!.id };
    if (classId) filter.class = classId;
    if (status) filter.status = status;

    const [sessions, total] = await Promise.all([
      Session.find(filter)
        .populate('class', 'name code')
        .populate('course', 'name code')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Session.countDocuments(filter),
    ]);

    res.json(createSuccessResponse(sessions, undefined, createPaginationMeta(total, page, limit)));
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }

    // Verify teacher owns the class
    const cls = await Class.findOne({ _id: parsed.data.classId, teacher: req.user!.id });
    if (!cls) {
      res.status(404).json(createErrorResponse('Class not found.'));
      return;
    }

    const session = await Session.create({
      class: parsed.data.classId,
      course: parsed.data.courseId,
      teacher: req.user!.id,
      title: parsed.data.title,
      date: new Date(parsed.data.date),
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
      notes: parsed.data.notes,
    });

    await AuditLog.create({
      user: req.user!.id,
      action: 'SESSION_CREATED',
      resourceType: 'Session',
      resourceId: session._id,
      success: true,
    });

    res.status(201).json(createSuccessResponse(session, 'Session created successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await Session.findOne({ _id: req.params.id, teacher: req.user!.id })
      .populate('class', 'name code')
      .populate('course', 'name code');

    if (!session) {
      res.status(404).json(createErrorResponse('Session not found.'));
      return;
    }

    // Get enrolled students for this class
    const enrollments = await Enrollment.find({ class: session.class, status: 'active' })
      .populate('student', 'name studentId email')
      .lean();

    // Get attendance records already captured for this session
    const attendanceRecords = await AttendanceRecord.find({ session: session._id })
      .populate('student', 'name studentId')
      .lean();

    const attendanceMap = new Map(
      attendanceRecords.map(r => [r.student.toString(), r])
    );

    res.json(createSuccessResponse({ session, enrollments, attendanceRecords, attendanceMap: Object.fromEntries(attendanceMap) }));
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user!.id },
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!session) {
      res.status(404).json(createErrorResponse('Session not found.'));
      return;
    }

    await AuditLog.create({
      user: req.user!.id,
      action: 'SESSION_UPDATED',
      resourceType: 'Session',
      resourceId: session._id,
      changes: parsed.data,
      success: true,
    });

    res.json(createSuccessResponse(session, 'Session updated successfully.'));
  } catch (error) {
    next(error);
  }
};
