import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate, validateQuery } from '../middleware/validate.js';
import {
  createBookingSchema,
  updateBookingSchema,
  bookingQuerySchema,
  scheduleQuerySchema,
  conflictQuerySchema,
} from '../schemas/booking.schema.js';

const router = Router();

// All booking routes require authentication
router.use(authenticate);

// Bookings CRUD
router.get(
  '/',
  validateQuery(bookingQuerySchema),
  bookingController.getAllBookings
);

router.get(
  '/:id',
  bookingController.getBookingById
);

router.post(
  '/',
  validate(createBookingSchema),
  bookingController.createBooking
);

router.put(
  '/:id',
  validate(updateBookingSchema),
  bookingController.updateBooking
);

router.delete(
  '/:id',
  bookingController.deleteBooking
);

export default router;
