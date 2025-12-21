import { api } from './client';
import {
  User,
  Category,
  HelpRequest,
  VolunteerProfile,
  Assignment,
  Review,
  PaginatedResponse,
  ApiResponse,
} from '../shared/types';

// Auth API
export const authApi = {
  register: (data: { username: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<User>>('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/login', data),
  refresh: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken }),
};

// Categories API
export const categoriesApi = {
  list: (params?: { limit?: number; offset?: number }) =>
    api.get<PaginatedResponse<Category>>('/categories', { params }),
  getById: (id: string) => api.get<ApiResponse<Category>>(`/categories/${id}`),
  create: (data: { name: string; description?: string; icon?: string }) =>
    api.post<ApiResponse<Category>>('/categories', data),
  update: (id: string, data: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Requests API
export const requestsApi = {
  list: (params?: {
    status?: string;
    categoryId?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }) => api.get<PaginatedResponse<HelpRequest>>('/requests', { params }),
  getById: (id: string) => api.get<ApiResponse<HelpRequest>>(`/requests/${id}`),
  create: (data: {
    title: string;
    description: string;
    categoryId: string;
    locationAddress: string;
    locationLat?: number;
    locationLng?: number;
  }) => api.post<ApiResponse<HelpRequest>>('/requests', data),
  update: (id: string, data: Partial<HelpRequest>) =>
    api.put<ApiResponse<HelpRequest>>(`/requests/${id}`, data),
  delete: (id: string) => api.delete(`/requests/${id}`),
};

// Volunteers API
export const volunteersApi = {
  list: (params?: { categoryId?: string; rating?: number; limit?: number; offset?: number }) =>
    api.get<PaginatedResponse<VolunteerProfile>>('/volunteers', { params }),
  getById: (id: string) => api.get<ApiResponse<VolunteerProfile>>(`/volunteers/${id}`),
  getStats: (id: string) =>
    api.get<ApiResponse<{ totalHelps: number; avgRating: number; reviewsCount: number }>>(
      `/volunteers/${id}/stats`
    ),
  create: (data: {
    userId: string;
    bio?: string;
    locationLat?: number;
    locationLng?: number;
    categories?: string[];
  }) => api.post<ApiResponse<VolunteerProfile>>('/volunteers', data),
  update: (id: string, data: Partial<VolunteerProfile>) =>
    api.put<ApiResponse<VolunteerProfile>>(`/volunteers/${id}`, data),
  delete: (id: string) => api.delete(`/volunteers/${id}`),
};

// Assignments API
export const assignmentsApi = {
  list: (params?: {
    requestId?: string;
    volunteerId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => api.get<PaginatedResponse<Assignment>>('/assignments', { params }),
  getById: (id: string) => api.get<ApiResponse<Assignment>>(`/assignments/${id}`),
  create: (data: { requestId: string; volunteerId?: string }) =>
    api.post<ApiResponse<Assignment>>('/assignments', data),
  update: (id: string, data: { status: string }) =>
    api.put<ApiResponse<Assignment>>(`/assignments/${id}`, data),
  delete: (id: string) => api.delete(`/assignments/${id}`),
};

// Reviews API
export const reviewsApi = {
  list: (params?: { volunteerId?: string; limit?: number; offset?: number }) =>
    api.get<PaginatedResponse<Review>>('/reviews', { params }),
  getById: (id: string) => api.get<ApiResponse<Review>>(`/reviews/${id}`),
  create: (data: { assignmentId: string; rating: number; comment?: string }) =>
    api.post<ApiResponse<Review>>('/reviews', data),
  update: (id: string, data: { rating?: number; comment?: string }) =>
    api.put<ApiResponse<Review>>(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

// Users API
export const usersApi = {
  list: (params?: { limit?: number; offset?: number }) =>
    api.get<PaginatedResponse<User>>('/users', { params }),
  getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),
  update: (id: string, data: Partial<User>) => api.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};
