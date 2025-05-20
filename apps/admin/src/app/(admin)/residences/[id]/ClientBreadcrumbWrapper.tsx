'use client';
import { useBreadcrumb } from "@/components/admin/Breadcrumb";
import { useEffect } from "react";

export default function ClientBreadcrumbWrapper({ id, name, children }: { id: string, name: string, children: React.ReactNode }) {
  const { setCustomBreadcrumb, resetCustomBreadcrumb } = useBreadcrumb();
  useEffect(() => {
    setCustomBreadcrumb(id, name);
    return () => {
      resetCustomBreadcrumb(id);
    };
  }, [id, name, setCustomBreadcrumb, resetCustomBreadcrumb]);
  return <>{children}</>;
} 