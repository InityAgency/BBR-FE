import axios from 'axios';
import { API_VERSION, API_TIMEOUT, API_URL } from '../../../config/api.config';
import { ApiResponse, EndpointBuilder, EndpointParams } from './types';
import { requestInterceptor, responseInterceptor } from './interceptors';

// API Constants
export const API_CONSTANTS = {
  TIMEOUT: API_TIMEOUT,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  REFRESH_TOKEN_THRESHOLD: 5 * 60 * 1000, // 5 minutes
} as const;

// Determine base URL
const useProxy = false;
const baseURL = useProxy ? `/api/${API_VERSION}` : `${API_URL}/api/${API_VERSION}`;

// Create axios instance
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONSTANTS.TIMEOUT,
  withCredentials: true,
});

// Add interceptors
apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(
  (response) => response,
  responseInterceptor
);

// API methods
export const api = {
  get: async <T>(endpoint: EndpointBuilder, params?: EndpointParams): Promise<ApiResponse<T>> => {
    const url = endpoint(params);
    const response = await apiClient.get(url);
    return response.data;
  },

  post: async <T>(endpoint: EndpointBuilder, data?: any, params?: EndpointParams): Promise<ApiResponse<T>> => {
    const url = endpoint(params);
    const response = await apiClient.post(url, data);
    return response.data;
  },

  put: async <T>(endpoint: EndpointBuilder, data?: any, params?: EndpointParams): Promise<ApiResponse<T>> => {
    const url = endpoint(params);
    const response = await apiClient.put(url, data);
    return response.data;
  },

  delete: async <T>(endpoint: EndpointBuilder, params?: EndpointParams): Promise<ApiResponse<T>> => {
    const url = endpoint(params);
    const response = await apiClient.delete(url);
    return response.data;
  },

  patch: async <T>(endpoint: EndpointBuilder, data?: any, params?: EndpointParams): Promise<ApiResponse<T>> => {
    const url = endpoint(params);
    const response = await apiClient.patch(url, data);
    return response.data;
  },
};

export default apiClient; 