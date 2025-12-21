export interface User {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  createdAt: string;
  updatedAt?: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  equipment?: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'ACTIVE' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  room?: {
    id: string;
    name: string;
    location: string;
  };
  user?: {
    id: string;
    username: string;
    role?: string;
  };
}

export interface ApiResponse<T = unknown> {
  status: 'ok' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export interface CreateBookingData {
  roomId: string;
  startTime: string;
  endTime: string;
  purpose: string;
}

export interface UpdateBookingData {
  startTime?: string;
  endTime?: string;
  purpose?: string;
}

export interface CreateRoomData {
  name: string;
  description?: string;
  capacity: number;
  equipment?: string;
  location: string;
}

export interface UpdateRoomData {
  name?: string;
  description?: string;
  capacity?: number;
  equipment?: string;
  location?: string;
}
