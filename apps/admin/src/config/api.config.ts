// apps/admin/src/config/api.config.ts
/**
 * API Configuration
 */

// API base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bbrapi.inity.space';

// API version
export const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

// Timeout for API requests in milliseconds
export const API_TIMEOUT = 15000;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/admin',
    LOGOUT: '/auth/logout',
    REQUEST_RESET_PASSWORD: '/auth/request-reset-password',
    VERIFY_RESET_PASSWORD: '/auth/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/user/profile',
    USERS: '/users',
    USER_STATUS: (userId: string) => `/users/${userId}/status`
  }
};

export default {
  API_URL,
  API_VERSION,
  API_TIMEOUT,
  API_ENDPOINTS
};