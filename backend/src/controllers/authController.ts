import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from '../models/User';
import { hashPassword } from '../utils/password';
import { generateToken } from '../utils/token';
import { createSuccessResponse, createErrorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';
import { AuditLog } from '../models/AuditLog';

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['teacher', 'student']).default('teacher'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse(parsed.error.errors[0].message));
      return;
    }
    const { name, email, password, role } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json(createErrorResponse('An account with this email already exists.'));
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await AuditLog.create({
      user: user._id,
      action: 'USER_REGISTERED',
      resourceType: 'User',
      resourceId: user._id,
      success: true,
    });

    res.status(201).json(
      createSuccessResponse(
        { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token },
        'Account created successfully.'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(createErrorResponse('Invalid email or password format.'));
      return;
    }
    const { email, password } = parsed.data;

    // Explicitly select passwordHash since it's excluded by default
    const user = await User.findOne({ email, isActive: true }).select('+passwordHash');
    if (!user) {
      // Generic message to prevent user enumeration
      res.status(401).json(createErrorResponse('Invalid email or password.'));
      return;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      await AuditLog.create({
        user: user._id,
        action: 'LOGIN_FAILED',
        resourceType: 'User',
        resourceId: user._id,
        success: false,
        errorMessage: 'Invalid password',
      });
      res.status(401).json(createErrorResponse('Invalid email or password.'));
      return;
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await AuditLog.create({
      user: user._id,
      action: 'LOGIN_SUCCESS',
      resourceType: 'User',
      resourceId: user._id,
      success: true,
    });

    res.json(
      createSuccessResponse(
        { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token },
        'Logged in successfully.'
      )
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // JWT is stateless — logout is handled client-side by discarding the token.
    // If refresh tokens are implemented, invalidate here.
    if (req.user) {
      await AuditLog.create({
        user: req.user.id,
        action: 'LOGOUT',
        resourceType: 'User',
        success: true,
      });
    }
    res.json(createSuccessResponse(null, 'Logged out successfully.'));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(createErrorResponse('Not authenticated.'));
      return;
    }
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      res.status(404).json(createErrorResponse('User not found.'));
      return;
    }
    res.json(createSuccessResponse({ user }));
  } catch (error) {
    next(error);
  }
};
