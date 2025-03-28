import { api } from '../api/client/api.client';
import { API_ENDPOINTS } from '../api/endpoints';
import {
  LoginCredentials,
  User,
  ApiResponse,
  RequestResetPasswordResponse,
  VerifyOtpResponse,
  ResetPasswordResponse,
} from '../api/services/types';
import Cookies from 'js-cookie';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await api.post<ApiResponse<User>>(
        API_ENDPOINTS.auth.login,
        credentials,
        { withCredentials: true }
      );
      const user = response.data.data;
      if (user?.id) Cookies.set('userLoggedIn', 'true');
      return user;
    } catch (error: any) {
      const message = error?.message || 'Login failed';
      throw Object.assign(new Error(message), { name: 'AuthError', stack: '' });
    }
  },

  logout: async (): Promise<void> => {
    await api.post(API_ENDPOINTS.auth.logout, {}, { withCredentials: true });
    Cookies.remove('userLoggedIn');
  },

  requestResetPassword: async (email: string): Promise<RequestResetPasswordResponse> => {
    const response = await api.post<ApiResponse<RequestResetPasswordResponse>>(
      API_ENDPOINTS.auth.requestResetPassword,
      { email }
    );
    return response.data.data;
    
  },

  verifyOtp: async (email: string, code: string): Promise<VerifyOtpResponse> => {
    const response = await api.post<ApiResponse<VerifyOtpResponse>>(
      API_ENDPOINTS.auth.verifyResetPassword,
      { email, code }
    );
    return response.data.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
    const response = await api.post<ApiResponse<ResetPasswordResponse>>(
      API_ENDPOINTS.auth.resetPassword,
      { token, newPassword }
    );
    return response.data.data;
  },
};
