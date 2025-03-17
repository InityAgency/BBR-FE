"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth state to be determined
    if (!isLoading) {
      // Redirect based on auth status
      if (isAuthenticated) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
  }, [router, isAuthenticated, isLoading]);

  // Show nothing during the redirect
  return null;
}