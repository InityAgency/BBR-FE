"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const GetMatchedButton: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const getDestination = () => {
    if (!isAuthenticated || !user) {
      return '/register';
    }

    switch (user.role.name) {
      case 'buyer':
        return '/buyer/ai-matchmaking-tool';
      case 'developer':
        return '/developer/dashboard';
      default:
        return '/register'; 
    }
  };

  return (
    <Link 
      href={getDestination()}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full lg:w-fit"
    >
      Get matched
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
};

export default GetMatchedButton;