import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string()
    .min(1, 'Room name is required')
    .max(100, 'Room name must be at most 100 characters'),
  description: z.string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  capacity: z.number()
    .int('Capacity must be an integer')
    .positive('Capacity must be greater than 0'),
  equipment: z.string()
    .max(500, 'Equipment description must be at most 500 characters')
    .optional(),
  location: z.string()
    .min(1, 'Location is required')
    .max(200, 'Location must be at most 200 characters'),
});

export const updateRoomSchema = createRoomSchema.partial();

export const roomQuerySchema = z.object({
  capacity: z.coerce.number().int().positive().optional(),
  equipment: z.string().optional(),
  location: z.string().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});
