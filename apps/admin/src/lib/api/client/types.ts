import { AxiosError, AxiosResponse } from 'axios';

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  withCredentials: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  message?: string;
  code?: string;
  data?: any;
}

export interface RequestMetadata {
  startTime: number;
  endTime?: number;
}

export interface EndpointParams {
  id?: string;
  query?: Record<string, string | number | boolean>;
  withCredentials?: boolean;
  timeout?: number;
  validateStatus?: (status: number) => boolean;
}

export type EndpointBuilder = (params?: EndpointParams) => string;

export interface EndpointGroup {
  [key: string]: EndpointBuilder;
}

export interface ApiEndpoints {
  auth: {
    login: EndpointBuilder;
    logout: EndpointBuilder;
    me: EndpointBuilder;
    requestResetPassword: EndpointBuilder;
    verifyResetPassword: EndpointBuilder;
    resetPassword: EndpointBuilder;
  };
  users: {
    list: EndpointBuilder;
    create: EndpointBuilder;
    update: EndpointBuilder;
    delete: EndpointBuilder;
    details: EndpointBuilder;
    status: EndpointBuilder;
    resendVerificationEmail: EndpointBuilder;
  };
  brands: {
    list: EndpointBuilder;
    create: EndpointBuilder;
    update: EndpointBuilder;
    delete: EndpointBuilder;
    details: EndpointBuilder;
  };
  amenities: {
    list: EndpointBuilder;
    create: EndpointBuilder;
    update: EndpointBuilder;
    delete: EndpointBuilder;
    details: EndpointBuilder;
    uploadIcon: EndpointBuilder;
  };
  settings: {
    get: EndpointBuilder;
    update: EndpointBuilder;
  };
  reviews: {
    list: EndpointBuilder;
    details: EndpointBuilder;
    updateStatus: EndpointBuilder;
    delete: EndpointBuilder;
  };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthError extends ApiError {
  constructor(message: string, status?: number) {
    super(message, status);
    this.name = 'AuthError';
  }
}

export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
} 