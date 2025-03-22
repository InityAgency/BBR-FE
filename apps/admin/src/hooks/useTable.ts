"use client";

import { useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  FilterFn,
} from "@tanstack/react-table";

interface UseTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  initialSorting?: SortingState;
  globalFilterFn?: FilterFn<TData>;
  initialPageSize?: number;
  manualPagination?: boolean;
  pageCount?: number;
}

export function useTable<TData>({
  data,
  columns,
  initialSorting = [],
  globalFilterFn,
  initialPageSize = 10,
  manualPagination = false,
  pageCount = 0,
}: UseTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn,
    onGlobalFilterChange: setGlobalFilter,
    filterFns: {
      multiSelectFilter: (row, id, filterValue) => {
        const values = filterValue as string[];
        if (!values || values.length === 0) return true;
        
        const rowValue = row.getValue(id) as string;
        return values.includes(rowValue);
      },
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  return {
    table,
    globalFilter,
    setGlobalFilter,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
  };
}