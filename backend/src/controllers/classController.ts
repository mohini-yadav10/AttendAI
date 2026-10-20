import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { Class } from '../models/Class';
import { Enrollment } from '../models/Enrollment';
import { createSuccessResponse, createErrorResponse, createPaginationMeta } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditLog } from '../models/AuditLog';

const createClassSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(1).max(20),
  description: z.string().max(500).optional(),
  academicYear: z.string().min(4).max(20),
  semester: z.string().max(20).optional(),
});

const updateClassSchema = createClassSchema.partial().extend({
  archived: z.boolean().optional(),
});

export const getClasses = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;
    const archived = req.query.archived === 'true';
    const search = req.query.search as string;

    const filter: Record<string, unknown> = {
      teacher: req.user!.id,
      archived,
    };

    if (search) {
      filter.$text = { $search: search };
    }

    const [classes, total] = await Promise.all([
      Class.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Class.countDocuments(filter),
    ]);

    res.json(
      createSuccessResponse(classes, undefined, createPaginationMeta(total, page, limit))
    );
  } catch (error) {
    next(error);
  }
};

export const createClass = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = createClassSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }

    const classData = {
      ...parsed.data,
      teacher: req.user!.id,
    };

    const newClass = await Class.create(classData);

    await AuditLog.create({
      user: req.user!.id,
      action: 'CLASS_CREATED',
      resourceType: 'Class',
      resourceId: newClass._id,
      success: true,
    });

    res.status(201).json(createSuccessResponse(newClass, 'Class created successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getClassById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cls = await Class.findOne({ _id: req.params.id, teacher: req.user!.id });
    if (!cls) {
      res.status(404).json(createErrorResponse('Class not found.'));
      return;
    }

    const enrollmentCount = await Enrollment.countDocuments({ class: cls._id, status: 'active' });
    res.json(createSuccessResponse({ ...cls.toJSON(), enrollmentCount }));
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = updateClassSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }

    const cls = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user!.id },
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!cls) {
      res.status(404).json(createErrorResponse('Class not found.'));
      return;
    }

    await AuditLog.create({
      user: req.user!.id,
      action: 'CLASS_UPDATED',
      resourceType: 'Class',
      resourceId: cls._id,
      changes: parsed.data,
      success: true,
    });

    res.json(createSuccessResponse(cls, 'Class updated successfully.'));
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cls = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user!.id },
      { $set: { archived: true } },
      { new: true }
    );

    if (!cls) {
      res.status(404).json(createErrorResponse('Class not found.'));
      return;
    }

    await AuditLog.create({
      user: req.user!.id,
      action: 'CLASS_ARCHIVED',
      resourceType: 'Class',
      resourceId: cls._id,
      success: true,
    });

    res.json(createSuccessResponse(null, 'Class archived successfully.'));
  } catch (error) {
    next(error);
  }
};
