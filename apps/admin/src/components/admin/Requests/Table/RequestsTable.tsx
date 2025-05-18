"use client";

import React, { useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { RequestsFilters } from "./RequestsFilters";
import { columns } from "./RequestsColumns";
import { Request } from "../../../../app/types/models/Request";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { RequestsActions } from "./RequestsActions";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/admin/Table/TablePagination";

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
      cell: (props: CellContext<Request, unknown>) => (
        <RequestsActions row={props.row} />
      )
    };
  }
  return modifiedColumn;
});

// Table skeleton loader
const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      {/* Header skeleton */}
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
      </div>
      
      {/* Row skeletons */}
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

interface RequestsTableProps {
  requests: Request[];
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
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  onQueryChange: (query: string) => void;
  updateUrlParams: (params: {
    page?: number;
    query?: string;
    statuses?: string[];
    types?: string[];
  }) => void;
}

export function RequestsTable({
  requests,
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
  selectedTypes,
  onTypesChange,
  onQueryChange,
  updateUrlParams
}: RequestsTableProps) {
  
  // Table setup with enhanced columns (NO client-side sorting)
  const { table } = useTable<Request>({
    data: requests,
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
    enableSorting: false, // Completely disable sorting
    initialSorting: [], // No initial sorting
  });

  // Extract unique types and statuses for filters
  const {
    locationSearchValue: typeSearchValue,
    setLocationSearchValue: setTypeSearchValue,
    uniqueStatuses,
    filteredLocations: filteredTypes,
  } = useTableFilters<Request>({
    table,
    data: requests,
    locationAccessor: "type",
    statusAccessor: "status",
  });

  // Row styling based on status
  const getRowClassName = (row: any) => {
    const status = row.original.status;
    if (status === "CANCELLED") return "opacity-60";
    if (status === "IN_PROGRESS") return "opacity-80";
    return "";
  };

  return (
    <div className="w-full">
      <RequestsFilters
        globalFilter={queryParam}
        setGlobalFilter={onQueryChange}
        selectedTypes={selectedTypes}
        setSelectedTypes={onTypesChange}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={onStatusesChange}
        uniqueStatuses={uniqueStatuses}
        uniqueTypes={filteredTypes}
        typeSearchValue={typeSearchValue}
        setTypeSearchValue={setTypeSearchValue}
        updateUrlParams={updateUrlParams}
      />

      <div className="hidden lg:block">
        {loading ? (
          <TableSkeleton />
        ) : (
          <BaseTable 
            table={table}
            getRowClassName={getRowClassName}
          />
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