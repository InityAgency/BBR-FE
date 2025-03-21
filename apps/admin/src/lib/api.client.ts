import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_VERSION, API_TIMEOUT, API_URL } from '@/config/api.config';
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

// Determine correct base URL
const useProxy = false; 
const baseURL = useProxy ? `/api/${API_VERSION}` : `${API_URL}/api/${API_VERSION}`;

// Create base axios instance
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
  withCredentials: true,
});

// Log configuration
// console.log('API Client Configuration:', { 
//   baseURL, 
//   useProxy,
//   withCredentials: true,
//   API_URL,
//   API_VERSION
// });

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
    // Get cookie values directly for debugging
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    console.log('Request Cookies:', cookies);
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    
    // Make sure withCredentials is always true
    config.withCredentials = true;
    
    return config;
  },
  (error) => {
    console.error('Request configuration error:', error);
    return Promise.reject(createAuthError('Request configuration failed'));
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response success:', { 
      url: response.config.url,
      status: response.status,
      hasData: !!response.data 
    });
    return response;
  },
  (error: AxiosError) => {
    // Completely skip ALL error handling during logout
    if (isLoggingOut) {
      return Promise.resolve({ data: null });
    }

    // Log error details
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });

    // Handle network errors
    if (!error.response) {
      return Promise.reject(
        createAuthError('Network Error: Please check your internet connection')
      );
    }

    // Handle HTTP errors
    const { status, data } = error.response;
    let errorMessage = (data as any)?.message || 'An error occurred';

    // Special handling for 401 - we'll return a specific error but not redirect
    if (status === 401 && !isLoggingOut) {
      return Promise.reject(
        createAuthError('You do not have permission to access this resource.', 401)
      );
    }

    return Promise.reject(createAuthError(errorMessage, status));
  }
);

export default apiClient;