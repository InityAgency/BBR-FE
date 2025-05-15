"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Company {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  website: string;
  image_id: string | null;
  contact_person_avatar_id: string | null;
  contact_person_full_name: string;
  contact_person_job_title: string;
  contact_person_email: string;
  contact_person_phone_number: string;
  contact_person_phone_number_country_code: string;
}

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  company?: Company;
  buyer?: {
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
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAccess: (path: string) => boolean;
  loginWithToken: (token: string) => Promise<void>; 
  setUser: (userData: User) => void; // Preimenovano iz setUserData za konzistentnost
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUserState(parsedUser);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Dodajemo useEffect za rukovanje Google callback-om
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code');
      if (code && pathname === '/api/v1/auth/google/callback') {
        setIsLoading(true);
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/google/callback?code=${code}`, {
            method: 'GET',
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Google authentication failed');
          }

          const data = await response.json();
          if (data.data) {
            setUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
            
            // Preusmeravanje na osnovu uloge
            const targetPath = data.data.role?.name === "developer" 
              ? '/developer/dashboard' 
              : data.data.role?.name === "buyer" 
                ? '/buyer/dashboard' 
                : '/';
                
            router.replace(targetPath);
          }
        } catch (error) {
          console.error('Google callback error:', error);
          router.replace('/login');
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleGoogleCallback();
  }, [searchParams, pathname, router]);

  const setUser = (userData: User) => {
    setUserState(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    document.cookie = `user=${JSON.stringify(userData)}; path=/`;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const response = await res.json();
      const userData = response.data;
      
      setUser(userData);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const targetPath = userData?.role?.name === "developer" 
        ? '/developer/dashboard' 
        : userData?.role?.name === "buyer" 
          ? '/buyer/dashboard' 
          : '/';
          
      if (pathname !== targetPath) {
        router.replace(targetPath);
      }
      
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcija za prijavljivanje sa tokenom (nakon verifikacije)
  const loginWithToken = async (token: string) => {
    setIsLoading(true);
    try {
      // Postavljamo token u cookie (može biti korisno za API pozive)
      document.cookie = `bbr-session=${token}; path=/`;
      
      // Dohvati podatke o korisniku sa tokenom
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/me`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('Failed to get user data with token');
      }
      
      const userData = await res.json();
      
      // Postavlja korisnika u stanje i localStorage/cookie
      setUser(userData.data);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Preusmeravanje na osnovu uloge
      let targetPath;
      if (userData.data?.role?.name === "developer") {
        targetPath = '/developer/onboarding';
      } else if (userData.data?.role?.name === "buyer") {
        targetPath = '/buyer/onboarding';
      } else {
        targetPath = '/';
      }
      
      if (pathname !== targetPath) {
        router.replace(targetPath);
      }
      
      return userData;
    } catch (error) {
      console.error('Login with token error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUserState(null);
      localStorage.removeItem('user');
      // document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      // document.cookie = 'bbr-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (pathname !== '/') {
        router.replace('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAccess = (path: string) => {
    if (!user) return false;
    
    if (path.startsWith('/developer') && user.role.name !== 'developer') {
      return false;
    }
    
    if (path.startsWith('/buyer') && user.role.name !== 'buyer') {
      return false;
    }
    
    return true;
  };

  const refreshUser = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });
  };
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      checkAccess, 
      loginWithToken, 
      setUser,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};