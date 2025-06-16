"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BillingActions } from "./BillingActions";
import { BillingTransaction } from "@/types/billing";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-green-900/55 text-green-300";
    case "pending":
      return "bg-yellow-900/55 text-yellow-300";
    case "failed":
      return "bg-red-900/55 text-red-300";
    default:
      return "bg-gray-900/55 text-gray-300";
  }
};

const renderStatusCell = (status: string) => {
  return (
    <Badge 
      variant="secondary"
      className={`${getStatusColor(status)} transition-colors`}
    >
      {status.toUpperCase()}
    </Badge>
  );
};

export const columns: ColumnDef<BillingTransaction>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as string;
      const currency = row.original.currency.toUpperCase();
      return <div className="font-medium">{`${amount} ${currency}`}</div>;
    },
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const value = row.getValue("type") as string;
      return <div className="font-medium">{value}</div>;
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
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      return format(new Date(value), "dd.MM.yyyy. HH:mm");
    },
    enableSorting: false,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <BillingActions row={row} />,
    enableHiding: false,
    enableSorting: false,
    meta: {
      width: "w-[60px]"
    }
  },
]; 