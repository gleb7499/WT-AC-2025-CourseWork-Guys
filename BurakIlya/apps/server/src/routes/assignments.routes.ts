import { Router } from 'express';
import * as assignmentsController from '../controllers/assignments.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createAssignmentSchema, updateAssignmentSchema } from '../schemas/assignment.schema';

const router = Router();

router.get('/', authenticate, assignmentsController.listAssignments);
router.get('/:id', authenticate, assignmentsController.getAssignmentById);
router.post('/', authenticate, authorize('volunteer', 'admin'), validate(createAssignmentSchema), assignmentsController.createAssignment);
router.put('/:id', authenticate, validate(updateAssignmentSchema), assignmentsController.updateAssignment);
router.delete('/:id', authenticate, authorize('admin'), assignmentsController.deleteAssignment);

export default router;
