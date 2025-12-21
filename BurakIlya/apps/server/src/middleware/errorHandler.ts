import { ErrorRequestHandler } from 'express';
import { AppError } from '../lib/errors';
import logger from '../lib/logger';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  logger.error(
    {
      err: {
        message: err.message,
        stack: err.stack,
        ...err,
      },
      path: req.path,
      method: req.method,
    },
    'Request error'
  );

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Handle Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      status: 'error',
      error: {
        code: 'conflict',
        message: 'A record with this value already exists',
      },
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      status: 'error',
      error: {
        code: 'not_found',
        message: 'Record not found',
      },
    });
  }

  // Default error
  return res.status(500).json({
    status: 'error',
    error: {
      code: 'internal_server_error',
      message: 'An unexpected error occurred',
    },
  });
};
