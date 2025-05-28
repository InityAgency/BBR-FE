"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RankingCategory } from "../../../../app/types/models/RankingCategory";
import { format } from "date-fns";

// Helper funkcije za renderovanje ćelija
const renderNameCell = (value: string, id: string) => (
    <div className="max-w-[200px]">
        <a href={`/rankings/ranking-categories/${id}`} className="font-medium text-foreground hover:underline truncate block" title={value}>
            {value}
        </a>
        <div className="text-xs text-muted-foreground truncate">
            {id}
        </div>
    </div>
);

const renderTypeCell = (rankingCategoryType: any) => (
    <div className="max-w-[180px] truncate" title={rankingCategoryType?.name || '-'}>
        {rankingCategoryType?.name || '-'}
    </div>
);

const renderNumberCell = (number: number | string | null | undefined) => (
    <div className="text-center">{number ?? '-'}</div>
);

const renderPriceCell = (price: string | number | null | undefined) => {
    if (price === null || price === undefined) return <div className="text-center">-</div>;
    
    // Formatiranje cene
    let formattedPrice = price;
    if (typeof price === 'string') {
        // Ako je string i ima format "1000.00", formatiraj ga
        formattedPrice = parseFloat(price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    } else if (typeof price === 'number') {
        formattedPrice = price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
    
    return <div className="text-center">{formattedPrice}</div>;
};

const renderStatusCell = (status: string) => {
    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
    let badgeClass = "";
    
    switch(status) {
        case "ACTIVE":
            badgeVariant = "default";
            badgeClass = "bg-green-900/55 text-green-300";
            break;
        case "DELETED":
            badgeVariant = "destructive";
            badgeClass = "bg-red-900/55 text-red-300";
            break;
        case "DRAFT":
            badgeVariant = "outline";
            badgeClass = "bg-gray-900/80 text-gray-300";
            break;
        case "INACTIVE":
            badgeVariant = "secondary";
            badgeClass = "bg-yellow-900/55 text-yellow-300";
            break;
        default:
            badgeVariant = "secondary";
            badgeClass = "";
    }
    
    return <Badge variant={badgeVariant} className={badgeClass}>{status}</Badge>;
};

export const columns: ColumnDef<RankingCategory>[] = [
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
                Ranking Category
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => renderNameCell(row.getValue("name"), row.original.id),
        meta: {
            width: "w-[250px]"
        }
    },
    {
        accessorKey: "rankingCategoryType",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Category Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => renderTypeCell(row.getValue("rankingCategoryType")),
        meta: {
            width: "w-[180px]"
        }
    },
    {
        accessorKey: "rankedFirst",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Ranked #1
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: () => "-",
        meta: {
            width: "w-[150px]"
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
        cell: () => "-",
        meta: {
            width: "w-[150px]"
        }
    },
    {
        accessorKey: "residenceLimitation",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Limitation
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => renderNumberCell(row.getValue("residenceLimitation")),
        meta: {
            width: "w-[120px]"
        }
    },
    {
        accessorKey: "rankingPrice",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Price
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => renderPriceCell(row.getValue("rankingPrice")),
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