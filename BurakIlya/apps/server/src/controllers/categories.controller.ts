import { Request, Response, NextFunction } from 'express';
import * as categoriesService from '../services/categories.service';

export async function listCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

    const result = await categoriesService.listCategories({ limit, offset });
    res.status(200).json({
      status: 'ok',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.getCategoryById(req.params.id);
    res.status(200).json({
      status: 'ok',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.createCategory(req.body);
    res.status(201).json({
      status: 'ok',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoriesService.updateCategory(req.params.id, req.body);
    res.status(200).json({
      status: 'ok',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await categoriesService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
