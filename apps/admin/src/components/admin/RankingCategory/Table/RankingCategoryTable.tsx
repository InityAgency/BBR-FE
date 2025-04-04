"use client";

import React, { useEffect, useState } from "react";
import { useTable } from "@/hooks/useTable";
import { useTableFilters } from "@/hooks/useTableFilters";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { RankingCategoryFilters } from "./RankingCategoryFilters";
import { columns } from "./RankingCategoryColumns";
import { RankingCategory } from "../../../../app/types/models/RankingCategory";
import { fuzzyFilter } from "@/lib/tableFilters";
import { CellContext } from "@tanstack/react-table";
import { RankingCategoryActions } from "./RankingCategoryActions";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { RankingCategoryCard } from "@/components/admin/RankingCategory/Cards/RankingCategoryCard";

const ITEMS_PER_PAGE = 10;

// Modify columns to use RankingCategoryActions
const enhancedColumns = (fetchCategories: (page: number) => Promise<void>, currentPage: number) => columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<RankingCategory, unknown>) => <RankingCategoryActions row={props.row} onDelete={fetchCategories} currentPage={currentPage} />
    };
  }
  return column;
});

// Skeleton loader for table
const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md">
      {/* Table header skeleton */}
      <div className="border-b px-4 py-3 flex">
        <Skeleton className="h-6 w-8 rounded-md mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/4 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-1/6 rounded-md ml-2 mr-2 bg-muted/20" />
        <Skeleton className="h-6 w-40 rounded-md ml-2 bg-muted/20" />
      </div>
      
      {/* Table rows skeleton */}
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

// Card skeleton for mobile view
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

// Card list component for mobile view
const RankingCategoryCardList = ({ categories }: { categories: RankingCategory[] }) => {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <RankingCategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

interface RankingCategoryTableProps {
  categories: RankingCategory[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  initialStatusFilter?: string | null;
  fetchCategories: (page: number) => Promise<void>;
}

export function RankingCategoryTable({
  categories,
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  initialStatusFilter,
  fetchCategories
}: RankingCategoryTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");

  // Use generic table hook
  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<RankingCategory>({
    data: categories,
    columns: enhancedColumns(fetchCategories, currentPage),
    initialSorting: [{ id: "name", desc: false }],
    globalFilterFn: (row, columnId, value, addMeta) => {
      // Use our fuzzy filter function
      const result = fuzzyFilter(row, columnId, value, addMeta);
      
      // Also check ID field explicitly
      const id = row.original.id || "";
      const searchValue = String(value).toLowerCase();
      
      // Return true if fuzzy search succeeded OR if ID contains search value
      return result || id.toLowerCase().includes(searchValue);
    },
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
  });

  // Synchronize globalFilter with table
  React.useEffect(() => {
    setTableGlobalFilter(globalFilter);
  }, [globalFilter, setTableGlobalFilter]);

  // Use hooks for filters
  const {
    selectedLocations: selectedTypes,
    setSelectedLocations: setSelectedTypes,
    locationSearchValue: typeSearchValue,
    setLocationSearchValue: setTypeSearchValue,
    selectedStatuses,
    setSelectedStatuses,
    uniqueLocations: uniqueTypes,
    uniqueStatuses,
    filteredLocations: filteredTypes,
  } = useTableFilters<RankingCategory>({
    table,
    data: categories,
    locationAccessor: "rankingCategoryType",
    statusAccessor: "status",
    useNestedFilter: true,
    nestedField: "name"
  });

  // Apply initial status filter if exists
  useEffect(() => {
    if (initialStatusFilter) {
      // Check if initial status exists among options
      if (uniqueStatuses.includes(initialStatusFilter)) {
        setSelectedStatuses([initialStatusFilter]);
      }
    }
  }, [initialStatusFilter, uniqueStatuses, setSelectedStatuses]);

  // Helper functions for styling rows and cells
  const getRowClassName = (row: any) => {
    const status = row.original.status;
    if (status === "DELETED") return "opacity-60";
    if (status === "DRAFT") return "opacity-80";
    return "";
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <RankingCategoryFilters
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        uniqueStatuses={uniqueStatuses}
        filteredTypes={filteredTypes}
        typeSearchValue={typeSearchValue}
        setTypeSearchValue={setTypeSearchValue}
      />

      {/* Cards for mobile view */}
      <div className="block lg:hidden">
        {loading ? (
          <CardsSkeleton />
        ) : (
          <RankingCategoryCardList categories={table.getRowModel().rows.map(row => row.original)} />
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

export default RankingCategoryTable;