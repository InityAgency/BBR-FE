"use client";

import React, { useState, useEffect } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { UsersFilters } from "./UsersFilters";
import { columns } from "./UsersColumns";
import { User } from "@/lib/api/services/types";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext, Row } from "@tanstack/react-table";
import { UsersActions } from "./UsersActions";
import { UsersCardList } from "../Cards/UsersCardList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/admin/Table/TablePagination";

const ITEMS_PER_PAGE = 10; 

const enhancedColumns = columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<User, unknown>) => <UsersActions row={props.row} />
    };
  }
  return column;
});

// Skeleton loader for table
const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      {/* Skeleton for table header */}
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-40 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
      </div>
      
      {/* Skeleton for table rows */}
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border-b px-4 py-3 flex items-center">
            <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
            <Skeleton className="h-6 w-40 rounded-md ml-2 mr-2 bg-muted/20" />
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

interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UsersTableProps {
  users: User[];
  roles: Role[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  selectedStatuses: string[];
  onStatusesChange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRoleIds: string[];
  onRoleIdsChange: React.Dispatch<React.SetStateAction<string[]>>;
}

export function UsersTable({
  users,
  roles = [],
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  selectedStatuses,
  onStatusesChange,
  selectedRoleIds,
  onRoleIdsChange
}: UsersTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  // Using the generic table hook
  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<User>({
    data: users,
    columns: enhancedColumns,
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

  // Synchronize globalFilter with the table
  React.useEffect(() => {
    setTableGlobalFilter(globalFilter);
  }, [globalFilter, setTableGlobalFilter]);

  const {
    locationSearchValue: roleSearchValue,
    setLocationSearchValue: setRoleSearchValue,
    uniqueStatuses,
  } = useTableFilters<User>({
    table,
    data: users,
    locationAccessor: "role",
    statusAccessor: "status",
    useNestedFilter: true, 
    nestedField: "name" 
  });

  // Helper function for styling rows
  const getRowClassName = (row: Row<User>) => {
    // Normalize status to lowercase for case-insensitive comparison
    const status = row.original.status?.toUpperCase();
    
    if (status === "INACTIVE") return "opacity-60";
    if (status === "DELETED") return "opacity-60";
    return "";
  };
  
  return (
    <div className="w-full">
      <UsersFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedRoleIds={selectedRoleIds}
        setSelectedRoleIds={onRoleIdsChange}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={onStatusesChange}
        roles={roles}
        uniqueStatuses={uniqueStatuses}
        roleSearchValue={roleSearchValue}
        setRoleSearchValue={setRoleSearchValue}
      />

      {/* Cards for mobile view */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <UsersCardList users={table.getRowModel().rows.map(row => row.original)} />
        )}
      </div>

      {/* Table for desktop view */}
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