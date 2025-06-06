"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAccess: (path: string) => boolean;
  loginWithToken: (token: string) => Promise<void>; 
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper funkcije za cookie management
const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
};

const deleteAllAuthCookies = () => {
  deleteCookie('bbr-session');
  deleteCookie('userLoggedIn');
  // Pokušaj brisanja sa različitim putanjama u slučaju da je cookie postavljen drugačije
  document.cookie = 'bbr-session=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;';
  document.cookie = 'bbr-session=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname + ';';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Pokušavamo da učitamo korisnika iz sessionStorage za brže inicijalno učitavanje
    if (typeof window !== 'undefined') {
      const savedUser = sessionStorage.getItem('user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          sessionStorage.removeItem('user');
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setUser(data.data);
          // Čuvamo u sessionStorage za brže sledeće učitavanje
          sessionStorage.setItem('user', JSON.stringify(data.data));
        }
      } else {
        setUser(null);
        sessionStorage.removeItem('user');
        // Obriši cookie-je ako API vraća grešku
        deleteAllAuthCookies();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      sessionStorage.removeItem('user');
      deleteAllAuthCookies();
    }
  };

  // Inicijalno učitavanje u pozadini
  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
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
      
      await fetchUser();
      
      const targetPath = user?.role?.name === "developer" 
        ? '/developer/dashboard' 
        : user?.role?.name === "buyer" 
          ? '/buyer/dashboard' 
          : '/';
          
      if (pathname !== targetPath) {
        router.replace(targetPath);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = async (token: string) => {
    setLoading(true);
    try {
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
      
      await fetchUser();
      
      const targetPath = user?.role?.name === "developer" 
        ? '/developer/onboarding' 
        : user?.role?.name === "buyer" 
          ? '/buyer/onboarding' 
          : '/';
      
      if (pathname !== targetPath) {
        router.replace(targetPath);
      }
    } catch (error) {
      console.error('Login with token error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/${process.env.NEXT_PUBLIC_API_VERSION}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Uvek obriši sve podatke i cookie-je
      setUser(null);
      sessionStorage.removeItem('user');
      deleteAllAuthCookies();
      setLoading(false);
      
      if (pathname !== '/') {
        router.replace('/');
      }
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
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: !!user,
      login, 
      logout, 
      checkAccess, 
      loginWithToken,
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