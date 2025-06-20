'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function ListResidenceButton() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleListResidence = () => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    switch (user.role.name) {
      case 'developer':
        router.push('/developer/residences');
        break;
      case 'buyer':
        router.push('/buyer/dashboard');
        break;
      default:
        router.push('/login');
        break;
    }
  };
  console.log("user", user);
  return (
    <button 
      onClick={handleListResidence}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full lg:w-fit disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Loading...' : 'List Your Residence'}
      <ArrowRight className="w-4 h-4" />
    </button>
  );
} 