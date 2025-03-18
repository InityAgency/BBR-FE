"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { Eye, UserX } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { User } from "@/app/types/models/User";

interface UsersActionsProps {
  row: Row<User>;
}

export function UsersActions({ row }: UsersActionsProps) {
  // Definišemo akcije specifične za korisnike
  const actions: TableAction[] = [
    {
      label: "View details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (user: User) => {
        window.location.href = `/user-management/${user.id}`;
      }
    },
    {
      label: "Delete",
      icon: <UserX className="h-4 w-4 text-red-500" />,
      className: "text-red-500",
      onClick: (user: User) => {
        // Ovde bi se nalazila logika za brisanje korisnika
        console.log(`Deleting user: ${user.id}`);
      }
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