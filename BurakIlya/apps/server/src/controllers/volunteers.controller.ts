import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as volunteersService from '../services/volunteers.service';

export async function listVolunteers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const params = {
      categoryId: req.query.categoryId as string | undefined,
      rating: req.query.rating ? parseFloat(req.query.rating as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await volunteersService.listVolunteers(params);
    res.status(200).json({
      status: 'ok',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getVolunteerById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const volunteer = await volunteersService.getVolunteerById(req.params.id);
    res.status(200).json({
      status: 'ok',
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
}

export async function createVolunteer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const volunteer = await volunteersService.createVolunteer(req.body);
    res.status(201).json({
      status: 'ok',
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateVolunteer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const volunteer = await volunteersService.updateVolunteer(
      req.params.id,
      req.body,
      req.user!.userId,
      req.user!.role
    );
    res.status(200).json({
      status: 'ok',
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteVolunteer(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await volunteersService.deleteVolunteer(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getVolunteerStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const stats = await volunteersService.getVolunteerStats(req.params.id);
    res.status(200).json({
      status: 'ok',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}
