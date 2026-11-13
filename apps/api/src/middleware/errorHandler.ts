import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors: Record<string, string[]> | undefined = err.errors;

  if (err instanceof ZodError || err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = {};
    const issues = (err as unknown as ZodError).issues || [];
    for (const issue of issues) {
      const field = issue.path.join('.') || 'general';
      if (!errors[field]) {
        errors[field] = [];
      }
      errors[field].push(issue.message);
    }
  }

  const responseBody: Record<string, unknown> = {
    success: false,
    message,
  };

  if (errors) {
    responseBody.errors = errors;
  }

  if (env.NODE_ENV === 'development' && statusCode === 500) {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
}
