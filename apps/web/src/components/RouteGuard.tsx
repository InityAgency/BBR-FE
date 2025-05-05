"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { PuffLoader } from 'react-spinners';

export default function RouteGuard({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode,
  requiredRole: string
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        if (pathname !== '/login') {
          router.replace('/login');
        }
        return;
      }
      
      if (user.role.name !== requiredRole) {
        const targetPath = user.role.name === 'developer' 
          ? '/developer/dashboard' 
          : user.role.name === 'buyer' 
            ? '/buyer/dashboard' 
            : '/';
            
        if (pathname !== targetPath) {
          router.replace(targetPath);
        }
      }
    }
  }, [user, isLoading, requiredRole, router, pathname]);
  
  if (isLoading || !user || user.role.name !== requiredRole) {
    return <div className="flex items-center justify-center min-h-[30svh]">
      <PuffLoader color="#b3804c" size={60} />
    </div>;
  }
  
  return <>{children}</>;
}