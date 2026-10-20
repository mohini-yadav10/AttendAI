import { Response, NextFunction } from 'express';
import { Session } from '../models/Session';
import { AttendanceRecord } from '../models/AttendanceRecord';
import { Enrollment } from '../models/Enrollment';
import { ParticipationEvent } from '../models/ParticipationEvent';
import { Class } from '../models/Class';
import { createSuccessResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const getOverview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classId = req.query.classId as string;

    // All classes for this teacher
    const classFilter: Record<string, unknown> = { teacher: req.user!.id, archived: false };
    if (classId) classFilter._id = classId;
    const classes = await Class.find(classFilter).distinct('_id');

    // Session stats
    const sessionFilter: Record<string, unknown> = { teacher: req.user!.id };
    if (classId) sessionFilter.class = classId;

    const [totalSessions, completedSessions, totalEnrolled] = await Promise.all([
      Session.countDocuments(sessionFilter),
      Session.countDocuments({ ...sessionFilter, status: 'completed' }),
      Enrollment.countDocuments({ class: { $in: classes }, status: 'active' }),
    ]);

    // Recent session attendance
    const recentSessions = await Session.find({ ...sessionFilter, attendanceCaptured: true })
      .sort({ date: -1 })
      .limit(5)
      .lean();

    const recentSessionIds = recentSessions.map(s => s._id);
    const recentAttendance = await AttendanceRecord.aggregate([
      { $match: { session: { $in: recentSessionIds } } },
      {
        $group: {
          _id: '$session',
          present: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
    ]);

    // Overall attendance rate
    const overallStats = await AttendanceRecord.aggregate([
      { $match: { session: { $in: await Session.find(sessionFilter).distinct('_id') } } },
      {
        $group: {
          _id: null,
          present: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
    ]);

    const overall = overallStats[0] || { present: 0, total: 0 };
    const attendanceRate = overall.total > 0 ? Math.round((overall.present / overall.total) * 100) : 0;

    res.json(
      createSuccessResponse({
        totalSessions,
        completedSessions,
        totalEnrolled,
        attendanceRate,
        overallPresent: overall.present,
        overallTotal: overall.total,
        recentSessions: recentSessions.map(s => ({
          ...s,
          attendance: recentAttendance.find(a => a._id.toString() === s._id.toString()),
        })),
      })
    );
  } catch (error) {
    next(error);
  }
};

export const getAttendanceTrends = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classId = req.query.classId as string;
    const days = Math.min(parseInt(req.query.days as string) || 30, 90);
    const since = new Date();
    since.setDate(since.getDate() - days);

    const sessionFilter: Record<string, unknown> = { teacher: req.user!.id, date: { $gte: since } };
    if (classId) sessionFilter.class = classId;

    const sessions = await Session.find(sessionFilter).sort({ date: 1 }).lean();
    const sessionIds = sessions.map(s => s._id);

    const attendanceBySession = await AttendanceRecord.aggregate([
      { $match: { session: { $in: sessionIds } } },
      {
        $group: {
          _id: '$session',
          present: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
    ]);

    const trends = sessions.map(s => {
      const att = attendanceBySession.find(a => a._id.toString() === s._id.toString());
      return {
        sessionId: s._id,
        title: s.title,
        date: s.date,
        present: att?.present || 0,
        absent: att?.absent || 0,
        total: att?.total || 0,
        rate: att?.total > 0 ? Math.round((att.present / att.total) * 100) : 0,
      };
    });

    res.json(createSuccessResponse(trends));
  } catch (error) {
    next(error);
  }
};

export const getParticipationAnalytics = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classId = req.query.classId as string;
    const sessionId = req.query.sessionId as string;

    const filter: Record<string, unknown> = {};
    if (sessionId) filter.session = sessionId;
    if (classId) filter.class = classId;

    // Verify teacher owns these resources
    if (!classId && !sessionId) {
      const teacherClasses = await Class.find({ teacher: req.user!.id }).distinct('_id');
      filter.class = { $in: teacherClasses };
    }

    const eventsByType = await ParticipationEvent.aggregate([
      { $match: filter },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const eventsBySession = await ParticipationEvent.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$session',
          count: { $sum: 1 },
          types: { $push: '$eventType' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json(createSuccessResponse({
      byType: eventsByType,
      bySession: eventsBySession,
      // IMPORTANT DISCLAIMER: Event counts reflect observable classroom interactions.
      // They are not measures of student intelligence, attention, or learning outcomes.
      disclaimer: 'Participation counts reflect observable events only and are not measures of student intelligence, attention, or learning outcomes.',
    }));
  } catch (error) {
    next(error);
  }
};

export const getClassComparison = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const classes = await Class.find({ teacher: req.user!.id, archived: false }).lean();
    const classIds = classes.map(c => c._id);

    const sessions = await Session.find({ teacher: req.user!.id, class: { $in: classIds } }).distinct('_id');

    const attendanceByClass = await AttendanceRecord.aggregate([
      { $match: { session: { $in: sessions }, class: { $in: classIds } } },
      {
        $group: {
          _id: '$class',
          present: { $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
    ]);

    const result = classes.map(cls => {
      const att = attendanceByClass.find(a => a._id.toString() === cls._id.toString());
      return {
        class: cls,
        present: att?.present || 0,
        total: att?.total || 0,
        rate: att?.total > 0 ? Math.round((att.present / att.total) * 100) : 0,
      };
    });

    res.json(createSuccessResponse(result));
  } catch (error) {
    next(error);
  }
};
