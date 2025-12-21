import { z } from 'zod';

export const createBookingSchema = z.object({
  roomId: z.string().uuid('Invalid room ID'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
  purpose: z.string()
    .min(1, 'Purpose is required')
    .max(500, 'Purpose must be at most 500 characters'),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const updateBookingSchema = z.object({
  startTime: z.string().datetime('Invalid start time format').optional(),
  endTime: z.string().datetime('Invalid end time format').optional(),
  purpose: z.string()
    .min(1, 'Purpose is required')
    .max(500, 'Purpose must be at most 500 characters')
    .optional(),
}).refine((data) => {
  if (data.startTime && data.endTime) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export const bookingQuerySchema = z.object({
  roomId: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  date: z.string().datetime().optional(),
  status: z.enum(['ACTIVE', 'CANCELLED']).optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

export const scheduleQuerySchema = z.object({
  roomId: z.string().uuid().optional(),
  date: z.string().datetime().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const conflictQuerySchema = z.object({
  roomId: z.string().uuid('Invalid room ID'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});
