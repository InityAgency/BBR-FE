"use client";

import React, { useState } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { UsersFilters } from "./UsersFilters";
import { columns } from "./UsersColumns";
import { User } from "@/app/types/models/User";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { UsersActions } from "./UsersActions";
import { UsersCardList } from "../Cards/UsersCardList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
      {/* Skelet za header tabele */}
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
      
      {/* Skelet za redove tabele */}
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

const getStatusClass = (status: string) => {
  switch(status) {
    case "Active": return "bg-green-900/55 text-green-300";
    case "Inactive": return "bg-red-900/55 text-red-300";
    case "Pending": return "bg-yellow-900/55 text-yellow-300";
    case "Invited": return "bg-orange-900/55 text-orange-300";
    case "Blocked": return "bg-red-900/55 text-red-300";
    case "Suspended": return "bg-red-900/55 text-red-300";
    case "Deleted": return "bg-gray-900/80 text-gray-300";
    default: return "";
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch(status) {
    case "Active": return "default";
    case "Inactive": return "destructive";
    case "Invited": return "secondary";
    case "Pending": return "secondary";
    case "Blocked": return "destructive";
    case "Suspended": return "destructive";
    case "Deleted": return "outline";
    default: return "outline";
  }
};

interface UsersTableProps {
  users: User[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
}

export function UsersTable({
  users,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage
}: UsersTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  // Koristimo generički hook za tabelu
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

  // Sinhronizujemo globalFilter sa tabelom
  React.useEffect(() => {
    setTableGlobalFilter(globalFilter);
  }, [globalFilter, setTableGlobalFilter]);

  const {
    selectedLocations: selectedRoles,
    setSelectedLocations: setSelectedRoles,
    locationSearchValue: roleSearchValue,
    setLocationSearchValue: setRoleSearchValue,
    selectedStatuses,
    setSelectedStatuses,
    uniqueLocations: uniqueRoles,
    uniqueStatuses,
    filteredLocations: filteredRoles,
  } = useTableFilters<User>({
    table,
    data: users,
    locationAccessor: "role",
    statusAccessor: "status",
    useNestedFilter: true, 
    nestedField: "name" 
  });

  // Helper funkcije za stilizovanje redova
  const getRowClassName = (row: any) => {
    const status = row.original.status;
    if (status === "Suspended") return "opacity-60";
    if (status === "Deleted") return "opacity-60";
    return "";
  };
  

  return (
    <div className="w-full">
      <UsersFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedRoles={selectedRoles}
        setSelectedRoles={setSelectedRoles}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        uniqueRoles={uniqueRoles}
        uniqueStatuses={uniqueStatuses}
        filteredRoles={filteredRoles}
        roleSearchValue={roleSearchValue}
        setRoleSearchValue={setRoleSearchValue}
      />

      {/* Kartice za mobilni prikaz */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <UsersCardList users={table.getRowModel().rows.map(row => row.original)} />
        )}
      </div>

      {/* Tabela za desktop prikaz */}
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

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground mb-2 mt-3">
          Page {currentPage} of {totalPages || 1} | Total users: {totalItems}
        </div>

        <div className="flex items-center justify-between py-4">
          <Button 
            variant="outline" 
            onClick={goToPreviousPage} 
            disabled={currentPage <= 1 || loading}
            className="mr-2"
          >
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                className="w-8 h-8"
                onClick={() => goToPage(i + 1)}
                disabled={loading}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={goToNextPage} 
            disabled={currentPage >= totalPages || loading}
            className="ml-2"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 