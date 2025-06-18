"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ClaimRequest } from "../../../../app/types/models/ClaimRequest";
import { format } from "date-fns";

const renderNameCell = (value: string, id: string) => (
    <div className="max-w-[200px]">
        <a href={`/residences/claim-requests/${id}`} className="font-medium text-foreground hover:underline truncate block" title={value}>
        {value}
        </a>
        <div className="text-xs text-muted-foreground truncate">
            {id}
        </div>
    </div>
);

const renderDateCell = (date: string) => (
    <div className="w-[180px]">
        {date ? format(new Date(date), "dd.MM.yyyy. HH:mm") : "-"}
    </div>
);

const renderStatusCell = (status: string) => {
    const statusConfig = {
        NEW: { label: "NEW", className: "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&]:hover:bg-primary/90 bg-blue-900/50 text-blue-300" },
        ACCEPTED: { label: "ACCEPTED", className: "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&]:hover:bg-primary/90 bg-green-900/55 text-green-300" },
        REJECTED: { label: "REJACTED", className: "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 bg-red-900/55 text-red-300" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NEW;

    return (
        <Badge variant="secondary" className={config.className}>
            {config.label}
        </Badge>
    );
};

// ISPRAVLJENA funkcija - dodao null check
const renderResidenceCell = (residence: ClaimRequest['residence']) => {
    if (!residence) {
        return (
            <div className="max-w-[200px]">
                <div className="text-sm text-muted-foreground">
                    No residence assigned
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[200px]">
            <div className="font-medium text-foreground truncate" title={residence.name}>
                {residence.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
                {residence.address}
            </div>
        </div>
    );
};

const renderContactCell = (request: ClaimRequest) => (
    <div className="max-w-[200px]">
        <div className="font-medium text-foreground truncate" title={request.email}>
            {request.email}
        </div>
        <div className="text-xs text-muted-foreground truncate">
            {request.phoneCode.code} {request.phoneNumber}
        </div>
    </div>
);

export const columns: ColumnDef<ClaimRequest>[] = [
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
        accessorKey: "firstName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Applicant Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const fullName = `${row.getValue("firstName")} ${row.original.lastName}`;
            return renderNameCell(fullName, row.original.id);
        },
        meta: {
            width: "w-[200px]"
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
            width: "w-[200px]"
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Contact Info
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => renderContactCell(row.original),
        meta: {
            width: "w-[200px]"
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
            width: "w-[120px]"
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
                Submitted
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => renderDateCell(row.getValue("createdAt")),
        meta: {
            width: "w-[180px]"
        }
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        meta: {
            width: "w-[125px]"
        }
    }
];