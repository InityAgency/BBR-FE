// components/admin/Brands/Table/BrandsColumns.tsx
"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Brand } from "../../../../app/types/models/Brand";
import { format } from "date-fns";

// Helper funkcije za renderovanje ćelija
const renderNameCell = (value: string, id: string) => (
    <div className="max-w-[200px]">
        <a href={`/brands/${id}`} className="font-medium text-foreground hover:underline truncate block" title={value}>
        {value}
        </a>
        <div className="text-xs text-muted-foreground truncate">
        {id}
        </div>
    </div>
);

const renderTypeCell = (brandType: any) => (
  <div className="max-w-[180px] truncate" title={brandType?.name || '-'}>
    {brandType?.name || '-'}
  </div>
);

const renderNumberCell = (number: number | null | undefined) => (
  <div className="text-center">{number ?? '-'}</div>
);

const renderStatusCell = (status: string) => {
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let badgeClass = "";
  
  switch(status) {
    case "ACTIVE":
      badgeVariant = "default";
      badgeClass = "bg-green-900/55 text-green-300";
      break;
    case "PENDING":
      badgeVariant = "secondary";
      badgeClass = "bg-yellow-900/55 text-yellow-300";
      break;
    case "DELETED":
      badgeVariant = "destructive";
      badgeClass = "bg-red-900/55 text-red-300";
      break;
    case "DRAFT":
      badgeVariant = "outline";
      badgeClass = "bg-gray-900/80 text-gray-300";
      break;
  }
  
  return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>;
};

const renderDateCell = (date: string) => (
  <div className="w-[180px]">
    {date ? format(new Date(date), "dd.MM.yyyy. HH:mm") : "-"}
  </div>
);

export const columns: ColumnDef<Brand>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Brand name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderNameCell(row.getValue("name"), row.original.id),
    meta: {
      width: "w-[250px]" // Malo povećana širina da primi i ID
    }
  },
  {
    accessorKey: "brandType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Brand Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderTypeCell(row.getValue("brandType")),
    meta: {
      width: "w-[180px]"
    }
  },
  {
    accessorKey: "numberOfResidences",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Number of residences
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderNumberCell(row.getValue("numberOfResidences")),
    meta: {
      width: "w-[180px]"
    }
  },
  {
    accessorKey: "registeredAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Last updated
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderDateCell(row.getValue("registeredAt")),
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
    enableHiding: false,
    meta: {
      width: "w-[80px]"
    }
  },
];