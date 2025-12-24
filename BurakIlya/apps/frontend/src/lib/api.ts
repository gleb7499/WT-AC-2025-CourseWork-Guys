import axios from "axios";
import type {
  ApiResponse,
  User,
  Category,
  HelpRequest,
  VolunteerProfile,
  Assignment,
  Review,
  AssignmentStatus,
  HelpRequestStatus
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function request<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  const { data } = await promise;
  if (data.status === "error") {
    const error = new Error(data.error.message);
    (error as any).code = data.error.code;
    (error as any).fields = data.error.fields;
    throw error;
  }
  return data.data;
}

// Auth
export function login(email: string, password: string) {
  return request<{ user: User; accessToken: string }>(api.post("/auth/login", { email, password }));
}

export function register(payload: { email: string; username: string; password: string }) {
  return request<{ user: User; accessToken: string }>(api.post("/auth/register", payload));
}

export function getMe() {
  return request<{ user: User }>(api.get("/users/me"));
}

// Categories
export function listCategories() {
  return request<{ items: Category[]; total: number; limit: number; offset: number }>(api.get("/categories"));
}

export function createCategory(payload: { name: string; description?: string; icon?: string }) {
  return request<Category>(api.post("/categories", payload));
}

export function updateCategory(id: string, payload: Partial<{ name: string; description?: string; icon?: string }>) {
  return request<Category>(api.put(`/categories/${id}`, payload));
}

export function deleteCategory(id: string) {
  return request<{ id: string }>(api.delete(`/categories/${id}`));
}

// Requests
export function listRequests(params?: { status?: HelpRequestStatus; categoryId?: string }) {
  return request<{ items: HelpRequest[]; total: number; limit: number; offset: number }>(api.get("/requests", { params }));
}

export function createRequest(payload: {
  title: string;
  description: string;
  categoryId: string;
  locationAddress: string;
  locationLat?: number;
  locationLng?: number;
}) {
  return request<HelpRequest>(api.post("/requests", payload));
}

export function updateRequest(id: string, payload: Partial<Omit<HelpRequest, "id" | "userId" | "categoryId">> & { categoryId?: string }) {
  return request<HelpRequest>(api.put(`/requests/${id}`, payload));
}

export function deleteRequest(id: string) {
  return request<{ id: string }>(api.delete(`/requests/${id}`));
}

// Volunteers
export function listVolunteers() {
  return request<{ items: VolunteerProfile[]; total: number; limit: number; offset: number }>(api.get("/volunteers"));
}

export function createVolunteer(payload: { bio?: string; locationLat?: number; locationLng?: number }) {
  return request<VolunteerProfile>(api.post("/volunteers", payload));
}

export function updateVolunteer(id: string, payload: Partial<{ bio?: string; locationLat?: number; locationLng?: number }>) {
  return request<VolunteerProfile>(api.put(`/volunteers/${id}`, payload));
}

export function deleteVolunteer(id: string) {
  return request<{ id: string }>(api.delete(`/volunteers/${id}`));
}

// Assignments
export function listAssignments(params?: { status?: AssignmentStatus; requestId?: string; volunteerId?: string }) {
  return request<{ items: Assignment[]; total: number; limit: number; offset: number }>(api.get("/assignments", { params }));
}

export function createAssignment(payload: { requestId: string; volunteerId?: string }) {
  return request<Assignment>(api.post("/assignments", payload));
}

export function updateAssignment(id: string, payload: { status: AssignmentStatus }) {
  return request<Assignment>(api.put(`/assignments/${id}`, payload));
}

export function deleteAssignment(id: string) {
  return request<{ id: string }>(api.delete(`/assignments/${id}`));
}

// Reviews
export function listReviews(params?: { volunteerId?: string }) {
  return request<{ items: Review[]; total: number; limit: number; offset: number }>(api.get("/reviews", { params }));
}

export function createReview(payload: { assignmentId: string; rating: number; comment?: string }) {
  return request<Review>(api.post("/reviews", payload));
}

export function updateReview(id: string, payload: Partial<{ rating: number; comment?: string }>) {
  return request<Review>(api.put(`/reviews/${id}`, payload));
}

export function deleteReview(id: string) {
  return request<{ id: string }>(api.delete(`/reviews/${id}`));
}
