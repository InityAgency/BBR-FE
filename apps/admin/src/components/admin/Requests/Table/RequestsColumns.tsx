"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Request } from "../../../../app/types/models/Request";
import { format } from "date-fns";

// Helper funkcije za renderovanje ćelija
const renderRequestTypeCell = (type: string, id: string) => {
  const formattedType = type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <div className="flex items-center gap-3 max-w-[300px]">
      <div>
        <div className="font-medium text-foreground truncate block" title={type}>
          {formattedType}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {id}
        </div>
      </div>
    </div>
  );
};

const renderLeadCell = (lead: any) => (
  <div className="max-w-[300px]">
    <div className="font-medium truncate" title={`${lead.firstName} ${lead.lastName}`}>
      {lead.firstName} {lead.lastName}
    </div>
    <div className="text-xs text-muted-foreground truncate" title={lead.email}>
      {lead.email}
    </div>
    {lead.phone && (
      <div className="text-xs text-muted-foreground truncate" title={lead.phone}>
        {lead.phone}
      </div>
    )}
  </div>
);

const renderDateCell = (date: string) => (
  <div className="w-[180px]">
    {date ? format(new Date(date), "dd.MM.yyyy. HH:mm") : "-"}
  </div>
);

const renderStatusCell = (status: string) => {
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let badgeClass = "";
  
  switch(status) {
    case "NEW":
      badgeVariant = "default";
      badgeClass = "bg-blue-900/55 text-blue-300";
      break;
    case "IN_PROGRESS":
      badgeVariant = "secondary";
      badgeClass = "bg-yellow-900/55 text-yellow-300";
      break;
    case "COMPLETED":
      badgeVariant = "default";
      badgeClass = "bg-green-900/55 text-green-300";
      break;
    case "CANCELLED":
      badgeVariant = "destructive";
      badgeClass = "bg-red-900/55 text-red-300";
      break;
  }
  
  return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>;
};

export const columns: ColumnDef<Request>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      width: "w-[40px]"
    }
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Request Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderRequestTypeCell(row.getValue("type"), row.original.id),
    meta: {
      width: "w-[300px]"
    }
  },
  {
    accessorKey: "lead",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lead
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderLeadCell(row.getValue("lead")),
    meta: {
      width: "w-[300px]"
    }
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Application Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderDateCell(row.getValue("createdAt")),
    meta: {
      width: "w-[180px]"
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderStatusCell(row.getValue("status")),
    meta: {
      width: "w-[100px]"
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button
        onClick={() => window.location.href = `/leads/requests/${row.original.id}`}
        title="View details"
        className="p-2 hover:bg-muted rounded"
      >
        <Eye className="h-4 w-4" />
      </button>
    ),
    enableHiding: false,
    meta: {
      width: "w-[60px]"
    }
  },
]; 