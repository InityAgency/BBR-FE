"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { Eye, Lock, Pencil, CircleMinus } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { User } from "@/app/types/models/User";
import { toast } from "sonner";

interface UsersActionsProps {
  row: Row<User>;
}

export function UsersActions({ row }: UsersActionsProps) {
  // Funkcija za simulaciju slanja reset linka
  const handleSendResetLink = (user: User) => {
    // Ovde bi išla logika za API poziv
    console.log(`Sending reset link to user: ${user.id}`);
    
    // Simuliramo uspešno slanje (kasnije zameniti sa stvarnim API pozivom)
    setTimeout(() => {
      toast.success(`Password reset link sent to ${user.email || 'user'}`, {
        description: "The user will receive an email with instructions to reset their password.",
        duration: 4000,
      });
    }, 500); // Kratak timeout da simulira API poziv
  };
  
  // Funkcija za simulaciju suspendovanja korisnika
  const handleSuspendUser = (user: User) => {
    // Ovde bi išla logika za API poziv
    console.log(`Suspending user: ${user.id}`);
    
    // Simuliramo uspešno suspendovanje (kasnije zameniti sa stvarnim API pozivom)
    setTimeout(() => {
      toast.success(`${user.fullName || 'User'} has been suspended`, {
        description: "The user's access to the system has been revoked.",
        duration: 4000,
      });
    }, 500); // Kratak timeout da simulira API poziv
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