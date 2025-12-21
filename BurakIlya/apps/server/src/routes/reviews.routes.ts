import { Router } from 'express';
import * as reviewsController from '../controllers/reviews.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createReviewSchema, updateReviewSchema } from '../schemas/review.schema';

const router = Router();

router.get('/', authenticate, reviewsController.listReviews);
router.get('/:id', authenticate, reviewsController.getReviewById);
router.post('/', authenticate, authorize('user', 'admin'), validate(createReviewSchema), reviewsController.createReview);
router.put('/:id', authenticate, validate(updateReviewSchema), reviewsController.updateReview);
router.delete('/:id', authenticate, authorize('admin'), reviewsController.deleteReview);

export default router;
