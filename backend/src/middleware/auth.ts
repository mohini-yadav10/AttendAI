import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { createErrorResponse } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(createErrorResponse('Authentication required. Please log in.'));
      return;
    }

    const token = authHeader.substring(7);

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch {
      res.status(401).json(createErrorResponse('Invalid or expired token. Please log in again.'));
      return;
    }

    // Verify user still exists and is active
    const user = await User.findById(payload.id).select('_id email role name isActive');
    if (!user || !user.isActive) {
      res.status(401).json(createErrorResponse('User account not found or deactivated.'));
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(createErrorResponse('Authentication required.'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json(
        createErrorResponse(`Access denied. Required role: ${roles.join(' or ')}.`)
      );
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
        req.user = { id: payload.id, email: payload.email, role: payload.role, name: payload.name };
      } catch {
        // Silently ignore invalid tokens for optional auth
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
