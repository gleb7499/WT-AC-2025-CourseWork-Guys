import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import * as assignmentsService from '../services/assignments.service';

export async function listAssignments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const params = {
      requestId: req.query.requestId as string | undefined,
      volunteerId: req.query.volunteerId as string | undefined,
      status: req.query.status as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await assignmentsService.listAssignments(params);
    res.status(200).json({
      status: 'ok',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAssignmentById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const assignment = await assignmentsService.getAssignmentById(req.params.id);
    res.status(200).json({
      status: 'ok',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const assignment = await assignmentsService.createAssignment(
      req.body,
      req.user!.userId,
      req.user!.role
    );
    res.status(201).json({
      status: 'ok',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const assignment = await assignmentsService.updateAssignment(
      req.params.id,
      req.body,
      req.user!.userId,
      req.user!.role
    );
    res.status(200).json({
      status: 'ok',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAssignment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await assignmentsService.deleteAssignment(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
