"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Review } from "../../../../app/types/models/Review";
import { format } from "date-fns";

// Helper funkcije za renderovanje ćelija
const renderResidenceCell = (residence: any) => (
  <div className="max-w-[250px]">
    <div className="font-medium text-foreground truncate" title={residence?.name || '-'}>
      {residence?.name || '-'}
    </div>
    <div className="text-xs text-muted-foreground truncate">
      {residence?.address || '-'}
    </div>
  </div>
);

const renderUserCell = (user: any) => (
  <div className="max-w-[180px]">
    <div className="font-medium text-foreground truncate" title={user?.fullName || '-'}>
      {user?.fullName || '-'}
    </div>
    <div className="text-xs text-muted-foreground truncate">
      {user?.email || '-'}
    </div>
  </div>
);

const renderDateCell = (date: string) => (
  <div className="text-sm">
    {format(new Date(date), "dd/MM/yyyy")}
  </div>
);

const renderRatingCell = (rating: number) => (
  <div className="flex items-center gap-1">
    <span className="text-sm font-medium">{rating}/10</span>
    <div className="flex gap-0.5">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-1 h-3 rounded-sm ${
            i < rating ? "bg-primary" : "bg-gray-200/60"
          }`}
        />
      ))}
    </div>
  </div>
);

const renderStatusCell = (status: string) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-900/55 text-yellow-300";
      case "ACTIVE":
        return "bg-green-900/55 text-green-300";
      case "REJECTED":
        return "bg-red-900/55 text-red-300";
      case "FLAGGED":
        return "bg-orange-900/55 text-orange-300";
      case "ARCHIVED":
        return "bg-gray-900/80 text-gray-300";
      default:
        return "bg-blue-900/55 text-blue-300";
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {status}
    </Badge>
  );
};

const renderUnitTypeCell = (unitType: any) => (
  <div className="max-w-[120px] truncate" title={unitType?.name || '-'}>
    {unitType?.name || '-'}
  </div>
);

const renderBooleanCell = (value: boolean) => (
  <Badge variant={value ? "default" : "secondary"}>
    {value ? "Yes" : "No"}
  </Badge>
);

export const columns: ColumnDef<Review>[] = [
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
    accessorKey: "residence",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Residence
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderResidenceCell(row.getValue("residence")),
    meta: {
      width: "w-[250px]"
    }
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderUserCell(row.getValue("user")),
    meta: {
      width: "w-[180px]"
    }
  },
  {
    accessorKey: "dateOfPurchase",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Purchase Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderDateCell(row.getValue("dateOfPurchase")),
    meta: {
      width: "w-[120px]"
    }
  },
  {
    accessorKey: "unitType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Unit Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderUnitTypeCell(row.getValue("unitType")),
    meta: {
      width: "w-[120px]"
    }
  },
  {
    accessorKey: "buildQuality",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Build Quality
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderRatingCell(row.getValue("buildQuality")),
    meta: {
      width: "w-[140px]"
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
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderDateCell(row.getValue("createdAt")),
    meta: {
      width: "w-[120px]"
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