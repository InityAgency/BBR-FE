import { ApiResponse as BaseApiResponse } from '../client/types';

export interface User {
  id: string;
  fullName: string;
  email: string;
  notifyLatestNews: boolean;
  notifyMarketTrends: boolean;
  notifyBlogs: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  signupMethod: string;
  emailVerified: boolean;
  agreedTerms: boolean;
  status: string;
  buyer: any | null;
  company: {
    id: string;
    name: string;
  } | null;
  role: {
    id: string;
    name: string;
  };
  lifestyles: any | null;
  unitTypes: any | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface RequestResetPasswordResponse {
  data: {
    resetToken: string;
  };
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface VerifyOtpResponse {
  data: {
    verified: boolean;
  };
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface ResetPasswordResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
} 