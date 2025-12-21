import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as usersService from '../services/users.service';

export async function listUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    const result = await usersService.listUsers({ limit, offset });
    res.status(200).json({
      status: 'ok',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await usersService.getUserById(
      req.params.id,
      req.user?.userId,
      req.user?.role
    );
    res.status(200).json({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await usersService.updateUser(
      req.params.id,
      req.body,
      req.user?.userId,
      req.user?.role
    );
    res.status(200).json({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await usersService.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
