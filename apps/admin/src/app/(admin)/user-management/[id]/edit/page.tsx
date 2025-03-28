"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UserForm from "@/components/admin/Users/Forms/UserForm";
import AdminLayout from "../../../AdminLayout";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import router from "next/router";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        console.log('Fetching user with ID:', userId);
        
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include' // This ensures cookies are sent with the request
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          if (response.status === 404) {
            console.log('User not found');
            throw new Error('User not found');
          }
          
          const errorData = await response.json().catch(() => null);
          console.error('Error response:', errorData);
          // Handle structured API error responses
          const errorMessage = errorData?.message || 
                              (errorData?.data && errorData.data.message) || 
                              `HTTP error! status: ${response.status}`;
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('API response:', result);
        // Extract user data from the response structure
        const data = result.data || result;
        
        // Format the user data for the form based on the exact API response structure
        const formattedData = {
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          roleId: data.role?.id,
          role: data.role?.name,
          password: "", // Empty for edit
          sendEmail: data.emailNotifications || false,
          status: data.status || "Active",
          profileImage: data.profileImage || null,
          // Additional fields from the API response
          emailVerified: data.emailVerified,
          company: data.company,
          emailNotifications: data.emailNotifications,
          pushNotifications: data.pushNotifications,
          signupMethod: data.signupMethod,
          // Notification preferences
          notifyBlogs: data.notifyBlogs,
          notifyLatestNews: data.notifyLatestNews,
          notifyMarketTrends: data.notifyMarketTrends
        };
        
        setUserData(formattedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.message || 'Failed to load user data');
        setUserData(null);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleUpdateUser = async (formData: any) => {
    console.log("handleUpdateUser starting with data:", formData);
    setLoading(true);
    
    try {
      // Create your payload
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        roleId: formData.roleId,
        status: formData.status || 'Active',
      };
      
      if (formData.password && formData.password.trim() !== '') {
        (payload as any).password = formData.password;
      }
      
      if (formData.profileImage) {
        (payload as any).profileImage = formData.profileImage;
      }
      
      console.log("Sending API request to:", `${API_BASE_URL}/api/${API_VERSION}/users/${userId}`);
      console.log("With payload:", payload);
      
      // Use the fetch API with explicit options
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      
      console.log("Response received:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Update successful:", data);
      toast.success("User updated successfully");
      
      // Navigate back to user list after successful update
      setTimeout(() => {
        router.push("/user-management");
      }, 1500);
      
      return data;
    } catch (error: unknown) {
      console.error("API error:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Failed to update user");
      } else {
        toast.error("Failed to update user");
      }
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