import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError, AuthError, NetworkError, ErrorResponse } from '../client/types';
import { getAuthToken, setAuthToken, clearAuthData, generateRequestId } from '../utils/auth';
import { logApiRequest } from '../utils/logger';
import { API_ENDPOINTS } from '../endpoints';
import apiClient from './api.client';

let isLoggingOut = false;

export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;
};

export const handleApiError = (error: AxiosError): ApiError => {
  if (!error.response) {
    return new NetworkError('Network Error: Please check your internet connection');
  }

  const { status, data } = error.response;
  const errorData = data as ErrorResponse;
  const message = errorData?.message || 'An error occurred';

  switch (status) {
    case 401:
      return new AuthError('Authentication failed', 401);
    case 403:
      return new ApiError('Access denied', 403);
    case 404:
      return new ApiError('Resource not found', 404);
    case 500:
      return new ApiError('Server error', 500);
    default:
      return new ApiError(message, status);
  }
};

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Dodavanje tokena u header
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Dodavanje request ID-a
  config.headers['X-Request-ID'] = generateRequestId();

  // Logovanje u development modu
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
    });
  }

  return config;
};

export const responseInterceptor = async (error: AxiosError) => {
  // Preskačemo error handling tokom logouta
  if (isLoggingOut) {
    return Promise.resolve({ data: null });
  }

  // Ako je 401 (Unauthorized), preusmeravamo na login
  if (error.response?.status === 401 && !isLoggingOut) {
    clearAuthData();
    window.location.href = '/auth/login';
    return Promise.reject(error);
  }

  return Promise.reject(handleApiError(error));
}; 