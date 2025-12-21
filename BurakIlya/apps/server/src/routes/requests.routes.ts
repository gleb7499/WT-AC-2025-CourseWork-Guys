import { Router } from 'express';
import * as requestsController from '../controllers/requests.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createRequestSchema, updateRequestSchema } from '../schemas/request.schema';

const router = Router();

router.get('/', authenticate, requestsController.listRequests);
router.get('/:id', authenticate, requestsController.getRequestById);
router.post('/', authenticate, authorize('user', 'admin'), validate(createRequestSchema), requestsController.createRequest);
router.put('/:id', authenticate, validate(updateRequestSchema), requestsController.updateRequest);
router.delete('/:id', authenticate, requestsController.deleteRequest);

export default router;
