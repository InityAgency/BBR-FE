"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersActions } from "../Table/UsersActions";
import { User } from "@/app/types/models/User";
import { formatDate } from "@/utils/dateFormatter";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  // Helper funkcije za stilizaciju
  const getStatusClass = (status: string) => {
    switch(status) {
      case "Active": return "bg-green-900/55 text-green-300";
      case "Inactive": return "bg-red-900/55 text-red-300";
      case "Pending": return "bg-yellow-900/55 text-yellow-300";
      case "Invited": return "bg-orange-900/55 text-orange-300";
      case "Blocked": return "bg-red-900/55 text-red-300";
      case "Suspended": return "bg-red-900/55 text-red-300";
      case "Deleted": return "bg-gray-900/80 text-gray-300";
      default: return "";
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
      case "Active": return "default";
      case "Inactive": return "destructive";
      case "Invited": return "secondary";
      case "Pending": return "secondary";
      case "Blocked": return "destructive";
      case "Suspended": return "destructive";
      case "Deleted": return "outline";
      default: return "outline";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent>

        <div className="flex items-center justify-between gap-2 mb-2">
              {user.status && (
                <Badge 
                  variant={getStatusVariant(user.status)} 
                  className={getStatusClass(user.status)}
                >
                  {user.status}
                </Badge>
              )}
              <UsersActions row={{ original: user } as any} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start border-b border-border pb-2">
              <div>
                <a href={`/user-management/${user.id}`} className="font-medium text-foreground hover:underline truncate block">
                  {user.fullName}
                </a>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
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
              <p className="text-sm capitalize">{user.role.name}</p>
            </div>
          </div>

          {user.company && (
            <div className="mt-1 text-muted-foreground border-b border-border pb-2">
              <p className="text-xs font-medium">Company</p>
              <p className="text-sm mt-1 text-white">{user.company}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm text-muted-foreground mt-1 text-white">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm text-muted-foreground mt-1 text-white">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 