"use client";

import React, { useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { B2BFormSubmissionsFilters } from "./B2BFormSubmissionsFilters";
import { createColumns } from "./B2BFormSubmissionsColumns";
import { B2BFormSubmission } from "@/app/types/models/B2BFormSubmission";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { B2BFormSubmissionsCardList } from "../Cards/B2BFormSubmissionsCardList";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/admin/Table/TablePagination";

const ITEMS_PER_PAGE = 10;

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

interface B2BFormSubmissionsTableProps {
  submissions: B2BFormSubmission[];
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
  onViewSubmission: (submission: B2BFormSubmission) => void;
}

export function B2BFormSubmissionsTable({
  submissions,
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
  updateUrlParams,
  onViewSubmission
}: B2BFormSubmissionsTableProps) {

  // Create columns with the onViewSubmission callback
  const columns = createColumns(onViewSubmission);

  // Enhanced columns with actions and disabled sorting
  const enhancedColumns = columns.map(column => {
    const modifiedColumn = {
      ...column,
      enableSorting: false, // Disable sorting on all columns
    };
    
    if (column.id === "actions") {
      return {
        ...modifiedColumn,
        cell: (props: CellContext<B2BFormSubmission, unknown>) => (
          <div className="flex justify-center">
            <button
              className="p-2 hover:bg-secondary rounded-md cursor-pointer"
              onClick={() => onViewSubmission(props.row.original)}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        )
      };
    }
    return modifiedColumn;
  });

  // Table setup with enhanced columns (NO client-side sorting)
  const { table } = useTable<B2BFormSubmission>({
    data: submissions,
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
  const { uniqueStatuses } = useTableFilters<B2BFormSubmission>({
    table,
    data: submissions,
    statusAccessor: "status",
  });

  return (
    <div className="w-full">
      {/* Filters */}
      {/* <B2BFormSubmissionsFilters
        globalFilter={queryParam}
        setGlobalFilter={onQueryChange}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={onStatusesChange}
        uniqueStatuses={uniqueStatuses}
        updateUrlParams={updateUrlParams}
      /> */}

      {/* Cards for mobile view */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <B2BFormSubmissionsCardList 
            submissions={table.getRowModel().rows.map(row => row.original)} 
            onViewSubmission={onViewSubmission}
          />
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