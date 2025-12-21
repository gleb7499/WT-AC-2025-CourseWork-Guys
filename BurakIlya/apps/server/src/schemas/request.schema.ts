import { z } from 'zod';

export const createRequestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().uuid('Invalid category ID'),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  locationAddress: z.string().min(1, 'Location address is required'),
});

export const updateRequestSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  status: z.enum(['new', 'assigned', 'in_progress', 'completed', 'cancelled']).optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  locationAddress: z.string().min(1, 'Location address is required').optional(),
});
