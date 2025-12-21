import { z } from 'zod';

export const createReviewSchema = z.object({
  assignmentId: z.string().uuid('Invalid assignment ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be at most 1000 characters').optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').optional(),
  comment: z.string().max(1000, 'Comment must be at most 1000 characters').optional(),
});
