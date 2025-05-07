"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/RouteGuard";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="buyer">
      {children}
    </RouteGuard>
  );
}