import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8080/api/v1';
const PUBLIC_PATHS = ['/'];

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401s and refreshing tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // const currentPath = window.location.pathname;
    console.log('Error:', error);
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Skip token refresh if we're on a public path
      // if (PUBLIC_PATHS.includes(currentPath)) {
      //   return Promise.reject(error);
      // }

      try {
        // Attempt to refresh the token
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        // Retry the original request with new token (which will be in cookies)
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        // window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Pagination interface from backend
export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
  isFirst: boolean;
}

// Generic API response interface matching the backend structure
export interface ApiResponse<T = any> {
  timestamp: string;
  status: number;
  data: T;
  message: string;
  error?: string;
  path?: string;
  pagination?: Pagination;
}

// Generic API error response interface
export interface ApiErrorResponse {
  timestamp: string;
  path: string;
  status: number;
  error: string;
  message: string;
}

// Default API request config
const defaultConfig: AxiosRequestConfig = {
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Reusable API methods
const apiService = {
  // GET request
  get: async <T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(url, {
      ...defaultConfig,
      params,
      ...config,
    });
    return response.data;
  },

  // POST request
  post: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data, {
      ...defaultConfig,
      ...config,
    });
    return response.data;
  },

  // PUT request
  put: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.put(url, data, {
      ...defaultConfig,
      ...config,
    });
    return response.data;
  },

  // PATCH request
  patch: async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.patch(url, data, {
      ...defaultConfig,
      ...config,
    });
    return response.data;
  },

  // DELETE request
  delete: async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response: AxiosResponse<ApiResponse<T>> = await api.delete(url, {
      ...defaultConfig,
      ...config,
    });
    return response.data;
  },
};

export { apiService };
export default api;
