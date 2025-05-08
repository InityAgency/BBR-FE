"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import BuyerSidebar from "@/components/web/Panel/Buyer/Sidebar";
import PanelLayout from "@/components/web/PanelLayout";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="buyer">
      <PanelLayout>
        <div className="flex flex-col lg:flex-row w-full gap-4">
          <BuyerSidebar />
          <div className="flex-1">{children}</div>
        </div>
      </PanelLayout>
    </RouteGuard>
  );
}