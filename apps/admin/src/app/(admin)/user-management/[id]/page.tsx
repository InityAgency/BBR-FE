"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "../../AdminLayout";
import UserService from "@/services/user.service";
import { User } from "@/app/types/models/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, Mail, Phone, User as UserIcon, MapPin, DollarSign, Bell, BellOff, Clock, Building } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UserHeader } from "@/components/admin/Headers/UserHeader";

interface ExtendedUser extends User {
  buyer?: {
    image_id?: string | null;
    budgetRangeFrom?: number;
    budgetRangeTo?: number;
    phoneNumber?: string;
    preferredContactMethod?: string;
    currentLocation?: {
      id: string;
      name: string;
      code: string;
    };
    preferredResidenceLocation?: {
      id: string;
      name: string;
      code: string;
    };
  };
  unitTypes?: Array<{
    id: string;
    name: string;
  }>;
  notifyLatestNews?: boolean;
  notifyMarketTrends?: boolean;
  notifyBlogs?: boolean;
  pushNotifications?: boolean;
  emailNotifications?: boolean;
  signupMethod?: string;
  agreedTerms?: boolean;
}

export default function UserDetailsPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await UserService.getUserById(userId);
        setUser(userData as ExtendedUser);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Unable to load user data");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getUserInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      // Call your API here
      // await UserService.updateUserStatus(userId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleResendInvitation = async () => {
    try {
      // Call your API here
      // await UserService.resendInvitation(userId);
      toast.success("Invitation sent successfully");
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <UserHeader 
        user={user} 
        loading={loading}
        onStatusChange={handleStatusChange}
        onResendInvitation={handleResendInvitation}
      />

      {error ? (
        <Card className="bg-destructive/10 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Profile Card - 1/3 width on large screens */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg">User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <UserProfileSkeleton />
              ) : (
                <>
                  <div className="flex items-start gap-4 w-full">
                    <Avatar className="h-16 w-16 rounded-lg">
                      <AvatarImage src={user?.buyer?.image_id ? `https://example.com/images/${user.buyer.image_id}` : ""} alt={user?.fullName} className="rounded-lg" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl rounded-lg">
                        {getUserInitials(user?.fullName || "")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex flex-col gap-1 pt-1">
                      <h3 className="text-xl font-semibold">{user?.fullName}</h3>
                      <Badge className="capitalize w-fit px-2 py-1" variant="outline">{user?.role?.name}</Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm flex items-center gap-1">
                        Email verification: 
                        {user?.emailVerified ? (
                          <Badge variant="default" className="bg-green-900/20 text-green-300 ml-1">Verified</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-900/20 text-yellow-300 ml-1">Not Verified</Badge>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm break-all">{user?.email}</span>
                    </div>
                    
                    {user?.buyer?.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.buyer.phoneNumber}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Joined: {formatDate(user?.createdAt || "")}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last update: {formatDate(user?.updatedAt || "")}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Details & Preferences - 2/3 width on large screens */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <CardTitle className="text-lg">Details & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <UserDetailsSkeleton />
              ) : (
                <>
                  {/* Authentication Info */}
                  <div>
                    <h3 className="text-md font-medium mb-3">Authentication</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-md">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Signup Method</p>
                          <p className="text-sm font-medium capitalize">{user?.signupMethod || "Email"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-md">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Company</p>
                          <p className="text-sm font-medium">{user?.company || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buyer Info - Only show if user is a buyer */}
                  {user?.buyer && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-md font-medium mb-3">Buyer Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-md">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Current Location</p>
                              <p className="text-sm font-medium">{user.buyer.currentLocation?.name || "Not specified"}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-md">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Preferred Location</p>
                              <p className="text-sm font-medium">{user.buyer.preferredResidenceLocation?.name || "Not specified"}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-md">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Budget Range</p>
                              <p className="text-sm font-medium">
                                {formatCurrency(user.buyer.budgetRangeFrom)} - {formatCurrency(user.buyer.budgetRangeTo)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-md">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">Preferred Contact Method</p>
                              <p className="text-sm font-medium capitalize">{user.buyer.preferredContactMethod || "Not specified"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Unit Types - Only show if user has preferences */}
                  {user?.unitTypes && user.unitTypes.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-md font-medium mb-3">Unit Type Preferences</h3>
                        <div className="flex flex-wrap gap-2">
                          {user.unitTypes.map(unitType => (
                            <Badge key={unitType.id} variant="outline" className="bg-muted/20">
                              {unitType.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Notification Preferences */}
                  <Separator />
                  <div>
                    <h3 className="text-md font-medium mb-3">Notification Preferences</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <NotificationPreference 
                        title="Latest News" 
                        enabled={user?.notifyLatestNews || false} 
                      />
                      <NotificationPreference 
                        title="Market Trends" 
                        enabled={user?.notifyMarketTrends || false} 
                      />
                      <NotificationPreference 
                        title="Blog Updates" 
                        enabled={user?.notifyBlogs || false} 
                      />
                      <NotificationPreference 
                        title="Push Notifications" 
                        enabled={user?.pushNotifications || false} 
                      />
                      <NotificationPreference 
                        title="Email Notifications" 
                        enabled={user?.emailNotifications || false} 
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}

// Notification preference component
function NotificationPreference({ title, enabled }: { title: string, enabled: boolean }) {
  return (
    <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-md">
      {enabled ? (
        <Bell className="h-5 w-5 text-green-500" />
      ) : (
        <BellOff className="h-5 w-5 text-muted-foreground" />
      )}
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          {enabled ? "Enabled" : "Disabled"}
        </p>
      </div>
    </div>
  );
}

// Skeleton loaders
function UserProfileSkeleton() {
  return (
    <>
      <div className="flex items-start gap-4 w-full">
        <Skeleton className="h-16 w-16 rounded-lg bg-muted/20" />
        <div className="flex flex-col gap-2 pt-1">
          <Skeleton className="h-6 w-32 bg-muted/20" />
          <Skeleton className="h-5 w-20 bg-muted/20" />
        </div>
      </div>
      
      <Skeleton className="h-px w-full bg-muted/20" />
      
      <div className="space-y-3">
        <Skeleton className="h-5 w-full bg-muted/20" />
        <Skeleton className="h-5 w-full bg-muted/20" />
        <Skeleton className="h-5 w-full bg-muted/20" />
        <Skeleton className="h-5 w-full bg-muted/20" />
        <Skeleton className="h-5 w-full bg-muted/20" />
      </div>
    </>
  );
}

function UserDetailsSkeleton() {
  return (
    <>
      <div>
        <Skeleton className="h-6 w-32 mb-3 bg-muted/20" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full bg-muted/20" />
          <Skeleton className="h-20 w-full bg-muted/20" />
        </div>
      </div>
      
      <Skeleton className="h-px w-full bg-muted/20" />
      
      <div>
        <Skeleton className="h-6 w-40 mb-3 bg-muted/20" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full bg-muted/20" />
          <Skeleton className="h-20 w-full bg-muted/20" />
          <Skeleton className="h-20 w-full bg-muted/20" />
          <Skeleton className="h-20 w-full bg-muted/20" />
        </div>
      </div>
      
      <Skeleton className="h-px w-full bg-muted/20" />
      
      <div>
        <Skeleton className="h-6 w-36 mb-3 bg-muted/20" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full bg-muted/20" />
          <Skeleton className="h-20 w-full bg-muted/20" />
          <Skeleton className="h-20 w-full bg-muted/20" />
          <Skeleton className="h-20 w-full bg-muted/20" />
          <Skeleton className="h-20 w-full bg-muted/20" />
        </div>
      </div>
    </>
  );
}