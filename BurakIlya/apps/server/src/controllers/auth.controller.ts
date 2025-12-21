import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      status: 'ok',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    res.status(200).json({
      status: 'ok',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
