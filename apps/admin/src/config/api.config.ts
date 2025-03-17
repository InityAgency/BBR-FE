// apps/admin/src/config/api.config.ts
/**
 * API Configuration
 */

// API base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.70.188.114';

// API version
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Timeout for API requests in milliseconds
export const API_TIMEOUT = 15000;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token'
  },
  USER: {
    PROFILE: '/user/profile'
  }
};

export default {
  API_URL,
  API_VERSION,
  API_TIMEOUT,
  API_ENDPOINTS
};