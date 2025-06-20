"use client";

import { ColumnDef } from "@tanstack/react-table";
import { B2BFormSubmission } from "@/app/types/models/B2BFormSubmission";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import { B2BFormSubmissionStatus } from "@/lib/api/services/b2b-form-submissions.service";

interface B2BFormSubmissionsColumnsProps {
  onViewSubmission: (submission: B2BFormSubmission) => void;
}

export const createColumns = (onViewSubmission: (submission: B2BFormSubmission) => void): ColumnDef<B2BFormSubmission>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="font-medium">
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {email}
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phoneNumber") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {phone}
        </div>
      );
    },
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => {
      const company = row.getValue("companyName") as string;
      return (
        <div className="font-medium">
          {company}
        </div>
      );
    },
  },
  {
    accessorKey: "brandedResidencesName",
    header: "Branded Residences",
    cell: ({ row }) => {
      const residences = row.getValue("brandedResidencesName") as string;
      return (
        <div className="text-sm">
          {residences}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as B2BFormSubmissionStatus;
      const getStatusColor = (status: B2BFormSubmissionStatus) => {
        switch (status) {
          case B2BFormSubmissionStatus.NEW:
            return "bg-blue-900/55 text-blue-300";
          case B2BFormSubmissionStatus.CONTACTED:
            return "bg-yellow-900/55 text-yellow-300";
          case B2BFormSubmissionStatus.COMPLETED:
            return "bg-green-900/55 text-green-300";
          default:
            return "bg-blue-900/55 text-blue-300";
        }
      };
      return (
        <Badge className={getStatusColor(status)}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {formatDate(date)}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onViewSubmission(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
]; 