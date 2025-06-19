"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ReviewsActions } from "./ReviewsActions";

import { Review } from "@/types/review";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-900/55 text-yellow-300";
    case "ARCHIVED":
      return "bg-gray-900/55 text-gray-300";
    case "APPROVED":
      return "bg-green-900/55 text-green-300";
    case "REJECTED":
      return "bg-red-900/55 text-red-300";
    default:
      return "bg-blue-900/55 text-blue-300";
  }
};

const renderStatusCell = (status: string) => {
  return (
    <Badge 
      variant="outline"
      className={`${getStatusColor(status)} transition-colors`}
    >
      {status}
    </Badge>
  );
};

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "residence.name",
    header: "Residence",
    cell: ({ row }) => {
      const value = row.original.residence.name;
      return <div className="font-medium">{value}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "user.fullName",
    header: "User",
    cell: ({ row }) => {
      const value = row.original.user.fullName;
      return <div className="font-medium">{value}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return format(new Date(value), "dd/MM/yyyy");
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => renderStatusCell(row.getValue("status")),
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    accessorFn: (row) => row.id,
    cell: ({ row }) => <ReviewsActions row={row} />,
    enableHiding: false,
    enableSorting: false,
    meta: {
      width: "w-[60px]"
    }
  },
];