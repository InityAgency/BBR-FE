"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersActions } from "../Table/UsersActions";
import { User } from "@/lib/api/services/types";
import { formatDate } from "@/utils/dateFormatter";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  // Helper functions for styling
  const getStatusClass = (status: string | undefined) => {
    // Normalize status for consistent handling regardless of API format
    const normalizedStatus = status || "";
    
    switch(normalizedStatus) {
      case "ACTIVE": return "bg-green-900/55 text-green-300";
      case "INACTIVE": return "bg-red-900/55 text-red-300";
      case "PENDING": return "bg-yellow-900/55 text-yellow-300";
      case "INVITED": return "bg-orange-900/55 text-orange-300";
      case "BLOCKED": return "bg-red-900/55 text-red-300";
      case "SUSPENDED": return "bg-red-900/55 text-red-300";
      case "DELETED": return "bg-gray-900/80 text-gray-300";
      default: return "";
    }
  };

  const getStatusVariant = (status: string | undefined): "default" | "secondary" | "destructive" | "outline" => {
    // Normalize status for consistent handling regardless of API format
    const normalizedStatus = status || "";
    
    switch(normalizedStatus) {
      case "ACTIVE": return "default";
      case "INACTIVE": return "destructive";
      case "INVITED": return "secondary";
      case "PENDING": return "secondary";
      case "BLOCKED": return "destructive";
      case "SUSPENDED": return "destructive";
      case "DELETED": return "outline";
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
              <Badge variant="outline" className="mt-2 bg-yellow-900/10 text-yellow-300 border-yellow-500">Not Verified</Badge>
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
                {formatDate(user.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm text-muted-foreground mt-1 text-white">
                {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}