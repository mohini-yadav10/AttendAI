import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AttendanceRecord, AttendanceStatus } from '../models/AttendanceRecord';
import { Session } from '../models/Session';
import { Enrollment } from '../models/Enrollment';
import { StudentProfile } from '../models/StudentProfile';
import { createSuccessResponse, createErrorResponse, createPaginationMeta } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditLog } from '../models/AuditLog';
import { ApiError } from '../middleware/errorHandler';

const manualAttendanceSchema = z.object({
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(['present', 'absent', 'late', 'excused']),
      notes: z.string().max(500).optional(),
    })
  ).min(1),
});

const reviewAttendanceSchema = z.object({
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(['present', 'absent', 'late', 'excused']),
      aiConfidence: z.number().min(0).max(1).optional(),
      notes: z.string().max(500).optional(),
    })
  ).min(1),
});

const updateSingleRecordSchema = z.object({
  status: z.enum(['present', 'absent', 'late', 'excused']),
  reason: z.string().max(500).optional(),
});

export const getSessionAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await Session.findOne({ _id: req.params.id, teacher: req.user!.id });
    if (!session) {
      res.status(404).json(createErrorResponse('Session not found.'));
      return;
    }

    const records = await AttendanceRecord.find({ session: req.params.id })
      .populate('student', 'name studentId email')
      .populate('confirmedBy', 'name')
      .sort({ createdAt: 1 })
      .lean();

    const summary = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      excused: records.filter(r => r.status === 'excused').length,
    };

    res.json(createSuccessResponse({ records, summary }));
  } catch (error) {
    next(error);
  }
};

export const submitManualAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await Session.findOne({ _id: req.params.id, teacher: req.user!.id });
    if (!session) {
      res.status(404).json(createErrorResponse('Session not found.'));
      return;
    }

    const parsed = manualAttendanceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }

    const results = { saved: 0, errors: [] as string[] };

    for (const record of parsed.data.records) {
      try {
        await AttendanceRecord.findOneAndUpdate(
          { student: record.studentId, session: req.params.id },
          {
            $set: {
              student: record.studentId,
              session: req.params.id,
              class: session.class,
              status: record.status,
              entryMethod: 'manual',
              aiReviewed: false,
              confirmedBy: req.user!.id,
              confirmedAt: new Date(),
              notes: record.notes,
            },
          },
          { upsert: true, new: true }
        );
        results.saved++;
      } catch {
        results.errors.push(`Failed to save record for student ${record.studentId}`);
      }
    }

    // Mark session attendance as captured
    await Session.findByIdAndUpdate(req.params.id, { attendanceCaptured: true });

    await AuditLog.create({
      user: req.user!.id,
      action: 'ATTENDANCE_MANUAL_SUBMITTED',
      resourceType: 'Session',
      resourceId: session._id,
      changes: { recordCount: results.saved },
      success: true,
    });

    res.json(createSuccessResponse(results, `${results.saved} attendance records saved.`));
  } catch (error) {
    next(error);
  }
};

export const reviewAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const session = await Session.findOne({ _id: req.params.id, teacher: req.user!.id });
    if (!session) {
      res.status(404).json(createErrorResponse('Session not found.'));
      return;
    }

    const parsed = reviewAttendanceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }

    const results = { saved: 0, errors: [] as string[] };

    for (const record of parsed.data.records) {
      try {
        // Get existing record for correction history
        const existing = await AttendanceRecord.findOne({
          student: record.studentId,
          session: req.params.id,
        });

        const correctionHistory = existing && existing.status !== record.status
          ? [
              ...existing.correctionHistory,
              {
                previousStatus: existing.status,
                newStatus: record.status as AttendanceStatus,
                correctedBy: req.user!.id,
                correctedAt: new Date(),
                reason: 'Teacher review after AI suggestion',
              },
            ]
          : existing?.correctionHistory || [];

        await AttendanceRecord.findOneAndUpdate(
          { student: record.studentId, session: req.params.id },
          {
            $set: {
              student: record.studentId,
              session: req.params.id,
              class: session.class,
              status: record.status,
              entryMethod: 'ai_reviewed',
              aiReviewed: true,
              aiConfidence: record.aiConfidence,
              confirmedBy: req.user!.id,
              confirmedAt: new Date(),
              notes: record.notes,
              correctionHistory,
            },
          },
          { upsert: true, new: true }
        );
        results.saved++;
      } catch {
        results.errors.push(`Failed to save record for student ${record.studentId}`);
      }
    }

    await Session.findByIdAndUpdate(req.params.id, {
      attendanceCaptured: true,
      aiServiceUsed: true,
    });

    await AuditLog.create({
      user: req.user!.id,
      action: 'ATTENDANCE_AI_REVIEWED',
      resourceType: 'Session',
      resourceId: session._id,
      changes: { recordCount: results.saved },
      success: true,
    });

    res.json(createSuccessResponse(results, `${results.saved} attendance records confirmed.`));
  } catch (error) {
    next(error);
  }
};

export const updateAttendanceRecord = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateSingleRecordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }

    const record = await AttendanceRecord.findById(req.params.id).populate('session');
    if (!record) {
      res.status(404).json(createErrorResponse('Attendance record not found.'));
      return;
    }

    // Verify teacher owns the session
    const session = await Session.findOne({ _id: record.session, teacher: req.user!.id });
    if (!session) {
      res.status(403).json(createErrorResponse('Access denied.'));
      return;
    }

    const previousStatus = record.status;
    record.correctionHistory.push({
      previousStatus,
      newStatus: parsed.data.status,
      correctedBy: req.user!.id as unknown as import('mongoose').Types.ObjectId,
      correctedAt: new Date(),
      reason: parsed.data.reason,
    });
    record.status = parsed.data.status;
    record.confirmedBy = req.user!.id as unknown as import('mongoose').Types.ObjectId;
    record.confirmedAt = new Date();
    await record.save();

    await AuditLog.create({
      user: req.user!.id,
      action: 'ATTENDANCE_CORRECTED',
      resourceType: 'AttendanceRecord',
      resourceId: record._id,
      changes: { from: previousStatus, to: parsed.data.status, reason: parsed.data.reason },
      success: true,
    });

    res.json(createSuccessResponse(record, 'Attendance record updated.'));
  } catch (error) {
    next(error);
  }
};

export const getAttendanceReports = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const skip = (page - 1) * limit;
    const classId = req.query.classId as string;
    const studentId = req.query.studentId as string;
    const from = req.query.from as string;
    const to = req.query.to as string;

    // Get sessions belonging to this teacher
    const sessionFilter: Record<string, unknown> = { teacher: req.user!.id };
    if (classId) sessionFilter.class = classId;
    if (from || to) {
      sessionFilter.date = {};
      if (from) (sessionFilter.date as Record<string, unknown>).$gte = new Date(from);
      if (to) (sessionFilter.date as Record<string, unknown>).$lte = new Date(to);
    }

    const teacherSessions = await Session.find(sessionFilter).distinct('_id');

    const recordFilter: Record<string, unknown> = { session: { $in: teacherSessions } };
    if (studentId) recordFilter.student = studentId;

    const [records, total] = await Promise.all([
      AttendanceRecord.find(recordFilter)
        .populate('student', 'name studentId email')
        .populate({ path: 'session', select: 'title date', populate: { path: 'class', select: 'name code' } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AttendanceRecord.countDocuments(recordFilter),
    ]);

    res.json(createSuccessResponse(records, undefined, createPaginationMeta(total, page, limit)));
  } catch (error) {
    next(error);
  }
};
