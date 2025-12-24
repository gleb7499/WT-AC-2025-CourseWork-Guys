export interface User {
  id: string;
  email: string;
  username: string;
  role: "admin" | "user";
}

export interface ApiResponse<T> {
  status: "ok" | "error";
  data?: T;
  error?: {
    message: string;
    code: string;
    fields?: Record<string, string[]>;
  };
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
  status: "new" | "assigned" | "in_progress" | "completed" | "cancelled";
  locationLat?: number;
  locationLng?: number;
  locationAddress: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  bio?: string;
  rating: number;
  totalHelps: number;
  locationLat?: number;
  locationLng?: number;
  user?: { id: string; email: string; username: string };
}

export interface Assignment {
  id: string;
  requestId: string;
  volunteerId: string;
  status: "assigned" | "in_progress" | "completed" | "cancelled";
  assignedAt: string;
  completedAt?: string;
  request?: HelpRequest;
}

export interface Review {
  id: string;
  assignmentId: string;
  userId: string;
  volunteerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
