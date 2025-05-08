"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import DeveloperSidebar from "@/components/web/Panel/Developer/Sidebar";
import PanelLayout from "@/components/web/PanelLayout";

export default function DeveloperLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole="developer">
      <PanelLayout>
        <div className="flex flex-col lg:flex-row w-full gap-4">
          <DeveloperSidebar />
          <div className="flex-1">{children}</div>
        </div>
      </PanelLayout>
    </RouteGuard>
  );
}