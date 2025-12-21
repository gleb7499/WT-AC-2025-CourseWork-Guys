import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateUserSchema } from '../schemas/user.schema';

const router = Router();

router.get('/', authenticate, authorize('admin'), usersController.listUsers);
router.get('/:id', authenticate, usersController.getUserById);
router.put('/:id', authenticate, validate(updateUserSchema), usersController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), usersController.deleteUser);

export default router;
