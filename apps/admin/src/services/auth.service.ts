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
    
    const allowedRoles = ['admin', 'developer'];
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
  }
};

export default AuthService;