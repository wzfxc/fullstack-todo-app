import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  validationErrors?: unknown[];
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(err.validationErrors ? { validationErrors: err.validationErrors } : {}),
  });
};

