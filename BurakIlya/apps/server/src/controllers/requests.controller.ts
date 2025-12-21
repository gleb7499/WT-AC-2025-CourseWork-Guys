import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as requestsService from '../services/requests.service';

export async function listRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const params = {
      status: req.query.status as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      userId: req.query.userId as string | undefined,
      lat: req.query.lat ? parseFloat(req.query.lat as string) : undefined,
      lng: req.query.lng ? parseFloat(req.query.lng as string) : undefined,
      radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await requestsService.listRequests(params);
    res.status(200).json({
      status: 'ok',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRequestById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const request = await requestsService.getRequestById(req.params.id);
    res.status(200).json({
      status: 'ok',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

export async function createRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const request = await requestsService.createRequest({
      ...req.body,
      userId: req.user!.userId,
    });
    res.status(201).json({
      status: 'ok',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const request = await requestsService.updateRequest(
      req.params.id,
      req.body,
      req.user!.userId,
      req.user!.role
    );
    res.status(200).json({
      status: 'ok',
      data: request,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await requestsService.deleteRequest(req.params.id, req.user!.userId, req.user!.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
