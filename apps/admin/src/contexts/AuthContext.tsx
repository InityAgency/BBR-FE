// apps/admin/src/contexts/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/services';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

// Types
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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, callbackUrl?: string) => Promise<User>;
  adminLogin: (email: string, password: string, callbackUrl?: string) => Promise<User>;
  logout: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check auth status on mount - important for session-based auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isLoggedIn()) {
          // Get user from storage
          const userData = authService.getCurrentUser();
          if (userData) {
            setUser(userData);
          } else {
            // If we have a session but no user data, logout
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Regular login function
  const login = async (email: string, password: string, callbackUrl: string = '/dashboard'): Promise<User> => {
    setIsLoading(true);
    try {
      const userData = await authService.login({ email, password });
      setUser(userData);
      
      // Set the cookie for middleware to recognize user is logged in
      Cookies.set('userLoggedIn', 'true', { path: '/' });
      
      toast.success("Login successful");
      
      // Using setTimeout to ensure state updates complete and toast is visible
      // before navigation
      setTimeout(() => {
        router.push(callbackUrl);
      }, 500);
      
      return userData;
    } catch (error: any) {
      // Handle network error
      if (error.message && error.message.includes('Network Error')) {
        toast.error('Network error. Please check your internet connection and try again.');
      } else {
        // Handle other errors
        const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin-specific login
  const adminLogin = async (email: string, password: string, callbackUrl: string = '/dashboard'): Promise<User> => {
    setIsLoading(true);
    try {
      const userData = await authService.adminLogin({ email, password });
      setUser(userData);
      
      // Set the cookie for middleware to recognize user is logged in
      Cookies.set('userLoggedIn', 'true', { path: '/' });
      
      toast.success("Admin login successful");
      
      // Using setTimeout to ensure state updates complete and toast is visible
      // before navigation
      setTimeout(() => {
        // Only log in development
        if (process.env.NODE_ENV !== 'production') {
          console.debug('Redirecting to:', callbackUrl);
        }
        router.push(callbackUrl);
      }, 500);
      
      return userData;
    } catch (error) {
      // Handle errors without exposing internal details
      let errorMessage: string;
      
      if (process.env.NODE_ENV === 'production') {
        // In production, show only generic messages
        errorMessage = 'Invalid credentials';
      } else {
        errorMessage = error instanceof Error ? error.message : 'Login failed';
      }
      
      toast.error(errorMessage);
      
      // Create a clean error without stack trace
      const cleanError = Object.assign(new Error(errorMessage), {
        name: 'AuthError',
        stack: ''
      });
      
      throw cleanError;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Call logout and wait for API call to complete
      await authService.logout();
      
      // Set user to null to update UI
      setUser(null);
      
      // Redirect to login page
      router.push('/auth/login');
    } catch (error) {
      // Only log in development
      if (process.env.NODE_ENV !== 'production') {
        console.debug('Logout error:', error);
      }
      
      // Always redirect to login without error
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    adminLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};