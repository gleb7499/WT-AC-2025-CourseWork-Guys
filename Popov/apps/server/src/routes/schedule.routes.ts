import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validate.js';
import { scheduleQuerySchema, conflictQuerySchema } from '../schemas/booking.schema.js';

const router = Router();

// All schedule routes require authentication
router.use(authenticate);

// View schedule
router.get(
  '/',
  validateQuery(scheduleQuerySchema),
  bookingController.getSchedule
);

// Check for conflicts
router.get(
  '/conflicts',
  validateQuery(conflictQuerySchema),
  bookingController.checkConflicts
);

export default router;
