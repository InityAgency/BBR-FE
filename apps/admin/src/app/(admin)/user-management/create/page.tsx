"use client";

import AdminLayout from "../../AdminLayout";
import UserForm from "@/components/admin/Users/Forms/UserForm";
import { useEffect, useState } from "react";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function UsersCreate() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  const router = useRouter();

  // Check if user has permission to create users
  useEffect(() => {
    const checkPermission = async () => {
      try {
        setIsLoading(true);
        
        // Check user permissions - this is just an example, adjust according to your API
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/users/me/permissions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 403) {
            setHasPermission(false);
            toast.error("You don't have permission to create users");
            setTimeout(() => router.push("/user-management"), 2000);
          }
        } else {
          setHasPermission(true);
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
        // If we can't check permissions, assume user has permission
        // (backend will reject unauthorized requests anyway)
        setHasPermission(true);
      } finally {
        setIsLoading(false);
      }
    };

    // In a real application, uncomment this to check permissions
    // checkPermission();
    
    // For now, just set loading to false immediately
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="py-6">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="space-y-6 max-w-2xl">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!hasPermission) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-muted-foreground">
            You don't have permission to create users. Redirecting...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <UserForm />
    </AdminLayout>
  );
}