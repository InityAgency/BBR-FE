"use client";

import React, { useEffect, useState } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { RequestsFilters } from "./RequestsFilters";
import { columns } from "./RequestsColumns";
import { Request } from "../../../../app/types/models/Request";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { RequestsActions } from "./RequestsActions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 10;

// Popravka za kolone da koriste RequestsActions
const enhancedColumns = (fetchRequests: (page: number, query?: string, statuses?: string[], types?: string[]) => Promise<void>, currentPage: number) => columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<Request, unknown>) => (
        <RequestsActions 
          row={props.row} 
          // onDelete={() => fetchRequests(currentPage)}
        />
      )
    };
  }
  return column;
});

// Skeleton loader za tabelu
const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      {/* Skelet za header tabele */}
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
      </div>
      
      {/* Skelet za redove tabele */}
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
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  selectedStatuses: string[];
  onStatusesChange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTypes: string[];
  onTypesChange: React.Dispatch<React.SetStateAction<string[]>>;
  fetchRequests: (page: number, query?: string, statuses?: string[], types?: string[]) => Promise<void>;
}

export function RequestsTable({
  requests,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  selectedStatuses,
  onStatusesChange,
  selectedTypes,
  onTypesChange,
  fetchRequests
}: RequestsTableProps) {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');
  const [search, setSearch] = useState(queryParam || "");

  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<Request>({
    data: requests,
    columns: enhancedColumns(fetchRequests, currentPage),
    initialSorting: [{ id: "createdAt", desc: true }],
    globalFilterFn: (row, columnId, value, addMeta) => {
      const result = fuzzyFilter(row, columnId, value, addMeta);
      
      const id = row.original.id || "";
      const searchValue = String(value).toLowerCase();
      
      return result || id.toLowerCase().includes(searchValue);
    },
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
  });

  React.useEffect(() => {
    setTableGlobalFilter(search);
  }, [search, setTableGlobalFilter]);

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

  useEffect(() => {
    if (queryParam !== search) {
      setSearch(queryParam || "");
    }
  }, [queryParam]);

  const getRowClassName = (row: any) => {
    const status = row.original.status;
    if (status === "CANCELLED") return "opacity-60";
    if (status === "IN_PROGRESS") return "opacity-80";
    return "";
  };

  return (
    <div className="w-full">
      <RequestsFilters
        globalFilter={search}
        setGlobalFilter={setSearch}
        selectedTypes={selectedTypes}
        setSelectedTypes={onTypesChange}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={onStatusesChange}
        uniqueStatuses={uniqueStatuses}
        uniqueTypes={filteredTypes}
        typeSearchValue={typeSearchValue}
        setTypeSearchValue={setTypeSearchValue}
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