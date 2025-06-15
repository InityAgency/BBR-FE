"use client";

import React from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/web/Table/BaseTable";
import { columns } from "../UnitsColumns";
import { Unit } from "@/app/types/models/Unit";
import { CellContext } from "@tanstack/react-table";
import { UnitsActions } from "../UnitsActions";
import { UnitsCardList } from "@/components/web/Units/UnitsCardList";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "../../Table/TablePagination";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

// Enhanced columns with actions
const enhancedColumns = (fetchUnits: (page: number) => Promise<void>, currentPage: number, residenceId: string) => 
  columns.map(column => {
    if (column.id === "actions") {
      return {
        ...column,
        cell: (props: CellContext<Unit, unknown>) => (
          <UnitsActions row={props.row} onDelete={fetchUnits} currentPage={currentPage} residenceId={residenceId} />
        )
      };
    }
    return column;
  });

// Skeleton loader for table
const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      {/* Header skeleton */}
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-1/3 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-16 rounded-md ml-2 bg-muted/20" />
      </div>
      
      {/* Rows skeleton */}
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border-b px-4 py-3 flex items-center">
          <Skeleton className="h-6 w-1/3 rounded-md mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
          <Skeleton className="h-6 w-16 rounded-md ml-2 bg-muted/20" />
        </div>
      ))}
    </div>
  );
};

// Cards skeleton for mobile
const CardsSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
        <div key={index} className="border rounded-md p-4 space-y-3">
          <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-32 rounded-md bg-muted/20" />
            <Skeleton className="h-6 w-20 rounded-md bg-muted/20" />
          </div>
          <Skeleton className="h-4 w-full rounded-md bg-muted/20" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-8 w-full rounded-md bg-muted/20" />
            <Skeleton className="h-8 w-full rounded-md bg-muted/20" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-1/2 rounded-md bg-muted/20" />
            <Skeleton className="h-8 w-1/2 rounded-md bg-muted/20" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface UnitsTableProps {
  units: Unit[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  fetchUnits: (page: number) => Promise<void>;
  residenceId: string; // Dodajemo residenceId
}

export function UnitsTable({
  units,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  fetchUnits,
  residenceId
}: UnitsTableProps) {

  // Use generic table hook
  const { table } = useTable<Unit>({
    data: units,
    columns: enhancedColumns(fetchUnits, currentPage, residenceId),
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
  });

  // Empty state component
  const EmptyState = () => (
    <Card className="text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-none bg-secondary">
      <CardContent className="py-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <Building2 className="h-10 w-10 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-sans">No units available</h3>
            <p className="text-muted-foreground">
              There are currently no units for this residence. Units will appear here once they are added.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Helper function for row styling
  const getRowClassName = (row: any) => {
    const status = row.original.status;
    if (status === "SOLD") return "opacity-60";
    if (status === "INACTIVE") return "opacity-80";
    return "";
  };

  return (
    <div className="w-full">
      {/* Cards for mobile view */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : units.length === 0 ? (
          <EmptyState />
        ) : (
          <UnitsCardList units={table.getRowModel().rows.map(row => row.original)} residenceId={residenceId} />
        )}
      </div>

      {/* Table for desktop view */}
      <div className="hidden lg:block">
        {loading ? (
          <TableSkeleton />
        ) : units.length === 0 ? (
          <EmptyState />
        ) : (
          <BaseTable 
            table={table}
            getRowClassName={getRowClassName}
          />
        )}
      </div>

      {/* Pagination */}
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