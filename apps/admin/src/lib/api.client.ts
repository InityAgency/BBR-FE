// apps/admin/src/lib/api.client.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_VERSION, API_TIMEOUT } from '@/config/api.config';
import Cookies from 'js-cookie';

// Custom error class
export class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AuthError';
    // Prevent stack trace from being generated
    Error.captureStackTrace(this, this.constructor);
  }
}

// Flag to track when we're in the logout process
let isLoggingOut = false;

// Create base axios instance
const apiClient = axios.create({
  baseURL: `/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
  withCredentials: true,
});

// Helper function to clear auth data
const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    Cookies.remove('userLoggedIn', { path: '/' });
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('user');
  }
};

// Helper to set the logging out flag
export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};

// Function to create error with proper handling
const createAuthError = (message: string, status?: number): AuthError => {
  // In production, show only generic messages
  if (process.env.NODE_ENV === 'production') {
    message = status === 401 ? 'Invalid credentials' : 'An error occurred';
  }
  
  const error = new AuthError(message, status);
  error.stack = '';
  return error;
};

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Remove sensitive headers in production
    if (process.env.NODE_ENV === 'production') {
      delete config.headers['X-Debug'];
      delete config.headers['X-Stack-Trace'];
    }
    return config;
  },
  () => Promise.reject(createAuthError('Request failed'))
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Skip error handling if we're logging out
    if (isLoggingOut) {
      return Promise.reject(createAuthError('Logout in progress'));
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(
        createAuthError('Network Error: Please check your internet connection')
      );
    }

    // Handle HTTP errors
    const { status, data } = error.response;
    let errorMessage = (data as any)?.message || 'An error occurred';

    // Special handling for 401
    if (status === 401) {
      clearAuthData();
      
      const currentPath = window.location.pathname;
      // Only show session expired message if we're not on login page and not logging out
      if (!currentPath.includes('/auth/login') && !isLoggingOut) {
        errorMessage = 'Your session has expired. Please log in again.';
        setTimeout(() => {
          window.location.href = '/auth/login?error=session_expired';
        }, 100);
      } else {
        // Don't show any error message during logout
        return Promise.reject(createAuthError(''));
      }
    }

    return Promise.reject(createAuthError(errorMessage, status));
  }
);

export default apiClient;