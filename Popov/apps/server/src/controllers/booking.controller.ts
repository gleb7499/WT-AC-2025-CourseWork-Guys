import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import * as bookingService from '../services/booking.service.js';
import { AuthRequest } from '../types/index.js';

export async function getAllBookings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const filters = req.query as any;
    const result = await bookingService.getAllBookings(filters);
    res.json({ status: 'ok', data: result });
  } catch (error) {
    next(error);
  }
}

export async function getBookingById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    res.json({ status: 'ok', data: booking });
  } catch (error) {
    next(error);
  }
}

export async function createBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        error: { code: 'unauthorized', message: 'Authentication required' },
      });
    }

    const booking = await bookingService.createBooking({
      ...req.body,
      userId: req.user.userId,
      userRole: req.user.role as Role,
    });
    res.status(201).json({ status: 'ok', data: booking });
  } catch (error) {
    next(error);
  }
}

export async function updateBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        error: { code: 'unauthorized', message: 'Authentication required' },
      });
    }

    const { id } = req.params;
    const booking = await bookingService.updateBooking(
      id,
      req.user.userId,
      req.user.role as Role,
      req.body
    );
    res.json({ status: 'ok', data: booking });
  } catch (error) {
    next(error);
  }
}

export async function deleteBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        error: { code: 'unauthorized', message: 'Authentication required' },
      });
    }

    const { id } = req.params;
    await bookingService.deleteBooking(id, req.user.userId, req.user.role as Role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getSchedule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const filters = req.query as any;
    const bookings = await bookingService.getSchedule(filters);
    res.json({ status: 'ok', data: bookings });
  } catch (error) {
    next(error);
  }
}

export async function checkConflicts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { roomId, startTime, endTime } = req.query as any;
    const result = await bookingService.checkScheduleConflicts(roomId, startTime, endTime);
    res.json({ status: 'ok', data: result });
  } catch (error) {
    next(error);
  }
}
