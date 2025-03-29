"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormHeader from "@/components/admin/Headers/FormHeader";
import { User } from "@/lib/api/services/types";
import { usersService } from "@/lib/api/services";

const ALLOWED_STATUSES = ["ACTIVE", "INACTIVE", "INVITED", "UNKNOWN"] as const;
type UserStatus = typeof ALLOWED_STATUSES[number];

interface UserHeaderProps {
  user?: User | null; 
  loading?: boolean;
  onStatusChange?: (newStatus: string) => Promise<void>;
  onResendInvitation?: () => Promise<void>;
}

const normalizeStatus = (status: string | undefined | null): UserStatus => {
  if (!status) return "UNKNOWN";
  const upperStatus = status.toUpperCase() as UserStatus;
  return ALLOWED_STATUSES.includes(upperStatus) ? upperStatus : "UNKNOWN";
};

const getStatusBadgeStyle = (status: string) => {
  switch(normalizeStatus(status)) {
    case "ACTIVE":
      return "bg-green-900/20 hover:bg-green-900/40 text-green-300 border-green-900/50";
    case "INACTIVE":
      return "bg-red-900/20 hover:bg-red-900/40 text-red-300 border-red-900/50";
    case "INVITED":
      return "bg-yellow-900/20 hover:bg-yellow-900/40 text-yellow-300 border-yellow-900/50";
    default:
      return "bg-gray-900/20 hover:bg-gray-900/40 text-gray-300 border-gray-900/50";
  }
};

export function UserHeader({ 
  user, 
  loading = false,
  onStatusChange,
  onResendInvitation,
}: UserHeaderProps) {
  const router = useRouter();
  const [status, setStatus] = useState<UserStatus>("UNKNOWN");
  const [isResendingInvitation, setIsResendingInvitation] = useState(false);
  const [isLoading, setIsLoading] = useState(loading);

  // Set the initial status once user data is loaded
  useEffect(() => {
    if (user?.status) {
      setStatus(normalizeStatus(user.status));
    }
    setIsLoading(loading);
  }, [user, loading]);

  // Skeleton view for loading state
  if (isLoading) {
    return <UserHeaderSkeleton />;
  }

  // Handle case when user is null
  if (!user) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-muted-foreground">User Not Found</h1>
          <p className="text-sm text-muted-foreground">The requested user could not be found.</p>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      
      const normalizedStatus = normalizeStatus(newStatus);
      if (normalizedStatus === "UNKNOWN") {
        throw new Error("Invalid status value");
      }

      await usersService.updateUserStatus(user.id, normalizedStatus);
      setStatus(normalizedStatus);
      toast.success(`Status for ${user.fullName} changed to ${normalizedStatus}`);
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error(error instanceof Error ? error.message : "Error changing status. Please try again.");
    }
  };

  const handleResendInvitation = async () => {
    if (!onResendInvitation) return;
    
    setIsResendingInvitation(true);
    try {
      await onResendInvitation();
      toast.success("Invitation sent successfully!");
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error(error instanceof Error ? error.message : "Error resending invitation. Please try again.");
    } finally {
      setIsResendingInvitation(false);
    }
  };

  const renderStatusBadge = () => {
    return (
      <div className="flex items-center gap-2">
        <Select 
          onValueChange={handleStatusChange} 
          value={status}
        >
          <SelectTrigger className="w-auto border-0 p-0 h-auto hover:bg-transparent focus:ring-0">
            <Badge 
              className={`${getStatusBadgeStyle(status)} px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer hover:opacity-80 capitalize`}
            >
              {status.toLowerCase()}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {ALLOWED_STATUSES.filter(s => s !== "UNKNOWN").map((statusOption) => (
              <SelectItem 
                key={statusOption} 
                value={statusOption}
                className="text-sm capitalize"
              >
                {statusOption.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(status === "INVITED") && (
          <Button
            variant="outline"
            className="transition-all duration-300"
            onClick={handleResendInvitation}
            disabled={isResendingInvitation}
          >
            <Send className="h-4 w-4 mr-2" />
            {isResendingInvitation ? "Sending..." : "Resend Invitation"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <FormHeader
      title={user.fullName || "Unnamed User"}
      titleContent={renderStatusBadge()}
      hideDefaultButtons={true}
      customButtons={
        <Button
          variant="outline"
          onClick={() => router.push(`/user-management/${user.id}/edit`)}
          className="cursor-pointer transition-colors"
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit User
        </Button>
      }
    />
  );
}

function UserHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-48 bg-muted/20" />
          <Skeleton className="h-7 w-24 bg-muted/20" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}