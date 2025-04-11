"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Residence } from "../../../../app/types/models/Residence";
import { format } from "date-fns";
import { API_BASE_URL, API_VERSION } from "@/app/constants/api";
// Helper funkcije za renderovanje ćelija
const renderNameCell = (value: string, id: string) => (
  <div className="max-w-[250px]">
    <a href={`/residences/${id}`} className="font-medium text-foreground hover:underline truncate block" title={value}>
      {value}
    </a>
    <div className="text-xs text-muted-foreground truncate">
      {id}
    </div>
  </div>
);

const renderLocationCell = (city: any, country: any) => (
  <div className="max-w-[180px]">
    <div className="truncate font-medium" title={city?.name || '-'}>
      {city?.name || '-'}
    </div>
    <div className="text-xs text-muted-foreground truncate" title={country?.name || '-'}>
      {country?.name || '-'}
    </div>
  </div>
);

const renderBrandCell = (brand: any) => (
  <div className="flex items-center gap-2 max-w-[180px]">
    {brand?.logo ? (
      <div className="h-8 w-8 rounded-md border overflow-hidden flex-shrink-0">
        <img 
          src={`${API_BASE_URL}/api/${API_VERSION}/media/${brand.logo.id}/content`} 
          alt={brand.name} 
          className="h-full w-full object-cover"
        />
      </div>
    ) : (
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
        {brand?.name?.charAt(0).toUpperCase() || '-'}
      </div>
    )}
    <div className="truncate font-medium" title={brand?.name || '-'}>
      {brand?.name || '-'}
    </div>
  </div>
);

const renderDevStatusCell = (status: string) => (
  <div className="max-w-[150px] truncate" title={status || '-'}>
    {status || '-'}
  </div>
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
  <div className="w-[120px]">
    {date ? format(new Date(date), "dd.MM.yyyy") : "-"}
  </div>
);

export const columns: ColumnDef<Residence>[] = [
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
        Residence name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderNameCell(row.getValue("name"), row.original.id),
    meta: {
      width: "w-[250px]"
    }
  },
  {
    id: "location",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Location
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderLocationCell(row.original.city, row.original.country),
    meta: {
      width: "w-[180px]"
    }
  },
  {
    id: "brand",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Brand
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) => row.brand?.name,
    cell: ({ row }) => renderBrandCell(row.original.brand),
    meta: {
      width: "w-[180px]"
    }
  },
  {
    accessorKey: "developmentStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Development Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderDevStatusCell(row.getValue("developmentStatus")),
    meta: {
      width: "w-[150px]"
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
        Created at
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderDateCell(row.getValue("createdAt")),
    meta: {
      width: "w-[120px]"
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
      width: "w-[60px]"
    }
  },
];