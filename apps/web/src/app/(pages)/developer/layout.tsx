"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/RouteGuard";

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="developer">
      {children}
    </RouteGuard>
  );
}