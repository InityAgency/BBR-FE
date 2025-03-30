"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Amenity } from "../../../../app/types/models/Amenities";
import { format } from "date-fns";

const renderNameCell = (value: string, id: string) => (
    <div className="max-w-[200px]">
        <a href={`/residences/amenities/${id}`} className="font-medium text-foreground hover:underline truncate block" title={value}>
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

export const columns: ColumnDef<Amenity>[] = [
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
                Amenity name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => renderNameCell(row.getValue("name"), row.original.id),
        meta: {
            width: "w-[250px]"
        }
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="max-w-[200px]">
                {row.getValue("description")}
            </div>
        ),
        meta: {
            width: "w-[250px]"
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
            width: "w-[180px]"
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
        cell: ({ row }) => renderDateCell(row.getValue("updatedAt")),
        meta: {
            width: "w-[180px]"
        }
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        meta: {
            width: "w-[80px]"
        }
    }
]
