"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UsersActions } from "../Table/UsersActions";
import { User } from "@/app/types/models/User";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  // Helper funkcije za stilizaciju
  const getStatusClass = (status: string) => {
    switch(status) {
      case "Active": return "bg-green-900/55 text-green-300";
      case "Pending": return "bg-yellow-900/55 text-yellow-300";
      case "Blocked": return "bg-red-900/55 text-red-300";
      case "Deleted": return "bg-gray-900/80 text-gray-300";
      default: return "";
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch(status) {
      case "Active": return "default";
      case "Pending": return "secondary";
      case "Blocked": return "destructive";
      case "Deleted": return "outline";
      default: return "default";
    }
  };

  // Formatiranje datuma
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("sr-Latn", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <a href={`/user-management/${user.id}`} className="font-medium text-foreground hover:underline truncate block">
                {user.fullName}
              </a>
              <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              {user.emailVerified ? (
                <Badge variant="outline" className="mt-2 bg-green-900/10 text-green-500 border-green-500">Verified</Badge>
              ) : (
                <Badge variant="outline" className="mt-2 bg-yellow-900/10 text-yellow-500 border-yellow-500">Not Verified</Badge>
              )}
            </div>
            <div>
              {user.status && (
                <Badge 
                  variant={getStatusVariant(user.status)} 
                  className={getStatusClass(user.status)}
                >
                  {user.status}
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-2">
            <p className="text-sm font-medium">Role</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {user.role.name.substring(0, 1).toUpperCase()}
              </div>
              <p className="text-sm capitalize">{user.role.name}</p>
            </div>
          </div>

          {user.company && (
            <div className="mt-1">
              <p className="text-sm font-medium">Company</p>
              <p className="text-sm mt-1">{user.company}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground mt-1">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground mt-1">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t bg-muted/50 p-3 flex justify-between">
        <UsersActions row={{ original: user } as any} />
      </CardFooter>
    </Card>
  );
} 