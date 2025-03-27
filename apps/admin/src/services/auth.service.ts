// apps/admin/src/services/auth.service.ts
import apiClient, { setLoggingOut, AuthError } from '@/lib/api.client';
import { API_ENDPOINTS } from '@/config/api.config';
import Cookies from 'js-cookie';

// Types based on actual API response
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  company?: {
    id: string;
    name: string;
  };
  avatar?: string;
}

interface ApiResponse {
  data: User;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

interface RequestResetPasswordResponse {
  data: {
    resetToken: string;
  };
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

interface VerifyOtpResponse {
  data: {
    verified: boolean;
  };
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

interface ResetPasswordResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

// Auth service methods
const AuthService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    let response;
    try {
      response = await apiClient.post<ApiResponse>(
        API_ENDPOINTS.AUTH.LOGIN, 
        credentials,
        { withCredentials: true }
      );
    } catch (error) {
      // Prevent error propagation and stack trace
      if (error instanceof Error && error.name === 'AuthError') {
        throw Object.assign(new Error(error.message), {
          name: 'AuthError',
          stack: ''
        });
      }
      throw Object.assign(new Error('Login failed'), {
        name: 'AuthError',
        stack: ''
      });
    }
    
    // Extract user data from the response
    const userData = response.data.data;
    
    if (userData && userData.id) {
      // Store session indicator and user info
      Cookies.set('userLoggedIn', 'true', { path: '/' });
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return userData;
  },

  /**
   * Login specifically as admin
   */
  async adminLogin(credentials: LoginCredentials): Promise<User> {
    let userData;
    try {
      userData = await this.login(credentials);
    } catch (error) {
      // Prevent error propagation and stack trace
      if (error instanceof Error) {
        throw Object.assign(new Error(error.message), {
          name: 'AuthError',
          stack: ''
        });
      }
      throw Object.assign(new Error('Login failed'), {
        name: 'AuthError',
        stack: ''
      });
    }
    
    const allowedRoles = ['admin'];
    const userRole = userData.role?.name?.toLowerCase() || '';
    
    if (!allowedRoles.includes(userRole)) {
      this.clearAuthData();
      throw Object.assign(new Error('You do not have admin privileges'), {
        name: 'AuthError',
        stack: ''
      });
    }
    
    return userData;
  },

  /**
   * Logout user - modified to ignore API errors
   */
  async logout(): Promise<void> {
    try {
      // Set logout flag immediately
      if (typeof setLoggingOut === 'function') {
        setLoggingOut(true);
      }
      
      try {

        await apiClient.post(
          API_ENDPOINTS.AUTH.LOGOUT, 
          {}, 
          { 
            withCredentials: true,
            timeout: 5000,
            validateStatus: () => true
          }
        );
      } catch (error) {
        // Ignorišemo greške sa API-ja ali beležimo ih u razvoju
        if (process.env.NODE_ENV !== 'production') {
          console.debug('Logout API error:', error);
        }
      }
      
      // Clear all local auth data
      this.clearAuthData();
      
      // Force redirect to login without any parameters
      window.location.href = '/auth/login';
      
      return Promise.resolve();
    } catch (error) {
      // Ignore any errors and resolve anyway
      return Promise.resolve();
    } finally {
      // Reset logout flag
      if (typeof setLoggingOut === 'function') {
        setLoggingOut(false);
      }
    }
  },

  /**
   * Clear all authentication data
   */
  clearAuthData(): void {
    // Clear both cookies and localStorage
    Cookies.remove('userLoggedIn', { path: '/' });
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check both cookie and localStorage for better compatibility
    const cookieLoggedIn = Cookies.get('userLoggedIn') === 'true';
    const localLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    return cookieLoggedIn || localLoggedIn;
  },

  /**
   * Get current user info
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Request password reset
   */
  async requestResetPassword(email: string): Promise<string> {
    try {
      const response = await apiClient.post<RequestResetPasswordResponse>(
        API_ENDPOINTS.AUTH.REQUEST_RESET_PASSWORD,
        { email },
        { withCredentials: true }
      );
      
      // Čuvamo resetToken u localStorage za korišćenje u sledećem koraku
      if (response.data?.data?.resetToken) {
        localStorage.setItem('resetToken', response.data.data.resetToken);
        return response.data.data.resetToken;
      }
      
      throw new Error('Reset token not received');
    } catch (error) {
      if (error instanceof Error) {
        throw Object.assign(new Error(error.message), {
          name: 'AuthError',
          stack: ''
        });
      }
      throw Object.assign(new Error('Password reset request failed'), {
        name: 'AuthError',
        stack: ''
      });
    }
  },
  
  /**
   * Verify OTP code
   */
  async verifyOtp(otp: string): Promise<boolean> {
    try {
      // Dobavljamo resetToken iz localStorage-a
      const resetToken = localStorage.getItem('resetToken');
      
      if (!resetToken) {
        throw new Error('Reset token not found. Please try resetting your password again.');
      }
      
      const response = await apiClient.post<VerifyOtpResponse>(
        API_ENDPOINTS.AUTH.VERIFY_RESET_PASSWORD,
        { 
          otp,
          resetToken 
        },
        { withCredentials: true }
      );
      
      console.log('OTP verification response:', response);
      
      // Proveravamo da li je verifikacija uspešna na osnovu status koda
      // 200 ili 201 znače uspeh bez obzira na strukturu podataka
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error instanceof Error) {
        throw Object.assign(new Error(error.message), {
          name: 'AuthError',
          stack: ''
        });
      }
      throw Object.assign(new Error('OTP verification failed'), {
        name: 'AuthError',
        stack: ''
      });
    }
  },

  /**
   * Reset password
   */
  async resetPassword(newPassword: string): Promise<boolean> {
    try {
      // Dobavljamo resetToken iz localStorage-a
      const resetToken = localStorage.getItem('resetToken');
      
      if (!resetToken) {
        throw new Error('Reset token not found. Please try resetting your password again.');
      }
      
      const response = await apiClient.post<ResetPasswordResponse>(
        API_ENDPOINTS.AUTH.RESET_PASSWORD,
        { 
          newPassword,
          resetToken 
        },
        { withCredentials: true }
      );
      
      console.log('Reset password response:', response);
      
      // Ako je zahtev uspešan, brišemo resetToken iz localStorage-a
      if (response.status === 200 || response.status === 201) {
        localStorage.removeItem('resetToken');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Reset password error:', error);
      if (error instanceof Error) {
        throw Object.assign(new Error(error.message), {
          name: 'AuthError',
          stack: ''
        });
      }
      throw Object.assign(new Error('Password reset failed'), {
        name: 'AuthError',
        stack: ''
      });
    }
  }
};

export default AuthService;