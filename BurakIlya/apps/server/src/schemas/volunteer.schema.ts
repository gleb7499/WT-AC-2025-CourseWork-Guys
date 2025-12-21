import { z } from 'zod';

export const createVolunteerSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  categories: z.array(z.string().uuid()).optional(),
});

export const updateVolunteerSchema = z.object({
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  categories: z.array(z.string().uuid()).optional(),
});
