import { Response, NextFunction } from 'express';
import * as roomService from '../services/room.service.js';
import { AuthRequest } from '../types/index.js';

export async function getAllRooms(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const filters = req.query as any;
    const result = await roomService.getAllRooms(filters);
    res.json({ status: 'ok', data: result });
  } catch (error) {
    next(error);
  }
}

export async function getRoomById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);
    res.json({ status: 'ok', data: room });
  } catch (error) {
    next(error);
  }
}

export async function createRoom(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json({ status: 'ok', data: room });
  } catch (error) {
    next(error);
  }
}

export async function updateRoom(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const room = await roomService.updateRoom(id, req.body);
    res.json({ status: 'ok', data: room });
  } catch (error) {
    next(error);
  }
}

export async function deleteRoom(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await roomService.deleteRoom(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
