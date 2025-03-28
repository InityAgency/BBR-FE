import { api } from '../client/api.client';
import { API_ENDPOINTS } from '../endpoints';
import {
  LoginCredentials,
  User,
  ApiResponse,
  RequestResetPasswordResponse,
  VerifyOtpResponse,
  ResetPasswordResponse,
} from './types';
import Cookies from 'js-cookie';

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    let response;
    try {
      response = await api.post<ApiResponse<User>>(
        API_ENDPOINTS.auth.login,
        credentials,
        { withCredentials: true }
      );
      
      console.log('Login response:', response);
      
      if (!response.data) {
        throw new Error('Invalid response format');
      }

      const userData = response.data as unknown as User;

      if (userData && userData.id) {
        Cookies.set('userLoggedIn', 'true', { path: '/' });
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }

      throw new Error('User data is missing or invalid');
    } catch (error: any) {
      console.error('Login error details:', error);
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      throw Object.assign(new Error(message), { name: 'AuthError', stack: '' });
    }
  },

  async adminLogin(credentials: LoginCredentials): Promise<User> {
    const user = await this.login(credentials);
    
    if (!user) {
      this.clearAuthData();
      throw Object.assign(new Error('Login failed'), {
        name: 'AuthError',
        stack: '',
      });
    }

    const allowedRoles = ['admin'];
    const role = user.role?.name?.toLowerCase() || '';

    if (!allowedRoles.includes(role)) {
      this.clearAuthData();
      throw Object.assign(new Error('You do not have admin privileges'), {
        name: 'AuthError',
        stack: '',
      });
    }

    return user;
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.auth.logout, {}, {
        withCredentials: true,
        timeout: 5000,
        validateStatus: () => true
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Logout API error:', error);
      }
    } finally {
      this.clearAuthData();
      window.location.href = '/auth/login';
    }
  },

  clearAuthData(): void {
    Cookies.remove('userLoggedIn', { path: '/' });
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('resetToken');
  },

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return (
      Cookies.get('userLoggedIn') === 'true' ||
      localStorage.getItem('userLoggedIn') === 'true'
    );
  },

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userString = localStorage.getItem('user');
    try {
      return userString ? JSON.parse(userString) : null;
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
      return null;
    }
  },

  async requestResetPassword(email: string): Promise<string> {
    try {
      const response = await api.post<RequestResetPasswordResponse>(
        API_ENDPOINTS.auth.requestResetPassword,
        { email },
        { withCredentials: true }
      );

      const token = response.data.data?.resetToken;
      if (token) {
        localStorage.setItem('resetToken', token);
        return token;
      }

      throw new Error('Reset token not received');
    } catch (error: any) {
      throw Object.assign(new Error(error?.message || 'Password reset request failed'), {
        name: 'AuthError',
        stack: ''
      });
    }
  },

  async verifyOtp(otp: string): Promise<boolean> {
    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) throw new Error('Reset token not found.');

    try {
      const response = await api.post<VerifyOtpResponse>(
        API_ENDPOINTS.auth.verifyResetPassword,
        { otp, resetToken },
        { withCredentials: true }
      );

      return response.status === 200 || response.status === 201;
    } catch (error: any) {
      console.error('OTP verification error:', error);
      throw Object.assign(new Error(error?.message || 'OTP verification failed'), {
        name: 'AuthError',
        stack: ''
      });
    }
  },

  async resetPassword(newPassword: string): Promise<boolean> {
    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) throw new Error('Reset token not found.');

    try {
      const response = await api.post<ResetPasswordResponse>(
        API_ENDPOINTS.auth.resetPassword,
        { newPassword, resetToken },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        localStorage.removeItem('resetToken');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw Object.assign(new Error(error?.message || 'Password reset failed'), {
        name: 'AuthError',
        stack: ''
      });
    }
  }
};
