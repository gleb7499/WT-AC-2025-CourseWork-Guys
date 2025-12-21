import { Router } from 'express';
import * as categoriesController from '../controllers/categories.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

const router = Router();

router.get('/', categoriesController.listCategories);
router.get('/:id', categoriesController.getCategoryById);
router.post('/', authenticate, authorize('admin'), validate(createCategorySchema), categoriesController.createCategory);
router.put('/:id', authenticate, authorize('admin'), validate(updateCategorySchema), categoriesController.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), categoriesController.deleteCategory);

export default router;
