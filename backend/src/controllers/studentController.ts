import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { StudentProfile } from '../models/StudentProfile';
import { Enrollment } from '../models/Enrollment';
import { Class } from '../models/Class';
import { AttendanceRecord } from '../models/AttendanceRecord';
import { createSuccessResponse, createErrorResponse, createPaginationMeta } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditLog } from '../models/AuditLog';
import { ApiError } from '../middleware/errorHandler';

const createStudentSchema = z.object({
  name: z.string().min(2).max(100),
  studentId: z.string().min(1).max(20),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  department: z.string().max(100).optional(),
  year: z.number().int().min(1).max(6).optional(),
  notes: z.string().max(500).optional(),
  classId: z.string().optional(), // Optional: enroll directly into a class
});

const updateStudentSchema = createStudentSchema.partial().omit({ classId: true });

const csvRowSchema = z.object({
  name: z.string().min(2).max(100),
  studentId: z.string().min(1).max(20),
  email: z.string().email().optional().or(z.literal('')),
  department: z.string().max(100).optional().or(z.literal('')),
  year: z.string().optional(),
});

export const getStudents = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search as string;
    const classId = req.query.classId as string;

    let studentIds: string[] | undefined;

    if (classId) {
      // Verify teacher owns this class
      const cls = await Class.findOne({ _id: classId, teacher: req.user!.id });
      if (!cls) {
        res.status(404).json(createErrorResponse('Class not found.'));
        return;
      }
      const enrollments = await Enrollment.find({ class: classId, status: 'active' }).distinct('student');
      studentIds = enrollments.map(id => id.toString());
    }

    const filter: Record<string, unknown> = {
      enrolledBy: req.user!.id,
    };

    if (studentIds !== undefined) {
      filter._id = { $in: studentIds };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const [students, total] = await Promise.all([
      StudentProfile.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      StudentProfile.countDocuments(filter),
    ]);

    res.json(createSuccessResponse(students, undefined, createPaginationMeta(total, page, limit)));
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }

    const { classId, ...studentData } = parsed.data;
    const student = await StudentProfile.create({ ...studentData, enrolledBy: req.user!.id });

    // Optionally enroll in a class immediately
    if (classId) {
      const cls = await Class.findOne({ _id: classId, teacher: req.user!.id });
      if (cls) {
        await Enrollment.create({ student: student._id, class: classId }).catch(() => {
          // Ignore if already enrolled
        });
      }
    }

    await AuditLog.create({
      user: req.user!.id,
      action: 'STUDENT_CREATED',
      resourceType: 'StudentProfile',
      resourceId: student._id,
      success: true,
    });

    res.status(201).json(createSuccessResponse(student, 'Student added successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const student = await StudentProfile.findOne({
      _id: req.params.id,
      enrolledBy: req.user!.id,
    });

    if (!student) {
      res.status(404).json(createErrorResponse('Student not found.'));
      return;
    }

    const enrollments = await Enrollment.find({ student: student._id })
      .populate('class', 'name code')
      .populate('course', 'name code')
      .lean();

    res.json(createSuccessResponse({ student, enrollments }));
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Students can only view their own profile — teachers can edit
    let filter: Record<string, unknown> = {};

    if (req.user!.role === 'teacher') {
      filter = { _id: req.params.id, enrolledBy: req.user!.id };
    } else {
      // Students cannot update profile via this endpoint
      res.status(403).json(createErrorResponse('Students cannot edit student profiles.'));
      return;
    }

    const parsed = updateStudentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }

    const student = await StudentProfile.findOneAndUpdate(
      filter,
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!student) {
      res.status(404).json(createErrorResponse('Student not found.'));
      return;
    }

    await AuditLog.create({
      user: req.user!.id,
      action: 'STUDENT_UPDATED',
      resourceType: 'StudentProfile',
      resourceId: student._id,
      changes: parsed.data,
      success: true,
    });

    res.json(createSuccessResponse(student, 'Student updated successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getStudentAttendance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const studentId = req.params.id;

    // Security: Students can only see their own records
    if (req.user!.role === 'student') {
      // Find student profile matching this user's email
      const studentProfile = await StudentProfile.findOne({
        email: req.user!.email,
        _id: studentId,
      });
      if (!studentProfile) {
        res.status(403).json(createErrorResponse('Access denied. You can only view your own records.'));
        return;
      }
    } else {
      // Teacher: verify they own the student
      const studentProfile = await StudentProfile.findOne({
        _id: studentId,
        enrolledBy: req.user!.id,
      });
      if (!studentProfile) {
        res.status(404).json(createErrorResponse('Student not found.'));
        return;
      }
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      AttendanceRecord.find({ student: studentId })
        .populate('session', 'title date class')
        .populate('class', 'name code')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AttendanceRecord.countDocuments({ student: studentId }),
    ]);

    // Calculate attendance percentage
    const totalSessions = await AttendanceRecord.countDocuments({ student: studentId });
    const presentCount = await AttendanceRecord.countDocuments({
      student: studentId,
      status: { $in: ['present', 'late'] },
    });
    const percentage = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

    res.json(
      createSuccessResponse(
        { records, summary: { total: totalSessions, present: presentCount, percentage } },
        undefined,
        createPaginationMeta(total, page, limit)
      )
    );
  } catch (error) {
    next(error);
  }
};

export const importStudentsFromCSV = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows, classId } = req.body as { rows: unknown[]; classId?: string };

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new ApiError('No rows provided for import.', 400);
    }

    if (rows.length > 500) {
      throw new ApiError('Maximum 500 students can be imported at once.', 400);
    }

    // Verify class ownership if classId provided
    if (classId) {
      const cls = await Class.findOne({ _id: classId, teacher: req.user!.id });
      if (!cls) throw new ApiError('Class not found.', 404);
    }

    const results = { imported: 0, skipped: 0, errors: [] as string[] };

    for (let i = 0; i < rows.length; i++) {
      const parsed = csvRowSchema.safeParse(rows[i]);
      if (!parsed.success) {
        results.errors.push(`Row ${i + 1}: ${parsed.error.errors[0].message}`);
        results.skipped++;
        continue;
      }

      const { name, studentId, email, department, year } = parsed.data;

      try {
        const student = await StudentProfile.findOneAndUpdate(
          { studentId: studentId.toUpperCase() },
          { $setOnInsert: { name, studentId, email: email || undefined, department: department || undefined, year: year ? parseInt(year) : undefined, enrolledBy: req.user!.id } },
          { upsert: true, new: true }
        );

        if (classId) {
          await Enrollment.findOneAndUpdate(
            { student: student._id, class: classId },
            { $setOnInsert: { student: student._id, class: classId } },
            { upsert: true }
          ).catch(() => {});
        }

        results.imported++;
      } catch {
        results.errors.push(`Row ${i + 1}: Could not import student ${studentId}`);
        results.skipped++;
      }
    }

    res.json(createSuccessResponse(results, `Import complete: ${results.imported} students imported.`));
  } catch (error) {
    next(error);
  }
};
