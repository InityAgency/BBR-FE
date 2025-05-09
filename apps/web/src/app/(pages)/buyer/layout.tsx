"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import BuyerSidebar from "@/components/web/Panel/Buyer/Sidebar";
import PanelLayout from "@/components/web/PanelLayout";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="buyer">
      <PanelLayout>
        {children}
      </PanelLayout>
    </RouteGuard>
  );
}