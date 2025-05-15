"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PuffLoader } from 'react-spinners';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      const targetPath = user.role?.name === "developer" 
        ? '/developer/dashboard' 
        : user.role?.name === "buyer" 
          ? '/buyer/dashboard' 
          : '/';
          
      router.replace(targetPath);
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-[30svh]">
      <PuffLoader color="#b3804c" size={60} />
    </div>
  );
} 