"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UserForm from "@/components/admin/Users/Forms/UserForm";
import AdminLayout from "../../../AdminLayout";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import router from "next/router";
import { usersService } from "@/lib/api/services/users.service";
import { User } from "@/lib/api/services/types";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await usersService.getUser(userId);
        const formattedData = {
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          roleId: data.role?.id,
          role: data.role?.name,
          password: "",
          sendEmail: data.emailNotifications || false,
          status: data.status || "ACTIVE",
          // profileImage: data.profileImage || null,
          emailVerified: data.emailVerified,
          company: data.company,
          emailNotifications: data.emailNotifications,
          pushNotifications: data.pushNotifications,
          signupMethod: data.signupMethod,
          notifyBlogs: data.notifyBlogs,
          notifyLatestNews: data.notifyLatestNews,
          notifyMarketTrends: data.notifyMarketTrends,
        };
        setUserData(formattedData);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching user:", err);
        setError(err.message || "Failed to load user data");
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };
    

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleUpdateUser = async (formData: any) => {
    setLoading(true);
  
    try {
      const payload: Partial<User> = {
        fullName: formData.fullName,
        email: formData.email,
        roleId: formData.roleId,
        status: formData.status,
        // profileImage: formData.profileImage,
      };
  
      if (formData.password?.trim()) {
        (payload as any).password = formData.password;
      }
  
      await usersService.updateUser(userId, payload);
  
      toast.success("User updated successfully");
      setTimeout(() => router.push("/user-management"), 1500);
    } catch (error: any) {
      console.error("API error:", error);
      toast.error(error.message || "Failed to update user");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <AdminLayout>
        <div>
          {/* Header loading skeleton */}
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-64 bg-muted/20" />
            <Skeleton className="h-9 w-32 bg-muted/20" />
          </div>
          
          {/* User details section */}
          <Skeleton className="h-8 w-40 mb-4 bg-muted/20" /> {/* Section title */}
          <div className="space-y-6 max-w-2xl">
            {/* Name field */}
            <div>
              <Skeleton className="h-5 w-24 mb-2 bg-muted/20" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-muted/20" /> {/* Input */}
            </div>
            
            {/* Email field */}
            <div>
              <Skeleton className="h-5 w-32 mb-2 bg-muted/20" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-muted/20" /> {/* Input */}
            </div>
            
            {/* Role field */}
            <div>
              <Skeleton className="h-5 w-20 mb-2 bg-muted/20" /> {/* Label */}
              <Skeleton className="h-10 w-full bg-muted/20" /> {/* Select */}
            </div>
            
            {/* Password section */}
            <div>
              <div className="flex justify-between mb-2">
                <Skeleton className="h-8 w-32 bg-muted/20" /> {/* Section title */}
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-40 bg-muted/20" /> {/* Reset link button */}
                  <Skeleton className="h-9 w-32 bg-muted/20" /> {/* Set password button */}
                </div>
              </div>
              <div>
                <Skeleton className="h-5 w-24 mb-2 bg-muted/20" /> {/* Label */}
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-full bg-muted/20" /> {/* Password input */}
                  <Skeleton className="h-10 w-56 bg-muted/20" /> {/* Generate button */}
                </div>
                  <Skeleton className="h-4 w-full mt-2 bg-muted/20" /> {/* Description */}
              </div>
            </div>
            
            {/* Profile image section */}
            <div className="mt-8">
              <Skeleton className="h-8 w-36 mb-4 bg-muted/20" /> {/* Section title */}
              <Skeleton className="h-[200px] w-full rounded-md bg-muted/20" /> {/* Image upload area */}
              <Skeleton className="h-4 w-64 mt-2 bg-muted/20" /> {/* Description */}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !userData) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h1 className="text-2xl font-semibold mb-2 text-destructive">Error Loading User</h1>
          <p className="text-muted-foreground">
            {error === 'User not found' 
              ? `User with ID ${userId} does not exist or has been deleted.`
              : 'Failed to load user data. Please try again later.'}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <UserForm 
        initialData={userData} 
        isEditing={true} 
        onSave={handleUpdateUser}
      />
    </AdminLayout>
  );
}