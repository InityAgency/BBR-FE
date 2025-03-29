"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { Lock, Pencil, CircleMinus } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { User } from "@/lib/api/services/types";
import { toast } from "sonner";

interface UsersActionsProps {
  row: Row<User>;
}

export function UsersActions({ row }: UsersActionsProps) {
  // Function to simulate sending reset link
  const handleSendResetLink = (user: User) => {
    // Here would be the logic for API call
    console.log(`Sending reset link to user: ${user.id}`);
    
    // Simulate successful sending (replace with actual API call later)
    setTimeout(() => {
      toast.success(`Password reset link sent to ${user.email || 'user'}`, {
        description: "The user will receive an email with instructions to reset their password.",
        duration: 4000,
      });
    }, 500); // Short timeout to simulate API call
  };
  
  // Function to simulate suspending a user
  const handleSuspendUser = (user: User) => {
    // Here would be the logic for API call
    console.log(`Suspending user: ${user.id}`);
    
    // Simulate successful suspension (replace with actual API call later)
    setTimeout(() => {
      toast.success(`${user.fullName || 'User'} has been suspended`, {
        description: "The user's access to the system has been revoked.",
        duration: 4000,
      });
    }, 500); // Short timeout to simulate API call
  };

  const actions: TableAction[] = [
    {
      label: "Send reset link",
      icon: <Lock className="h-4 w-4" />,
      onClick: handleSendResetLink
    },
    {
      label: "Edit user",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (user: User) => {
        window.location.href = `/user-management/${user.id}/edit`;
      }
    },
    {
      label: "Suspend user",
      icon: <CircleMinus className="h-4 w-4 text-red-400" />,
      className: "text-red-400 hover:text-red-500 hover-red-label",
      onClick: handleSuspendUser
    }
  ];

  return (
    <TableActions 
      row={row} 
      actions={actions}
      editAction={{
        href: `/user-management/${row.original.id}/edit`,
      }}
    />
  );
}