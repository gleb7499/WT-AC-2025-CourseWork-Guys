import { z } from 'zod';

export const createAssignmentSchema = z.object({
  requestId: z.string().uuid('Invalid request ID'),
  volunteerId: z.string().uuid('Invalid volunteer ID').optional(),
});

export const updateAssignmentSchema = z.object({
  status: z.enum(['assigned', 'in_progress', 'completed', 'cancelled']),
});
