import { ApiResponse as BaseApiResponse } from '../client/types';

export interface User {
  id: string;
  fullName: string;
  email: string;
  receieveLuxuryInsights: boolean;
  notifyLatestNews: boolean;
  notifyMarketTrends: boolean;
  notifyBlogs: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  signupMethod: string;
  emailVerified: boolean;
  agreedTerms: boolean;
  status: string;
  buyer: {
    image_id: string | null;
    budgetRangeFrom: number | null;
    budgetRangeTo: number | null;
    phoneNumber: string | null;
    preferredContactMethod: string | null;
    currentLocation: {
      id: string | null;
      name: string | null;
      code: string | null;
    };
    preferredResidenceLocation: {
      id: string | null;
      name: string | null;
      code: string | null;
    };
  } | null;
  company: {
    id: string;
    name: string;
    address?: string;
    phone_number?: string;
    website?: string;
    image_id?: string | null;
    contact_person_avatar_id?: string | null;
    contact_person_full_name?: string;
    contact_person_job_title?: string;
    contact_person_email?: string;
    contact_person_phone_number?: string;
    contact_person_phone_number_country_code?: string;
  } | null;
  role: {
    id: string;
    name: string;
  };
  roleId?: string;
  profileImage?: string | null;
  unitTypes: Array<{
    id: string;
    name: string;
  }> | null;
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
  data: T | T[];
  statusCode: number;
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
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

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
  statusCode?: number;
  message?: string;
  timestamp?: string;
  path?: string;
};

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
} 