// apps/admin/src/components/SessionRecovery.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function SessionRecovery() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasAttemptedRecover, setHasAttemptedRecover] = useState(false);

  useEffect(() => {
    // Don't do anything if we're on an auth page
    if (pathname.startsWith('/auth/')) {
      return;
    }

    // Try to recover session if we're not authenticated and not loading
    if (!isAuthenticated && !isLoading && !hasAttemptedRecover) {
      console.log('Session recovery: Detected unauthenticated state on protected route');
      setHasAttemptedRecover(true);
      
      // Redirect to login with callback URL
      toast.error('Your session has expired. Please log in again.');
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router, hasAttemptedRecover]);

  // This component doesn't render anything
  return null;
}