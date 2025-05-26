"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { TableActions, TableAction } from "@/components/admin/Table/TableActions";
import { Request } from "../../../../app/types/models/Request";

interface RequestsActionsProps {
  row: Row<Request>;
}

export function RequestsActions({ row }: RequestsActionsProps) {
  const actions: TableAction[] = [
    {
      label: "View details",
      icon: <Eye className="h-4 w-4" />,
      onClick: (request: Request) => {
        window.location.href = `/leads/requests/${request.id}`;
      }
    }
  ];

  return (
    <TableActions 
      row={row} 
      actions={[]}
      editAction={{
        href: `/leads/requests/${row.original.id}`,
        icon: <Eye className="h-4 w-4" />,
      }}
    />
  );
} 