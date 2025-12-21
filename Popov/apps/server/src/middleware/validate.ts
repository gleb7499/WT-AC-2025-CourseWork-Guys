import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'validation_error',
          message: 'Invalid input data',
          details: result.error.flatten().fieldErrors,
        },
      });
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 'validation_error',
          message: 'Invalid query parameters',
          details: result.error.flatten().fieldErrors,
        },
      });
    }
    req.query = result.data as any;
    next();
  };
}
