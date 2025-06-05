"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PuffLoader } from 'react-spinners';
import { toast } from 'sonner';

export default function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, user } = useAuth();
  
  const type = searchParams.get('type'); // 'login' ili 'register'
  const role = searchParams.get('role');

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Odmah pozivamo refresh da dobijemo podatke sa /me endpoint-a
        await refreshUser();
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Authentication failed. Please try again.');
        router.replace('/login');
      }
    };

    handleAuth();
  }, [refreshUser]);

  // Kada se user učita, preusmeravamo ga
  useEffect(() => {
    if (user) {
      let targetPath = '/';
      
      if (type === 'register') {
        // Za registraciju idemo na onboarding
        targetPath = user.role?.name === 'developer' 
          ? '/developer/onboarding' 
          : user.role?.name === 'buyer' 
            ? '/buyer/onboarding'
            : '/onboarding';
      } else {
        // Za login idemo na dashboard
        targetPath = user.role?.name === 'developer' 
          ? '/developer/dashboard' 
          : user.role?.name === 'buyer' 
            ? '/buyer/dashboard'
            : '/';
      }

      router.replace(targetPath);
    }
  }, [user, type, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <PuffLoader color="#b3804c" size={60} />
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}