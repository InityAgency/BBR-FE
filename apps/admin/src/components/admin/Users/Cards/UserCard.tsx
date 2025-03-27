"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersActions } from "../Table/UsersActions";
import { User } from "@/app/types/models/User";
import { formatDate } from "@/utils/dateFormatter";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  // Helper functions for styling
  const getStatusClass = (status: string | undefined) => {
    switch(status?.toLowerCase()) {
      case "active": return "bg-green-900/55 text-green-300";
      case "inactive": return "bg-red-900/55 text-red-300";
      case "pending": return "bg-yellow-900/55 text-yellow-300";
      case "invited": return "bg-orange-900/55 text-orange-300";
      case "blocked": return "bg-red-900/55 text-red-300";
      case "suspended": return "bg-red-900/55 text-red-300";
      case "deleted": return "bg-gray-900/80 text-gray-300";
      default: return "";
    }
  };

  const getStatusVariant = (status: string | undefined): "default" | "secondary" | "destructive" | "outline" => {
    switch(status?.toLowerCase()) {
      case "active": return "default";
      case "inactive": return "destructive";
      case "invited": return "secondary";
      case "pending": return "secondary";
      case "blocked": return "destructive";
      case "suspended": return "destructive";
      case "deleted": return "outline";
      default: return "outline";
    }
  };

  // Safely get role name
  const getRoleName = () => {
    if (!user.role) return "-";
    
    // Check if role is a string
    if (typeof user.role === 'string') return user.role;
    
    // Check if role is an object with name property
    if (typeof user.role === 'object' && user.role !== null && 'name' in user.role) {
      return user.role.name || "-";
    }
    
    return "-";
  };

  // Safely format date with fallback
  const safelyFormatDate = (date: string | undefined) => {
    if (!date) return "-";
    try {
      return formatDate(date);
    } catch (error) {
      console.error("Error formatting date:", error, date);
      return "-";
    }
  };

  // Safely get company name
  const getCompanyName = () => {
    if (!user.company) return null;
    
    // Check if company is a string
    if (typeof user.company === 'string') return user.company;
    
    // Check if company is an object with name property
    if (typeof user.company === 'object' && user.company !== null && 'name' in user.company) {
      return (user.company as {name: string}).name || "-";
    }
    
    return "-";
  };

  const companyName = getCompanyName();

  return (
    <Card className="overflow-hidden">
      <CardContent>
        <div className="flex items-center justify-between gap-2 mb-2">
          {user.status && (
            <Badge 
              variant={getStatusVariant(user.status)} 
              className={getStatusClass(user.status)}
            >
              {typeof user.status === 'string' ? user.status : '-'}
            </Badge>
          )}
          <UsersActions row={{ original: user } as any} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start border-b border-border pb-2">
            <div>
              <a href={`/user-management/${user.id}`} className="font-medium text-foreground hover:underline truncate block">
                {user.fullName || "-"}
              </a>
              <p className="text-sm text-muted-foreground mt-1">{user.email || "-"}</p>
            </div>
            {user.emailVerified ? (
              <Badge variant="outline" className="mt-2 bg-green-900/10 text-green-500 border-green-500">Verified</Badge>
            ) : (
              <Badge variant="outline" className="mt-2 bg-yellow-900/10 text-yellow-500 border-yellow-500">Not Verified</Badge>
            )}
          </div>

          <div className="border-b border-border pb-2">
            <p className="text-sm font-medium text-muted-foreground">Role</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm capitalize">{getRoleName()}</p>
            </div>
          </div>

          {companyName && (
            <div className="mt-1 text-muted-foreground border-b border-border pb-2">
              <p className="text-xs font-medium">Company</p>
              <p className="text-sm mt-1 text-white">{companyName}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm text-muted-foreground mt-1 text-white">
                {safelyFormatDate(user.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm text-muted-foreground mt-1 text-white">
                {safelyFormatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}