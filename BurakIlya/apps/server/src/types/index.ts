import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role: string;
  };
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

export type UserRole = 'admin' | 'user' | 'volunteer';

export type HelpRequestStatus = 'new' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type AssignmentStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled';
