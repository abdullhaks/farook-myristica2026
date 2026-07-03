import axios, { AxiosError } from 'axios';
import { useAdminStore } from '../store/useAdminStore';


const API_BASE = import.meta.env.VITE_BACKEND_URL as string | undefined;

console.log(" api base" ,API_BASE);

const BASE_URL = API_BASE ?? 'https://myristica2026api.onrender.com';
// const BASE_URL = 'https://myristica2026api.onrender.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Important for cookies
});

// Interceptor to handle 401 Unauthorized errors and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If error is 401 and it's not a retry already, and not a login request
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      originalRequest.url !== '/admin/login'
    ) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        await axios.post(`${BASE_URL}/admin/refresh-token`, {}, {
          withCredentials: true,
        });
        
        // If successful, retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, likely refresh token is expired or missing.
        // User should be logged out. We will handle this in the UI (e.g. Zustand store).
        useAdminStore.getState().setLogout();
        
        // For now, we can just reject the promise.
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export class ApiError extends Error {
  statusCode?: number;
  errors?: any;

  constructor(message: string, statusCode?: number, errors?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Wrapper to keep backward compatibility with existing codebase
export async function request<T = any>(
  path: string,
  options?: RequestInit
): Promise<T> {
  try {
    const method = options?.method || 'GET';
    const data = options?.body ? JSON.parse(options.body as string) : undefined;
    const headers = options?.headers as any;

    const response = await apiClient({
      url: path,
      method,
      data,
      headers,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 429) {
        throw new ApiError('Too many requests. Please try again after one minute.', 429);
      }
      throw new ApiError(
        error.response.data.message || 'An error occurred',
        error.response.status,
        error.response.data.errors
      );
    }
    throw new ApiError(
      'Failed to connect to the server. Please ensure the backend is running.',
      500
    );
  }
}
