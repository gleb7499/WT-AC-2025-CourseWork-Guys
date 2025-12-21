import { Router } from 'express';
import { Role } from '@prisma/client';
import * as roomController from '../controllers/room.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, validateQuery } from '../middleware/validate.js';
import { createRoomSchema, updateRoomSchema, roomQuerySchema } from '../schemas/room.schema.js';

const router = Router();

// Public routes (authenticated users can view rooms)
router.get(
  '/',
  authenticate,
  validateQuery(roomQuerySchema),
  roomController.getAllRooms
);

router.get(
  '/:id',
  authenticate,
  roomController.getRoomById
);

// Admin only routes
router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN),
  validate(createRoomSchema),
  roomController.createRoom
);

router.put(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  validate(updateRoomSchema),
  roomController.updateRoom
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN),
  roomController.deleteRoom
);

export default router;
