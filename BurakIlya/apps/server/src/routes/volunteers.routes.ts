import { Router, IRouter } from 'express';
import * as volunteersController from '../controllers/volunteers.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createVolunteerSchema, updateVolunteerSchema } from '../schemas/volunteer.schema';

const router: IRouter = Router();

router.get('/', authenticate, volunteersController.listVolunteers);
router.get('/:id', authenticate, volunteersController.getVolunteerById);
router.get('/:id/stats', authenticate, volunteersController.getVolunteerStats);
router.post('/', authenticate, authorize('admin'), validate(createVolunteerSchema), volunteersController.createVolunteer);
router.put('/:id', authenticate, validate(updateVolunteerSchema), volunteersController.updateVolunteer);
router.delete('/:id', authenticate, authorize('admin'), volunteersController.deleteVolunteer);

export default router;
