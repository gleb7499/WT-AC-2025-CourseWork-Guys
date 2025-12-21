import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const error = result.error as ZodError;
        return res.status(400).json({
          status: 'error',
          error: {
            code: 'validation_error',
            message: 'Invalid input data',
            details: error.flatten().fieldErrors,
          },
        });
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}
