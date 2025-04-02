"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BrandType } from "@/app/types/models/BrandType";
import { formatDate } from "@/utils/dateFormatter";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

const brandTypeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
});

export const columns: ColumnDef<BrandType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      width: "w-[40px]"
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const id = row.original.id;
      const value = row.getValue("name") as string;
      
      return (
        <div className="flex flex-col">
          <a href={`/brands/types/${id}/edit`} className="font-medium text-foreground hover:underline truncate block" title={value}>
            {value}
          </a>
          <span className="text-xs text-muted-foreground truncate" title={id}>
            {id}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return description ? <div className="truncate max-w-[200px]" title={description}>{description}</div> : "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => formatDate(row.getValue("updatedAt")),
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => null,
    enableHiding: false,
    meta: {
      width: "w-[80px]"
    }
  },
];

export default columns; 