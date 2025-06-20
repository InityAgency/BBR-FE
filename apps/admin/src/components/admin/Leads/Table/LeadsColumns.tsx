"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Lead } from "@/types/models/Lead";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LeadsActions } from "./LeadsActions";

const renderStatusCell = (status: string) => {
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
  let badgeClass = "";
  
  switch(status) {
    case "NEW":
      badgeVariant = "secondary";
      badgeClass = "bg-yellow-900/55 text-yellow-300";
      break;
    case "CONTACTED":
      badgeVariant = "default";
      badgeClass = "bg-blue-900/55 text-blue-300";
      break;
    case "QUALIFIED":
      badgeVariant = "default";
      badgeClass = "bg-purple-900/55 text-purple-300";
      break;
    case "WON":
      badgeVariant = "default";
      badgeClass = "bg-green-900/55 text-green-300";
      break;
    case "LOST":
      badgeVariant = "destructive";
      badgeClass = "bg-red-900/55 text-red-300";
      break;
    case "INACTIVE":
      badgeVariant = "outline";
      badgeClass = "bg-gray-900/80 text-gray-300";
      break;
  }
  
  return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>;
};

const renderContactMethods = (methods: string[] | null) => {
  if (!methods || methods.length === 0) return "-";
  
  return (
    <div className="flex gap-1">
      {methods.map((method) => (
        <Badge key={method} variant="outline">
          {method}
        </Badge>
      ))}
    </div>
  );
};

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => {
      const value = row.getValue("firstName") as string;
      return <div className="font-medium">{value}</div>;
    },
    enableSorting: false, // Disable client-side sorting
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => {
      const value = row.getValue("lastName") as string;
      return <div className="font-medium">{value}</div>;
    },
    enableSorting: false, // Disable client-side sorting
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const value = row.getValue("email") as string;
      return <div className="truncate max-w-[200px]" title={value}>{value}</div>;
    },
    enableSorting: false, // Disable client-side sorting
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const value = row.getValue("phone") as string;
      return value || "-";
    },
    enableSorting: false, // Disable client-side sorting
  },
  {
    accessorKey: "preferredContactMethod",
    header: "Preferred Contact",
    cell: ({ row }) => renderContactMethods(row.getValue("preferredContactMethod")),
    enableSorting: false, // Disable client-side sorting
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "dd.MM.yyyy. HH:mm"),
    enableSorting: false, // Disable client-side sorting
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <LeadsActions row={row} />,
    enableHiding: false,
    enableSorting: false,
    meta: {
      width: "w-[60px]"
    }
  },
];