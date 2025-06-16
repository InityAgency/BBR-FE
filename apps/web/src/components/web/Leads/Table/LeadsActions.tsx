"use client";

import React from "react";
import { Row } from "@tanstack/react-table";
import { TableActions } from "@/components/web/Table/TableActions";
import { Lead } from "@/types/Lead";
import { Eye } from "lucide-react";

interface LeadsActionsProps {
  row: Row<Lead>;
}

export function LeadsActions({ row }: LeadsActionsProps) {
  return (
    <TableActions 
      row={row} 
      actions={[]}
      editAction={{
        href: `/developer/leads/${row.original.id}`,
        icon: <Eye className="h-4 w-4" />,
      }}
    />
  );
} 