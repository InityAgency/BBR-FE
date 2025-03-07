"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Residence } from "../../../../app/types/models/Residence";

// Helper funkcije za renderovanje ćelija
const renderNameCell = (value: string, id: string) => (
  <div className="max-w-[300px]">
    <a href={`/residences/${id}`} className="font-medium text-foreground hover:underline truncate block" title={value}>
      {value}
    </a>
  </div>
);

const renderLocationCell = (location: string) => {
  const parts = location.split(", ");
  const city = parts[0];
  const country = parts.length > 1 ? parts[1] : "";
  
  return (
    <div className="max-w-[150px]">
      <div className="truncate font-medium" title={city}>{city}</div>
      {country && (
        <div className="text-xs text-muted-foreground truncate" title={country}>
          {country}
        </div>
      )}
    </div>
  );
};

const renderContactCell = (contact: string, email?: string, phone?: string) => (
  <div className="max-w-[150px]">
    <div className="font-medium truncate" title={contact}>{contact}</div>
    {email && (
      <a href={`mailto:${email}`} className="text-xs text-primary" title={email}>
        {email}
      </a>
    )}
    {phone && (
      <div className="text-xs text-muted-foreground truncate" title={phone}>
        {phone}
      </div>
    )}
  </div>
);

const renderDeveloperCell = (developer: string, developerCode?: string) => (
  <div className="flex items-center gap-2 max-w-[180px]">
    <div className="flex-shrink-0">
      {developerCode ? (
        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-medium">
          {developerCode}
        </div>
      ) : (
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
          {developer.split(" ").map(word => word[0]).join("").substring(0, 2).toUpperCase()}
        </div>
      )}
    </div>
    <div className="truncate font-medium" title={developer}>
      {developer}
    </div>
  </div>
);

const renderStatusCell = (status: string) => {
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let badgeClass = "";
  
  switch(status) {
    case "Active":
      badgeVariant = "default";
      badgeClass = "bg-green-900/55 text-green-300";
      break;
    case "Pending":
      badgeVariant = "secondary";
      badgeClass = "bg-yellow-900/55 text-yellow-300";
      break;
    case "Deleted":
      badgeVariant = "destructive";
      badgeClass = "bg-red-900/55 text-red-300";
      break;
    case "Draft":
      badgeVariant = "outline";
      badgeClass = "bg-gray-900/80 text-gray-300";
      break;
  }
  
  return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>;
};

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
    accessorKey: "location",
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
    cell: ({ row }) => renderLocationCell(row.getValue("location")),
    meta: {
      width: "w-[150px]"
    }
  },
  {
    accessorKey: "contact",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Contact
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderContactCell(
      row.getValue("contact"),
      row.original.contactEmail,
      row.original.contactPhone
    ),
    meta: {
      width: "w-[150px]"
    }
  },
  {
    accessorKey: "developer",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Developer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => renderDeveloperCell(
      row.getValue("developer"),
      row.original.developerCode
    ),
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
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("createdAt")}</div>,
    meta: {
      width: "w-[120px]"
    }
  },
  {
    accessorKey: "updatedAt",
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
    cell: ({ row }) => <div className="w-[100px]">{row.getValue("updatedAt")}</div>,
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
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => window.location.href = `/residences/${row.original.id}/edit`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
          </svg>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.location.href = `/residences/${row.original.id}`}>
              <Eye />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <Archive className="text-red-500"/> 
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: {
      width: "w-[80px]"
    }
  },
];