'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function ListResidenceButton() {
  const { user } = useAuth();
  const router = useRouter();

  const handleListResidence = () => {
    if (user) {
      if (user.role?.name === "developer") {
        router.push('/developer/dashboard');
      } else if (user.role?.name === "buyer") {
        router.push('/buyer/dashboard');
      }
    } else {
      router.push('/register');
    }
  };

  return (
    <button 
      onClick={handleListResidence}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 w-full lg:w-fit"
    >
      List Your Residence
      <ArrowRight className="w-4 h-4" />
    </button>
  );
} 