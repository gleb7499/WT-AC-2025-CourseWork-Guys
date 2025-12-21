import api from './client';
import type {
  LoginData,
  RegisterData,
  User,
  Room,
  Booking,
  CreateBookingData,
  UpdateBookingData,
  CreateRoomData,
  UpdateRoomData,
  ApiResponse,
  PaginatedResponse,
} from '../shared/types';

// Auth API
export const authApi = {
  register: (data: RegisterData) =>
    api.post<ApiResponse<User>>('/auth/register', data),
  
  login: (data: LoginData) =>
    api.post<ApiResponse<{ accessToken: string; refreshToken: string; user: User }>>('/auth/login', data),
  
  refresh: (refreshToken: string) =>
    api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken }),
};

// Users API
export const usersApi = {
  getAll: (params?: { limit?: number; offset?: number }) =>
    api.get<ApiResponse<PaginatedResponse<User>>>('/users', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<User>>(`/users/${id}`),
  
  create: (data: RegisterData) =>
    api.post<ApiResponse<User>>('/users', data),
  
  update: (id: string, data: Partial<RegisterData>) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/users/${id}`),
};

// Rooms API
export const roomsApi = {
  getAll: (params?: {
    capacity?: number;
    equipment?: string;
    location?: string;
    limit?: number;
    offset?: number;
  }) =>
    api.get<ApiResponse<PaginatedResponse<Room>>>('/rooms', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<Room>>(`/rooms/${id}`),
  
  create: (data: CreateRoomData) =>
    api.post<ApiResponse<Room>>('/rooms', data),
  
  update: (id: string, data: UpdateRoomData) =>
    api.put<ApiResponse<Room>>(`/rooms/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/rooms/${id}`),
};

// Bookings API
export const bookingsApi = {
  getAll: (params?: {
    roomId?: string;
    userId?: string;
    date?: string;
    status?: 'ACTIVE' | 'CANCELLED';
    limit?: number;
    offset?: number;
  }) =>
    api.get<ApiResponse<PaginatedResponse<Booking>>>('/bookings', { params }),
  
  getById: (id: string) =>
    api.get<ApiResponse<Booking>>(`/bookings/${id}`),
  
  create: (data: CreateBookingData) =>
    api.post<ApiResponse<Booking>>('/bookings', data),
  
  update: (id: string, data: UpdateBookingData) =>
    api.put<ApiResponse<Booking>>(`/bookings/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/bookings/${id}`),
};

// Schedule API
export const scheduleApi = {
  get: (params?: {
    roomId?: string;
    date?: string;
    from?: string;
    to?: string;
  }) =>
    api.get<ApiResponse<Booking[]>>('/schedule', { params }),
  
  checkConflicts: (params: {
    roomId: string;
    startTime: string;
    endTime: string;
  }) =>
    api.get<ApiResponse<{ hasConflicts: boolean; conflicts: Booking[] }>>('/schedule/conflicts', { params }),
};
