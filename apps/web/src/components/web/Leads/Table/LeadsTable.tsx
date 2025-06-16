"use client";

import React, { useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/web/Table/BaseTable";
import { LeadsFilters } from "./LeadsFilters";
import { columns } from "./LeadsColumns";
import { Lead } from "@/types/lead";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { LeadsActions } from "./LeadsActions";
import { LeadsCardList } from "../Cards/LeadsCardList";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/web/Table/TablePagination";

const ITEMS_PER_PAGE = 10;

// Enhanced columns with actions and disabled sorting
const enhancedColumns = columns.map(column => {
  const modifiedColumn = {
    ...column,
    enableSorting: false, // Disable sorting on all columns
  };
  
  if (column.id === "actions") {
    return {
      ...modifiedColumn,
      cell: (props: CellContext<Lead, unknown>) => (
        <LeadsActions row={props.row} />
      )
    };
  }
  return modifiedColumn;
});

// Table skeleton loader
const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
      </div>
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border-b px-4 py-3 flex items-center">
          <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
        </div>
      ))}
    </div>
  );
};

const CardsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border rounded-md p-4 space-y-3">
          <div className="flex justify-between mt-3">
            <Skeleton className="h-8 w-32 rounded-md bg-muted/20" />
            <Skeleton className="h-8 w-20 rounded-md bg-muted/20" />
          </div>
          <div className="flex justify-between mt-3 mb-3">
            <Skeleton className="h-8 w-80 rounded-md bg-muted/20" />
            <Skeleton className="h-8 w-20 rounded-md bg-muted/20" />
          </div>
          <Skeleton className="h-8 w-60 rounded-md bg-muted/20" />
          <div className="flex items-center space-x-2 mt-4">
            <Skeleton className="h-8 w-1/2 rounded-md bg-muted/20" />
            <Skeleton className="h-8 w-1/2 rounded-md bg-muted/20" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface LeadsTableProps {
  leads: Lead[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  queryParam: string;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  selectedStatuses: string[];
  onStatusesChange: (statuses: string[]) => void;
  onQueryChange: (query: string) => void;
  updateUrlParams: (params: {
    page?: number;
    query?: string;
    statuses?: string[];
  }) => void;
}

export function LeadsTable({
  leads,
  loading,
  totalItems,
  totalPages,
  currentPage,
  queryParam,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  selectedStatuses,
  onStatusesChange,
  onQueryChange,
  updateUrlParams
}: LeadsTableProps) {

  // Table setup with enhanced columns (NO client-side sorting)
  const { table } = useTable<Lead>({
    data: leads,
    columns: enhancedColumns,
    globalFilterFn: (row, columnId, value, addMeta) => {
      const result = fuzzyFilter(row, columnId, value, addMeta);
      const id = row.original.id || "";
      const searchValue = String(value).toLowerCase();
      return result || id.toLowerCase().includes(searchValue);
    },
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
    enableSorting: false, // Disable all sorting
    initialSorting: [], // No initial sorting
  });

  // Extract unique statuses for filters
  const { uniqueStatuses } = useTableFilters<Lead>({
    table,
    data: leads,
    // statusAccessor: "status",
  });

  return (
    <div className="w-full">
      {/* Filters */}
      <LeadsFilters
        globalFilter={queryParam}
        setGlobalFilter={onQueryChange}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={onStatusesChange}
        uniqueStatuses={uniqueStatuses}
        updateUrlParams={updateUrlParams}
      />

      {/* Cards for mobile view */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <LeadsCardList leads={table.getRowModel().rows.map(row => row.original)} />
        )}
      </div>

      {/* Table for desktop view */}
      <div className="hidden lg:block">
        {loading ? (
          <TableSkeleton />
        ) : (
          <BaseTable table={table} />
        )}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={ITEMS_PER_PAGE}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        goToPage={goToPage}
        loading={loading}
      />
    </div>
  );
}