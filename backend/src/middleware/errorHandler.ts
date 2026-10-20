import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { createErrorResponse } from '../utils/response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log full error server-side (but NEVER log passwords, tokens, or biometric data)
  logger.error(`${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
    statusCode: err.statusCode,
  });

  // Mongoose duplicate key
  if (err.name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    res.status(409).json(
      createErrorResponse('A record with this information already exists.')
    );
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json(
      createErrorResponse('Validation failed: ' + err.message)
    );
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json(createErrorResponse('Invalid token.'));
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json(createErrorResponse('Token expired. Please log in again.'));
    return;
  }

  // Operational errors we created deliberately
  if (err.isOperational) {
    res.status(err.statusCode || 400).json(createErrorResponse(err.message));
    return;
  }

  // Unknown errors — never expose internal details to client
  res.status(500).json(
    createErrorResponse('An internal server error occurred. Please try again later.')
  );
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json(createErrorResponse(`Route not found: ${req.method} ${req.path}`));
};

export class ApiError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
