import { Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';
import { AuthRequest } from '../types/index.js';

export async function getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { limit, offset } = req.query as any;
    const result = await userService.getAllUsers(limit, offset);
    res.json({ status: 'ok', data: result });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.json({ status: 'ok', data: user });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ status: 'ok', data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userService.updateUser(id, req.body);
    res.json({ status: 'ok', data: user });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
