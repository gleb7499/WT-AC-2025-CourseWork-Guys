export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'volunteer';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface HelpRequest {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  status: 'new' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  locationLat?: number;
  locationLng?: number;
  locationAddress: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; username: string };
  category?: Category;
  assignments?: Assignment[];
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  bio?: string;
  rating: number;
  totalHelps: number;
  locationLat?: number;
  locationLng?: number;
  categories: string[];
  user?: User;
}

export interface Assignment {
  id: string;
  requestId: string;
  volunteerId: string;
  status: 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignedAt: string;
  completedAt?: string;
  request?: HelpRequest;
  volunteer?: { id: string; username: string };
  review?: Review;
}

export interface Review {
  id: string;
  assignmentId: string;
  userId: string;
  volunteerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { id: string; username: string };
  volunteer?: { id: string; username: string };
}

export interface PaginatedResponse<T> {
  status: string;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface ApiError {
  status: string;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
