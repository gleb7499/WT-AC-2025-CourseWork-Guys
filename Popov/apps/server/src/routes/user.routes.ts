import { Router } from 'express';
import { Role } from '@prisma/client';
import * as userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, validateQuery } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema, userQuerySchema } from '../schemas/user.schema.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// List users - admin only
router.get(
  '/',
  authorize(Role.ADMIN),
  validateQuery(userQuerySchema),
  userController.getAllUsers
);

// Get user by ID - admin or self
router.get('/:id', userController.getUserById);

// Create user - admin only
router.post(
  '/',
  authorize(Role.ADMIN),
  validate(createUserSchema),
  userController.createUser
);

// Update user - admin or self
router.put(
  '/:id',
  validate(updateUserSchema),
  userController.updateUser
);

// Delete user - admin only
router.delete(
  '/:id',
  authorize(Role.ADMIN),
  userController.deleteUser
);

export default router;
