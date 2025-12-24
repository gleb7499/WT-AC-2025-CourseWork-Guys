import type { ApiResponse } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public fields?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>)
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const json: ApiResponse<T> = await response.json();

  if (json.status === "error" && json.error) {
    throw new ApiError(json.error.code, json.error.message, json.error.fields);
  }

  if (!json.data) {
    throw new ApiError("unknown_error", "No data in response");
  }

  return json.data;
}

export const api = {
  auth: {
    register: (data: { email: string; username: string; password: string }) =>
      fetchApi<{ user: any; accessToken: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
      }),
    login: (data: { email: string; password: string }) =>
      fetchApi<{ user: any; accessToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
      })
  },
  users: {
    me: () => fetchApi<{ user: any }>("/users/me")
  },
  categories: {
    list: () => fetchApi<any>("/categories"),
    create: (data: { name: string; description?: string }) =>
      fetchApi<any>("/categories", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ name: string; description?: string }>) =>
      fetchApi<any>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/categories/${id}`, { method: "DELETE" })
  },
  requests: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return fetchApi<any>(`/requests${query}`);
    },
    get: (id: string) => fetchApi<any>(`/requests/${id}`),
    create: (data: {
      title: string;
      description: string;
      categoryId: string;
      locationAddress: string;
      locationLat?: number;
      locationLng?: number;
    }) => fetchApi<any>("/requests", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<any>) =>
      fetchApi<any>(`/requests/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/requests/${id}`, { method: "DELETE" })
  },
  volunteers: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return fetchApi<any>(`/volunteers${query}`);
    },
    get: (id: string) => fetchApi<any>(`/volunteers/${id}`),
    create: (data: { userId?: string; bio?: string }) =>
      fetchApi<any>("/volunteers", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ bio?: string }>) =>
      fetchApi<any>(`/volunteers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/volunteers/${id}`, { method: "DELETE" })
  },
  assignments: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return fetchApi<any>(`/assignments${query}`);
    },
    get: (id: string) => fetchApi<any>(`/assignments/${id}`),
    create: (data: { requestId: string; volunteerId?: string }) =>
      fetchApi<any>("/assignments", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: { status: string }) =>
      fetchApi<any>(`/assignments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/assignments/${id}`, { method: "DELETE" })
  },
  reviews: {
    list: (params?: Record<string, string>) => {
      const query = params ? `?${new URLSearchParams(params).toString()}` : "";
      return fetchApi<any>(`/reviews${query}`);
    },
    get: (id: string) => fetchApi<any>(`/reviews/${id}`),
    create: (data: { assignmentId: string; rating: number; comment?: string }) =>
      fetchApi<any>("/reviews", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<{ rating: number; comment?: string }>) =>
      fetchApi<any>(`/reviews/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => fetchApi<any>(`/reviews/${id}`, { method: "DELETE" })
  }
};

export { ApiError };
