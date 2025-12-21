import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as reviewsService from '../services/reviews.service';

export async function listReviews(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const params = {
      volunteerId: req.query.volunteerId as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await reviewsService.listReviews(params);
    res.status(200).json({
      status: 'ok',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getReviewById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.getReviewById(req.params.id);
    res.status(200).json({
      status: 'ok',
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

export async function createReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.createReview({
      ...req.body,
      userId: req.user!.userId,
    });
    res.status(201).json({
      status: 'ok',
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const review = await reviewsService.updateReview(
      req.params.id,
      req.body,
      req.user!.userId,
      req.user!.role
    );
    res.status(200).json({
      status: 'ok',
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await reviewsService.deleteReview(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
