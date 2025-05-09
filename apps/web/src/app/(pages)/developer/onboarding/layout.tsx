"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import PanelLayout from "@/components/web/PanelLayout";

export default function DeveloperOnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <RouteGuard requiredRole="developer">
            <PanelLayout>
                <div className="flex-1">{children}</div>
            </PanelLayout>
        </RouteGuard>
    );
} 