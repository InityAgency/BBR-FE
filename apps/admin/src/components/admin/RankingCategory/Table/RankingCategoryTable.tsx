"use client";

import React, { useEffect, useState } from "react";
import { useTable } from "@/hooks/useTable";
import { BaseTable } from "@/components/admin/Table/BaseTable";
import { RankingCategoryFilters } from "./RankingCategoryFilters";
import { columns } from "./RankingCategoryColumns";
import { RankingCategory } from "../../../../app/types/models/RankingCategory";
import { CellContext } from "@tanstack/react-table";
import { RankingCategoryActions } from "./RankingCategoryActions";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/admin/Table/TablePagination";
import { useSearchParams } from "next/navigation";

const ITEMS_PER_PAGE = 10;

interface RankingCategoryType {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Modify columns to use RankingCategoryActions
const enhancedColumns = (fetchCategories: (page: number, query?: string, statuses?: string[], categoryTypeIds?: string[]) => Promise<void>, currentPage: number) => columns.map(column => {
  if (column.id === "actions") {
    return {
      ...column,
      cell: (props: CellContext<RankingCategory, unknown>) => <RankingCategoryActions row={props.row} onDelete={fetchCategories} currentPage={currentPage} />
    };
  }
  return column;
});

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
        <div key={category.id} className="border rounded-md p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground">ID: {category.id}</p>
            </div>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Type: {category.rankingCategoryType?.name || '-'}</p>
            <p>Status: {category.status || '-'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

interface RankingCategoryTableProps {
  categories: RankingCategory[];
  categoryTypes: RankingCategoryType[];
  loading: boolean;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  selectedStatuses: string[];
  onStatusesChange: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategoryTypeIds: string[];
  onCategoryTypeIdsChange: React.Dispatch<React.SetStateAction<string[]>>;
  fetchCategories: (page: number, query?: string, statuses?: string[], categoryTypeIds?: string[]) => Promise<void>;
}

export function RankingCategoryTable({
  categories,
  categoryTypes = [],
  loading,
  totalItems,
  totalPages,
  currentPage,
  goToNextPage,
  goToPreviousPage,
  goToPage,
  selectedStatuses,
  onStatusesChange,
  selectedCategoryTypeIds,
  onCategoryTypeIdsChange,
  fetchCategories
}: RankingCategoryTableProps) {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('query');
  const [search, setSearch] = useState(queryParam || "");

  // Use generic table hook
  const {
    table,
    setGlobalFilter: setTableGlobalFilter,
  } = useTable<RankingCategory>({
    data: categories,
    columns: enhancedColumns(fetchCategories, currentPage),
    initialSorting: [{ id: "name", desc: false }],
    globalFilterFn: (row, columnId, value) => {
      const searchValue = String(value).toLowerCase();
      const cellValue = String(row.getValue(columnId) || "").toLowerCase();
      
      // Takođe proveravamo ID polje eksplicitno
      const id = row.original.id || "";
      
      return cellValue.includes(searchValue) || id.toLowerCase().includes(searchValue);
    },
    initialPageSize: ITEMS_PER_PAGE,
    manualPagination: true,
    pageCount: totalPages,
  });

  // Sync globalFilter with the table
  React.useEffect(() => {
    setTableGlobalFilter(search);
  }, [search, setTableGlobalFilter]);

  // Sinhronizujemo stanje sa URL parametrom
  useEffect(() => {
    if (queryParam !== search) {
      setSearch(queryParam || "");
    }
  }, [queryParam]);

  const getRowClassName = (row: { original: RankingCategory }) => {
    const status = row.original.status;
    if (status === "DELETED") return "opacity-60";
    if (status === "DRAFT") return "opacity-80";
    return "";
  };

  return (
    <div className="w-full">
      {/* Filters */}
      <RankingCategoryFilters
        globalFilter={search}
        setGlobalFilter={setSearch}
        selectedCategoryTypeIds={selectedCategoryTypeIds}
        setSelectedCategoryTypeIds={onCategoryTypeIdsChange}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={onStatusesChange}
        categoryTypes={categoryTypes}
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