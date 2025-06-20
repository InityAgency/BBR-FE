"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Table as TableType } from "@tanstack/react-table";

interface BaseTableProps<TData> {
  table: TableType<TData>;
  getRowClassName?: (row: any) => string;
  getCellClassName?: (cell: any) => string;
}

// Tip za meta podatke kolona
interface ColumnMeta {
  width?: string;
}

export function BaseTable<TData>({
  table,
  getRowClassName,
  getCellClassName,
}: BaseTableProps<TData>) {
  return (
    <div className="rounded-md border w-full">
      <Table className="w-full table-auto">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const widthClass = (header.column.columnDef.meta as ColumnMeta)?.width || "";
                
                return (
                  <TableHead
                    key={header.id}
                    className={`whitespace-nowrap ${widthClass}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={getRowClassName ? getRowClassName(row) : ""}
              >
                {row.getVisibleCells().map((cell) => {
                  const widthClass = (cell.column.columnDef.meta as ColumnMeta)?.width || "";
                  
                  return (
                    <TableCell
                      key={cell.id}
                      className={`${widthClass} ${getCellClassName ? getCellClassName(cell) : ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}